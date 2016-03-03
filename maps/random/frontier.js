RMS.LoadLibrary("rmgen");
InitMap();

/*
TODO:
- bluffs / sloped terrain
- rivers (rndRiver)
- crossings (passageMaker)
- spines / canyons
- roads / trails
- islands

- beach access from steep terrain
- trees around shallow lakes
- mountain passes
- decorative terrain (paintTerrainBasedOnHeight, paintTileClassBasedOnHeight)
- refine each biome's styling
*/

/*
Maps:
- sunken city: players start out surrounded by a crescent shaped bluff, leading to a central highlands
- buried treasure: players start on high ground, mineral rich resources in a sunken middle
- terraces: 5 parallel levels connected by ramps
- delta: a mina river splits into many smaller rivers that cut up the map
- ambush: each team had access to a private bluff leading to high ground behind their opponents base
*/


///////////
// define the map constants
///////////
const m = getSettings();
const t = constTerrains();
const g = constGaia();
const p = constProps();
const tc = constTileClasses();
const f = constForests();
const allSizes = ["tiny", "small", "normal", "big", "huge"];
const allMixes = ["same", "similar", "normal", "varied", "unique"];
const allAmounts = ["scarce", "few", "normal", "many", "tons"];

///////////
// setup the map
///////////

// pick a random elevation with a bias towards lower elevations
var randElevation = randInt(25);
if (randElevation < 20) {
	randElevation = randInt(12);
}

initTerrain(t.mainTerrain, tc.map, randElevation);
var pos = getStartingPositions();
var players = addBases(pos.setup, pos.distance, pos.separation);
RMS.SetProgress(20);

///////////
// customize the map
///////////

RMS.SetProgress(40);
///////////
// add terrain
///////////

// terrain features
var features = [
	{
		"func": addBluff,
		"tile": "tc.bluff",
		"avoid": [tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.valley, 2, tc.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}/*,
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.valley, 2, tc.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addLakes,
		"tile": "tc.water",
		"avoid": [tc.mountain, 15, tc.player, 20, tc.valley, 10, tc.water, 25],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"tile": "tc.mountain",
		"avoid": [tc.mountain, 25, tc.player, 20, tc.valley, 10, tc.water, 15],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"tile": "tc.mountain",
		"avoid": [tc.mountain, 25, tc.player, 40, tc.valley, 10, tc.water, 15],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addValleys,
		"tile": "tc.valley",
		"avoid": [tc.hill, 5, tc.mountain, 25, tc.player, 40, tc.valley, 15, tc.water, 10],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}*/
];
features = randArray(features);

// decorative elements
var decoration = [
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 5, tc.dirt, 5, tc.forest, 0, tc.mountain, 0, tc.player, 12, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 5, tc.forest, 2, tc.mountain, 2, tc.player, 2, tc.water, 2],
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
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 15, tc.metal, 40, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 50, tc.rock, 40, tc.metal, 15, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.water, 2],
		"sizes": ["normal"],
		"mixes": ["similar", "normal"],
		"amounts": ["few", "normal", "many"]
	}
];
primaryRes = randArray(primaryRes);

// secondary resources
var treeAmounts = ["few", "normal", "many"];
if (m.biome == 6)
	treeAmounts = ["many", "tons"];

