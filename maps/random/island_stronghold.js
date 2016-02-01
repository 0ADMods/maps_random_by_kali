RMS.LoadLibrary("rmgen");

//random terrain textures
var random_terrain = randomizeBiome();
// Exclude African Biome
while(random_terrain == 6) 
	random_terrain = randomizeBiome();

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
const oWhale = "gaia/fauna_whale_humpback";
const oShipwreck = "other/special_treasure_shipwreck";
const oShipDebris = "other/special_treasure_shipwreck_debris";

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
var clDirt = createTileClass();
var clRock = createTileClass();
var clMetal = createTileClass();
var clFood = createTileClass();
var clBaseResource = createTileClass();
var clLand = createTileClass();

for (let ix = 0; ix < mapSize; ++ix)
{
	for (let iz = 0; iz < mapSize; ++iz)
	{
		let x = ix / (mapSize + 1.0);
		let z = iz / (mapSize + 1.0);
		placeTerrain(ix, iz, tWater);
	}
}

// some constants
var radius = scaleByMapSize(15, 25);
var cliffRadius = 2;
var elevation = 20;
var centerOfMap = mapSize / 2;

var fx = fractionToTiles(0.5);
var fz = fractionToTiles(0.5);
var ix = round(fx);
var iz = round(fz);

var startAngle = randFloat(0, TWO_PI);

// Group teams, creates a 2D array where i is used to mark the team ID. Free For All Players (FFA) get a team ID starting with the highest possible team number
// This only works as expected when there are no empty teams between filled teams
var ffaPlayers = 0;
var teams = new Array(9);
var numTeams = 0;
for (var i = 0; i < numPlayers; ++i)
{
	var team = getPlayerTeam(i);
	if (team == -1) 
	{
		teams[8 - ffaPlayers] = new Array();
		teams[8 - ffaPlayers].push(i + 1);
		ffaPlayers++;
		numTeams++;
	} 
	else 
	{
		if (teams[team] == null) 
		{
			teams[team] = new Array();
			numTeams++;
		}
		teams[team].push(i+1);
	}
}

RMS.SetProgress(10);

var shoreRadius = 6;
var elevation = 3;
var teamNo = 0;

