function decayErrodeHeightmap(strength, heightmap)
{
	strength = strength || 0.9; // 0 to 1
	heightmap = heightmap || g_Map.height;

	let referenceHeightmap = deepcopy(heightmap);
	// let map = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // faster
	let map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; // smoother
	let max_x = heightmap.length;
	let max_y = heightmap[0].length;
	for (let x = 0; x < max_x; ++x)
		for (let y = 0; y < max_y; ++y)
			for (let i = 0; i < map.length; ++i)
				heightmap[x][y] += strength / map.length * (referenceHeightmap[(x + map[i][0] + max_x) % max_x][(y + map[i][1] + max_y) % max_y] - referenceHeightmap[x][y]); // Not entirely sure if scaling with map.length is perfect but tested values seam to indicate it is
}

RMS.LoadLibrary("rmgen");

//random terrain textures
var random_terrain = randomizeBiome();

const tMainTerrain = rBiomeT1();
const tForestFloor1 = rBiomeT2();
const tForestFloor2 = rBiomeT3();
const tCliff = rBiomeT4();
const tTier1Terrain = rBiomeT5();
const tTier2Terrain = rBiomeT6();
const tTier3Terrain = rBiomeT7();
const tHill = rBiomeT8();
const tRoad = rBiomeT10();
const tRoadWild = rBiomeT11();
const tTier4Terrain = rBiomeT12();
const tShore = rBiomeT14();
const tWater = rBiomeT15();

// gaia entities
const oTree1 = rBiomeE1();
const oTree2 = rBiomeE2();
const oTree3 = rBiomeE3();
const oTree4 = rBiomeE4();
const oTree5 = rBiomeE5();
const oFruitBush = rBiomeE6();
const oChicken = rBiomeE7();
const oMainHuntableAnimal = rBiomeE8();
const oFish = rBiomeE9();
const oSecondaryHuntableAnimal = rBiomeE10();
const oStoneLarge = rBiomeE11();
const oStoneSmall = rBiomeE12();
const oMetalLarge = rBiomeE13();

// decorative props
const aGrass = rBiomeA1();
const aGrassShort = rBiomeA2();
const aRockLarge = rBiomeA5();
const aRockMedium = rBiomeA6();
const aBushMedium = rBiomeA7();
const aBushSmall = rBiomeA8();

const pForest1 = [tForestFloor2 + TERRAIN_SEPARATOR + oTree1, tForestFloor2 + TERRAIN_SEPARATOR + oTree2, tForestFloor2];
const pForest2 = [tForestFloor1 + TERRAIN_SEPARATOR + oTree4, tForestFloor1 + TERRAIN_SEPARATOR + oTree5, tForestFloor1];
const BUILDING_ANGlE = -PI/4;

log("Initializing map...");
InitMap();

const numPlayers = getNumPlayers();
const mapSize = getMapSize();

// create tile classes
var clPlayer = createTileClass();
var clHill = createTileClass();
var clForest = createTileClass();
var clWater = createTileClass();
var clDirt = createTileClass();
var clRock = createTileClass();
var clMetal = createTileClass();
var clFood = createTileClass();
var clBaseResource = createTileClass();
var clLand = createTileClass();

for (var ix = 0; ix < mapSize; ++ix)
	for (var iz = 0; iz < mapSize; ++iz)
		placeTerrain(ix, iz, tMainTerrain);

// some constants
var radius = scaleByMapSize(15,25);
var centerOfMap = mapSize / 2;

var fx = fractionToTiles(0.5);
var fz = fractionToTiles(0.5);
ix = round(fx);
iz = round(fz);

var teamNo = 0;

var startAngle = randFloat(0, TWO_PI);

// randomize player order
var playerIDs = [];
for (var i = 0; i < numPlayers; i++)
{
	playerIDs.push(i+1);
}
playerIDs = sortPlayers(playerIDs);

