RMS.LoadLibrary("rmgen");

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

log("Initializing map...");
InitMap();

const numPlayers = getNumPlayers();
const mapSize = getMapSize();
const mapArea = mapSize*mapSize;

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
	for (var iz = 0; iz < mapSize; iz++)
	{
		var x = ix / (mapSize + 1.0);
		var z = iz / (mapSize + 1.0);
			placeTerrain(ix, iz, tMainTerrain);
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
	if (team == -1)
	{
		teams[8 - ffaPlayers] = new Array();
		teams[8 - ffaPlayers].push(i+1);
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

// create bowl
var bSize = PI * fx * fx / 2.25;
var placer = new ClumpPlacer(bSize, 1, 1, 1, centerOfMap, centerOfMap);
var terrainPainter = new LayeredPainter(
    [tCliff, tMainTerrain, tMainTerrain, tMainTerrain],       // terrains
    [4, 1, 2]       // widths
);
var elevationPainter = new SmoothElevationPainter(
   ELEVATION_SET,          // type
   0,             // elevation
   4               // blend radius
);
createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)]);

RMS.SetProgress(50);

// place inner team members
for (var i = 0; i < 9; i++)
{
	// we found a team
	if (teams[i] != null)
	{
		teamNo++;
		var teamAngle = startAngle + teamNo*TWO_PI/numTeams;

		log("Creating base for player " + teams[i][0] + " on team " + i + "...");

		// get the x and z in tiles
		var fx = fractionToTiles(0.5 + 0.18*cos(teamAngle));
		var fz = fractionToTiles(0.5 + 0.18*sin(teamAngle));
		var ix = round(fx);
		var iz = round(fz);
		addToClass(ix, iz, clPlayer);
		addToClass(ix+5, iz, clPlayer);
		addToClass(ix, iz+5, clPlayer);
		addToClass(ix-5, iz, clPlayer);
		addToClass(ix, iz-5, clPlayer);

		// create starting units
		placeCivDefaultEntities(fx, fz, teams[i][0], BUILDING_ANGlE);

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
}

var rampOffset = 0;
var rampLength = 27;

if (mapSize < 256)
	rampLength = 15;

if (mapSize < 192)
{
	rampLength = 11;
	rampOffset = -3;
}

if (mapSize > 256)
	rampOffset = 12;

if (mapSize > 448)
	rampOffset = 18;

var outCount = 0;
var numOuter = numPlayers - numTeams;

// place outer team members
for (var i = 0; i < 9; i++)
{
	// we found a team
	if (teams[i] != null && teams[i].length > 1)
	{
		for (var p = 1; p < teams[i].length; p++)
		{
			outCount++;
			var teamAngle = startAngle + outCount*TWO_PI/numOuter;

			log("Creating base for player " + teams[i][p] + " on team " + i + "...");

			// get the x and z in tiles
			var fx = fractionToTiles(0.5 + 0.42*cos(teamAngle));
			var fz = fractionToTiles(0.5 + 0.42*sin(teamAngle));
			var ix = round(fx);
			var iz = round(fz);
			addToClass(ix, iz, clPlayer);
			addToClass(ix+5, iz, clPlayer);
			addToClass(ix, iz+5, clPlayer);
			addToClass(ix-5, iz, clPlayer);
			addToClass(ix, iz-5, clPlayer);

			// create starting units
			placeCivDefaultEntities(fx, fz, teams[i][p], BUILDING_ANGlE);

			// create the city patch
			var cityRadius = radius/3;
			var placer = new ClumpPlacer(PI*cityRadius*cityRadius, 0.6, 0.3, 10, ix, iz);
			var painter = new LayeredPainter([tRoadWild, tRoad], [1]);
			createArea(placer, painter, null);

			// create the ramp
			var rampAngle = teamAngle + PI + randFloat(-PI/8, PI/8);
			var rampDist = radius;
			var rampWidth = 12;
			var rampX1 = round(fx + (rampDist + rampOffset + rampLength) * cos(rampAngle));
			var rampZ1 = round(fz + (rampDist + rampOffset + rampLength) * sin(rampAngle));
			var rampX2 = round(fx + (rampDist + rampOffset) * cos(rampAngle));
			var rampZ2 = round(fz + (rampDist + rampOffset) * sin(rampAngle));

			createRamp (rampX1, rampZ1, rampX2, rampZ2, 0, 24, rampWidth, 2, tMainTerrain, tCliff, clPlayer);

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
	}
}

RMS.SetProgress(85);

createMines(
[
	[new SimpleObject(oStoneLarge, 1,1, 1,numPlayers)], [new SimpleObject(oStoneSmall, 2,2, 2,numPlayers * 2)]
],
avoidClasses(clWater, 5, clForest, 1, clPlayer, 20, clRock, 10, clHill, 5, clLand, 5),
clRock
)

log("Creating metal mines...");
createMines(
[
	[new SimpleObject(oMetalLarge, 1,1, 1,numPlayers)]
],
avoidClasses(clWater, 5, clForest, 1, clPlayer, 20, clMetal, 10, clRock, 5, clHill, 5, clLand, 5),
clMetal
)

group = new SimpleGroup(
	[new SimpleObject(oMetalLarge,1,3,0,40)],
	true, clBaseResource, centerOfMap, centerOfMap
);
createObjectGroup(group, 0, avoidClasses(clBaseResource, 5));

group = new SimpleGroup(
	[new SimpleObject(oStoneLarge,1,3,0,40)],
	true, clBaseResource, centerOfMap, centerOfMap
);
createObjectGroup(group, 0, avoidClasses(clBaseResource, 5));

createBumps();

createFood(
	[
		[new SimpleObject(oFruitBush, 5,6, 1,5)],
		[new SimpleObject(oMainHuntableAnimal, 2,6, 1,5)],
		[new SimpleObject(oSecondaryHuntableAnimal, 4,7, 3,8)],
	],
	[
		numPlayers,
		numPlayers * 6,
		numPlayers * 6,
	],
	[avoidClasses(clHill, 5, clFood, 10, clBaseResource, 3, clPlayer, 20), stayClasses(clLand, 10)],
	clFood
);

createFood(
	[
		[new SimpleObject(oFruitBush, 3,4, 0,5)],
		[new SimpleObject(oMainHuntableAnimal, 1,3, 0,5)],
	],
	[
		ceil(numPlayers/2),
		numPlayers,
	],
	avoidClasses(clHill, 5, clFood, 10, clBaseResource, 3, clPlayer, 20, clLand, 5),
	clFood
);

var forestDist = 20;
if (mapSize < 192)
	forestDist = 6;
if (mapSize < 256)
	forestDist = 12;

createForests(
 [tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
 [avoidClasses(clPlayer, forestDist, clForest, forestDist, clHill, forestDist, clWater, 5), stayClasses(clLand, Math.floor(forestDist/2))],
 clForest,
 1.0,
 random_terrain
);

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

ExportMap();