for (var i = 0; i < 9; ++i) 
{
	// we didn't find a team so try with next i
	if (teams[i] == null) 
		continue;

	teamNo++;
	let teamAngle = startAngle + teamNo*TWO_PI/numTeams;
	let fractionX = 0.5 + 0.3 * cos(teamAngle);
	let fractionZ = 0.5 + 0.3 * sin(teamAngle);
	let teamX = fractionToTiles(fractionX);
	let teamZ = fractionToTiles(fractionZ);

	for (let p = 0; p < teams[i].length; ++p) 
	{
		log("Creating base for player " + teams[i][p] + " on team " + i + "...");

		let playerAngle = startAngle + (p+1)*TWO_PI/teams[i].length;

		// get the x and z in tiles
		let fx = fractionToTiles(fractionX + 0.05 * cos(playerAngle));
		let fz = fractionToTiles(fractionZ + 0.05 * sin(playerAngle));
		let ix = round(fx);
		let iz = round(fz);

		// mark a small area around the player's starting coördinates with the clPlayer class
		addToClass(ix, iz, clPlayer);
		addToClass(ix+5, iz, clPlayer);
		addToClass(ix, iz+5, clPlayer);
		addToClass(ix-5, iz, clPlayer);
		addToClass(ix, iz-5, clPlayer);

		// create an island
		let placer = new ChainPlacer(2, floor(scaleByMapSize(5, 11)), floor(scaleByMapSize(60, 250)), 1, ix, iz, 0, [floor(mapSize * 0.01)]);
		let terrainPainter = new LayeredPainter(
			[tMainTerrain, tMainTerrain, tMainTerrain],       // terrains
			[1, shoreRadius]     // widths
		);
		let elevationPainter = new SmoothElevationPainter(
			ELEVATION_SET,          // type
			elevation,              // elevation
			shoreRadius               // blend radius
		);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], null);

		// create starting units
		placeCivDefaultEntities(fx, fz, teams[i][p], BUILDING_ANGlE, { "iberWall": false });

		// create animals
		for (let j = 0; j < 2; ++j)
		{
			let aAngle = randFloat(0, TWO_PI);
			let aDist = 7;
			let aX = round(fx + aDist * cos(aAngle));
			let aZ = round(fz + aDist * sin(aAngle));
			let group = new SimpleGroup(
				[new SimpleObject(oChicken, 5, 5, 0, 2)],
				true, clBaseResource, aX, aZ
			);
			createObjectGroup(group, 0, [stayClasses(clLand, 5)]);
		}

		// create initial metal and stone mines
		let mAngle = randFloat(PI, TWO_PI);
		let mDist = 16;
		let mX = round(fx + mDist * cos(mAngle));
		let mZ = round(fz + mDist * sin(mAngle));
		let sX = round(fx + mDist * cos(mAngle + PI/4));
		let sZ = round(fz + mDist * sin(mAngle + PI/4));
		let group = new SimpleGroup(
			[new SimpleObject(oMetalLarge, 1, 1, 0, 4)],
			true, clBaseResource, mX, mZ
		);
		createObjectGroup(group, 0, [avoidClasses(clBaseResource, 2, clPlayer, 2), stayClasses(clLand, 2)]);
		group = new SimpleGroup(
			[new SimpleObject(oStoneLarge, 1, 1, 0, 4)],
			true, clBaseResource, sX, sZ
		);
		createObjectGroup(group, 0, [avoidClasses(clBaseResource, 2, clPlayer, 2), stayClasses(clLand, 2)]);

		// create berry bushes, should avoid mines
		let bbAngle = randFloat(PI, PI*1.5);
		let bbDist = 10;
		let bbX = round(fx + bbDist * cos(bbAngle));
		let bbZ = round(fz + bbDist * sin(bbAngle));
		group = new SimpleGroup(
			[new SimpleObject(oFruitBush, 5, 5, 0, 3)],
			true, clBaseResource, bbX, bbZ
		);
		createObjectGroup(group, 0, [avoidClasses(clBaseResource, 4, clPlayer, 2), stayClasses(clLand, 5)]);

		// create starting trees, should avoid mines and bushes
		let tries = 10;
		let tDist = 16;
		let num = 50;
		for (let x = 0; x < tries; ++x) 
		{
			let tAngle = randFloat(0, TWO_PI);
			let tX = round(fx + tDist * cos(tAngle));
			let tZ = round(fz + tDist * sin(tAngle));
			group = new SimpleGroup(
				[new SimpleObject(oTree2, num, num, 0, 7)],
				true, clBaseResource, tX, tZ
			);
			if( createObjectGroup(group, 0, [avoidClasses(clBaseResource, 6, clPlayer, 2), stayClasses(clLand, 4)]) )
				break;
		};

		// create grass tufts
		num = (PI * radius * radius) / 250;
		for (let j = 0; j < num; ++j)
		{
			let gAngle = randFloat(0, TWO_PI);
			let gDist = radius - (5 + randInt(7));
			let gX = round(fx + gDist * cos(gAngle));
			let gZ = round(fz + gDist * sin(gAngle));
			group = new SimpleGroup(
				[new SimpleObject(aGrassShort, 2, 5, 0, 1, -PI/8, PI/8)],
				false, clBaseResource, gX, gZ
			);
			createObjectGroup(group, 0, [stayClasses(clLand, 5)]);
		}

		// create team bounty
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal, 2 * numPlayers / numTeams, 2 * numPlayers / numTeams, 0, floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, [avoidClasses(clBaseResource, 2, clHill, 1, clPlayer, 10), stayClasses(clLand, 5)]);
		group = new SimpleGroup(
			[new SimpleObject(oSecondaryHuntableAnimal, 4 * numPlayers / numTeams, 4 * numPlayers / numTeams, 0, floor(mapSize * 0.2))],
			true, clBaseResource, teamX, teamZ
		);
		createObjectGroup(group, 0, [avoidClasses(clBaseResource, 2, clHill, 1, clPlayer, 10), stayClasses(clLand, 5)]);
	}
}