// Group teams
var ffaPlayers = 0;
var teams = new Array(9);
var numTeams = 0;
for (var i = 0; i < numPlayers; i++)
{
	var team = getPlayerTeam(i);
	if(team == -1) {
		teams[8 - ffaPlayers] = new Array();
		teams[8 - ffaPlayers].push(i+1);
		ffaPlayers++;
		numTeams++;
	} else {
		if(teams[team] == null) {
			teams[team] = new Array();
			numTeams++;
		}
		teams[team].push(i+1);
	}
}

RMS.SetProgress(50);

for(var i = 0; i < 9; i++) {
	// we found a team
	if(teams[i] != null) {
		teamNo++;
		var teamAngle = startAngle + teamNo*TWO_PI/numTeams;
		var fractionX = 0.5 + 0.3*cos(teamAngle);
		var fractionZ = 0.5 + 0.3*sin(teamAngle);

		for(var p = 0; p < teams[i].length; ++p) {
			log("Creating base for player " + teams[i][p] + " on team " + i + "...");

			var playerAngle = startAngle + (p + 1) * TWO_PI / teams[i].length;

			// get the x and z in tiles
			var fx = fractionToTiles(fractionX + 0.05*cos(playerAngle));
			var fz = fractionToTiles(fractionZ + 0.05*sin(playerAngle));
			var ix = round(fx);
			var iz = round(fz);
			addToClass(ix, iz, clPlayer);
			addToClass(ix+5, iz, clPlayer);
			addToClass(ix, iz+5, clPlayer);
			addToClass(ix-5, iz, clPlayer);
			addToClass(ix, iz-5, clPlayer);

			// create starting units
			placeCivDefaultEntities(fx, fz, teams[i][p], BUILDING_ANGlE, {'iberWall': false});

			// create the city patch
			var cityRadius = radius/3;
			var placer = new ClumpPlacer(PI*cityRadius*cityRadius, 0.6, 0.3, 10, ix, iz);
			var painter = new LayeredPainter([tRoadWild, tRoad], [1]);
			createArea(placer, painter, null);

			// create animals
			for (var j = 0; j < 2; ++j)
			{
				var aAngle = randFloat(0, TWO_PI);
				var aDist = 7;
				var aX = round(fx + aDist * cos(aAngle));
				var aZ = round(fz + aDist * sin(aAngle));
				var group = new SimpleGroup(
					[new SimpleObject(oChicken, 5,5, 0,2)],
					true, clBaseResource, aX, aZ
				);
				createObjectGroup(group, 0);
			}

			// create berry bushes
			var bbAngle = randFloat(0, TWO_PI);
			var bbDist = 12;
			var bbX = round(fx + bbDist * cos(bbAngle));
			var bbZ = round(fz + bbDist * sin(bbAngle));
			group = new SimpleGroup(
				[new SimpleObject(oFruitBush, 5,5, 0,3)],
				true, clBaseResource, bbX, bbZ
			);
			createObjectGroup(group, 0);

			var hillSize = PI * radius * radius;
			// create starting trees
			var num = 20 + randInt(10);
			var tAngle = randFloat(0, TWO_PI);
			var tDist = randFloat(12, 13);
			var tX = round(fx + tDist * cos(tAngle));
			var tZ = round(fz + tDist * sin(tAngle));
			group = new SimpleGroup(
				[new SimpleObject(oTree1, num, num, 3,3)],
				false, clBaseResource, tX, tZ
			);
			createObjectGroup(group, 0, avoidClasses(clBaseResource,1));

			// create grass tufts
			var num = hillSize / 250;
			for (var j = 0; j < num; j++)
			{
				var gAngle = randFloat(0, TWO_PI);
				var gDist = radius - (5 + randInt(7));
				var gX = round(fx + gDist * cos(gAngle));
				var gZ = round(fz + gDist * sin(gAngle));
				group = new SimpleGroup(
					[new SimpleObject(aGrassShort, 2,5, 0,1, -PI/8,PI/8)],
					false, clBaseResource, gX, gZ
				);
				createObjectGroup(group, 0);
			}

			// create metal mine
			var mAngle = bbAngle;
			while(abs(mAngle - bbAngle) < PI/3)
			{
				mAngle = randFloat(0, TWO_PI);
			}
			var mDist = 12;
			var mX = round(fx + mDist * cos(mAngle));
			var mZ = round(fz + mDist * sin(mAngle));
			group = new SimpleGroup(
				[new SimpleObject(oMetalLarge, 1,1, 0,0)],
				true, clBaseResource, mX, mZ
			);
			createObjectGroup(group, 0);

			// create stone mines
			mAngle += randFloat(PI/8, PI/4);
			mX = round(fx + mDist * cos(mAngle));
			mZ = round(fz + mDist * sin(mAngle));
			group = new SimpleGroup(
				[new SimpleObject(oStoneLarge, 1,1, 0,2)],
				true, clBaseResource, mX, mZ
			);
			createObjectGroup(group, 0);
		}
	}
}

