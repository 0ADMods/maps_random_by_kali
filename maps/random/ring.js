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

for (let ix = 0; ix < mapSize; ++ix)
{
	for (let iz = 0; iz < mapSize; ++iz)
	{
		var x = ix / (mapSize + 1.0);
		var z = iz / (mapSize + 1.0);
			placeTerrain(ix, iz, tMainTerrain);
	}
}

// randomize player order
var playerIDs = [];
for (var i = 0; i < numPlayers; ++i)
{
	playerIDs.push(i+1);
}
playerIDs = sortPlayers(playerIDs);

// place players
var playerX = new Array(numPlayers);
var playerZ = new Array(numPlayers);
var playerAngle = new Array(numPlayers);

var startAngle = randFloat(0, TWO_PI);
for (var i = 0; i < numPlayers; ++i)
{
	playerAngle[i] = startAngle + i * TWO_PI/numPlayers;
	playerX[i] = 0.5 + 0.33 * cos(playerAngle[i]);
	playerZ[i] = 0.5 + 0.33 * sin(playerAngle[i]);
}

// some constants
var radius = scaleByMapSize(15, 25);
var cliffRadius = 2;
var elevation = 20;
var centerOfMap = mapSize / 2;

var fx = fractionToTiles(0.5);
var fz = fractionToTiles(0.5);
ix = round(fx);
iz = round(fz);

const lSize = sqrt(sqrt(sqrt(scaleByMapSize(1, 6))));

// create the highlands
var placer = new ClumpPlacer(mapArea * 0.6, 1, 1, 1, ix, iz);
var terrainPainter = new LayeredPainter(
    [tCliff, tCliff, tTier2Terrain],       // terrains
    [1, 4]       // widths
);
var elevationPainter = new SmoothElevationPainter(
   ELEVATION_SET,          	// type
   24,             			// elevation
   7               			// blend radius
);
createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], avoidClasses(clPlayer, 5));

// create the middle lowlands
var placer = new ClumpPlacer(mapArea * 0.2, 1, 1, 1, ix, iz);
var terrainPainter = new LayeredPainter(
    [tCliff, tCliff, tMainTerrain],     // terrains
    [1, 4]       						// widths
);
var elevationPainter = new SmoothElevationPainter(
   ELEVATION_SET,          	// type
   4,             			// elevation
   7               			// blend radius
);
createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], avoidClasses(clPlayer, 5));

// create the center hill
var placer = new ClumpPlacer(mapArea * 0.05, 1, 1, 1, ix, iz);
var terrainPainter = new LayeredPainter(
    [tCliff, tCliff, tTier2Terrain],    // terrains
    [1, 4]       						// widths
);
var elevationPainter = new SmoothElevationPainter(
   ELEVATION_SET,          	// type
   24,             			// elevation
   7               			// blend radius
);
createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], avoidClasses(clPlayer, 5));

var placer = new ClumpPlacer(mapArea * 0.01, 1, 1, 1, ix, iz);
var terrainPainter = new LayeredPainter(
    [tCliff, tCliff, tTier2Terrain],    // terrains
    [1, 4]       						// widths
);
var elevationPainter = new SmoothElevationPainter(
   ELEVATION_SET,          	// type
   34,             			// elevation
   7               			// blend radius
);
createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)], avoidClasses(clPlayer, 5));

var cDist = 20;

// create the center bounty
group = new SimpleGroup(
	[new SimpleObject(oMetalLarge, 2, 5, 0, cDist)],
	true, clBaseResource, centerOfMap, centerOfMap
);
createObjectGroup(group, 0, avoidClasses(clBaseResource, 5));

group = new SimpleGroup(
	[new SimpleObject(oStoneLarge, 2, 5, 0, cDist)],
	true, clBaseResource, centerOfMap, centerOfMap
);
createObjectGroup(group, 0, avoidClasses(clBaseResource, 5));

