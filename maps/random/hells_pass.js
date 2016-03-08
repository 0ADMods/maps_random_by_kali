RMS.LoadLibrary("rmgen");
InitMap();

///////////
// define the map constants
///////////
const m = getSettings(randInt(1, 8));
const t = constTerrains();
const g = constGaia();
const p = constProps();
const tc = constTileClasses();
const f = constForests();
const allSizes = ["tiny", "small", "normal", "big", "huge"];
const allMixes = ["same", "similar", "normal", "varied", "unique"];
const allAmounts = ["scarce", "few", "normal", "many", "tons"];

var treeAmounts = ["few", "normal", "many"];
if (m.biome == 6)
	treeAmounts = ["many", "tons"];

///////////
// setup the map
///////////
initTerrain(t.mainTerrain, tc.land, 1);
var pos = getStartingPositions();
var players = addBases("line", 0.2, 0.08);
RMS.SetProgress(20);

///////////
// customize the map
///////////
placeBarriers();
RMS.SetProgress(40);

///////////
// add terrain
///////////

// terrain features
var features = [
	{
		"func": addBluffs,
		"tile": "tc.bluff",
		"avoid": [tc.bluff, 20, tc.hill, 5, tc.mountain, 20, tc.player, 30, tc.spine, 15, tc.valley, 5, tc.water, 7],
		"sizes": ["normal", "big"],
		"mixes": ["varied"],
		"amounts": ["few"]
	},
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.spine, 15, tc.valley, 2, tc.water, 2],
		"sizes": ["normal", "big"],
		"mixes": ["varied"],
		"amounts": ["few"]
	},
	{
		"func": addLakes,
		"tile": "tc.water",
		"avoid": [tc.bluff, 7, tc.hill, 2, tc.mountain, 15, tc.player, 20, tc.spine, 15, tc.valley, 10, tc.water, 25],
		"sizes": ["big", "huge"],
		"mixes": ["varied", "unique"],
		"amounts": ["few"]
	}
];
features = randArray(features);

// decorative elements
var decoration = [
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
]

// add decorative elements to the end of the terrain rendering
var terrain = features.concat(decoration);
addElements(terrain);
RMS.SetProgress(60);

///////////
// add gaia
///////////

// primary resources
var primaryRes = [
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 15, tc.spine, 5, tc.metal, 40, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 40, tc.spine, 5, tc.metal, 15, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.spine, 5, tc.water, 2],
		"sizes": ["normal"],
		"mixes": ["similar", "normal"],
		"amounts": ["few", "normal", "many"]
	}
];
primaryRes = randArray(primaryRes);

// secondary resources
var secondaryRes = [
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 50, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.spine, 5, tc.water, 3],
		"sizes": ["small", "normal", "big"],
		"mixes": ["similar", "normal", "varied"],
		"amounts": ["few", "normal", "many"]
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.bluff, 5, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.spine, 5, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.spine, 5, tc.water, 5],
		"sizes": ["normal", "big"],
		"mixes": ["similar", "normal", "varied"],
		"amounts": treeAmounts
	}
];
secondaryRes = randArray(secondaryRes);

var gaia = primaryRes.concat(secondaryRes);
addElements(gaia);
RMS.SetProgress(80);

///////////
// export the map
///////////
RMS.SetProgress(100);
ExportMap();

///////////
// Custom map functions
///////////