RMS.SetProgress(40);

// create expansion islands

var landAreas = [];
var playerConstraint = new AvoidTileClassConstraint(clPlayer, floor(scaleByMapSize(12, 16)));
var landConstraint = new AvoidTileClassConstraint(clLand, floor(scaleByMapSize(12, 16)));

for (let x = 0; x < mapSize; ++x)
	for (let z = 0; z < mapSize; ++z)
		if (playerConstraint.allows(x, z) && landConstraint.allows(x, z))
			landAreas.push([x, z]);

var chosenPoint;
var landAreaLen;

log("Creating big islands...");
var numIslands = scaleByMapSize(4, 14)
for (let i = 0; i < numIslands; ++i)
{
	landAreaLen = landAreas.length;
	if (!landAreaLen)
		break;

	chosenPoint = landAreas[randInt(landAreaLen)];

	// create big islands
	let placer = new ChainPlacer(floor(scaleByMapSize(4, 8)), floor(scaleByMapSize(8, 14)), floor(scaleByMapSize(25, 60)), 0.07, chosenPoint[0], chosenPoint[1], scaleByMapSize(30, 70));
	let terrainPainter = new LayeredPainter(
		[tMainTerrain, tMainTerrain],		// terrains
		[2]								// widths
	);
	let elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 3, 6);
	let newIsland = createAreas(
		placer,
		[terrainPainter, elevationPainter, paintClass(clLand)],
		avoidClasses(clLand, 3, clPlayer, 3),
		1, 1
	);
	if (newIsland && newIsland.length)
	{
		let n = 0;
		for (let j = 0; j < landAreaLen; ++j)
		{
			let x = landAreas[j][0], z = landAreas[j][1];
			if (playerConstraint.allows(x, z) && landConstraint.allows(x, z))
				landAreas[n++] = landAreas[j];
		}
		landAreas.length = n;
	}
}

playerConstraint = new AvoidTileClassConstraint(clPlayer, floor(scaleByMapSize(9, 12)));
landConstraint = new AvoidTileClassConstraint(clLand, floor(scaleByMapSize(9, 12)));

log("Creating small islands...");
numIslands = scaleByMapSize(6, 18) * scaleByMapSize(1, 3)
for (let i = 0; i < numIslands; ++i)
{
	landAreaLen = landAreas.length;
	if (!landAreaLen)
		break;

	chosenPoint = landAreas[randInt(0, landAreaLen)];

	let placer = new ChainPlacer(floor(scaleByMapSize(4, 7)), floor(scaleByMapSize(7, 10)), floor(scaleByMapSize(16, 40)), 0.07, chosenPoint[0], chosenPoint[1], scaleByMapSize(22, 40));
	let terrainPainter = new LayeredPainter(
		[tMainTerrain, tMainTerrain],		// terrains
		[2]								// widths
	);
	let elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 3, 6);
	let newIsland = createAreas(
		placer,
		[terrainPainter, elevationPainter, paintClass(clLand)],
		avoidClasses(clLand, 3, clPlayer, 3),
		1, 1
	);
	if (newIsland !== undefined)
	{
		let temp = []
		for (let j = 0; j < landAreaLen; ++j)
		{
			let x = landAreas[j][0], z = landAreas[j][1];
			if (playerConstraint.allows(x, z) && landConstraint.allows(x, z))
					temp.push([x, z]);
		}
		landAreas = temp;
	}
}
paintTerrainBasedOnHeight(1, 3, 0, tShore);
paintTerrainBasedOnHeight(-8, 1, 2, tWater);

