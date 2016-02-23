RMS.LoadLibrary("rmgen");

///////////
// initialize the map
///////////
InitMap();

///////////
// define the map constants
///////////
var m = getSettings();
const t = constTerrains();
const g = constGaia();
const p = constProps();
const tc = constTileClasses();
const f = constForests();

///////////
// setup the map
///////////
initTerrain(t.mainTerrain);
RMS.SetProgress(20);

///////////
// add players
///////////

// randomize the starting positions
var starting = getStartingPositions();
var players = addBases(starting.setup, starting.distance, starting.separation);
RMS.SetProgress(40);

///////////
// customize the map
///////////
var tRand = randomizeElements(["hills", "lakes", "mountains", "plateaus"], 0.5, 3, 0.1, 0.5, 0, 2);
var gRand = randomizeElements(["animals", "berries", "fish", "forests", "metal", "stone", "trees"], 1, 1, 0, 0, 0.5, 2);
RMS.SetProgress(60);

///////////
// add terrain
///////////
addHills(avoidClasses(tc.hill, 15, tc.player, 20, tc.water, 5), tRand.hills.qty, tRand.hills.dev, tRand.hills.fill);
addMountains(avoidClasses(tc.mountain, 15, tc.player, 20, tc.water, 5), tRand.mountains.qty, tRand.mountains.dev, tRand.mountains.fill);
addPlateaus(avoidClasses(tc.mountain, 15, tc.player, 40, tc.water, 5), tRand.plateaus.qty, tRand.plateaus.dev, tRand.plateaus.fill);
addLakes(avoidClasses(tc.hill, 5, tc.mountain, 5, tc.player, 20, tc.water, 25), tRand.lakes.qty, tRand.lakes.dev, tRand.lakes.fill);
addLayeredPatches(avoidClasses(tc.dirt, 5, tc.forest, 0, tc.mountain, 0, tc.player, 12, tc.water, 3));
addDecoration(avoidClasses(tc.forest, 2, tc.mountain, 2, tc.player, 2, tc.water, 2));
RMS.SetProgress(80);

///////////
// add gaia
///////////
addForests(avoidClasses(tc.berries, 5, tc.forest, 18, tc.mountain, 5, tc.player, 20, tc.water, 2), gRand.forests.qty, gRand.forests.dev, gRand.forests.fill);
addBerries(avoidClasses(tc.berries, 50, tc.forest, 5, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.metal, 10, tc.water, 3), gRand.berries.qty, gRand.berries.dev, gRand.berries.fill);
addMetal(avoidClasses(tc.berries, 5, tc.forest, 5, tc.mountain, 2, tc.player, 50, tc.rock, 30, tc.metal, 40, tc.water, 3), gRand.metal.qty, gRand.metal.dev, gRand.metal.fill);
addStone(avoidClasses(tc.berries, 5, tc.forest, 5, tc.mountain, 2, tc.player, 50, tc.rock, 40, tc.metal, 30, tc.water, 3), gRand.stone.qty, gRand.stone.dev, gRand.stone.fill);
addAnimals(avoidClasses(tc.animals, 20, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.water, 3), gRand.animals.qty, gRand.animals.dev, gRand.animals.fill);
addFish([avoidClasses(tc.fish, 12, tc.hill, 8, tc.land, 8, tc.mountain, 8, tc.player, 8), stayClasses(tc.water, 8)], gRand.fish.qty, gRand.fish.dev, gRand.fish.fill);
addStragglerTrees(avoidClasses(tc.berries, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5), gRand.trees.qty, gRand.trees.dev, gRand.trees.fill);

///////////
// export the map
///////////
RMS.SetProgress(100);
ExportMap();

///////////
// Custom map functions
///////////