// random feature
if(mapSize <= 192)
	r = 1;
else
	var r = randInt(1,5);

var makeForests = true;
var makeMinerals = true;

switch(r) {
	// 1: central highlands
	case 1:
		var placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(200, 300)), 1, centerOfMap, centerOfMap, 0, [floor(mapSize * 0.01)]);
		var terrainPainter = new LayeredPainter(
			[tCliff, tTier1Terrain],       // terrains
			[3]     // widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			25,              // elevation
			5               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);

		// create center bounty
		group = new SimpleGroup(
			[new SimpleObject(oMetalLarge, 1, 4, 0, floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clPlayer, 5));
		group = new SimpleGroup(
			[new SimpleObject(oStoneLarge, 1, 4, 0, floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clPlayer, 5));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal, 4 * numPlayers / numTeams, 4 * numPlayers / numTeams, 0, floor(mapSize * 0.1))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 5, clPlayer, 10, clWater, 2));
		break;

	// 2: mountains
	case 2:
	var randMountains = 10 + randInt(10);
	for(var m = 0; m < randMountains; ++m) {
		var randX = randInt(mapSize);
		var randY = randInt(mapSize);
		var placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(20, 40)), 1, randX, randY, 0, [floor(mapSize * 0.01)]);
		var terrainPainter = new LayeredPainter(
			[tCliff, tTier1Terrain, tTier2Terrain, tTier3Terrain],       // terrains
			[3, 5, 10]     // widths
		);
		var elevRand = 25 + randInt(35);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			elevRand,              // elevation
			4               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clHill)], avoidClasses(clBaseResource, 2, clHill, 20, clPlayer, 30, clWater, 2));
	}
	break;

	// 3: ponds
	case 3:
		var randPonds = numPlayers * 2 + randInt(numPlayers * 2);
		for(var w = 0; w < randPonds; ++w) {
			var randX = randInt(mapSize);
			var randY = randInt(mapSize);
			var placer = new ChainPlacer(5, 10, scaleByMapSize(5, 30), 1, randX, randY);
			var terrainPainter = new LayeredPainter(
				[tWater, tWater, tShore],       // terrains
				[100, 100]     // widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,          // type
				-8,              // elevation
				4               // blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clWater)], avoidClasses(clPlayer, 25, clBaseResource, 15, clHill, 10, clWater, 15));
			group = new SimpleGroup(
				[new SimpleObject(oFish, 5, 9, 0, floor(mapSize * 0.15))],
				true, clBaseResource, randX, randY
			);
			createObjectGroup(group, 0, [avoidClasses(clLand, 1), stayClasses(clWater, 5)]);
		}
		var randMountains = 5 + randInt(10);
		for(var m = 0; m < randMountains; ++m) {
			var randX = randInt(mapSize);
			var randY = randInt(mapSize);
			var placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(20, 40)), 1, randX, randY, 0, [floor(mapSize * 0.01)]);
			var terrainPainter = new LayeredPainter(
				[tCliff, tTier1Terrain, tTier2Terrain, tTier3Terrain],       // terrains
				[3, 5, 10]     // widths
			);
			var elevRand = 25 + randInt(35);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_SET,          // type
				elevRand,              // elevation
				4               // blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clHill)], avoidClasses(clBaseResource, 2, clHill, 20, clPlayer, 30, clWater, 2));
		}
		createHills([tCliff, tCliff, tHill], avoidClasses(clPlayer, 20, clHill, 15, clWater, 15, clBaseResource, 3), clHill, scaleByMapSize(3, 30), 1, floor(scaleByMapSize(4, 10)));
		//makeForests = false;
		break;

	// 4: lake
	case 4:
		var placer = new ChainPlacer(5, 10,scaleByMapSize(50, 100), 1, centerOfMap, centerOfMap);
		var terrainPainter = new LayeredPainter(
			[tWater, tWater, tShore],       // terrains
			[100, 100]     // widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			-8,              // elevation
			4               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clWater)], avoidClasses(clPlayer, 20, clBaseResource, 10, clHill, 5));
		createHills([tCliff, tCliff, tHill], avoidClasses(clBaseResource, 2, clPlayer, 20, clHill, 10, clWater, 35), clHill, scaleByMapSize(3, 30), 1, floor(scaleByMapSize(4, 10)));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal, 40, 50, floor(mapSize * 0.15), floor(mapSize * 0.3))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 1, clPlayer, 1, clWater, 1, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oFish, numPlayers, numPlayers * 3, 0, floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, [avoidClasses(clLand, 1), stayClasses(clWater, 5)]);
		//makeMinerals = false;
		break;

	// rivers
	case 5:
		for(var t = 0; t < numTeams; ++t) {
			var mStartCo = 0;
			var mStopCo = 0.5;
			var tang = startAngle + (t + 0.5) * TWO_PI / numTeams;
			var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(40, 40), 0.7, 0.1, 0.2, 0.3);
			var terrainPainter = new LayeredPainter(
				[tWater, tWater, tShore],
				[100, 100]								// widths
			);
			var elevationPainter = new SmoothElevationPainter(
				ELEVATION_MODIFY,			// type
				-6,				// elevation
				8				// blend radius
			);
			createArea(placer, [terrainPainter, elevationPainter, paintClass(clWater)]);
		}
		createHills([tCliff, tCliff, tHill], avoidClasses(clBaseResource, 2, clPlayer, 20, clHill, 10, clWater, 5), clHill, scaleByMapSize(10, 20), 1, floor(scaleByMapSize(3, 10)));
		break;
	// tight spaces
	case 6:
		createHills([tCliff, tCliff, tHill], avoidClasses(clBaseResource, 5, clPlayer, 20, clHill, 20, clWater, 5), clHill, scaleByMapSize(15, 30), 1, floor(scaleByMapSize(10, 20)));
		break;
}