RMS.SetProgress(70);

// smooth Heightmap
function decayErrodeHeightmap(strength, heightmap)
{
	strength = (strength || 0.9); // 0 to 1
	heightmap = (heightmap || g_Map.height);
	
	var referenceHeightmap = deepcopy(heightmap);
	// var map = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // faster
	var map = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]; // smoother
	var max_x = heightmap.length;
	var max_y = heightmap[0].length;
	for (let x = 0; x < max_x; ++x)
		for (let y = 0; y < max_y; ++y)
			for (let i = 0; i < map.length; ++i)
				heightmap[x][y] += strength / map.length * (referenceHeightmap[(x + map[i][0] + max_x) % max_x][(y + map[i][1] + max_y) % max_y] - referenceHeightmap[x][y]); // Not entirely sure if scaling with map.length is perfect but tested values seam to indicate it is
}

for (let i = 0; i < 5; ++i)
	decayErrodeHeightmap(0.5);

RMS.SetProgress(85);

// create bumps
createBumps();

// create mines
log("Creating mines...");
createMines(
[
	[new SimpleObject(oMetalLarge, 1, 1, 3, (numPlayers * 2) + 1)]
],
[avoidClasses(clForest, 1, clPlayer, 40, clRock, 20, clHill, 5), stayClasses(clLand, 5)],
clMetal
);
createMines(
[
	[new SimpleObject(oStoneLarge, 1, 1, 3, (numPlayers * 2) + 1)], [new SimpleObject(oStoneSmall, 2, 2, 2, (numPlayers * 2) + 1)]
],
[avoidClasses(clForest, 1, clPlayer, 40, clMetal, 20, clHill, 5), stayClasses(clLand, 5)],
clRock
);

// create forests
createForests(
 [tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
 [avoidClasses(clPlayer, 10, clForest, 20, clHill, 10, clBaseResource, 5, clRock, 4, clMetal, 4), stayClasses(clLand, 5)],
 clForest,
 1.0,
 random_terrain
);

// create hills
var placer = new ChainPlacer(1, floor(scaleByMapSize(4, 6)), floor(scaleByMapSize(16, 40)), 0.5);
var painter = new LayeredPainter(
	[tCliff, tHill],		// terrains
	[2]								// widths
);
var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 18, 2);
createAreas(
	placer,
	[painter, elevationPainter, paintClass(clHill)], 
	[avoidClasses(clBaseResource, 20, clHill, 15, clRock, 4, clMetal, 4), stayClasses(clLand, 0)],
	scaleByMapSize(4, 13)
);

for (let i = 0; i < 3; ++i)
	decayErrodeHeightmap(0.2);

// create straggler trees
var types = [oTree1, oTree2, oTree4, oTree3];	// some variation
createStragglerTrees(types, [avoidClasses(clForest, 10, clPlayer, 20, clMetal, 1, clRock, 1, clHill, 1), stayClasses(clLand, 10)]);

// create dirt patches
log("Creating dirt patches...");
var sizes = [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)];
var numb = 1;
if (random_terrain == 6)
	numb = 3;