// place the mountainous barriers between the teams
function placeBarriers()
{
	var spineTerrain = t.dirt;

	if (m.biome == 2)
		spineTerrain = t.tier1Terrain;

	if (m.biome == 4 || m.biome == 6)
		spineTerrain = t.tier2Terrain;

	if (m.biome == 8)
		spineTerrain = t.tier4Terrain;

	// create mountain ranges
	for (var i = 0; i < m.teams.length; ++i)
	{
	  var tang = m.startAngle + (i + 0.5) * TWO_PI / m.teams.length;

	  var fx = fractionToTiles(0.5);
	  var fz = fractionToTiles(0.5);
	  var ix = round(fx);
	  var iz = round(fz);

		var mStartCo = 0.07;
		var mStopCo = 0.42;
		var mSize = 8;
		var mWaviness = 0.6;
		var mOffset = 0.5;
		var mTaper = -1.5;

		if(m.teams.length > 3 || m.mapSize <= 192)
		{
			mWaviness = 0.2;
			mOffset = 0.2;
			mTaper = -1;
		}

		if(m.teams.length >= 5)
		{
			mSize = 4;
			mWaviness = 0.2;
			mOffset = 0.2;
			mTaper = -0.7;
		}

		// place barrier
		var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(14, mSize), mWaviness, 0.1, mOffset, mTaper);
		var terrainPainter = new LayeredPainter([t.cliff, spineTerrain], [2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 30, 2);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.spine)], avoidClasses(tc.player, 2));
	}

	// decorative elements
	var decoration = [
		{
			"func": addDecoration,
			"tile": "tc.dirt",
			"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
			"stay": [tc.spine, 5],
			"sizes": ["huge"],
			"mixes": ["unique"],
			"amounts": ["tons"]
		}
	]
	addElements(decoration);
}

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
// addBluffs
//
// Function for creating bluffs
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addBluffs(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = fill * 10;
	var minSize = scaleByMapSize(15, 15);
	var maxSize = scaleByMapSize(15, 15);
	var elevation = 30;
	var spread = scaleByMapSize(5, 5);

	for (var i = 0; i < count; ++i)
	{
		var offset = getRandomDeviation(size, deviation);

		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pElevation = floor(elevation * offset);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([t.cliff, t.mainTerrain, t.tier2Terrain], [2, 3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, 2);
		var rendered = createAreas2(placer, [terrainPainter, elevationPainter, paintClass(tc.bluff)], constraint, 1);

		// find the bounding box of the bluff
		if (rendered[0] === undefined)
			continue;

		var points = rendered[0].points;

		var corners = findCorners(points);
		var area = points.length;

		// seed an array the size of the bounding box
		var bb = createBoundingBox(points, corners);

		// get a random starting position for the baseline and the endline
		var angle = randInt(4);
		var opAngle = angle - 2;
		if (angle < 2)
			opAngle = angle + 2;

		// find the edges of the bluff
		var baseLine = findClearLine(bb, corners, angle);
		var endLine = findClearLine(bb, corners, opAngle);

		// if the clear lines are undefined, leave it as a plateau
		if (baseLine.x1 === undefined || endLine.x1 === undefined)
			continue;

		var ground = createTerrain(t.mainTerrain);

		var slopeLength = getDistance(baseLine.midX, baseLine.midZ, endLine.midX, endLine.midZ);

		// adjust the height of each point in the bluff
		for (var p = 0; p < points.length; ++p)
		{
			var pt = points[p];
			var dist = distanceOfPointFromLine(baseLine.x1, baseLine.z1, baseLine.x2, baseLine.z2, pt.x, pt.z);

			var curHeight = g_Map.getHeight(pt.x, pt.z);
			var newHeight = curHeight - curHeight * (dist / slopeLength);

			if (newHeight < endLine.height)
				newHeight = endLine.height;

			if (newHeight <= endLine.height + 2 && g_Map.validT(pt.x, pt.z) && g_Map.getTexture(pt.x, pt.z).indexOf('cliff') > -1)
				ground.place(pt.x, pt.z);

			g_Map.setHeight(pt.x, pt.z, newHeight);
		}

		// smooth out the ground around the bluff
		fadeToGround(bb, corners.minX, corners.minZ, endLine.height);
	}

	var bluffPatches = [
		{
			"func": addLayeredPatches,
			"tile": "tc.dirt",
			"avoid": [tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]
	addElements(bluffPatches);

	var bluffDecor = [
		{
			"func": addDecoration,
			"tile": "tc.dirt",
			"avoid": [tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]
	addElements(bluffDecor);

	var bluffForest = [
		{
			"func": addForests,
			"tile": "tc.forest",
			"avoid": [tc.berries, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.water, 2],
			"stay": [tc.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["similar", "normal"],
			"amounts": ["few", "normal", "many"]
		}
	]
	addElements(bluffForest);

	var bluffMetal = [
		{
			"func": addMetal,
			"tile": "tc.metal",
			"avoid": [tc.berries, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 15, tc.metal, 40, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["same"],
			"amounts": allAmounts
		}
	]
	addElements(bluffMetal);

	var bluffStone = [
		{
			"func": addStone,
			"tile": "tc.stone",
			"avoid": [tc.berries, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 40, tc.metal, 15, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["same"],
			"amounts": allAmounts
		}
	]
	addElements(bluffStone);

	var bluffTrees = [
		{
			"func": addStragglerTrees,
			"tile": "tc.forest",
			"avoid": [tc.berries, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5],
			"stay": [tc.bluff, 5],
			"sizes": ["big"],
			"mixes": ["normal"],
			"amounts": treeAmounts
		}
	]
	addElements(bluffTrees);

	var bluffAnimals = [
		{
			"func": addAnimals,
			"tile": "tc.animals",
			"avoid": [tc.animals, 20, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": allAmounts
		}
	]
	addElements(bluffAnimals);

	var bluffBerries = [
		{
			"func": addBerries,
			"tile": "tc.berries",
			"avoid": [tc.berries, 50, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3],
			"stay": [tc.bluff, 5],
			"sizes": ["small", "normal", "big"],
			"mixes": ["similar", "normal", "varied"],
			"amounts": ["few", "normal", "many"]
		}
	]
	addElements(bluffBerries);
}

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
// addElevation
//
// Function for creating varying elevations
//
// constraint: constraint classes
// element: the element to be rendered, ex:
//    "class": tc.hill,
//		"painter": [t.mainTerrain, t.mainTerrain],
//		"size": 1,
//		"deviation": 0.2,
//		"fill": 1,
//		"count": scaleByMapSize(8, 8),
//		"minSize": floor(scaleByMapSize(5, 5)),
//		"maxSize": floor(scaleByMapSize(8, 8)),
//		"spread": floor(scaleByMapSize(20, 20)),
//		"minElevation": 6,
//		"maxElevation": 12,
//		"steepness": 1.5
//
/////////////////////////////////////////
function addElevation(constraint, el)
{
	var size = sizeOrDefault(el.size);
	var deviation = deviationOrDefault(el.deviation);
	var fill = fillOrDefault(el.fill);
	var count = fill * el.count;
	var minSize = el.minSize;
	var maxSize = el.maxSize;
	var spread = el.spread;

	var elType = ELEVATION_MODIFY;
	if (el.class == tc.water)
		elType = ELEVATION_SET;

	var widths = [];

	// allow for shore and cliff rendering
	for (var s = el.painter.length; s > 2; --s)
		widths.push(1);

	for (var i = 0; i < count; ++i)
	{
		var elevation = el.minElevation + randInt(el.maxElevation - el.minElevation);
		var smooth = floor(elevation / el.steepness);

		var offset = getRandomDeviation(size, el.deviation);
		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pSmooth = Math.abs(floor(smooth * offset));
		var pElevation = floor(elevation * offset);

		if (pMinSize > pMaxSize)
			pMinSize = pMaxSize;

		if (pElevation > el.maxElevation)
			pElevation = el.maxElevation;

		if (pElevation < el.minElevation)
			pElevation = el.minElevation;

		if (pMaxSize > el.maxSize)
			pMaxSize = el.maxSize;

		if (pMinSize < el.minSize)
			pMinSize = el.minSize;

		if (pSmooth < 1)
			pSmooth = 1;

		var pWidths = widths.concat(pSmooth);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter(el.painter, [pWidths]);
		var elevationPainter = new SmoothElevationPainter(elType, pElevation, pSmooth);
		createAreas(placer, [terrainPainter, elevationPainter, paintClass(el.class)], constraint, 1);
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
	var hill = {
		"class": tc.hill,
		"painter": [t.mainTerrain, t.mainTerrain],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(5, 5)),
		"maxSize": floor(scaleByMapSize(8, 8)),
		"spread": floor(scaleByMapSize(20, 20)),
		"minElevation": 6,
		"maxElevation": 12,
		"steepness": 1.5
	}
	addElevation(constraint, hill);
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
	var painter = [t.shoreBlend, t.water, t.water];
	var steepness = floor(m.mapHeight / 5) + 1 + randInt(floor(m.mapHeight / 5));
	var depthAdj = 0;
	var setFish = true;

	// make impossible to reach lakes really deep
	if (steepness * m.mapHeight > 20)
	{
		setFish = false;
		depthAdj = -20;
		steepness = 20;
		painter = [t.cliff, t.cliff, t.water];
	} else if (steepness > 2) {
		steepness = 2;
		depthAdj = 2;
	}

	var lake = {
		"class": tc.water,
		"painter": painter,
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(4, 4)),
		"maxSize": floor(scaleByMapSize(18, 18)),
		"spread": floor(scaleByMapSize(10, 30)),
		"minElevation": -15 + depthAdj,
		"maxElevation": -3 + depthAdj,
		"steepness": steepness
	}
	addElevation(constraint, lake);

	if (setFish)
	{
		var fish = [
			{
				"func": addFish,
				"tile": "tc.fish",
				"avoid": [tc.fish, 12, tc.hill, 8, tc.mountain, 8, tc.player, 8],
				"stay": [tc.water, 8],
				"sizes": ["small", "normal", "big"],
				"mixes": ["similar", "normal", "varied"],
				"amounts": ["normal", "many", "tons"]
			}
		]
		addElements(fish);
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

	for (var i = 0; i < sizes.length; i++)
	{
		var offset = getRandomDeviation(size, deviation);
		var patchMinRadius = floor(minRadius * offset);
		var patchMaxRadius = floor(maxRadius * offset);
		var patchSize = floor(sizes[i] * offset);
		var patchCount = count * offset;

		if (patchMinRadius > patchMaxRadius)
			patchMinRadius = patchMaxRadius;

		var placer = new ChainPlacer(patchMinRadius, patchMaxRadius, patchSize, 0.5);
		var painter = new LayeredPainter(
			[[t.mainTerrain, t.tier1Terrain], [t.tier1Terrain, t.tier2Terrain], [t.tier2Terrain, t.tier3Terrain], [t.tier4Terrain]], 		// terrains
			[1, 1]			// widths
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
	var mountain = {
		"class": tc.mountain,
		"painter": [t.cliff, t.hill],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(8, 8)),
		"maxSize": floor(scaleByMapSize(10, 10)),
		"spread": floor(scaleByMapSize(8, 8)),
		"minElevation": 60,
		"maxElevation": 80,
		"steepness": 4
	}
	addElevation(constraint, mountain);
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
	var plateauTile = t.dirt;

	if (m.biome == 2)
		plateauTile = t.tier1Terrain;

	if (m.biome == 4 || m.biome == 6)
		plateauTile = t.tier2Terrain;

	if (m.biome == 8)
		plateauTile = t.tier4Terrain;

	var plateau = {
		"class": tc.mountain,
		"painter": [t.cliff, plateauTile],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(6, 6)),
		"maxSize": floor(scaleByMapSize(9, 9)),
		"spread": floor(scaleByMapSize(10, 10)),
		"minElevation": 20,
		"maxElevation": 30,
		"steepness": 8
	}
	addElevation(constraint, plateau);
}

/////////////////////////////////////////
// addRivers
//
// Function for creating rivers
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addRivers(constraint, size, deviation, fill)
{
	size = sizeOrDefault(size);
	deviation = deviationOrDefault(deviation);
	fill = fillOrDefault(fill);

	var count = 5;
	var minSize = scaleByMapSize(15, 15);
	var maxSize = scaleByMapSize(15, 15);
	var elevation = -2;
	var spread = scaleByMapSize(5, 5);

	for (var i = 0; i < count; ++i)
	{
		var offset = getRandomDeviation(size, deviation);

		var startAngle = randFloat(0, 2 * PI);
		var endAngle = startAngle + randFloat(PI * 0.5, PI * 1.5);

		var startX = m.centerOfMap + floor(m.centerOfMap * Math.cos(startAngle));
		var startZ = m.centerOfMap + floor(m.centerOfMap * Math.sin(startAngle));

		var endX = m.centerOfMap + floor(m.centerOfMap * Math.cos(endAngle));
		var endZ = m.centerOfMap + floor(m.centerOfMap * Math.sin(endAngle));

		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);

		var placer = new PathPlacer(startX, startZ, endX, endZ, 12, 0.25, 1, 0.05, 0.3);
		var terrainPainter = new LayeredPainter([t.water, t.shore], [2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, elevation, 2);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], constraint);
	}
}

/////////////////////////////////////////
// addValleys
//
// Function for creating valleys
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addValleys(constraint, size, deviation, fill)
{
	if (m.mapHeight < 6)
		return;

	var minElevation = (-1 * m.mapHeight) / (size * (1 + deviation)) + 1;
	if (minElevation < -1 * m.mapHeight)
		minElevation = -1 * m.mapHeight;

	var valleySlope = t.tier1Terrain;
	var valleyFloor = t.tier4Terrain;

	if (m.biome == 0)
	{
		valleySlope = t.dirt;
		valleyFloor = t.tier2Terrain;
	}

	if (m.biome == 3 || m.biome == 5)
	{
		valleySlope = t.tier2Terrain;
		valleyFloor = t.dirt;
	}

	if (m.biome == 4 || m.biome == 6)
		valleyFloor = t.tier2Terrain;

	if (m.biome == 7)
		valleySlope = t.dirt;

	if (m.biome == 8)
		valleyFloor = t.tier3Terrain;

	var valley = {
		"class": tc.valley,
		"painter": [valleySlope, valleyFloor],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(5, 5)),
		"maxSize": floor(scaleByMapSize(8, 8)),
		"spread": floor(scaleByMapSize(20, 20)),
		"minElevation": minElevation,
		"maxElevation": -2,
		"steepness": 4
	}
	addElevation(constraint, valley);
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
	var counts = [scaleByMapSize(40, 40) * fill, scaleByMapSize(40, 40) * fill];

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
	if (m.biome == 6)
		return;

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
	var count = m.numPlayers * scaleByMapSize(m.numPlayers, m.numPlayers) * fill;
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
	var count = m.numPlayers * scaleByMapSize(m.numPlayers, m.numPlayers) * fill;
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

	if (m.biome == 6 && fill < 0.8)
		fill = 0.8;

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
	if (m.biome == 6)
	{
		count = count * 1.25;
		min = 2 * offset;
		max = 5 * offset;
		minDist = 5 * offset;
		maxDist = 7 * offset;
	}

	for (var i = 0; i < trees.length; ++i)
	{
		var treesMax = max;

		// don't clump fruit trees
		if (i == 2 && (m.biome == 3 || m.biome == 5))
			treesMax = 1;

		if (min > treesMax)
			min = treesMax

		var group = new SimpleGroup([new SimpleObject(trees[i], min, treesMax, minDist, maxDist)], true, tc.forest);
		createObjectGroups(group, 0, constraint, count);
	}
}

///////////
// Terrain Helpers
///////////

// had to modify current RMgen function to return the list of points in the terrain feature
function createAreas2(centeredPlacer, painter, constraint, amount, retryFactor = 10)
{
	let placeFunc = function (args) {
		randomizePlacerCoordinates2(args.placer, args.halfMapSize);
		var area = g_Map.createArea(args.placer, args.painter, args.constraint);
		return area;
	};

	let args = {
		"placer": centeredPlacer,
		"painter": painter,
		"constraint": constraint,
		"halfMapSize": g_Map.size / 2
	};

	return retryPlacing2(placeFunc, args, retryFactor, amount, true);
}

// for some reason, couldn't call the original RMgen function
function retryPlacing2(placeFunc, placeArgs, retryFactor, amount, getResult)
{
	let maxFail = amount * retryFactor;

	let results = [];
	let good = 0;
	let bad = 0;

	while (good < amount && bad <= maxFail)
	{
		let result = placeFunc(placeArgs);

		if (result !== undefined)
		{
			++good;
			if (getResult)
				results.push(result);
		}
		else
			++bad;
	}

	return getResult ? results : good;
}

// for some reason, couldn't call the original RMgen function
function randomizePlacerCoordinates2(placer, halfMapSize)
{
	if (!!g_MapSettings.CircularMap)
	{
		// Polar coordinates
		let r = halfMapSize * Math.sqrt(randFloat()); // uniform distribution
		let theta = randFloat(0, 2 * PI);
		placer.x = Math.floor(r * Math.cos(theta)) + halfMapSize;
		placer.z = Math.floor(r * Math.sin(theta)) + halfMapSize;
	}
	else
	{
		// Rectangular coordinates
		placer.x = randInt(g_Map.size);
		placer.z = randInt(g_Map.size);
	}
}

// create an array of points the fill a bounding box around a terrain feature
function createBoundingBox(points, corners)
{
	var bb = [];
	var width = corners.maxX - corners.minX + 1;
	var length = corners.maxZ - corners.minZ + 1;
	for (var w = 0; w < width; ++w)
	{
		bb[w] = [];
		for (var l = 0; l < length; ++l)
		{
			var curHeight = g_Map.getHeight(w + corners.minX, l + corners.minZ);
			bb[w][l] = {"height": curHeight, "isFeature": false};
		}
	}

	// define the coordinates that represent the bluff
	for (var p = 0; p < points.length; ++p)
	{
		var pt = points[p];
		bb[pt.x - corners.minX][pt.z - corners.minZ].isFeature = true;
	}

	return bb;
}

// flattens the ground touching a terrain feature
function fadeToGround(bb, minX, minZ, elevation)
{
	for (var x = 0; x < bb.length; ++x)
	{
		for (var z = 0; z < bb[x].length; ++z)
		{
			var pt = bb[x][z];
			if (!pt.isFeature && nextToFeature(bb, x, z))
				g_Map.setHeight(x + minX, z + minZ, elevation);
		}
	}
}

// find a 45 degree line in a bounding box that does not intersect any terrain feature
function findClearLine(bb, corners, angle)
{
	// angle - 0: northwest; 1: northeast; 2: southeast; 3: southwest
	var z = corners.maxZ;
	var xOffset = -1;
	var zOffset = -1;

	switch(angle)
	{
		case 1:
			xOffset = 1;
			break;
		case 2:
			xOffset = 1;
			zOffset = 1;
			z = corners.minZ;
			break;
		case 3:
			zOffset = 1;
			z = corners.minZ;
			break;
	}

	var clearLine = {};

	for (var x = corners.minX; x <= corners.maxX; ++x)
	{
		var x2 = x;
		var z2 = z;

		var clear = true;

		while (x2 >= corners.minX && x2 <= corners.maxX && z2 >= corners.minZ && z2 <= corners.maxZ)
		{
			var bp = bb[x2 - corners.minX][z2 - corners.minZ];
			if (bp.isFeature)
			{
				clear = false;
				break;
			}

			x2 = x2 + xOffset;
			z2 = z2 + zOffset;
		}

		if (clear)
		{
			var lastX = x2 - xOffset;
			var lastZ = z2 - zOffset;
			var midX = floor((x + lastX) / 2);
			var midZ = floor((z + lastZ) / 2);
			clearLine = {"x1": x, "z1": z, "x2": lastX, "z2": lastZ, "midX": midX, "midZ": midZ, "height": m.mapHeight};
		}

		if (clear && (angle == 1 || angle == 2))
			break;

		if (!clear && (angle == 0 || angle == 3))
			break;
	}

	return clearLine;
}

// finds the corners of a bounding box
function findCorners(points)
{
	// find the bounding box of the terrain feature
	var minX = m.mapSize + 1;
	var minZ = m.mapSize + 1;
	var maxX = -1;
	var maxZ = -1;

	for (var p = 0; p < points.length; ++p)
	{
		var pt = points[p];

		if (pt.x < minX)
			minX = pt.x

		if (pt.z < minZ)
			minZ = pt.z

		if (pt.x > maxX)
			maxX = pt.x

		if (pt.z > maxZ)
			maxZ = pt.z
	}

	return {"minX": minX, "minZ": minZ, "maxX": maxX, "maxZ": maxZ}
}

// determines if a point in a bounding box array is next to a terrain feature
function nextToFeature(bb, x, z)
{
	for (var xOffset = -1; xOffset <= 1; ++xOffset)
	{
		for (var zOffset = -1; zOffset <= 1; ++zOffset)
		{
			var thisX = x + xOffset;
			var thisZ = z + zOffset;
			if (thisX < 0 || thisX >= bb.length || thisZ < 0 || thisZ >= bb[x].length || (thisX == 0 && thisZ == 0))
				continue;

			if (bb[thisX][thisZ].isFeature)
				return true;
		}
	}

	return false;
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
// Gaia
///////////

// adds an array of elements to the map
function addElements(els)
{
	for (var i = 0; i < els.length; ++i)
	{
		var stay = null;
		if (els[i].stay !== undefined)
			stay = els[i].stay;

		els[i].func(
			[avoidClasses.apply(null, els[i].avoid), stayClasses.apply(null, stay)],
			pickSize(els[i].sizes),
			pickMix(els[i].mixes),
			pickAmount(els[i].amounts)
		);
	}
}

// converts "amount" terms to numbers
function pickAmount(amounts)
{
	var amount = randInt(amounts.length);
	switch(amounts[amount])
	{
		case "scarce":
			return 0.5;
		case "few":
			return 0.75;
		case "many":
			return 1.25;
		case "tons":
			return 1.5;
	}

	return 1;
}

// converts "mix" terms to numbers
function pickMix(mixes)
{
	var mix = randInt(mixes.length);
	switch(mixes[mix])
	{
		case "same":
			return 0;
		case "similar":
			return 0.1;
		case "varied":
			return 0.5;
		case "unique":
			return 0.75;
	}

	return 0.25;
}

// converst "size" terms to numbers
function pickSize(sizes)
{
	var size = randInt(sizes.length);
	switch(sizes[size])
	{
		case "tiny":
			return 0.5;
		case "small":
			return 0.75;
		case "big":
			return 1.25;
		case "huge":
			return 1.5;
	}

	return 1;
}

///////////
// Map
///////////

// paints the entire map with a single tile type
function initTerrain(terrain, tc, elevation)
{
	var placer = new ClumpPlacer(m.mapArea, 1, 1, 1, m.centerOfMap, m.centerOfMap);
	var terrainPainter = new LayeredPainter([terrain], []);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, elevation, 1);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc)], null);

	// update the map height
	m.mapHeight = getHeight(m["centerOfMap"], m["centerOfMap"]);
}

// find the distance between two points
function separation(x1, z1, x2, z2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
}

// sets the map Biome
// copied from randomizeBiome(), but modified to allow the user to set the biome
function setBiome(biomeID)
{
	var random_sky = randInt(1,3)
	if (random_sky==1)
		setSkySet("cirrus");
	else if (random_sky ==2)
		setSkySet("cumulus");
	else if (random_sky ==3)
		setSkySet("sunny");
	setSunRotation(randFloat(0, TWO_PI));
	setSunElevation(randFloat(PI/ 6, PI / 3));

	setUnitsAmbientColor(0.57, 0.58, 0.55);
	setTerrainAmbientColor(0.447059, 0.509804, 0.54902);

	//temperate
	if (biomeID == 1){

		// temperate ocean blue, a bit too deep and saturated perhaps but it looks nicer.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.114, 0.192, 0.463);
		setWaterTint(0.255, 0.361, 0.651);
		setWaterWaviness(5.5);
		setWaterMurkiness(0.83);

		setFogThickness(0.25);
		setFogFactor(0.4);

		setPPEffect("hdr");
		setPPSaturation(0.62);
		setPPContrast(0.62);
		setPPBloom(0.3);

		if (randInt(2))
		{
			rbt1 = "alpine_grass";
			rbt2 = "temp_forestfloor_pine";
			rbt3 = "temp_grass_clovers_2";
			rbt5 = "alpine_grass_a";
			rbt6 = "alpine_grass_b";
			rbt7 = "alpine_grass_c";
			rbt12 = "temp_grass_mossy";
		}
		else
		{
			rbt1 = "temp_grass_long_b";
			rbt2 = "temp_forestfloor_pine";
			rbt3 = "temp_plants_bog";
			rbt5 = "temp_grass_d";
			rbt6 = "temp_grass_c";
			rbt7 = "temp_grass_clovers_2";
			rbt12 = "temp_grass_plants";
		}

		rbt4 = ["temp_cliff_a", "temp_cliff_b"];

		rbt8 = ["temp_dirt_gravel", "temp_dirt_gravel_b"];
		rbt9 = ["temp_dirt_gravel", "temp_dirt_gravel_b"];
		rbt10 = "temp_road";
		rbt11 = "temp_road_overgrown";

		rbt13 = "temp_mud_plants";
		rbt14 = "sand_grass_25";
		rbt15 = "medit_sand_wet";

		// gaia entities
		var random_trees = randInt(3);

		if (random_trees == 0)
		{
			rbe1 = "gaia/flora_tree_oak";
			rbe2 = "gaia/flora_tree_oak_large";
		}
		else if (random_trees == 1)
		{
			rbe1 = "gaia/flora_tree_poplar";
			rbe2 = "gaia/flora_tree_poplar";
		}
		else
		{
			rbe1 = "gaia/flora_tree_euro_beech";
			rbe2 = "gaia/flora_tree_euro_beech";
		}
		rbe3 = "gaia/flora_tree_apple";
		random_trees = randInt(3);
		if (random_trees == 0)
		{
			rbe4 = "gaia/flora_tree_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}
		else if (random_trees == 1)
		{
			rbe4 = "gaia/flora_tree_pine";
			rbe5 = "gaia/flora_tree_pine";
		}
		else
		{
			rbe4 = "gaia/flora_tree_aleppo_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_sheep";
		rbe11 = "gaia/geology_stonemine_temperate_quarry";
		rbe12 = "gaia/geology_stone_temperate";
		rbe13 = "gaia/geology_metal_temperate_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_large_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_medit_me.xml";
		rba8 = "actor|props/flora/bush_medit_sm.xml";
		rba9 = "actor|flora/trees/oak.xml";
	}
	//snowy
	else if (biomeID == 2)
	{
		setSunColor(0.550, 0.601, 0.644);				// a little darker
		// Water is a semi-deep blue, fairly wavy, fairly murky for an ocean.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.067, 0.212, 0.361);
		setWaterTint(0.4, 0.486, 0.765);
		setWaterWaviness(5.5);
		setWaterMurkiness(0.83);

		rbt1 = ["polar_snow_b", "snow grass 75", "snow rocks", "snow forest"];
		rbt2 = "polar_tundra_snow";
		rbt3 = "polar_tundra_snow";
		rbt4 = ["alpine_cliff_a", "alpine_cliff_b"];
		rbt5 = "polar_snow_a";
		rbt6 = "polar_ice_snow";
		rbt7 = "polar_ice";
		rbt8 = ["polar_snow_rocks", "polar_cliff_snow"];
		rbt9 = "snow grass 2";
		rbt10 = "new_alpine_citytile";
		rbt11 = "polar_ice_cracked";
		rbt12 = "snow grass 2";
		rbt13 = "polar_ice";
		rbt14 = "alpine_shore_rocks_icy";
		rbt15 = "alpine_shore_rocks";

		// gaia entities
		rbe1 = "gaia/flora_tree_pine_w";
		rbe2 = "gaia/flora_tree_pine_w";
		rbe3 = "gaia/flora_tree_pine_w";
		rbe4 = "gaia/flora_tree_pine_w";
		rbe5 = "gaia/flora_tree_pine";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_muskox";
		rbe9 = "gaia/fauna_fish_tuna";
		rbe10 = "gaia/fauna_walrus";
		rbe11 = "gaia/geology_stonemine_alpine_quarry";
		rbe12 = "gaia/geology_stone_alpine_a";
		rbe13 = "gaia/geology_metal_alpine_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/pine_w.xml";

		setFogFactor(0.6);
		setFogThickness(0.21);
		setPPSaturation(0.37);
		setPPEffect("hdr");
	}
	//desert
	else if (biomeID == 3)
	{
		setSunColor(0.733, 0.746, 0.574);

		// Went for a very clear, slightly blue-ish water in this case, basically no waves.
		setWaterColor(0, 0.227, 0.843);
		setWaterTint(0, 0.545, 0.859);
		setWaterWaviness(1);
		setWaterMurkiness(0.22);

		setFogFactor(0.5);
		setFogThickness(0.0);
		setFogColor(0.852, 0.746, 0.493);

		setPPEffect("hdr");
		setPPContrast(0.67);
		setPPSaturation(0.42);
		setPPBloom(0.23);

		rbt1 = ["desert_dirt_rough", "desert_dirt_rough_2", "desert_sand_dunes_50", "desert_sand_smooth"];
		rbt2 = "forestfloor_dirty";
		rbt3 = "desert_forestfloor_palms";
		rbt4 = ["desert_cliff_1", "desert_cliff_2", "desert_cliff_3", "desert_cliff_4", "desert_cliff_5"];
		rbt5 = "desert_dirt_rough";
		rbt6 = "desert_dirt_rocks_1";
		rbt7 = "desert_dirt_rocks_2";
		rbt8 = ["desert_dirt_rocks_1", "desert_dirt_rocks_2", "desert_dirt_rocks_3"];
		rbt9 = ["desert_lakebed_dry", "desert_lakebed_dry_b"];
		rbt10 = "desert_city_tile";
		rbt11 = "desert_city_tile";
		rbt12 = "desert_dirt_rough";
		rbt13 = "desert_shore_stones";
		rbt14 = "desert_sand_smooth";
		rbt15 = "desert_sand_wet";

		// gaia entities
		if (randInt(2))
		{
			rbe1 = "gaia/flora_tree_cretan_date_palm_short";
			rbe2 = "gaia/flora_tree_cretan_date_palm_tall";
		}
		else
		{
			rbe1 = "gaia/flora_tree_date_palm";
			rbe2 = "gaia/flora_tree_date_palm";
		}
		rbe3 = "gaia/flora_tree_fig";
		if (randInt(2))
		{
			rbe4 = "gaia/flora_tree_tamarix";
			rbe5 = "gaia/flora_tree_tamarix";
		}
		else
		{
			rbe4 = "gaia/flora_tree_senegal_date_palm";
			rbe5 = "gaia/flora_tree_senegal_date_palm";
		}
		rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_camel";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_gazelle";
		rbe11 = "gaia/geology_stonemine_desert_quarry";
		rbe12 = "gaia/geology_stone_desert_small";
		rbe13 = "gaia/geology_metal_desert_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba5 = "actor|geology/stone_desert_med.xml";
		rba6 = "actor|geology/stone_desert_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/palm_date.xml";
	}
	//alpine
	else if (biomeID == 4)
	{
		// simulates an alpine lake, fairly deep.
		// this is not intended for a clear running river, or even an ocean.
		setWaterColor(0.0, 0.047, 0.286);				// dark majestic blue
		setWaterTint(0.471, 0.776, 0.863);				// light blue
		setWaterMurkiness(0.82);
		setWaterWaviness(2);

		setFogThickness(0.26);
		setFogFactor(0.4);

		setPPEffect("hdr");
		setPPSaturation(0.48);
		setPPContrast(0.53);
		setPPBloom(0.12);

		rbt1 = ["alpine_dirt_grass_50"];
		rbt2 = "alpine_forrestfloor";
		rbt3 = "alpine_forrestfloor";
		rbt4 = ["alpine_cliff_a", "alpine_cliff_b", "alpine_cliff_c"];
		rbt5 = "alpine_dirt";
		rbt6 = ["alpine_grass_snow_50", "alpine_dirt_snow", "alpine_dirt_snow"];
		rbt7 = ["alpine_snow_a", "alpine_snow_b"];
		rbt8 = "alpine_cliff_snow";
		rbt9 = ["alpine_dirt", "alpine_grass_d"];
		rbt10 = "new_alpine_citytile";
		rbt11 = "new_alpine_citytile";
		rbt12 = "new_alpine_grass_a";
		rbt13 = "alpine_shore_rocks";
		rbt14 = "alpine_shore_rocks_grass_50";
		rbt15 = "alpine_shore_rocks";

		// gaia entities
		rbe1 = "gaia/flora_tree_pine";
		rbe2 = "gaia/flora_tree_pine";
		rbe3 = "gaia/flora_tree_pine";
		rbe4 = "gaia/flora_tree_pine";
		rbe5 = "gaia/flora_tree_pine";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_goat";
		rbe9 = "gaia/fauna_fish_tuna";
		rbe10 = "gaia/fauna_deer";
		rbe11 = "gaia/geology_stonemine_alpine_quarry";
		rbe12 = "gaia/geology_stone_alpine_a";
		rbe13 = "gaia/geology_metal_alpine_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_a.xml";
		rba8 = "actor|props/flora/bush_desert_a.xml";
		rba9 = "actor|flora/trees/pine.xml";
	}
	//medit
	else if (biomeID == 5)
	{
		// Guess what, this is based on the colors of the mediterranean sea.
		setWaterColor(0.024,0.212,0.024);
		setWaterTint(0.133, 0.725,0.855);
		setWaterWaviness(3);
		setWaterMurkiness(0.8);

		setFogFactor(0.3);
		setFogThickness(0.25);

		setPPEffect("hdr");
		setPPContrast(0.62);
		setPPSaturation(0.51);
		setPPBloom(0.12);

		rbt1 = ["medit_grass_field_a", "medit_grass_field_b"];
		rbt2 = "medit_grass_field";
		rbt3 = "medit_grass_shrubs";
		rbt4 = ["medit_cliff_grass", "medit_cliff_greek", "medit_cliff_greek_2", "medit_cliff_aegean", "medit_cliff_italia", "medit_cliff_italia_grass"];
		rbt5 = "medit_grass_field_b";
		rbt6 = "medit_grass_field_brown";
		rbt7 = "medit_grass_field_dry";
		rbt8 = ["medit_rocks_grass_shrubs", "medit_rocks_shrubs"];
		rbt9 = ["medit_dirt", "medit_dirt_b"];
		rbt10 = "medit_city_tile";
		rbt11 = "medit_city_tile";
		rbt12 = "medit_grass_wild";
		rbt13 = "medit_sand";
		rbt14 = "sand_grass_25";
		rbt15 = "medit_sand_wet";

		// gaia entities
		var random_trees = randInt(3);

		if (random_trees == 0)
		{
			rbe1 = "gaia/flora_tree_cretan_date_palm_short";
			rbe2 = "gaia/flora_tree_cretan_date_palm_tall";
		}
		else if (random_trees == 1)
		{
			rbe1 = "gaia/flora_tree_carob";
			rbe2 = "gaia/flora_tree_carob";
		}
		else
		{
			rbe1 = "gaia/flora_tree_medit_fan_palm";
			rbe2 = "gaia/flora_tree_medit_fan_palm";
		}

		if (randInt(2))
		{
			rbe3 = "gaia/flora_tree_apple";
		}
		else
		{
			rbe3 = "gaia/flora_tree_poplar_lombardy";
		}

		if (randInt(2))
		{
			rbe4 = "gaia/flora_tree_cypress";
			rbe5 = "gaia/flora_tree_cypress";
		}
		else
		{
			rbe4 = "gaia/flora_tree_aleppo_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}

		if (randInt(2))
			rbe6 = "gaia/flora_bush_berry";
		else
			rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_sheep";
		rbe11 = "gaia/geology_stonemine_medit_quarry";
		rbe12 = "gaia/geology_stone_mediterranean";
		rbe13 = "gaia/geology_metal_mediterranean_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_large_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_medit_me.xml";
		rba8 = "actor|props/flora/bush_medit_sm.xml";
		rba9 = "actor|flora/trees/palm_cretan_date.xml";
	}
	//savanah
	else if (biomeID == 6)
	{
		// Using the Malawi as a reference, in parts where it's not too murky from a river nearby.
		setWaterColor(0.055,0.176,0.431);
		setWaterTint(0.227,0.749,0.549);
		setWaterWaviness(1.5);
		setWaterMurkiness(0.77);

		setFogFactor(0.25);
		setFogThickness(0.15);
		setFogColor(0.847059, 0.737255, 0.482353);

		setPPEffect("hdr");
		setPPContrast(0.57031);
		setPPBloom(0.34);

		rbt1 = ["savanna_grass_a", "savanna_grass_b"];
		rbt2 = "savanna_forestfloor_a";
		rbt3 = "savanna_forestfloor_b";
		rbt4 = ["savanna_cliff_a", "savanna_cliff_b"];
		rbt5 = "savanna_shrubs_a";
		rbt6 = "savanna_dirt_rocks_b";
		rbt7 = "savanna_dirt_rocks_a";
		rbt8 = ["savanna_grass_a", "savanna_grass_b"];
		rbt9 = ["savanna_dirt_rocks_b", "dirt_brown_e"];
		rbt10 = "savanna_tile_a";
		rbt11 = "savanna_tile_a";
		rbt12 = "savanna_grass_a";
		rbt13 = "savanna_riparian";
		rbt14 = "savanna_riparian_bank";
		rbt15 = "savanna_riparian_wet";

		// gaia entities
		rbe1 = "gaia/flora_tree_baobab";
		rbe2 = "gaia/flora_tree_baobab";
		rbe3 = "gaia/flora_tree_baobab";
		rbe4 = "gaia/flora_tree_baobab";
		rbe5 = "gaia/flora_tree_baobab";
		rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		var rts = randInt(1,4);
		if (rts==1){
			rbe8 = "gaia/fauna_wildebeest";
		}
		else if (rts==2)
		{
			rbe8 = "gaia/fauna_zebra";
		}
		else if (rts==3)
		{
			rbe8 = "gaia/fauna_giraffe";
		}
		else if (rts==4)
		{
			rbe8 = "gaia/fauna_elephant_african_bush";
		}
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_gazelle";
		rbe11 = "gaia/geology_stonemine_desert_quarry";
		rbe12 = "gaia/geology_stone_savanna_small";
		rbe13 = "gaia/geology_metal_savanna_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_savanna.xml";
		rba2 = "actor|props/flora/grass_medit_field.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba5 = "actor|geology/stone_savanna_med.xml";
		rba6 = "actor|geology/stone_savanna_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_dry_a.xml";
		rba9 = "actor|flora/trees/baobab.xml";
	}
	//tropic
	else if (biomeID == 7)
	{

		// Bora-Bora ish. Quite transparent, not wavy.
		// Mostly for shallow maps. Maps where the water level goes deeper should use a much darker Water Color to simulate deep water holes.
		setWaterColor(0.584,0.824,0.929);
		setWaterTint(0.569,0.965,0.945);
		setWaterWaviness(1.5);
		setWaterMurkiness(0.35);

		setFogFactor(0.4);
		setFogThickness(0.2);

		setPPEffect("hdr");
		setPPContrast(0.67);
		setPPSaturation(0.62);
		setPPBloom(0.6);

		rbt1 = ["tropic_grass_c", "tropic_grass_c", "tropic_grass_c", "tropic_grass_c", "tropic_grass_plants", "tropic_plants", "tropic_plants_b"];
		rbt2 = "tropic_plants_c";
		rbt3 = "tropic_plants_c";
		rbt4 = ["tropic_cliff_a", "tropic_cliff_a", "tropic_cliff_a", "tropic_cliff_a_plants"];
		rbt5 = "tropic_grass_c";
		rbt6 = "tropic_grass_plants";
		rbt7 = "tropic_plants";
		rbt8 = ["tropic_cliff_grass"];
		rbt9 = ["tropic_dirt_a", "tropic_dirt_a_plants"];
		rbt10 = "tropic_citytile_a";
		rbt11 = "tropic_citytile_plants";
		rbt12 = "tropic_plants_b";
		rbt13 = "temp_mud_plants";
		rbt14 = "tropic_beach_dry_plants";
		rbt15 = "tropic_beach_dry";

		// gaia entities
		rbe1 = "gaia/flora_tree_toona";
		rbe2 = "gaia/flora_tree_toona";
		rbe3 = "gaia/flora_tree_palm_tropic";
		rbe4 = "gaia/flora_tree_palm_tropic";
		rbe5 = "gaia/flora_tree_palm_tropic";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_peacock";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_tiger";
		rbe11 = "gaia/geology_stonemine_tropic_quarry";
		rbe12 = "gaia/geology_stone_tropic_a";
		rbe13 = "gaia/geology_metal_tropic_slabs";

		// decorative props
		rba1 = "actor|props/flora/plant_tropic_a.xml";
		rba2 = "actor|props/flora/plant_lg.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/plant_tropic_large.xml";
		rba8 = "actor|props/flora/plant_tropic_large.xml";
		rba9 = "actor|flora/trees/tree_tropic.xml";
	}
	//autumn
	else if (biomeID == 8)
	{

		// basically temperate with a reddish twist in the reflection and the tint. Also less wavy.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.157, 0.149, 0.443);
		setWaterTint(0.443,0.42,0.824);
		setWaterWaviness(2.5);
		setWaterMurkiness(0.83);

		setFogFactor(0.35);
		setFogThickness(0.22);
		setFogColor(0.82,0.82, 0.73);
		setPPSaturation(0.56);
		setPPContrast(0.56);
		setPPBloom(0.38);
		setPPEffect("hdr");

		rbt1 = ["temp_grass_aut", "temp_grass_aut", "temp_grass_d_aut"];
		rbt2 = "temp_plants_bog_aut";
		rbt3 = "temp_forestfloor_aut";
		rbt4 = ["temp_cliff_a", "temp_cliff_b"];
		rbt5 = "temp_grass_plants_aut";
		rbt6 = ["temp_grass_b_aut", "temp_grass_c_aut"];
		rbt7 = ["temp_grass_b_aut", "temp_grass_long_b_aut"];
		rbt8 = "temp_highlands_aut";
		rbt9 = ["temp_cliff_a", "temp_cliff_b"];
		rbt10 = "temp_road_aut";
		rbt11 = "temp_road_overgrown_aut";
		rbt12 = "temp_grass_plants_aut";
		rbt13 = "temp_grass_plants_aut";
		rbt14 = "temp_forestfloor_pine";
		rbt15 = "medit_sand_wet";

		// gaia entities
		rbe1 = "gaia/flora_tree_euro_beech_aut";
		rbe2 = "gaia/flora_tree_euro_beech_aut";
		rbe3 = "gaia/flora_tree_pine";
		rbe4 = "gaia/flora_tree_oak_aut";
		rbe5 = "gaia/flora_tree_oak_aut";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_rabbit";
		rbe11 = "gaia/geology_stonemine_temperate_quarry";
		rbe12 = "gaia/geology_stone_temperate";
		rbe13 = "gaia/geology_metal_temperate_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/european_beech_aut.xml";
	}

}

///////////
// Defaults
///////////

// default to 10% deviation
function deviationOrDefault(deviation)
{
	return optionalParam(deviation, 0.1);
}

// default to 0.3 distance
function distanceOrDefault(distance)
{
	return optionalParam(distance, 0.3);
}

// default to filling 100% of the map
function fillOrDefault(fill)
{
	return optionalParam(fill, 1)
}

// default to 0.05 distance between teammates
function groupedDistanceOrDefault(groupedDistance)
{
	return optionalParam(groupedDistance, 0.05);
}

// default to 100% of normal size
function sizeOrDefault(size)
{
	return optionalParam(size, 1);
}

// default to "radial" placement
function typeOrDefault(type)
{
	return optionalParam(type, "radial");
}

///////////
// Players
///////////

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
	var players = {};

	switch(type)
	{
		case "line":
			players = placeLine(playerIDs, distance, groupedDistance);
			break;
		case "radial":
			players = placeRadial(playerIDs, distance);
			break;
		case "random":
			players = placeRandom(playerIDs);
			break;
		case "stronghold":
			players = placeStronghold(playerIDs, distance, groupedDistance);
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
	if (walls || walls == undefined)
		placeCivDefaultEntities(fx, fz, player.id, m.mapRadius);
	else
		placeCivDefaultEntities(fx, fz, player.id, m.mapRadius, {'iberWall': false});

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
		mAngle = randFloat(0, TWO_PI);

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

// generates an array of teams
function getTeams(numPlayers)
{
	var ffaPlayers = 0;
	var numTeams = 0;
	var teams = new Array(9);
	for (var i = 0; i < numPlayers; ++i)
	{
		var team = getPlayerTeam(i) + 1;
		if (team < 1)
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

	// consolidate the array
	var setTeams = new Array();
	var currentTeam = 0;
	for (var i = 1; i < 9; ++i)
	{
		if (teams[i] !== undefined)
		{
			setTeams[currentTeam] = teams[i];
			currentTeam++;
		}
	}

	return setTeams;
}

// picks a random starting style
function getStartingPositions()
{
	var starting = {};
	var formats = ["radial"];

	// enable stronghold if we have a few teams and a big enough map
	if (m.teams.length >= 2 && m.numPlayers >= 4 && m.mapSize >= 256)
		formats.push("stronghold");

	// enable random if we have enough teams or enough players on a big enough map
	if (m.mapSize >= 256 && (m.teams.length >= 3 || m.numPlayers > 4))
		formats.push("random");

	// enable line if we have enough teams and players on a big enough map
	if (m.teams.length >= 2 && m.numPlayers >= 4 && m.mapSize >= 384)
		formats.push("line");

	var use = randInt(formats.length);

	starting["setup"] = formats[use];
	starting["distance"] = getRand(0.2, 0.35, 100);
	starting["separation"] = getRand(0.05, 0.1, 100);

	return starting;
}

// randomize player order
function randomizePlayers()
{
	var playerIDs = [];
	for (var i = 0; i < m.numPlayers; i++)
		playerIDs.push(i + 1);

	playerIDs = sortPlayers(playerIDs);

	return playerIDs
}

/////////////////////////////////////////
// placeLine
//
// Function for placing teams in a line pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
//
/////////////////////////////////////////
function placeLine(playerIDs, distance, groupedDistance)
{
	var players = new Array();

	for (var i = 0; i < m.teams.length; ++i) {
		var safeDist = distance;
		if (distance + m.teams[i].length * groupedDistance > 0.45)
			safeDist = 0.45 - m.teams[i].length * groupedDistance;

		var teamAngle = m.startAngle + (i + 1) * TWO_PI / m.teams.length;

		// create player base
		for (var p = 0; p < m.teams[i].length; ++p)
		{
			var player = {"id": m.teams[i][p], "angle": m.startAngle + (p + 1) * TWO_PI / m.teams[i].length};
			player["x"] = 0.5 + (safeDist + p * groupedDistance) * cos(teamAngle);
			player["z"] = 0.5 + (safeDist + p * groupedDistance) * sin(teamAngle);
			players[m.teams[i][p]] = player;
			createBase(players[m.teams[i][p]], false)
		}
	}

	return players;
}

/////////////////////////////////////////
// placeRadial
//
// Function for placing players in a radial pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
//
/////////////////////////////////////////
function placeRadial(playerIDs, distance)
{
	var players = new Array();

	for (var i = 0; i < m.numPlayers; ++i)
	{
		players[i] = {"id": playerIDs[i], "angle": m.startAngle + i * TWO_PI / m.numPlayers};
		players[i]["x"] = 0.5 + distance * cos(players[i].angle);
		players[i]["z"] = 0.5 + distance * sin(players[i].angle);

		createBase(players[i])
	}

	return players;
}

/////////////////////////////////////////
// placeRandom
//
// Function for placing players in a random pattern
//
// playerIDs: array of randomized playerIDs
//
/////////////////////////////////////////
function placeRandom(playerIDs)
{
	var players = new Array();
	var placed = new Array();

	for (var i = 0; i < m.numPlayers; ++i)
	{
		var playerAngle = randFloat(0, TWO_PI);
		var distance = randFloat(0, 0.42);
		var x = 0.5 + distance * cos(playerAngle);
		var z = 0.5 + distance * sin(playerAngle);

		var tooClose = false;
		for (var j = 0; j < placed.length; ++j)
		{
			var sep = separation(x, z, placed[j].x, placed[j].z);
			if (sep < 0.25)
			{
				tooClose = true;
				break;
			}
		}

		if (tooClose)
		{
			--i;
			continue;
		}

		players[i] = {"id": playerIDs[i], "angle": playerAngle, "x": x, "z": z};
		placed.push(players[i])

		createBase(players[i])
	}

	return players;
}

/////////////////////////////////////////
// placeStronghold
//
// Function for placing teams in a stronghold pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
//
/////////////////////////////////////////
function placeStronghold(playerIDs, distance, groupedDistance)
{
	var players = new Array();

	for (var i = 0; i < m.teams.length; ++i) {
		var teamAngle = m.startAngle + (i + 1) * TWO_PI / m.teams.length;
		var fractionX = 0.5 + distance * cos(teamAngle);
		var fractionZ = 0.5 + distance * sin(teamAngle);

		// create player base
		for (var p = 0; p < m.teams[i].length; ++p)
		{
			var player = {"id": m.teams[i][p], "angle": m.startAngle + (p + 1) * TWO_PI / m.teams[i].length};
			player["x"] = fractionX + groupedDistance * cos(player.angle);
			player["z"] = fractionZ + groupedDistance * sin(player.angle);
			players[m.teams[i][p]] = player;
			createBase(players[m.teams[i][p]], false)
		}
	}

	return players;
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
	var defaultClasses = ["animals", "baseResource", "berries", "bluff", "bluffSlope", "dirt", "fish", "food", "forest", "hill", "land", "map", "metal", "mountain", "player", "ramp", "rock", "settlement", "spine", "valley", "water"];
	var classes = defaultClasses;
	if (newClasses !== undefined)
		classes = defaultClasses.concat(newClasses)

	var tc = {};
	for (var i = 0; i < classes.length; ++i)
		tc[classes[i]] = createTileClass();

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

// put some useful map settings into an object
function getSettings(biomeID)
{
	var m = {};
	setBiome(biomeID);
	m["biome"] = biomeID;
	m["numPlayers"] = getNumPlayers();
	m["mapSize"] = getMapSize();
	m["mapArea"] = m["mapSize"] * m["mapSize"];
	m["centerOfMap"] = floor(m["mapSize"] / 2);
	m["mapHeight"] = getHeight(m["centerOfMap"], m["centerOfMap"]);
	m["mapRadius"] = -PI / 4;
	m["teams"] = getTeams(m["numPlayers"]);
	m["startAngle"] = randFloat(0, TWO_PI);
	return m;
}

///////////
// Generic Helpers
///////////

// gets a number of elements from a randomized array
function randArray(array)
{
	var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

	return array;
}

// gets a random number between two values
function getRand(min, max, factor)
{
	return ((min * factor) + randInt((max - min) * factor)) / factor;
}

// gets a number within a random deviation of a base number
function getRandomDeviation(base, randomness)
{
	if (randomness > base)
		randomness = base;

	var deviation = base + (-1 * randomness + (randInt(20 * randomness) + 0.0001) / 10);
	return floor(deviation * 100) / 100;
}

// return a parameteter or it's default value
function optionalParam(param, defaultVal)
{
	return param || defaultVal;
}
