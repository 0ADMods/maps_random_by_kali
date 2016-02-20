RMS.LoadLibrary("rmgen");

///////////
// initialize the map
///////////
log("Initializing map...");
InitMap();

///////////
// define the map constants
///////////
const randomTerrain = randomizeBiome();
const t = constTerrains();
const g = constGaia();
const p = constProps();
const tc = constTileClasses(["spine"]);
const f = constForests();
const numPlayers = getNumPlayers();
const mapSize = getMapSize();
const mapArea = mapSize * mapSize;
const centerOfMap = mapSize / 2;
const startAngle = randFloat(0, TWO_PI);
const radius = -PI / 4;

///////////
// setup the map
///////////
initTerrain(mapSize, t.mainTerrain);
RMS.SetProgress(20);

///////////
// add players
///////////
var players = addBases(numPlayers, "radial", 0.35);
RMS.SetProgress(40);

///////////
// customize the map
///////////
addLake();
if(mapSize >= 192) {
	addHarbors(players);
}
addSpines();
RMS.SetProgress(60);

///////////
// decorate the terrain
///////////

// decorate the land
addHills(avoidClasses(tc.hill, 15, tc.mountain, 15, tc.player, 20, tc.spine, 5, tc.water, 5), 1, 0.1, 1);
addHills([avoidClasses(tc.hill, 15, tc.mountain, 15, tc.player, 20, tc.spine, 5, tc.water, 5), stayClasses(tc.spine, 5)], 0.5, 0.2, 0.7);
addMountains(avoidClasses(tc.mountain, 15, tc.player, 20, tc.spine, 15, tc.water, 5), 1, 0.1, 1);
addLayeredPatches(avoidClasses(tc.dirt, 5, tc.forest, 0, tc.mountain, 0, tc.player, 12, tc.spine, 5, tc.water, 3), 1, 0.1, 1);
addDecoration(avoidClasses(tc.forest, 0, tc.mountain, 0, tc.player, 0, tc.spine, 5, tc.water, 0), 1, 0.1, 1);

// decorate the spines
addLayeredPatches([avoidClasses(tc.dirt, 5, tc.forest, 0, tc.mountain, 0, tc.player, 12, tc.water, 3), stayClasses(tc.spine, 5)], 1, 0.1, 1);
addDecoration([avoidClasses(tc.forest, 0, tc.mountain, 0, tc.player, 0, tc.water, 0), stayClasses(tc.spine, 5)], 1, 0.1, 1);
RMS.SetProgress(80);

///////////
// add resources
///////////

// add resources to the land
addForests(avoidClasses(tc.forest, 18, tc.mountain, 5, tc.player, 20, tc.water, 2 , tc.spine, 5), 1, 0.1, 1);

addMetal(avoidClasses(tc.forest, 5, tc.metal, 40, tc.mountain, 2, tc.player, 50, tc.rock, 10, tc.spine, 5, tc.water, 3), 1, 0.1, 1);
addStone(avoidClasses(tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 50, tc.rock, 40, tc.spine, 5, tc.water, 3), 1, 0.1, 1);
addAnimals(avoidClasses(tc.food, 20, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.spine, 5, tc.water, 3), 1, 0.1, 1);
addStragglerTrees(avoidClasses(tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.spine, 5, tc.water, 5), 1, 0.1, 1);

// add resources to the spines
addStone([avoidClasses(tc.forest, 5, tc.land, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 40, tc.water, 3), stayClasses(tc.spine, 5)], 1, 0.3, 3);
addMetal([avoidClasses(tc.forest, 5, tc.land, 5, tc.metal, 40, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3), stayClasses(tc.spine, 5)], 1, 0.3, 3);
addForests([avoidClasses(tc.forest, 8, tc.land, 5, tc.mountain, 5, tc.player, 10, tc.water, 10), stayClasses(tc.spine, 5)], 0.5, 0.3, 1);
addStragglerTrees([avoidClasses(tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5), stayClasses(tc.spine, 5)], 1, 0.1, 1);
RMS.SetProgress(80);

///////////
// export the map
///////////
RMS.SetProgress(100);
ExportMap();

///////////
// Custom map functions
///////////