RMS.SetProgress(85);

// create random bounty
if(makeMinerals) {
	// create stone quarries
	createMines(
	[
		[new SimpleObject(oStoneLarge, 1, 1, 30, 200)], [new SimpleObject(oStoneSmall, 1, 1, 30, 200)]
	],
	avoidClasses(clWater, 2, clForest, 1, clPlayer, 20, clMetal, 10, clRock, 20, clHill, 2),
	clRock
	);

	log("Creating metal mines...");
	// create large metal quarries
	createMines(
	[
		[new SimpleObject(oMetalLarge, 1, 1, 30, 200)]
	],
	avoidClasses(clWater, 2, clForest, 1, clPlayer, 20, clMetal, 20, clRock, 10, clHill, 2),
	clMetal
	);
}

// create animals
for(var a = 0; a < numTeams * 4; ++a) {
	var tang = startAngle + (a + 0.5) * TWO_PI / numTeams;
	var a1x = fractionToTiles(0.5 + 0.05 * cos(tang));
	var a1y = fractionToTiles(0.5 + 0.05 * sin(tang));
	var a2x = fractionToTiles(0.5 + 0.25 * cos(tang));
	var a2y = fractionToTiles(0.5 + 0.25 * sin(tang));
	var a3x = fractionToTiles(0.5 + 0.35 * cos(tang));
	var a3y = fractionToTiles(0.5 + 0.35 * sin(tang));
	group = new SimpleGroup(
		[new SimpleObject(oMainHuntableAnimal, 1, 2, 4, 20)],
		true, clBaseResource, a1x, a1y
	);
	createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 2, clPlayer, 20, clWater, 2));
	group = new SimpleGroup(
		[new SimpleObject(oSecondaryHuntableAnimal, 1, 1, 10, 20)],
		true, clBaseResource, a2x, a2y
	);
	createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 2, clPlayer, 20, clWater, 2));
	group = new SimpleGroup(
		[new SimpleObject(oSecondaryHuntableAnimal, 1, 1, 20, 30)],
		true, clBaseResource, a3x, a3y
	);
	createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 2, clPlayer, 20, clWater, 2));
}

 for (var i = 0; i < 5; ++i)
	 decayErrodeHeightmap(0.5);