///////////
// RMGEN functions
///////////

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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addDecoration(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var offset = getRandomDeviation(size, deviation);
	var decorations = [[new SimpleObject(p.rockMedium, 1 * offset, 3 * offset, 0, 1 * offset)],
		[new SimpleObject(p.rockLarge, 1 * offset, 2 * offset, 0, 1 * offset), new SimpleObject(p.rockMedium, 1 * offset, 3 * offset, 0, 2 * offset)],
		[new SimpleObject(p.grassShort, 1 * offset, 2 * offset, 0, 1 * offset, -PI / 8, PI / 8)],
		[new SimpleObject(p.grass, 2 * offset, 4 * offset, 0, 1.8 * offset, -PI / 8, PI / 8), new SimpleObject(p.grassShort, 3 * offset, 6 * offset, 1.2 * offset, 2.5 * offset, -PI / 8, PI / 8)],
		[new SimpleObject(p.bushMedium, 1 * offset, 2 * offset, 0, 2 * offset), new SimpleObject(p.bushSmall, 2 * offset, 4 * offset, 0, 2 * offset)]
	];

	var baseCount = 1;
	if (m.biome == 7)
		baseCount = 8;

	var counts = [
		scaleByMapSize(16, 262),
		scaleByMapSize(8, 131),
		baseCount * scaleByMapSize(13, 200),
		baseCount * scaleByMapSize(13, 200),
		baseCount * scaleByMapSize(13, 200)
	];

	for (var i = 0; i < decorations.length; ++i)
	{
		var decorCount = floor(counts[i] * fill);
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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addHills(constraint, size, deviation, fill)
{

	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = fill * scaleByMapSize(8, 8);
	var minSize = floor(scaleByMapSize(5, 5));
	var maxSize = floor(scaleByMapSize(8, 8));
	var spread = floor(scaleByMapSize(20, 20));

	for(var i = 0; i < count; ++i)
	{
		var elevation = 6 + randInt(6);
		var offset = getRandomDeviation(size, deviation);
		var smooth = floor(elevation / 1.5);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		// don't let hills grow too tall
		if(pElevation > elevation)
		{
			pElevation = (elevation + pElevation) / 2;
		}

		// don't let hills grow too big
		if(pMaxSize > maxSize * 2)
		{
			pMaxSize = maxSize;
		}

		// don't render tiny hills
		if(pElevation < 5)
		{
			continue;
		}

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.mainTerrain, t.mainTerrain], [pSmooth]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(tc.hill)], constraint, 1);
	}
}

/////////////////////////////////////////
// addLakes
//
// Function for creating lakes
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addLakes(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = fill * scaleByMapSize(8, 8);
	var minSize = floor(scaleByMapSize(5, 5));
	var maxSize = floor(scaleByMapSize(8, 8));
	var spread = floor(scaleByMapSize(20, 20));

	for(var i = 0; i < count; ++i)
	{
		var elevation = -8 - randInt(8);
		var smooth = -1 * floor(elevation / 3);
		var offset = getRandomDeviation(size, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		// don't let lakes get too deep
		if(pElevation < elevation)
		{
			pElevation = (elevation - pElevation) / 2;
		}

		// don't let lakes grow too big
		if(pMaxSize > maxSize * 3)
		{
			pMaxSize = maxSize;
		}

		// don't render puddles
		if(pMinSize < minSize / 2)
		{
			continue;
		}

		// make sure lakes have some negative depth
		if(pElevation > -6)
		{
			pElevation = -6;
		}

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.shore, t.water, t.water], [1, 45]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], constraint, 1);
	}
}