// add the center lake
function addLake() {
	var lSize = sqrt(sqrt(sqrt(scaleByMapSize(1, 6))));

	var placer = new ChainPlacer(2, floor(scaleByMapSize(2, 12)), floor(scaleByMapSize(35, 160)), 1, centerOfMap, centerOfMap, 0, [floor(mapSize * 0.17 * lSize)]);
	var terrainPainter = new LayeredPainter([t.shore, t.water, t.water], [1, 100]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, -18, 10);

	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], avoidClasses(tc.player, 20));

	var fDist = 50;
	if(mapSize <= 192) {
		fDist = 20;
	}

	// create a bunch of fish
	var group = new SimpleGroup([new SimpleObject(g.fish, 30, 40, 0, fDist)], true, tc.baseResource, centerOfMap, centerOfMap);
	createObjectGroup(group, 0, avoidClasses(tc.player, 5, tc.mountain, 10));
}

// add player harbors
function addHarbors(players) {
	for(var i = 0; i < players.length; ++i) {
		// create player harbors
		var ix = round(fractionToTiles(players[i].x));
		var iz = round(fractionToTiles(players[i].z));
		var playerDistX = centerOfMap - ix;
		var playerDistZ = centerOfMap - iz;
		var offsetX = round(playerDistX / 3);
		var offsetZ = round(playerDistZ / 3);

		var placer = new ClumpPlacer(scaleByMapSize(1200, 1200), 0.5, 0.5, 1, ix + offsetX, iz + offsetZ)
		var terrainPainter = new LayeredPainter([t.shore, t.water],	[2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, -11, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], avoidClasses(tc.player, 15, tc.hill, 1));

		// create fish in harbor
		var group = new SimpleGroup(
			[new SimpleObject(g.fish, 4, 6, 5, 10)],
			true, tc.baseResource, ix + offsetX, iz + offsetZ
		);
		createObjectGroup(group, 0, [avoidClasses(tc.land, 2, tc.hill, 2), stayClasses(tc.water, 5)]);
	}
}

// add mountain spines
function addSpines() {
	var split = 1;
	if(numPlayers <= 3 || (mapSize >= 320 && numPlayers <= 4)) {
		split = 2;
	}

	for (var i = 0; i < numPlayers * split; ++i) {
	  var tang = startAngle + (i + 0.5) * TWO_PI / (numPlayers * split);

	  var fx = fractionToTiles(0.5);
	  var fz = fractionToTiles(0.5);
	  var ix = round(fx);
	  var iz = round(fz);

		var mStartCo = 0.12
		var mStopCo = 0.40
		var mSize = 15;
		var mWaviness = 0.4;
		var mOffset = 0.3;
		var mTaper = -1.5;

		// make small mountain dividers if we're making expansion territories or if there are a lot of players
		if(split == 2 && i % split == 0 || numPlayers >= 7 && mapSize <= 384) {
			var mStartCo = 0.15
			var mStopCo = 0.44
			var mSize = 8;
			var mWaviness = 0.4;
			var mOffset = 0.3;
			var mTaper = -1.5;
		}

		if(mapSize <= 192) {
			var mStartCo = 0.15
			var mStopCo = 0.45
			var mSize = 0.02;
			var mWaviness = 0.2;
			var mOffset = 0.1;
			var mTaper = 0;
		}

		var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(14, mSize), mWaviness, 0.1, mOffset, mTaper);
		var terrainPainter = new LayeredPainter([t.cliff, t.mainTerrain, t.forestFloor2], [3, 5]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, 20, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.spine)], avoidClasses(tc.player, 5));
	}
}

/********************************
 *
 * Utilities
 *
 * Recommended for inclusion at:
 * ps/trunk/binaries/data/mods/public/maps/random/rmgen/utilities.js
 *
 * Could eventually replace:
 * ps/trunk/binaries/data/mods/public/maps/random/rmgen/utilityfunctions.js
 *
 * However, removing utilityfunctions.js would break older maps.
 *
 ********************************/

///////////
// Terrain
///////////