// create bumps
createBumps();

// create forests
if(makeForests) {
	createForests(
		[tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
		avoidClasses(clPlayer, 22, clForest, 10, clHill, 5, clWater, 5),
		clForest,
		0.5,
		random_terrain
	);
} else {
	createForests(
	 	[tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
	 	avoidClasses(clPlayer, 22, clForest, 10, clHill, 5, clWater, 5),
	 	clForest,
	 	0.3,
		random_terrain
	);
}

	// create hills
log("Creating hills...");
placer = new ChainPlacer(1, floor(scaleByMapSize(4, 6)), floor(scaleByMapSize(16, 40)), 0.5);
terrainPainter = new LayeredPainter(
	[tCliff, tHill],		// terrains
	[2]								// widths
);
elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 18, 2);
createAreas(
	placer,
	[terrainPainter, elevationPainter, paintClass(clHill)],
	[avoidClasses(clBaseResource, 20, clHill, 15), stayClasses(clLand, 0)],
	scaleByMapSize(4, 13)
);

// create straggeler trees
var types = [oTree1, oTree2, oTree4, oTree3];	// some variation
createStragglerTrees(types, avoidClasses(clWater, 5, clForest, 10, clPlayer, 20, clMetal, 1, clRock, 1, clHill, 1));


// create dirt patches
log("Creating dirt patches...");
var sizes = [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)];
var numb = 1;
if (random_terrain == 6)
	numb = 3;

for (var i = 0; i < sizes.length; ++i)
{
	placer = new ChainPlacer(1, floor(scaleByMapSize(3, 5)), sizes[i], 0.5);
	var painter = new LayeredPainter(
		[[tMainTerrain, tTier1Terrain], [tTier1Terrain, tTier2Terrain], [tTier2Terrain, tTier3Terrain]], 		// terrains
		[1, 1]															// widths
	);
	createAreas(
		placer,
		[painter, paintClass(clDirt)],
		[avoidClasses(clForest, 0, clHill, 0, clDirt, 5, clPlayer, 0), stayClasses(clLand, 6)],
		numb*scaleByMapSize(15, 45)
	);
}

// create grass patches
log("Creating grass patches...");
var sizes = [scaleByMapSize(2, 4), scaleByMapSize(3, 7), scaleByMapSize(5, 15)];
for (var i = 0; i < sizes.length; ++i)
{
	placer = new ChainPlacer(1, floor(scaleByMapSize(3, 5)), sizes[i], 0.5);
	var painter = new TerrainPainter(tTier4Terrain);
	createAreas(
		placer,
		painter,
		[avoidClasses(clForest, 0, clHill, 0, clDirt, 5, clPlayer, 0), stayClasses(clLand, 6)],
		numb*scaleByMapSize(15, 45)
	);
}