/////////////////////////////////////////
// addLayeredPatches
//
// Function for creating layered patches
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addLayeredPatches(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var minRadius = 1;
	var maxRadius = floor(scaleByMapSize(3, 5));
	var count = fill * scaleByMapSize(15, 45);
	var sizes = [scaleByMapSize(3, 6), scaleByMapSize(5, 10), scaleByMapSize(8, 21)];

	for(var i = 0; i < sizes.length; i++)
	{
		var offset = getRandomDeviation(size, deviation);
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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addMountains(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = fill * scaleByMapSize(8, 8);
	var minSize = floor(scaleByMapSize(4, 4));
	var maxSize = floor(scaleByMapSize(10, 10));
	var spread = floor(scaleByMapSize(10, 10));
	var smooth = 8;

	for(var i = 0; i < count; ++i)
	{
		var elevation = 22 + randInt(8);
		var offset = getRandomDeviation(size, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * offset);

		// don't let mountains grow too tall
		if(pElevation > elevation)
		{
			pElevation = (elevation + pElevation) / 2;
		}

		// don't let mountains grow too big
		if(pMaxSize > maxSize * 2)
		{
			pMaxSize = maxSize;
		}

		// don't render tiny mountains
		if(pElevation < 15)
		{
			continue;
		}

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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addPlateaus(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = fill * scaleByMapSize(8, 8);
	var minSize = floor(scaleByMapSize(2, 2));
	var maxSize = floor(scaleByMapSize(5, 8));
	var spread = floor(scaleByMapSize(20, 40));
	var smooth = 2;

	for(var i = 0; i < count; ++i)
	{
		var elevation = 20 + randInt(10);
		var offset = getRandomDeviation(size, deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = floor(smooth * offset);
		var pElevation = floor(elevation * (offset / 2));

		// don't let plateaus grow too tall
		if(pElevation > elevation)
		{
			pElevation = (elevation + pElevation) / 2;
		}

		// don't let mountains grow too big
		if(pMaxSize > maxSize * 2)
		{
			pMaxSize = maxSize;
		}

		// don't render tiny plateaus
		if(pElevation < 10)
		{
			continue;
		}

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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addAnimals(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var groupOffset = getRandomDeviation(size, deviation);

	var animals = [
		[new SimpleObject(g.mainHuntableAnimal, 5 * groupOffset, 7 * groupOffset, 0, 4 * groupOffset)],
		[new SimpleObject(g.secondaryHuntableAnimal, 2 * groupOffset, 3 * groupOffset, 0, 2 * groupOffset)]
	];
	var counts = [3 * m.numPlayers * fill, 3 * m.numPlayers * fill];

	for (var i = 0; i < animals.length; ++i)
	{
		var group = new SimpleGroup(animals[i], true, tc.animals);
		createObjectGroups(group, 0, constraint, floor(counts[i]), 50);
	}
}

/////////////////////////////////////////
// addBerries
//
// Function for creating berries
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addBerries(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var groupOffset = getRandomDeviation(size, deviation);

	var count = scaleByMapSize(30, 30) * fill;
	var berries = [[new SimpleObject(g.fruitBush, 5 * groupOffset, 5 * groupOffset, 0, 3 * groupOffset)]];

	for (var i = 0; i < berries.length; ++i)
	{
		var group = new SimpleGroup(berries[i], true, tc.berries);
		createObjectGroups(group, 0, constraint, floor(count), 70);
	}
}

/////////////////////////////////////////
// addFish
//
// Function for creating fish
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addFish(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var groupOffset = getRandomDeviation(size, deviation);

	var fish = [
		[new SimpleObject(g.fish, 1 * groupOffset, 2 * groupOffset, 0, 2 * groupOffset)],
		[new SimpleObject(g.fish, 2 * groupOffset, 4 * groupOffset, 10 * groupOffset, 20 * groupOffset)]
	];
	var counts = [scaleByMapSize(3, 3) * m.numPlayers * fill, scaleByMapSize(3, 3) * m.numPlayers * fill];

	for (var i = 0; i < fish.length; ++i)
	{
		var group = new SimpleGroup(fish[i], true, tc.fish);
		createObjectGroups(group, 0, constraint, floor(counts[i]), 50);
	}
}

/////////////////////////////////////////
// addForests
//
// Function for creating forests
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addForests(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	// no forests to render in the african biome
	if(m.biome == 6)
	{
		return;
	}

	var types = [
		[[t.forestFloor2, t.mainTerrain, f.forest1], [t.forestFloor2, f.forest1]],
		[[t.forestFloor2, t.mainTerrain, f.forest2], [t.forestFloor1, f.forest2]],
		[[t.forestFloor1, t.mainTerrain, f.forest1], [t.forestFloor2, f.forest1]],
		[[t.forestFloor1, t.mainTerrain, f.forest2], [t.forestFloor1, f.forest2]]
	];

	for (var i = 0; i < types.length; ++i)
	{
		var offset = getRandomDeviation(size, deviation);
		var minSize = floor(scaleByMapSize(3, 5) * offset);
		var maxSize = floor(scaleByMapSize(50, 50) * offset);
		var forestCount = scaleByMapSize(10, 10) * fill;

		var placer = new ChainPlacer(1, minSize, maxSize, 0.5);
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
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addMetal(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var offset = getRandomDeviation(size, deviation);
	var count = scaleByMapSize(4, 16) * fill;
	var mines = [[new SimpleObject(g.metalLarge, 1 * offset, 1 * offset, 0, 4 * offset)]];

	for (var i = 0; i < mines.length; ++i)
	{
		var group = new SimpleGroup(mines[i], true, tc.metal);
		createObjectGroups(group, 0, constraint, count, 70);
	}
}

/////////////////////////////////////////
// addStone
//
// Function for creating stone mines
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addStone(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var offset = getRandomDeviation(size, deviation);
	var count = scaleByMapSize(4, 16) * fill;
	var mines = [[new SimpleObject(g.stoneSmall, 0, 2 * offset, 0, 4 * offset), new SimpleObject(g.stoneLarge, 1 * offset, 1 * offset, 0, 4 * offset)],
  [new SimpleObject(g.stoneSmall, 2 * offset, 5 * offset, 1 * offset, 3 * offset)]];

	for (var i = 0; i < mines.length; ++i)
	{
		var group = new SimpleGroup(mines[i], true, tc.rock);
		createObjectGroups(group, 0, constraint, count, 70);
	}
}

/////////////////////////////////////////
// addStragglerTrees
//
// Function for creating straggler trees
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addStragglerTrees(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	if(m.biome == 6 && fill < 0.8)
	{
		fill = 0.8;
	}

	var trees = [g.tree1, g.tree2, g.tree3, g.tree4];

	var treesPerPlayer = 40;

	var offset = getRandomDeviation(size, deviation);
	var treeCount = treesPerPlayer * m.numPlayers * fill;
	var totalTrees = scaleByMapSize(treeCount, treeCount);

	var count = floor(totalTrees / trees.length) * fill;
	var min = 1 * offset;
	var max = 4 * offset;
	var minDist = 1 * offset;
	var maxDist = 5 * offset;

	// render more trees for the african biome
	if(m.biome == 6)
	{
		count = count * 1.25;
		min = 3 * offset;
		max = 8 * offset;
		minDist = 2 * offset;
		maxDist = 7 * offset;
	}

	for (var i = 0; i < trees.length; ++i)
	{
		var treesMax = max;
		// don't clump fruit trees
		if (i == 2 && (m.biome == 3 || m.biome == 5))
		{
			treesMax = 1;
		}
		var group = new SimpleGroup([new SimpleObject(trees[i], min, treesMax, minDist, maxDist)], true, tc.forest);
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

function getRand(min, max, factor)
{
	return ((min * factor) + randInt((max - min) * factor)) / factor;
}

function randomizeElements(types, minSize, maxSize, minDeviation, maxDeviation, minFill, maxFill)
{
	var totalFill = ((minFill + maxFill) / 2) * types.length;
	var els = {};
	for(var i = 0; i < types.length; ++i)
	{
		els[types[i]] = {}
		var fill = getRand(minFill, maxFill, 100);
		totalFill = totalFill - fill;
		els[types[i]]["qty"] = 0;
		els[types[i]]["dev"] = 0;
		els[types[i]]["fill"] = 0;

		if(totalFill > 0)
		{
			els[types[i]]["qty"] = getRand(minSize, maxSize, 100);
			els[types[i]]["dev"] = getRand(minDeviation, maxDeviation, 100);
			els[types[i]]["fill"] = getRand(minFill, maxFill, 100);
		}
	}

	return els;
}

// put some useful map settings into an object
function getSettings()
{
	var m = {}
	m["biome"] = randomizeBiome();
	m["numPlayers"] = getNumPlayers();
	m["mapSize"] = getMapSize();
	m["mapArea"] = m["mapSize"] * m["mapSize"];
	m["centerOfMap"] = m["mapSize"] / 2;
	m["mapRadius"] = -PI / 4;
	m["teams"] = getTeams(m["numPlayers"]);
	return m;
}

// paints the entire map with a single tile type
function initTerrain(terrain)
{
	for (var ix = 0; ix < m.mapSize; ix++)
	{
		for (var iz = 0; iz < m.mapSize; iz++)
		{
			var x = ix / (m.mapSize + 1.0);
			var z = iz / (m.mapSize + 1.0);
			placeTerrain(ix, iz, terrain);
		}
	}
}

// randomize player order
function randomizePlayers(numPlayers)
{
	var playerIDs = [];
	for (var i = 0; i < m.numPlayers; i++)
	{
		playerIDs.push(i + 1);
	}

	playerIDs = sortPlayers(playerIDs);

	return playerIDs
}

// gets a number within a random deviation of a base number
function getRandomDeviation(base, randomness)
{
	if (randomness > base)
	{
		randomness = base;
	}

	var deviation = base + (-1 * randomness + (randInt(20 * randomness) + 0.0001) / 10);
	return floor(deviation * 100) / 100;
}

// return a parameteter or it's default value
function optionalParam(param, defaultVal)
{
	return param || defaultVal;
}

// default to "radial" placement
function typeOrDefault(type)
{
	return optionalParam(type, "radial");
}

// default to 0.35 distance
function distanceOrDefault(distance)
{
	return optionalParam(distance, 0.3);
}

// default to 0.35 distance
function groupedDistanceOrDefault(groupedDistance)
{
	return optionalParam(groupedDistance, 0.05);
}

// default to 100% of normal size
function sizeOrDefault(size)
{
	return optionalParam(size, 1);
}

// default to 10% deviation
function deviationOrDefault(deviation)
{
	return optionalParam(deviation, 0.1);
}

// default to filling 100% of the map
function fillOrDefault(fill)
{
	return optionalParam(fill, 1)
}

///////////
// Players
///////////

function getStartingPositions()
{
	var starting = {};
	var formats = ["radial"];

	if(m.teams.length >= 2 && m.numPlayers >= 4)
	{
		formats.push("stronghold");
	}
	var use = randInt(formats.length);

	starting["setup"] = formats[use];
	starting["distance"] = getRand(0.2, 0.4, 100);
	starting["separation"] = getRand(0.05, 0.1, 100);

	return starting;
}

// Group teams
function getTeams(numPlayers)
{
	var ffaPlayers = 0;
	var numTeams = 0;
	var teams = new Array(9);
	for (var i = 0; i < numPlayers; ++i)
	{
		var team = getPlayerTeam(i) + 1;
		if(team < 1)
		{
			teams[8 - ffaPlayers] = new Array();
			teams[8 - ffaPlayers].push(i + 1);
			ffaPlayers++;
			numTeams++;
		}
		else
		{
			if(teams[team] == null)
			{
				teams[team] = new Array();
				numTeams++;
			}
			teams[team].push(i+1);
		}
	}

	// consolidate the array
	var setTeams = new Array();
	var currentTeam = 0;
	for (var i = 1; i < 9; ++i)
	{
		if(teams[i] !== undefined)
		{
			setTeams[currentTeam] = teams[i];
			currentTeam++;
		}
	}

	return setTeams;
}

/////////////////////////////////////////
// placeRadial
//
// Function for placing players in a radial pattern
//
// playerIDs: array of randomized playerIDs
// startAngle: the starting angle for the map
// distance: radial distance from the center of the map
//
/////////////////////////////////////////
function placeRadial(playerIDs, startAngle, distance)
{
	var players = new Array();

	for (var i = 0; i < m.numPlayers; ++i)
	{
		players[i] = {"id": playerIDs[i], "angle": startAngle + i * TWO_PI / m.numPlayers};
		players[i]["x"] = 0.5 + distance * cos(players[i].angle);
		players[i]["z"] = 0.5 + distance * sin(players[i].angle);

		createBase(players[i])
	}
}

/////////////////////////////////////////
// placeStronghold
//
// Function for placing teams in a stronghold pattern
//
// playerIDs: array of randomized playerIDs
// startAngle: the starting angle for the map
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
//
/////////////////////////////////////////
function placeStronghold(playerIDs, startAngle, distance, groupedDistance)
{
	var players = new Array();

	for(var i = 0; i < m.teams.length; ++i) {
		var teamAngle = startAngle + (i + 1) * TWO_PI / m.teams.length;
		var fractionX = 0.5 + distance * cos(teamAngle);
		var fractionZ = 0.5 + distance * sin(teamAngle);

		// create player base
		for(var p = 0; p < m.teams[i].length; ++p)
		{
			var player = {"id": m.teams[i][p], "angle": startAngle + (p + 1) * TWO_PI / m.teams[i].length};
			player["x"] = fractionX + groupedDistance * cos(player.angle);
			player["z"] = fractionZ + groupedDistance * sin(player.angle);
			players[m.teams[i][p]] = player;
			createBase(players[m.teams[i][p]], false)
		}
	}

	return players;
}

/////////////////////////////////////////
// addBases
//
// Function for creating player bases
//
// type: "radial", "stacked", "stronghold", "random"
// distance: radial distance from the center of the map
//
/////////////////////////////////////////
function addBases(type, distance, groupedDistance)
{
	type = typeOrDefault(type);
	distance = distanceOrDefault(distance);
	groupedDistance = groupedDistanceOrDefault(groupedDistance);
	var playerIDs = randomizePlayers()
	var startAngle = randFloat(0, TWO_PI);
	var players = {};

	switch(type)
	{
		case "radial":
			players = placeRadial(playerIDs, startAngle, distance);
			break;
		case "stronghold":
			players = placeStronghold(playerIDs, startAngle, distance, groupedDistance);
			break;
	}

	return players;
}

/////////////////////////////////////////
// createBase
//
// Function for creating a single player base
//
// player: An object with the player's attributes (id, angle, x, z)
// walls: Iberian walls (true/false)
//
/////////////////////////////////////////
function createBase(player, walls)
{
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
	if(walls || walls == undefined) {
		placeCivDefaultEntities(fx, fz, player.id);
	} else {
		placeCivDefaultEntities(fx, fz, player.id, m.mapRadius, {'iberWall': false});
	}


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

	var hillSize = PI * m.mapRadius * m.mapRadius;

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
		var gDist = m.mapRadius - (5 + randInt(7));
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
function constTerrains()
{
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
function constGaia()
{
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
function constProps()
{
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
function constTileClasses(newClasses)
{
	var defaultClasses = ["animals", "baseResource", "berries", "dirt", "fish", "food", "forest", "hill", "land", "metal", "mountain", "player", "rock", "settlement", "water"]
	var classes = defaultClasses.concat(newClasses)

	var tc = {};
	for(var i = 0; i < classes.length; ++i)
	{
		tc[classes[i]] = createTileClass();
	}
	return tc;
}

// forests
function constForests()
{
	var f = {};
	f["forest1"] = [t.forestFloor2 + TERRAIN_SEPARATOR + g.tree1, t.forestFloor2 + TERRAIN_SEPARATOR + g.tree2, t.forestFloor2];
	f["forest2"] = [t.forestFloor1 + TERRAIN_SEPARATOR + g.tree4, t.forestFloor1 + TERRAIN_SEPARATOR + g.tree5, t.forestFloor1];
	return f;
}