/////////////////////////////////////////
// addDecoration
//
// Function for creating decoration
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addDecoration(constraint, percent, deviation, fillFraction) {
	var decorations = [[new SimpleObject(p.rockMedium, 1, 3, 0, 1)],
		[new SimpleObject(p.rockLarge, 1, 2, 0, 1), new SimpleObject(p.rockMedium, 1, 3, 0, 2)],
		[new SimpleObject(p.grassShort, 1, 2, 0, 1, -PI / 8, PI / 8)],
		[new SimpleObject(p.grass, 2, 4, 0, 1.8, -PI / 8, PI / 8), new SimpleObject(p.grassShort, 3,6, 1.2, 2.5, -PI / 8, PI / 8)],
		[new SimpleObject(p.bushMedium, 1, 2, 0, 2), new SimpleObject(p.bushSmall, 2, 4, 0, 2)]
	];

	var planetm = 1;
	if (randomTerrain == 7)
		planetm = 8;

	var baseCount = planetm * getRandomDeviation(percent, deviation);

	var counts = [
		scaleByMapSize(16, 262) * fillFraction,
		scaleByMapSize(8, 131) * fillFraction,
		baseCount * scaleByMapSize(13, 200) * fillFraction,
		baseCount * scaleByMapSize(13, 200) * fillFraction,
		baseCount * scaleByMapSize(13, 200) * fillFraction
	];

	for (var i = 0; i < decorations.length; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var decorCount = floor(counts[i] * offset);
		var group = new SimpleGroup(decorations[i], true);
		createObjectGroups(group, 0, constraint, decorCount, 5);
	}
}

/////////////////////////////////////////
// addHills
//
// Function for creating rolling hills
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addHills(constraint, percent, deviation, fillFraction) {
	var countOffset = getRandomDeviation(percent, deviation);
	var playerFactor = numPlayers / 4;
	if(playerFactor < 1) {
		playerFactor = 1;
	}

	var count = fillFraction * scaleByMapSize(30, 30) * countOffset / playerFactor;
	var minSize = floor(scaleByMapSize(5, 5));
	var maxSize = floor(scaleByMapSize(8, 8));
	var spread = floor(scaleByMapSize(20, 20));

	for(var i = 0; i < count; ++i) {
		var elevation = 10 + randInt(8);
		var smooth = floor(elevation / 2);
		var offset = getRandomDeviation(percent, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.mainTerrain, t.mainTerrain], [pSmooth]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(tc.hill)], constraint, 1);
	}
}

/////////////////////////////////////////
// addLayeredPatches
//
// Function for creating layered patches
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addLayeredPatches(constraint, percent, deviation, fillFraction) {
	var minRadius = 1;
	var maxRadius = floor(scaleByMapSize(3, 5));
	var count = fillFraction * scaleByMapSize(15, 45);
	var sizes = [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)];

	for(var i = 0; i < sizes.length; i++) {
		var offset = getRandomDeviation(percent, deviation);
		var patchMinRadius = minRadius * offset;
		var patchMaxRadius = maxRadius * offset;
		var patchSize = sizes[i] * offset;
		var patchCount = count * offset;

		var placer = new ChainPlacer(patchMinRadius, patchMaxRadius, patchSize, 0.5);
		var painter = new LayeredPainter(
			[[t.mainTerrain, t.tier1Terrain], [t.tier1Terrain, t.tier2Terrain], [t.tier2Terrain, t.tier3Terrain], [t.tier4Terrain]], 		// terrains
			[1,1]			// widths
		);
		createAreas(placer, [painter, paintClass(tc.dirt)], constraint, patchCount);
	}
}

/////////////////////////////////////////
// addMountains
//
// Function for creating steep mountains
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addMountains(constraint, percent, deviation, fillFraction) {
	var countOffset = getRandomDeviation(percent, deviation);
	var playerFactor = numPlayers / 4;
	if(playerFactor < 1) {
		playerFactor = 1;
	}

	var count = fillFraction * scaleByMapSize(30, 30) * countOffset / playerFactor;
	var minSize = floor(scaleByMapSize(4, 4));
	var maxSize = floor(scaleByMapSize(10, 10));
	var spread = floor(scaleByMapSize(10, 10));
	var elevation = 36;
	var smooth = 8;

	for(var i = 0; i < count; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.cliff, t.hill], [pSmooth]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(tc.mountain)], constraint, 1);
	}
}