// create small decorative rocks
log("Creating small decorative rocks...");
group = new SimpleGroup(
	[new SimpleObject(aRockMedium, 1, 3, 0, 1)],
	true
);
createObjectGroups(
	group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clHill, 0), stayClasses(clLand, 5)],
	scaleByMapSize(16, 262), 50
);

// create large decorative rocks
log("Creating large decorative rocks...");
group = new SimpleGroup(
	[new SimpleObject(aRockLarge, 1, 2, 0, 1), new SimpleObject(aRockMedium, 1, 3, 0, 2)],
	true
);
createObjectGroups(
	group, 0,
	[avoidClasses(clWater, 0, clForest, 0, clHill, 0), stayClasses(clLand, 5)],
	scaleByMapSize(8, 131), 50
);

// create decoration
var planetm = 1;

if (random_terrain == 7)
	planetm = 8;

// create grass tufts
var num = hillSize / 250;
for (var j = 0; j < num; ++j)
{
	var gAngle = randFloat(0, TWO_PI);
	var gDist = radius - (5 + randInt(7));
	var gX = round(fx + gDist * cos(gAngle));
	var gZ = round(fz + gDist * sin(gAngle));
	group = new SimpleGroup(
		[new SimpleObject(aGrassShort, 2, 5, 0, 1, -PI/8, PI/8)],
		false, clBaseResource, gX, gZ
	);
	createObjectGroup(group, 0, [stayClasses(clLand, 5)]);
}

//create small grass tufts
log("Creating small grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrassShort, 1, 2, 0, 1, -PI/8, PI/8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 2, clHill, 2, clPlayer, 2, clDirt, 0), stayClasses(clLand, 6)],
	planetm * scaleByMapSize(13, 200)
);

RMS.SetProgress(90);

// create large grass tufts
log("Creating large grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrass, 2, 4, 0, 1.8, -PI/8, PI/8), new SimpleObject(aGrassShort, 3, 6, 1.2, 2.5, -PI/8, PI/8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clWater, 3, clHill, 2, clPlayer, 2, clDirt, 1, clForest, 0), stayClasses(clLand, 5)],
	planetm * scaleByMapSize(13, 200)
);

createDecoration
(
 [[new SimpleObject(aRockMedium, 1, 3, 0, 1)],
  [new SimpleObject(aRockLarge, 1, 2, 0, 1), new SimpleObject(aRockMedium, 1, 3, 0, 2)],
  [new SimpleObject(aGrassShort, 2, 15, 0, 1, -PI/8, PI/8)],
  [new SimpleObject(aGrass, 2, 10, 0, 1.8, -PI/8, PI/8), new SimpleObject(aGrassShort, 3, 10, 1.2, 2.5, -PI/8, PI/8)],
  [new SimpleObject(aBushMedium, 1, 5, 0, 2), new SimpleObject(aBushSmall, 2, 4, 0, 2)]
 ],
 [
  scaleByMapSize(16, 262),
  scaleByMapSize(8, 131),
  planetm * scaleByMapSize(13, 200),
  planetm * scaleByMapSize(13, 200),
  planetm * scaleByMapSize(13, 200)
 ],
 avoidClasses(clForest, 2, clPlayer, 20, clHill, 5, clWater, 1, clFood, 1, clBaseResource, 2)
);

setSkySet(shuffleArray(["cloudless", "cumulus", "overcast"])[0]);

setSunRotation(randFloat(0, TWO_PI));
setSunElevation(randFloat(PI/5, PI/3));
setWaterWaviness(2);

RMS.SetProgress(100);

ExportMap(); 