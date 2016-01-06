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
const tDirt = rBiomeT9();
const tRoad = rBiomeT10();
const tRoadWild = rBiomeT11();
const tTier4Terrain = rBiomeT12();
const tShoreBlend = rBiomeT13();
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
const aReeds = rBiomeA3();
const aLillies = rBiomeA4();
const aRockLarge = rBiomeA5();
const aRockMedium = rBiomeA6();
const aBushMedium = rBiomeA7();
const aBushSmall = rBiomeA8();

const pForest1 = [tForestFloor2 + TERRAIN_SEPARATOR + oTree1, tForestFloor2 + TERRAIN_SEPARATOR + oTree2, tForestFloor2];
const pForest2 = [tForestFloor1 + TERRAIN_SEPARATOR + oTree4, tForestFloor1 + TERRAIN_SEPARATOR + oTree5, tForestFloor1];
const BUILDING_ANGlE = -PI/4;

// initialize map

log("Initializing map...");

InitMap();

const numPlayers = getNumPlayers();
const mapSize = getMapSize();
const mapArea = mapSize*mapSize;

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
var clSettlement = createTileClass();
var clLand = createTileClass();

for (var ix = 0; ix < mapSize; ix++)
{
	for (var iz = 0; iz < mapSize; iz++)
	{
		var x = ix / (mapSize + 1.0);
		var z = iz / (mapSize + 1.0);
			placeTerrain(ix, iz, tMainTerrain);
	}
}

// some constants
var radius = scaleByMapSize(15,25);
var cliffRadius = 2;
var elevation = 20;
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
		var teamX = fractionToTiles(fractionX);
		var teamZ = fractionToTiles(fractionZ);

		for(var p = 0; p < teams[i].length; p++) {
			log("Creating base for player " + teams[i][p] + " on team " + i + "...");

			var playerAngle = startAngle + (p+1)*TWO_PI/teams[i].length;

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
			var num = 5;
			var tAngle = randFloat(0, TWO_PI);
			var tDist = randFloat(12, 13);
			var tX = round(fx + tDist * cos(tAngle));
			var tZ = round(fz + tDist * sin(tAngle));
			group = new SimpleGroup(
				[new SimpleObject(oTree1, num, num, 0,3)],
				false, clBaseResource, tX, tZ
			);
			createObjectGroup(group, 0, avoidClasses(clBaseResource,2));

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
		}

		// create team bounty
		group = new SimpleGroup(
			[new SimpleObject(oMetalLarge,1+numPlayers/numTeams,1+numPlayers/numTeams,0,floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 1, clPlayer, 5, clWater, 2));
		group = new SimpleGroup(
			[new SimpleObject(oStoneLarge,1+numPlayers/numTeams,1+numPlayers/numTeams,0,floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 1, clPlayer, 5, clWater, 2));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal,2*numPlayers/numTeams,2*numPlayers/numTeams,0,floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 5, clPlayer, 10, clWater, 2));
		group = new SimpleGroup(
			[new SimpleObject(oSecondaryHuntableAnimal,4*numPlayers/numTeams,4*numPlayers/numTeams,0,floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 5, clPlayer, 10, clWater, 2));
	}
}

// random feature
var r = randInt(1,4);

if(mapSize <= 192) {
	r = 1;
}

var makeForests = true;
var makeMinerals = true;