/////////////////////////////////////////
// addPlateaus
//
// Function for creating plateaus
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addPlateaus(constraint, percent, deviation, fillFraction) {
	var countOffset = getRandomDeviation(percent, deviation);
	var playerFactor = numPlayers / 4;
	if(playerFactor < 1) {
		playerFactor = 1;
	}

	var count = fillFraction * scaleByMapSize(30, 30) * countOffset / playerFactor;
	var minSize = floor(scaleByMapSize(2, 2));
	var maxSize = floor(scaleByMapSize(5, 8));
	var spread = floor(scaleByMapSize(20, 40));
	var elevation = 25;
	var smooth = 2;

	for(var i = 0; i < count; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.cliff, t.cliff, t.hill], [1, pSmooth]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(tc.mountain)], constraint, 1);
	}
}

///////////
// Resources
///////////

/////////////////////////////////////////
// addAnimals
//
// Function for creating animals
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addAnimals(constraint, percent, deviation, fillFraction) {
	var animals = [
		[new SimpleObject(g.mainHuntableAnimal, 5, 7, 0, 4)],
		[new SimpleObject(g.secondaryHuntableAnimal, 2, 3, 0, 2)]
	];
	var counts = [
  	3 * numPlayers * fillFraction,
  	3 * numPlayers * fillFraction
	];

	for (var i = 0; i < animals.length; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var animalCount = floor(counts[i] * offset);
		var group = new SimpleGroup(animals[i], true, tc.food);
		createObjectGroups(group, 0, constraint, animalCount, 50);
	}
}

/////////////////////////////////////////
// addForests
//
// Function for creating forests
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addForests(constraint, percent, deviation, fillFraction) {
	// no forests to render in the african biome
	if(randomTerrain == 6) {
		return;
	}

	var types = [
		[[t.forestFloor2, t.mainTerrain, f.forest1], [t.forestFloor2, f.forest1]],
		[[t.forestFloor2, t.mainTerrain, f.forest2], [t.forestFloor1, f.forest2]],
		[[t.forestFloor1, t.mainTerrain, f.forest1], [t.forestFloor2, f.forest1]],
		[[t.forestFloor1, t.mainTerrain, f.forest2], [t.forestFloor1, f.forest2]]
	];

	for (var i = 0; i < types.length; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var forestSize = scaleByMapSize(50, 50) * offset;
		var forestCount = scaleByMapSize(10, 10) * offset * fillFraction;

		var placer = new ChainPlacer(1, floor(scaleByMapSize(3, 5)), forestSize, 0.5);
		var painter = new LayeredPainter(types[i], [2]);
		createAreas(placer, [painter, paintClass(tc.forest)], constraint, forestCount);
	}
}

/////////////////////////////////////////
// addMetal
//
// Function for creating metal mines
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addMetal(constraint, percent, deviation, fillFraction) {
	var count = scaleByMapSize(4,16);
	var mines = [[new SimpleObject(g.metalLarge, 1, 1, 0, 4)]];

	for (var i = 0; i < mines.length; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var mineCount = count * offset;
		var group = new SimpleGroup(mines[i], true, tc.metal);
		createObjectGroups(group, 0, constraint, mineCount, 70);
	}
}

/////////////////////////////////////////
// addStone
//
// Function for creating stone mines
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addStone(constraint, percent, deviation, fillFraction) {
	var count = scaleByMapSize(4,16);
	var mines = [[new SimpleObject(g.stoneSmall, 0, 2, 0, 4), new SimpleObject(g.stoneLarge, 1, 1, 0, 4)],
  [new SimpleObject(g.stoneSmall, 2, 5, 1, 3)]];

	for (var i = 0; i < mines.length; ++i) {
		var offset = getRandomDeviation(percent, deviation);
		var mineCount = count * offset * fillFraction;
		var group = new SimpleGroup(mines[i], true, tc.rock);
		createObjectGroups(group, 0, constraint, mineCount, 70);
	}
}

/////////////////////////////////////////
// addStragglerTrees
//
// Function for creating straggler trees
//
// constraint: constraint classes
// percent: percent of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined percent (0.2 would be 20% plus/minus deviation)
// fillFraction: percent of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addStragglerTrees(constraint, percent, deviation, fillFraction) {
	var trees = [g.tree1, g.tree2, g.tree3, g.tree4];

	var treesPerPlayer = 40;

	if (deviation > percent) {
		deviation = percent;
	}

	var offset = getRandomDeviation(percent, deviation);
	var treeCount = treesPerPlayer * numPlayers * offset;
	var totalTrees = scaleByMapSize(treeCount, treeCount);

	var count = floor(totalTrees / trees.length) * fillFraction;
	var max = 3;
	var minDist = 1;
	var maxDist = 5;

	if(randomTerrain == 6) {
		count = count * 1.25;
		max = 8;
		minDist = 2;
		maxDist = 7;
	}

	for (var i = 0; i < trees.length; ++i) {
		var group = new SimpleGroup([new SimpleObject(trees[i], 1, max, minDist, maxDist)], true, tc.forest);
		createObjectGroups(group, 0, constraint, count);
	}
}