for (var i = 0; i < numPlayers; ++i)
{
	var id = playerIDs[i];
	log("Creating base for player " + id + "...");

	// get the x and z in tiles
	var fx = fractionToTiles(playerX[i]);
	var fz = fractionToTiles(playerZ[i]);
	var ix = round(fx);
	var iz = round(fz);

	// mark a small area around the player's starting coördinates with the clPlayer class
	addToClass(ix, iz, clPlayer);
	addToClass(ix + 5, iz, clPlayer);
	addToClass(ix, iz + 5, clPlayer);
	addToClass(ix - 5, iz, clPlayer);
	addToClass(ix, iz - 5, clPlayer);

	// create starting units
	placeCivDefaultEntities(fx, fz, id, BUILDING_ANGlE);

	// create the city patch
	var cityRadius = radius/3;
	var placer = new ClumpPlacer(PI * cityRadius * cityRadius, 0.6, 0.3, 10, ix, iz);
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
			[new SimpleObject(oChicken, 5, 5, 0, 2)],
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
		[new SimpleObject(oFruitBush, 5, 5, 0, 3)],
		true, clBaseResource, bbX, bbZ
	);
	createObjectGroup(group, 0);

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
		[new SimpleObject(oMetalLarge, 1, 1, 0, 0)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);

	// create stone mines
	mAngle += randFloat(PI/8, PI/4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(oStoneLarge, 1, 1, 0, 2)],
		true, clBaseResource, mX, mZ
	);
	createObjectGroup(group, 0);

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
		createObjectGroup(group, 0);
	}
}

RMS.SetProgress(20);

// create bumps
createBumps();

log("Creating stone mines...");
// create stone quarries
createMines(
	[
		[new SimpleObject(oStoneLarge, 1, 1, 3, (numPlayers * 2) + 1)], [new SimpleObject(oStoneSmall, 2, 2, 2, (numPlayers * 2) + 1)]
	],
	[avoidClasses(clWater, 1, clForest, 1, clPlayer, 20, clRock, 10, clHill, 1), stayClasses(clLand, 6)]
);

log("Creating metal mines...");
// create large metal quarries
createMines(
 	[
  		[new SimpleObject(oMetalLarge, 1, 1, 0, 4)]
 	],
 	avoidClasses(clWater, 1, clForest, 1, clPlayer, 20, clMetal, 10, clRock, 5, clHill, 1),
 	clMetal
);

// create forests
createForests(
	[tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
	avoidClasses(clPlayer, 2, clForest, 10, clHill, 1, clWater, 5),
	clForest,
	1.0,
	random_terrain
);

RMS.SetProgress(50);

// create dirt patches
log("Creating dirt patches...");
createLayeredPatches(
	[scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)],
	[[tMainTerrain, tTier1Terrain], [tTier1Terrain, tTier2Terrain], [tTier2Terrain, tTier3Terrain]],
	[1, 1],
	avoidClasses(clWater, 3, clForest, 0, clHill, 0, clDirt, 5, clPlayer, 12)
);

RMS.SetProgress(55);

// create grass patches
log("Creating grass patches...");
createPatches(
	[scaleByMapSize(2, 4), scaleByMapSize(3, 7), scaleByMapSize(5, 15)],
	tTier4Terrain,
	avoidClasses(clWater, 3, clForest, 0, clHill, 0, clDirt, 5, clPlayer, 12)
);

RMS.SetProgress(65);

// create animals
createFood
(
 	[
  		[new SimpleObject(oMainHuntableAnimal, 5, 7, 0, 4)], [new SimpleObject(oSecondaryHuntableAnimal, 2, 3, 0, 2)]
 	],
 	[3 * numPlayers, 3 * numPlayers],
 	avoidClasses(clWater, 3, clForest, 0, clPlayer, 20, clHill, 1, clFood, 20)
);

RMS.SetProgress(75);

// create fruits
createFood
(
 	[
  		[new SimpleObject(oFruitBush, 5,7, 0,4)]
 	],
 	[3 * numPlayers],
 	avoidClasses(clWater, 3, clForest, 0, clPlayer, 20, clHill, 1, clFood, 10)
);

RMS.SetProgress(85);

// create straggler trees
var types = [oTree1, oTree2, oTree4, oTree3];	// some variation
createStragglerTrees(types, avoidClasses(clWater, 5, clForest, 7, clHill, 1, clPlayer, 12, clMetal, 1, clRock, 1));

// create decoration
var planetm = 1;
if (random_terrain==7)
	planetm = 8;

createDecoration
(
 	[
 		[new SimpleObject(aRockMedium, 1, 3, 0, 1)],
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

// Export map data
ExportMap();