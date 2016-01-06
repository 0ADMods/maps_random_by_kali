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

var startAngle = PI/2;
var minDist = 0.2;
var maxDist = 0.5;

if(numPlayers >= 6 && numTeams <= 3) {
	minDist = 0.12;
}

if(numTeams >= 5) {
	minDist = 0.35;
}

// create mountain ranges
for (var m = 0; m < numTeams; m++)
{
  var tang = startAngle + (m+0.5)*TWO_PI/numTeams;

  var fx = fractionToTiles(0.5);
  var fz = fractionToTiles(0.5);
  ix = round(fx);
  iz = round(fz);

	var mStartCo = 0.05
	var mStopCo = 0.5
	var mSize = 20;
	var mWaviness = 0.6;
	var mOffset = 0.5;
	var mTaper = -2.5;

	if(numTeams > 3 || mapSize <= 192) {
		var mStartCo = 0.05
		var mStopCo = 0.5
		var mSize = 8;
		var mWaviness = 0.2;
		var mOffset = 0.2;
		var mTaper = -1.5;
	}

	if(numTeams >= 5) {
		var mStartCo = 0.05
		var mStopCo = 0.5
		var mSize = 4;
		var mWaviness = 0.2;
		var mOffset = 0.2;
		var mTaper = -0.7;
	}

	// place barrier
	var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo*cos(tang)), fractionToTiles(0.5 + mStartCo*sin(tang)), fractionToTiles(0.5 + mStopCo*cos(tang)), fractionToTiles(0.5 + mStopCo*sin(tang)), scaleByMapSize(14,mSize), mWaviness, 0.1, mOffset, mTaper);
	var terrainPainter = new LayeredPainter(
		[tCliff, tCliff, tCliff, tCliff],		// terrains
		[1,20,1]								// widths
	);
	var elevationPainter = new SmoothElevationPainter(
		ELEVATION_SET,			// type
		15,				// elevation
		2				// blend radius
	);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(clHill)], avoidClasses(clPlayer, 2));

}

RMS.SetProgress(50);

for(var i = 0; i < 9; i++) {
	// we found a team
	if(teams[i] != null) {
		teamNo++;
		var teamAngle = startAngle + teamNo*TWO_PI/numTeams;
		var teamDist = (maxDist - minDist) / teams[i].length;

		var thisX = fractionToTiles(0.5 + 0.8 * cos(teamAngle));
		var thisZ = fractionToTiles(0.5 + 0.8 * sin(teamAngle));

		var bountyX = round(fractionToTiles(0.5 + 0.45 * cos(teamAngle)));
		var bountyZ = round(fractionToTiles(0.5 + 0.45 * sin(teamAngle)));

		for(var p = 0; p < teams[i].length; p++) {
			log("Creating base for player " + teams[i][p] + " on team " + i + "...");

			// get the x and z in tiles
			var fx = fractionToTiles(0.5 + (minDist + p * teamDist)*cos(teamAngle));
			var fz = fractionToTiles(0.5 + (minDist + p * teamDist)*sin(teamAngle));
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

			// create mountain passes
			var pDist = 0.8;
			var nextTeamNo = teamNo+1;
			var nextTeamAngle = startAngle + nextTeamNo*TWO_PI/numTeams;

			if(numTeams==2) {
				if(teamNo == 1) {
					var nextX = fractionToTiles(pDist * cos(nextTeamAngle));
					var nextZ = fractionToTiles(pDist * sin(nextTeamAngle));
				} else {
					var nextX = fractionToTiles(pDist * cos(nextTeamAngle) + 1);
					var nextZ = fractionToTiles(pDist * sin(nextTeamAngle) + 1);
				}

				// create mountain passes
				var placer = new PathPlacer(thisX, thisZ, nextX, nextZ, scaleByMapSize(14,1), 0.7, 0.5, 0.1, -1.2);
				var terrainPainter = new LayeredPainter(
					[tMainTerrain, tMainTerrain, tMainTerrain, tMainTerrain],		// terrains
					[1,5,1]								// widths
				);
				var elevationPainter = new SmoothElevationPainter(
					ELEVATION_SET,			// type
					0,				// elevation
					2				// blend radius
				);
				createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)]);
			} else if(p == 0) {

				if(nextTeamNo == 9) {
					nextTeamNo = 1;
				}

				if(numTeams == 4) {
					pDist = 0.5;
				}
				if(numTeams == 5) {
					pDist = 0.35;
				}
				if(numTeams == 6) {
					pDist = 0.34;
				}
				if(numTeams == 7) {
					pDist = 0.32;
				}
				if(numTeams == 8) {
					pDist = 0.3;
				}

				var nextTeamAngle = startAngle + nextTeamNo*TWO_PI/numTeams;
				var nextX = fractionToTiles(0.5 + pDist * cos(nextTeamAngle));
				var nextZ = fractionToTiles(0.5 + pDist * sin(nextTeamAngle));

				// create mountain passes
				var placer = new PathPlacer(thisX, thisZ, nextX, nextZ, scaleByMapSize(14,4), 0.7, 0.5, 0.1, -1.2);
				var terrainPainter = new LayeredPainter(
					[tMainTerrain, tMainTerrain, tMainTerrain, tMainTerrain],		// terrains
					[1,5,1]								// widths
				);
				var elevationPainter = new SmoothElevationPainter(
					ELEVATION_SET,			// type
					0,				// elevation
					2				// blend radius
				);
				createArea(placer, [terrainPainter, elevationPainter, paintClass(clLand)]);
			}

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
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oStoneLarge,1+numPlayers/numTeams,1+numPlayers/numTeams,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oMainHuntableAnimal,numPlayers*15/numTeams,numPlayers*25/numTeams,0,floor(mapSize * 0.3))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oSecondaryHuntableAnimal,numPlayers*25/numTeams,numPlayers*35/numTeams,0,floor(mapSize * 0.3))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oTree1,numTeams*5,numTeams*5,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oTree2,numTeams*5,numTeams*5,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oTree3,numTeams*10,numTeams*10,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oTree4,numTeams*15,numTeams*15,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
		group = new SimpleGroup(
			[new SimpleObject(oTree5,numTeams*105,numTeams*105,0,floor(mapSize * 0.2))],
			true, clBaseResource, bountyX, bountyZ
		);
		createObjectGroup(group, 0, avoidClasses(clPlayer, 10, clBaseResource, 2, clHill, 1));
	}
}

RMS.SetProgress(85);

// create bumps
createBumps();

// create forests
createForests(
 [tMainTerrain, tForestFloor1, tForestFloor2, pForest1, pForest2],
 avoidClasses(clPlayer, 20, clForest, 20, clHill, 30, clWater, 5),
 clForest,
 1.0,
 random_terrain
);

// create straggeler trees
var types = [oTree1, oTree2, oTree4, oTree3];	// some variation
createStragglerTrees(types, avoidClasses(clWater, 5, clForest, 10, clHill, 15, clPlayer, 20, clMetal, 1, clRock, 1));


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