/********************************
 *
 * Setup
 *
 * Recommended for inclusion at:
 * ps/trunk/binaries/data/mods/public/maps/random/rmgen/setup.js
 *
 ********************************/

///////////
// Generic Helpers
///////////

// paints the entire map with a single tile type
function initTerrain(mapSize, terrain) {
	for (var ix = 0; ix < mapSize; ix++) {
		for (var iz = 0; iz < mapSize; iz++) {
			var x = ix / (mapSize + 1.0);
			var z = iz / (mapSize + 1.0);
			placeTerrain(ix, iz, terrain);
		}
	}
}

// randomize player order
function randomizePlayers(numPlayers) {
	var playerIDs = [];
	for (var i = 0; i < numPlayers; i++)
		playerIDs.push(i + 1);

	playerIDs = sortPlayers(playerIDs);

	return playerIDs
}

// gets a number within a random deviation of a base number
function getRandomDeviation(base, randomness) {
	if (randomness > base) {
		randomness = base;
	}

	var deviation = base + (-1 * randomness + (randInt(20 * randomness) + 0.0001) / 10);
	return floor(deviation * 100) / 100;
}

///////////
// Bases
///////////

/////////////////////////////////////////
// addBases
//
// Function for creating player bases
//
// numPlayers: The number of player bases to create
// positionType: "radial", "stacked", "stronghold", "random"
// distance: distance from center (radial), or min distance from each other
//
/////////////////////////////////////////
function addBases(numPlayers, positionType, distance) {
	var playerIDs = randomizePlayers(numPlayers)
	var players = new Array();
	for (var i = 0; i < numPlayers; ++i) {
		players[i] = {"id": playerIDs[i], "angle": startAngle + i * TWO_PI / numPlayers};
		players[i]["x"] = 0.5 + distance * cos(players[i].angle);
		players[i]["z"] = 0.5 + distance * sin(players[i].angle);

		createBase(players[i])
	}

	return players;
}

/////////////////////////////////////////
// createBase
//
// Function for creating a single player base
//
// player: An object with the player's attributes (id, angle, x, z)
//
/////////////////////////////////////////
function createBase(player) {
	// get the x and z in tiles
	var fx = fractionToTiles(player.x);
	var fz = fractionToTiles(player.z);
	var ix = round(fx);
	var iz = round(fz);
	addToClass(ix, iz, tc.player);
	addToClass(ix + 5, iz, tc.player);
	addToClass(ix, iz + 5, tc.player);
	addToClass(ix - 5, iz, tc.player);
	addToClass(ix, iz - 5, tc.player);

	// create starting units
	placeCivDefaultEntities(fx, fz, player.id, radius);

	// create the city patch
	var cityRadius = scaleByMapSize(15, 25) / 3;
	var placer = new ClumpPlacer(PI * cityRadius * cityRadius, 0.6, 0.3, 10, ix, iz);
	var painter = new LayeredPainter([t.roadWild, t.road], [1]);
	createArea(placer, painter, null);

	// custom base terrain function

	// create animals
	for (var j = 0; j < 2; ++j)
	{
		var aAngle = randFloat(0, TWO_PI);
		var aDist = 7;
		var aX = round(fx + aDist * cos(aAngle));
		var aZ = round(fz + aDist * sin(aAngle));
		var group = new SimpleGroup(
			[new SimpleObject(g.chicken, 5, 5, 0, 2)],
			true, tc.baseResource, aX, aZ
		);
		createObjectGroup(group, 0);
	}

	// create berry bushes
	var bbAngle = randFloat(0, TWO_PI);
	var bbDist = 12;
	var bbX = round(fx + bbDist * cos(bbAngle));
	var bbZ = round(fz + bbDist * sin(bbAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.fruitBush, 5, 5, 0, 3)],
		true, tc.baseResource, bbX, bbZ
	);
	createObjectGroup(group, 0);

	// create metal mine
	var mAngle = bbAngle;
	while(abs(mAngle - bbAngle) < PI / 3)
	{
		mAngle = randFloat(0, TWO_PI);
	}
	var mDist = 12;
	var mX = round(fx + mDist * cos(mAngle));
	var mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.metalLarge, 1, 1, 0, 0)],
		true, tc.baseResource, mX, mZ
	);
	createObjectGroup(group, 0);

	// create stone mines
	mAngle += randFloat(PI / 8, PI / 4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.stoneLarge, 1, 1, 0, 2)],
		true, tc.baseResource, mX, mZ
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
		[new SimpleObject(g.tree1, num, num, 0, 3)],
		false, tc.baseResource, tX, tZ
	);
	createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));

	// create grass tufts
	var num = hillSize / 250;
	for (var j = 0; j < num; j++)
	{
		var gAngle = randFloat(0, TWO_PI);
		var gDist = radius - (5 + randInt(7));
		var gX = round(fx + gDist * cos(gAngle));
		var gZ = round(fz + gDist * sin(gAngle));
		group = new SimpleGroup(
			[new SimpleObject(p.grassShort, 2, 5, 0, 1, -PI / 8, PI / 8)],
			false, tc.baseResource, gX, gZ
		);
		createObjectGroup(group, 0);
	}
}