var secondaryRes = [
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 50, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3],
		"sizes": ["small", "normal", "big"],
		"mixes": ["similar", "normal", "varied"],
		"amounts": ["few", "normal", "many"]
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.bluff, 5, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5],
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
// addBluff
//
// Function for creating bluffs
//
// constraint: constraint classes
// size: size of normal (1.2 would be 120% of normal)
// deviation: degree of deviation from the defined size (0.2 would be 20% plus/minus deviation)
// fill: size of map to fill (1.5 would be 150% of normal)
//
/////////////////////////////////////////
function addBluff(constraint, size, deviation, fill)
{
	var elevation = 25;
	var placer = new ChainPlacer(20, 20, 3, 0.5);
	var terrainPainter = new LayeredPainter([t.cliff, t.tier2Terrain, t.tier3Terrain], [2, 2]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, elevation, 2);
	var rendered = createAreas2(placer, [terrainPainter, elevationPainter, paintClass(tc.bluff)], constraint, 1);

	for (var i = 0; i < rendered.length; ++i)
	{
		if (rendered[i].points !== undefined)
		{
			// find the bounding box of the bluff
			var minX = m.mapSize + 1;
			var minZ = m.mapSize + 1;
			var maxX = -1;
			var maxZ = -1;
			var area = rendered[i].points.length;

			for (var p = 0; p < area; ++p)
			{
				var pt = rendered[i].points[p];

				if (pt.x < minX)
					minX = pt.x

				if (pt.z < minZ)
					minZ = pt.z

				if (pt.x > maxX)
					maxX = pt.x

				if (pt.z > maxZ)
					maxZ = pt.z
			}

			// TODO:
			// start at the plateau and move through the plateau until the plateau % is reached
			// find the height of the middle of the line that doesn't include the plateau to establish the fade to height
			// define the maximum distance the slope will have to travel
			// receed the slope's height propotional to distance from ridgeline

			// seed an array the size of the bounding box
			var bb = [];
			var width = maxX - minX + 1;
			var length = maxZ - minZ + 1;
			for (var w = 0; w < width; ++w)
			{
				bb[w] = [];
				for (var l = 0; l < length; ++l)
				{
					var curHeight = g_Map.getHeight(w + minX, l + minZ);
					bb[w][l] = {"height": curHeight, "isBluff": false};
				}
			}

			// define the coordinates that represent the bluff
			for (var p = 0; p < area; ++p)
			{
				var pt = rendered[i].points[p];
				bb[pt.x - minX][pt.z - minZ].isBluff = true;
			}

			// get a random starting position for the slope
			var ridgeAngle = randInt(4);

			var startX = minX;
			var startZ = minZ;
			var stopX = maxX;
			var stopZ = maxZ;

			var covered = 0;
			var startRidge = 0.4;
			var shouldSlope = false;
			var clear = true;
			var fadeTo = {"x1": stopX, "z1": stopZ, "x2": stopX, "z2": stopZ, "height": g_Map.setHeight(stopX, stopZ) + 2};
			var distToFade = 0;
			var slope = 0;
			var step = 0;

			// TODO:
			// finish searching the other part of the bounding box for the clear line
			// get the max height of the clear line, to calculate the slope
			// get rid of ripples at the edge of the bluff
			// paint the slope a different class

			// find the end of the plateau
			for (var x = stopX; x >= startX; --x)
			{
				var nextX = x;
				var nextZ = stopZ;

				while (nextX >= startX && nextX <= stopX && nextZ >= startZ && nextZ <= stopZ)
				{
					var bp = bb[nextX - startX][nextZ - startZ];
					if (bp.isBluff)
					{
						clear = false;
						break;
					}

					nextX = nextX - 1;
					nextZ = nextZ + 1;
				}

				if (clear)
				{
					var midX = x + floor((nextX - x) / 2);
					var midZ = stopZ - floor((stopZ - nextZ) / 2);
					fadeTo = {"x1": x, "z1": stopZ, "x2": nextX + 1, "z2": nextZ - 1, "height": g_Map.getHeight(midX, midZ)};
				}
				else
					break;
			}

			warn("Fade to: " + fadeTo.x1 + ", " + fadeTo.z1 + ": " + fadeTo.height);

			var ground = createTerrain(t.mainTerrain);

			// traverse the bounding box
			for (var x = startX; x < stopX; ++x)
			{
				var nextX = x;
				var nextZ = startZ;

				while (nextX >= startX && nextX <= stopX && nextZ >= startZ && nextZ <= stopZ)
				{
					var bp = bb[nextX - startX][nextZ - startZ];
					if (bp.isBluff)
						covered++;

					if (shouldSlope && bp.isBluff)
					{
						var curHeight = g_Map.getHeight(nextX, nextZ);
						var newHeight = curHeight - curHeight * (step / distToFade);
						if (newHeight < fadeTo.height)
							newHeight = fadeTo.height;

						if (newHeight <= fadeTo.height)
							ground.place(nextX, nextZ);

						g_Map.setHeight(nextX, nextZ, newHeight);
					}

					nextX = nextX - 1;
					nextZ = nextZ + 1;
				}

				if (covered >= area * startRidge && !shouldSlope)
				{
					distToFade = stopX - x + fadeTo.z2 - startZ;
					slope = (elevation - fadeTo.height) / distToFade;
					shouldSlope = true;
				}

				if (shouldSlope)
					step++;
			}

			// traverse the bounding box
			for (var z = startZ; z <= stopZ; ++z)
			{
				var nextX = stopX;
				var nextZ = z;

				while (nextX >= startX && nextX <= stopX && nextZ >= startZ && nextZ <= stopZ)
				{
					var bp = bb[nextX - startX][nextZ - startZ];
					if (bp.isBluff)
						covered++;

						if (shouldSlope && bp.isBluff)
						{
							var curHeight = g_Map.getHeight(nextX, nextZ);
							var newHeight = curHeight - curHeight * (step / distToFade);
							if (newHeight < fadeTo.height)
								newHeight = fadeTo.height;

							if (newHeight <= fadeTo.height + 2)
								ground.place(nextX, nextZ);

							g_Map.setHeight(nextX, nextZ, newHeight);
						}

					nextX = nextX - 1;
					nextZ = nextZ + 1;
				}

				if (covered >= area * startRidge && !shouldSlope)
				{
					distToFade = fadeTo.z2 - startZ;
					slope = (elevation - fadeTo.height) / distToFade;
					shouldSlope = true;
				}

				if (shouldSlope)
					step++;
			}

			/*
			var startX = minX;
			var startZ = minZ;
			var stopX = maxX;
			var stopZ = maxZ;

			if (ridgeAngle > PI / 2)
			{
				startZ = maxZ;
				stopZ = minZ;
			}

			var slope = (stopZ - startZ) / (stopX - startX);

			var minZBluff = minZ;
			var maxZBluff = maxZ;

			// traverse the diagonal
			for (var x = startX; x <= stopX; ++x)
			{
				var z = floor(slope * x);
				var texture = g_Map.getTexture(x, z);
				warn(texture);
			}*/

			/*
			var startRidge = 0.2;

			// find the center of the bounding box
			var lenX = maxX - minX;
			var lenZ = maxZ - minZ;

			var north = Math.random() >= 0.5;
			warn("north: " + north)
			var flatSection = startRidge - 0.1;

			if (!north)
			{
				startRidge = 1 - startRidge;
				flatSection = startRidge + 0.1;
			}

			// find the center point of the ridge
			var ridgeCenterX = minX + floor(lenX * startRidge);
			var ridgeCenterZ = minZ + floor(lenX * startRidge);

			var flatX = minX + floor(lenX * flatSection);
			var flatZ = minZ + floor(lenX * flatSection);

			if (ridgeAngle > PI / 2)
			{
				warn("updating ridgeCenterZ")
				ridgeCenterZ = maxZ - floor(lenX * startRidge);
				flatZ = maxZ - floor(lenX * flatSection);
			}

			// define two points on our ridgeline
			var ridgeX1 = ridgeCenterX + floor(lenX / 2) * Math.cos(ridgeAngle);
			var ridgeZ1 = ridgeCenterZ - floor(lenZ / 2) * Math.sin(ridgeAngle);
			var ridgeX2 = ridgeCenterX - floor(lenX / 2) * Math.cos(ridgeAngle);
			var ridgeZ2 = ridgeCenterZ + floor(lenZ / 2) * Math.sin(ridgeAngle);

			// define two points that give us a reference point for our flat section
			var flatX1 = flatX + floor(lenX / 2) * Math.cos(ridgeAngle);
			var flatZ1 = flatZ - floor(lenZ / 2) * Math.sin(ridgeAngle);
			var flatX2 = flatX - floor(lenX / 2) * Math.cos(ridgeAngle);
			var flatZ2 = flatZ + floor(lenZ / 2) * Math.sin(ridgeAngle);

			// find the distance between the ridge line and safe line
			var safeDist = distanceOfPointFromLine(flatX1, flatZ1, flatX2, flatZ2, ridgeX1, ridgeZ1);

			var ground = createTerrain(t.mainTerrain);
			var maxDist = 15;

			for (var p = 0; p < rendered[i].points.length; ++p)
			{
				var pt = rendered[i].points[p];
				var distToRidge = distanceOfPointFromLine(ridgeX1, ridgeZ1, ridgeX2, ridgeZ2, pt.x, pt.z);
				var distToSafeline = distanceOfPointFromLine(flatX1, flatZ1, flatX2, flatZ2, pt.x, pt.z);

				// check that we're on the right side of the ridgeline
				if (distToSafeline > distToRidge && distToSafeline > safeDist)
				{
					var curHeight = g_Map.getHeight(pt.x, pt.z);
					var newHeight = curHeight - (curHeight * (distToRidge / maxDist));
					if (newHeight < m.mapHeight + 1)
						newHeight = m.mapHeight - 10;

					if (newHeight <= m.mapHeight + 2)
						ground.place(pt.x, pt.z);

					g_Map.setHeight(pt.x, pt.z, newHeight);
				}
			}*/
		}
	}

	//var slopeAngle = randFloat(0, TWO_PI);
}

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
		"minSize": floor(scaleByMapSize(7, 7)),
		"maxSize": floor(scaleByMapSize(15, 15)),
		"spread": floor(scaleByMapSize(20, 20)),
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
				"avoid": [tc.fish, 12, tc.hill, 8, tc.land, 8, tc.mountain, 8, tc.player, 8],
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
	var plateau = {
		"class": tc.mountain,
		"painter": [t.cliff, t.cliff, t.hill],
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

	var valley = {
		"class": tc.valley,
		"painter": [t.mainTerrain, t.dirt],
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
		minDist = 2 * offset;
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
	starting["distance"] = getRand(0.2, 0.4, 100);
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
	var defaultClasses = ["animals", "baseResource", "berries", "bluff", "dirt", "fish", "food", "forest", "hill", "land", "map", "metal", "mountain", "player", "ramp", "rock", "settlement", "valley", "water"];
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
function getSettings()
{
	var m = {}
	m["biome"] = randomizeBiome();
	m["numPlayers"] = getNumPlayers();
	m["mapSize"] = getMapSize();
	m["mapArea"] = m["mapSize"] * m["mapSize"];
	m["centerOfMap"] = m["mapSize"] / 2;
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