switch(r) {
	// 1: central highlands
	case 1:
		var placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(60, 250)), 1, centerOfMap, centerOfMap, 0, [floor(mapSize * 0.01)]);
		var terrainPainter = new LayeredPainter(
			[tCliff, tTier1Terrain],       // terrains
			[3]     // widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			18,              // elevation
			5               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);

		// create center bounty
		group = new SimpleGroup(
			[new SimpleObject(oMetalLarge,1,4,0,floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clPlayer, 5));
		group = new SimpleGroup(
			[new SimpleObject(oStoneLarge,1,4,0,floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clPlayer, 5));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal,4*numPlayers/numTeams,4*numPlayers/numTeams,0,floor(mapSize * 0.1))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 5, clPlayer, 10, clWater, 2));
		break;

	// 2: central mountain
	case 2:
		var placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(60, 150)), 1, centerOfMap, centerOfMap, 0, [floor(mapSize * 0.01)]);
		var terrainPainter = new LayeredPainter(
			[tCliff, tTier1Terrain],       // terrains
			[3]     // widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			25,              // elevation
			2               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clHill)], null);
		break;

	// 3: limited forests
	case 3:
		group = new SimpleGroup(
			[new SimpleObject(oFruitBush,4*numPlayers/numTeams,4*numPlayers/numTeams,0,floor(mapSize * 0.1))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 2, clHill, 5, clPlayer, 10, clWater, 2, clForest, 3));
		createHills([tCliff, tCliff, tHill], avoidClasses(clPlayer, 20, clHill, 15, clWater, 15, clBaseResource, 3), clHill, scaleByMapSize(3, 30), 1, floor(scaleByMapSize(4,10)));
		createForests(
		[tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
		avoidClasses(clPlayer, 50, clForest, 30, clHill, 5, clWater, 5),
		clForest,
		1.0,
		random_terrain
		);
		makeForests = false;
		break;

	// 4: oasis
	case 4:
		var placer = new ChainPlacer(5,10,scaleByMapSize(30,30), 1, centerOfMap, centerOfMap);
		var terrainPainter = new LayeredPainter(
			[tWater, tWater, tShore],       // terrains
			[3,5]     // widths
		);
		var elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			-8,              // elevation
			4               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clWater)], null);
		createHills([tCliff, tCliff, tHill], avoidClasses(clBaseResource, 2, clPlayer, 20, clHill, 10, clWater, 35), clHill, scaleByMapSize(3, 30), 1, floor(scaleByMapSize(4,10)));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal,40,50,floor(mapSize * 0.15),floor(mapSize * 0.3))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, avoidClasses(clBaseResource, 1, clPlayer, 1, clWater, 1, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oFish,numPlayers,numPlayers*3,0,floor(mapSize * 0.15))],
			true, clBaseResource, centerOfMap, centerOfMap
		);
		createObjectGroup(group, 0, [avoidClasses(clLand, 1), stayClasses(clWater, 5)]);
		makeMinerals = false;
		break;

}

RMS.SetProgress(85);

// create random bounty
if(makeMinerals) {
	// create stone quarries
	createMines(
	[
		[new SimpleObject(oStoneLarge, 1,1, 1,numPlayers)], [new SimpleObject(oStoneSmall, 2,2, 2,numPlayers * 2)]
	],
	avoidClasses(clWater, 5, clForest, 1, clPlayer, 20, clRock, 10, clHill, 5),
	clRock
	)

	log("Creating metal mines...");
	// create large metal quarries
	createMines(
	[
		[new SimpleObject(oMetalLarge, 1,1, 1,numPlayers)]
	],
	avoidClasses(clWater, 5, clForest, 1, clPlayer, 20, clMetal, 10, clRock, 5, clHill, 5),
	clMetal
	)
}

// create bumps
createBumps();

// create forests
if(makeForests) {
	createForests(
	 [tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
	 avoidClasses(clPlayer, 20, clForest, 20, clHill, 30, clWater, 5),
	 clForest,
	 1.0,
	 random_terrain
	);
}

// create straggeler trees
var types = [oTree1, oTree2, oTree4, oTree3];	// some variation
createStragglerTrees(types, avoidClasses(clWater, 5, clForest, 10, clPlayer, 20, clMetal, 1, clRock, 1, clHill, 1));

// create decoration
var planetm = 1;

if (random_terrain==7)
	planetm = 8;

createDecoration
(
 [[new SimpleObject(aRockMedium, 1,3, 0,1)],
  [new SimpleObject(aRockLarge, 1,2, 0,1), new SimpleObject(aRockMedium, 1,3, 0,2)],
  [new SimpleObject(aGrassShort, 2,15, 0,1, -PI/8,PI/8)],
  [new SimpleObject(aGrass, 2,10, 0,1.8, -PI/8,PI/8), new SimpleObject(aGrassShort, 3,10, 1.2,2.5, -PI/8,PI/8)],
  [new SimpleObject(aBushMedium, 1,5, 0,2), new SimpleObject(aBushSmall, 2,4, 0,2)]
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

// Export map data

ExportMap();