for (let i = 0; i < sizes.length; ++i)
{
	placer = new ChainPlacer(1, floor(scaleByMapSize(3, 5)), sizes[i], 0.5);
	painter = new LayeredPainter(
		[[tMainTerrain,tTier1Terrain],[tTier1Terrain,tTier2Terrain], [tTier2Terrain,tTier3Terrain]], 		// terrains
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
for (let i = 0; i < sizes.length; ++i)
{
	placer = new ChainPlacer(1, floor(scaleByMapSize(3, 5)), sizes[i], 0.5);
	painter = new TerrainPainter(tTier4Terrain);
	createAreas(
		placer,
		painter,
		[avoidClasses(clForest, 0, clHill, 0, clDirt, 5, clPlayer, 0), stayClasses(clLand, 6)],
		numb * scaleByMapSize(15, 45)
	);
}

// create small decorative rocks
log("Creating small decorative rocks...");
var group = new SimpleGroup(
	[new SimpleObject(aRockMedium, 1, 3, 0, 1)],
	true
);
createObjectGroups(
	group, 0,
	[avoidClasses(clForest, 0, clHill, 0), stayClasses(clLand, 5)],
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
	[avoidClasses(clForest, 0, clHill, 0), stayClasses(clLand, 5)],
	scaleByMapSize(8, 131), 50
);

// create fish
log("Creating fish...");
group = new SimpleGroup(
	[new SimpleObject(oFish, 2, 3, 0, 2)],
	true, clFood
);
createObjectGroups(group, 0,
	avoidClasses(clLand, 4, clFood, 20),
	25 * numPlayers, 60
);

log("Creating Whales...");
// create Whales
group = new SimpleGroup(
	[new SimpleObject(oWhale, 1, 1, 0, 3)], 
	true, clFood
);
createObjectGroups(group, 0,
	[avoidClasses(clLand, 4),avoidClasses(clFood, 8)],
	scaleByMapSize(5, 20), 100
);

log("Creating shipwrecks...");
// create shipwreck
group = new SimpleGroup(
	[new SimpleObject(oShipwreck, 1, 1, 0, 1)], 
	true, clFood
);
createObjectGroups(group, 0,
	[avoidClasses(clLand, 4),avoidClasses(clFood, 8)],
	scaleByMapSize(12, 16), 100
);

log("Creating shipwreck debris...");
// create shipwreck debris
group = new SimpleGroup(
	[new SimpleObject(oShipDebris, 1, 1, 0, 1)], 
	true, clFood
);
createObjectGroups(group, 0,
	[avoidClasses(clLand, 4),avoidClasses(clFood, 8)],
	scaleByMapSize(10, 20), 100
);

// create decoration 

var planetm = 1;
if (random_terrain == 7)
{
	planetm = 8;
}

// create grass tufts
var num = (PI * radius * radius) / 250;
for (let j = 0; j < num; ++j)
{
	let gAngle = randFloat(0, TWO_PI);
	let gDist = radius - (5 + randInt(7));
	let gX = round(fx + gDist * cos(gAngle));
	let gZ = round(fz + gDist * sin(gAngle));
	group = new SimpleGroup(
		[new SimpleObject(aGrassShort, 2, 5, 0,1, -PI / 8, PI / 8)],
		false, clBaseResource, gX, gZ
	);
	createObjectGroup(group, 0, [stayClasses(clLand, 5)]);
}

//create small grass tufts
log("Creating small grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrassShort, 1, 2, 0, 1, -PI / 8, PI / 8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clHill, 2, clPlayer, 2, clDirt, 0), stayClasses(clLand, 6)],
	planetm * scaleByMapSize(13, 200)
);

RMS.SetProgress(95);

// create large grass tufts
log("Creating large grass tufts...");
group = new SimpleGroup(
	[new SimpleObject(aGrass, 2, 4, 0, 1.8, -PI / 8, PI / 8), new SimpleObject(aGrassShort, 3, 6, 1.2,2.5, -PI / 8, PI / 8)]
);
createObjectGroups(group, 0,
	[avoidClasses(clHill, 2, clPlayer, 2, clDirt, 1, clForest, 0), stayClasses(clLand, 5)],
	planetm * scaleByMapSize(13, 200)
);

// do some environment randomization
var random_sky = randInt(1, 3);
if (random_sky == 1){
	setSkySet("cloudless");
}
else if (random_sky == 2){
	setSkySet("cumulus");
}
else if (random_sky == 3){
	setSkySet("overcast");
}
setSunRotation(randFloat(0, TWO_PI));
setSunElevation(randFloat(PI/5, PI/3));
setWaterWaviness(2);

RMS.SetProgress(100);

// Export map data
ExportMap();