///////////
// Constants
///////////

// terrains
function constTerrains() {
	var t = {};
	t["mainTerrain"] = rBiomeT1();
	t["forestFloor1"] = rBiomeT2();
	t["forestFloor2"] = rBiomeT3();
	t["cliff"] = rBiomeT4();
	t["tier1Terrain"] = rBiomeT5();
	t["tier2Terrain"] = rBiomeT6();
	t["tier3Terrain"] = rBiomeT7();
	t["hill"] = rBiomeT8();
	t["dirt"] = rBiomeT9();
	t["road"] = rBiomeT10();
	t["roadWild"] = rBiomeT11();
	t["tier4Terrain"] = rBiomeT12();
	t["shoreBlend"] = rBiomeT13();
	t["shore"] = rBiomeT14();
	t["water"] = rBiomeT15();
	return t;
}

// gaia entities
function constGaia() {
	var g = {};
	g["tree1"] = rBiomeE1();
	g["tree2"] = rBiomeE2();
	g["tree3"] = rBiomeE3();
	g["tree4"] = rBiomeE4();
	g["tree5"] = rBiomeE5();
	g["fruitBush"] = rBiomeE6();
	g["chicken"] = rBiomeE7();
	g["mainHuntableAnimal"] = rBiomeE8();
	g["fish"] = rBiomeE9();
	g["secondaryHuntableAnimal"] = rBiomeE10();
	g["stoneLarge"] = rBiomeE11();
	g["stoneSmall"] = rBiomeE12();
	g["metalLarge"] = rBiomeE13();
	return g;
}

// props
function constProps() {
	var p = {};
	p["grass"] = rBiomeA1();
	p["grassShort"] = rBiomeA2();
	p["reeds"] = rBiomeA3();
	p["lillies"] = rBiomeA4();
	p["rockLarge"] = rBiomeA5();
	p["rockMedium"] = rBiomeA6();
	p["bushMedium"] = rBiomeA7();
	p["bushSmall"] = rBiomeA8();
	return p;
}

// tile classes
function constTileClasses(newClasses) {
	var defaultClasses = ["baseResource", "dirt", "food", "forest", "hill", "land", "metal", "mountain", "player", "rock", "settlement", "water"]
	var classes = defaultClasses.concat(newClasses)

	var tc = {};
	for(var i = 0; i < classes.length; ++i) {
		tc[classes[i]] = createTileClass();
	}
	return tc;
}

// forests
function constForests() {
	var f = {};
	f["forest1"] = [t.forestFloor2 + TERRAIN_SEPARATOR + g.tree1, t.forestFloor2 + TERRAIN_SEPARATOR + g.tree2, t.forestFloor2];
	f["forest2"] = [t.forestFloor1 + TERRAIN_SEPARATOR + g.tree4, t.forestFloor1 + TERRAIN_SEPARATOR + g.tree5, t.forestFloor1];
	return f;
}
