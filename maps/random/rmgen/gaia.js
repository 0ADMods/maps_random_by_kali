const allSizes = ["tiny", "small", "normal", "big", "huge"];
const allMixes = ["same", "similar", "normal", "varied", "unique"];
const allAmounts = ["scarce", "few", "normal", "many", "tons"];

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

	var count = fill * scaleByMapSize(15, 15);
	var minSize = scaleByMapSize(5, 5);
	var maxSize = scaleByMapSize(7, 7);
	var elevation = 30;
	var spread = scaleByMapSize(100, 100);

	for (var i = 0; i < count; ++i)
	{
		var offset = getRandomDeviation(size, deviation);

		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);
		var pElevation = floor(elevation * offset);

		var placer = new ChainPlacer(pMinSize, pMaxSize, pSpread, 0.5);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, g_Terrains.mainTerrain, g_Terrains.tier2Terrain], [2, 3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, pElevation, 2);
		var rendered = createAreas2(placer, [terrainPainter, elevationPainter, paintClass(g_TileClasses.bluff)], constraint, 1);

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

		// if we can't access the bluff, try different angles
		var retries = 1;
		var bluffCat = 2;
		while (bluffCat != 0 && retries < 4)
		{
			bluffCat = unreachableBluff(bb, corners, baseLine, endLine);
			++angle;
			if (angle > 3)
				angle = 0;

			opAngle = angle - 2;
			if (angle < 2)
				opAngle = angle + 2;

			baseLine = findClearLine(bb, corners, angle);
			endLine = findClearLine(bb, corners, opAngle);
			++retries;
		}

		// found a bluff that can't be accessed, so turn it into a plateau
		if (retries == 4)
		{
			removeBluff(points);

			// if we couldn't find the slope lines, turn it into a plateau
			if (bluffCat == 1)
				continue;
		}

		var ground = createTerrain(g_Terrains.mainTerrain);

		var slopeLength = getDistance(baseLine.midX, baseLine.midZ, endLine.midX, endLine.midZ);

		// adjust the height of each point in the bluff
		for (var p = 0; p < points.length; ++p)
		{
			var pt = points[p];
			var dist = distanceOfPointFromLine(baseLine.x1, baseLine.z1, baseLine.x2, baseLine.z2, pt.x, pt.z);

			var curHeight = g_Map.getHeight(pt.x, pt.z);
			var newHeight = curHeight - curHeight * (dist / slopeLength) - 2;

			if (newHeight < endLine.height)
				newHeight = endLine.height;

			if (newHeight <= endLine.height + 2 && g_Map.validT(pt.x, pt.z) && g_Map.getTexture(pt.x, pt.z).indexOf('cliff') > -1)
				ground.place(pt.x, pt.z);

			g_Map.setHeight(pt.x, pt.z, newHeight);
		}

		// smooth out the ground around the bluff
		fadeToGround(bb, corners.minX, corners.minZ, endLine.height);
	}

	addElements([{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.hill, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"stay": [g_TileClasses.bluff, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}]);

	addElements([
		{
			"func": addLayeredPatches,
			"tile": "g_TileClasses.dirt",
			"avoid": [g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
			"stay": [g_TileClasses.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]);

	addElements([
		{
			"func": addDecoration,
			"tile": "g_TileClasses.dirt",
			"avoid": [g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
			"stay": [g_TileClasses.bluff, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]);

	addElements([{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.hill, 3, g_TileClasses.player, 20, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"stay": [g_TileClasses.bluff, 5, g_TileClasses.mountain, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}]);

	addElements([
		{
			"func": addLayeredPatches,
			"tile": "g_TileClasses.dirt",
			"avoid": [g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
			"stay": [g_TileClasses.bluff, 5, g_TileClasses.mountain, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]);

	addElements([
		{
			"func": addDecoration,
			"tile": "g_TileClasses.dirt",
			"avoid": [g_TileClasses.forest, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
			"stay": [g_TileClasses.bluff, 5, g_TileClasses.mountain, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]);

	addElements(randArray([
		{
			"func": addForests,
			"tile": "g_TileClasses.forest",
			"avoid": [
				g_TileClasses.berries, 5,
				g_TileClasses.forest, 18,
				g_TileClasses.metal, 5,
				g_TileClasses.mountain, 5,
				g_TileClasses.player, 20,
				g_TileClasses.rock, 5,
				g_TileClasses.water, 2
			],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": allAmounts
		},
		{
			"func": addMetal,
			"tile": "g_TileClasses.metal",
			"avoid": [
				g_TileClasses.berries, 5,
				g_TileClasses.forest, 5,
				g_TileClasses.mountain, 2,
				g_TileClasses.player, 50,
				g_TileClasses.rock, 15,
				g_TileClasses.metal, 40,
				g_TileClasses.water, 3
			],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": ["normal"],
			"mixes": ["same"],
			"amounts": allAmounts
		},
		{
			"func": addStone,
			"tile": "g_TileClasses.stone",
			"avoid": [
				g_TileClasses.berries, 5,
				g_TileClasses.forest, 5,
				g_TileClasses.mountain, 2,
				g_TileClasses.player, 50,
				g_TileClasses.rock, 40,
				g_TileClasses.metal, 15,
				g_TileClasses.water, 3
			],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": ["normal"],
			"mixes": ["same"],
			"amounts": allAmounts
		}
	]));

	addElements(randArray([
		{
			"func": addStragglerTrees,
			"tile": "g_TileClasses.forest",
			"avoid": [
				g_TileClasses.berries, 5,
				g_TileClasses.forest, 10,
				g_TileClasses.metal, 5,
				g_TileClasses.mountain, 1,
				g_TileClasses.player, 12,
				g_TileClasses.rock, 5,
				g_TileClasses.water, 5
			 ],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": ["scarce", "few", "normal"]
		},
		{
			"func": addAnimals,
			"tile": "g_TileClasses.animals",
			"avoid": [
				g_TileClasses.animals, 20,
				g_TileClasses.forest, 5,
				g_TileClasses.mountain, 1,
				g_TileClasses.player, 20,
				g_TileClasses.rock, 5,
				g_TileClasses.metal, 5,
				g_TileClasses.water, 3
			 ],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": allAmounts
		},
		{
			"func": addBerries,
			"tile": "g_TileClasses.berries",
			"avoid": [
				g_TileClasses.berries, 50,
				g_TileClasses.forest, 5,
				g_TileClasses.metal, 10,
				g_TileClasses.mountain, 2,
				g_TileClasses.player, 20,
				g_TileClasses.rock, 10,
				g_TileClasses.water, 3
			],
			"stay": [g_TileClasses.bluff, 10],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": allAmounts
		}
	]));
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
	if (mapSettings.biome == 7)
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
//    "class": g_TileClasses.hill,
//		"painter": [g_Terrains.mainTerrain, g_Terrains.mainTerrain],
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
	if (el.class == g_TileClasses.water)
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
	addElevation(constraint, {
		"class": g_TileClasses.hill,
		"painter": [g_Terrains.mainTerrain, g_Terrains.mainTerrain],
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
	});
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
	var lakeTile = g_Terrains.water;

	if (mapSettings.biome == 0 || mapSettings.biome == 1 || mapSettings.biome == 7)
		lakeTile = g_Terrains.dirt;

	if (mapSettings.biome == 5)
		lakeTile = g_Terrains.tier2Terrain;

	if (mapSettings.biome == 8)
		lakeTile = g_Terrains.shore;

	addElevation(constraint, {
		"class": g_TileClasses.water,
		"painter": [lakeTile, lakeTile],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(6, 6),
		"minSize": floor(scaleByMapSize(7, 7)),
		"maxSize": floor(scaleByMapSize(9, 9)),
		"spread": floor(scaleByMapSize(70, 70)),
		"minElevation": -15,
		"maxElevation": -2,
		"steepness": 1.5
	});

	addElements([
		{
			"func": addFish,
			"tile": "g_TileClasses.fish",
			"avoid": [
				g_TileClasses.fish, 12,
				g_TileClasses.hill, 8,
				g_TileClasses.mountain, 8,
				g_TileClasses.player, 8
			],
			"stay": [g_TileClasses.water, 7],
			"sizes": allSizes,
			"mixes": allMixes,
			"amounts": ["normal", "many", "tons"]
		}
	]);

	var group = new SimpleGroup([new SimpleObject(p.rockMedium, 1, 3, 1, 3)], true, g_TileClasses.dirt)
	createObjectGroups(group, 0, [stayClasses(g_TileClasses.water, 1), borderClasses(g_TileClasses.water, 4, 3)], 1000, 100);

	group = new SimpleGroup([new SimpleObject(p.reeds, 10, 15, 1, 3), new SimpleObject(p.rockMedium, 1, 3, 1, 3)], true, g_TileClasses.dirt)
	createObjectGroups(group, 0, [stayClasses(g_TileClasses.water, 2), borderClasses(g_TileClasses.water, 4, 3)], 1000, 100);
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

	for (var i = 0; i < sizes.length; ++i)
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
			[
				[g_Terrains.mainTerrain, g_Terrains.tier1Terrain],
				[g_Terrains.tier1Terrain, g_Terrains.tier2Terrain],
				[g_Terrains.tier2Terrain, g_Terrains.tier3Terrain],
				[g_Terrains.tier4Terrain]
			],
			[1, 1]			// widths
		);
		createAreas(placer, [painter, paintClass(g_TileClasses.dirt)], constraint, patchCount);
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
	addElevation(constraint, {
		"class": g_TileClasses.mountain,
		"painter": [g_Terrains.cliff, g_Terrains.hill],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(2, 2)),
		"maxSize": floor(scaleByMapSize(4, 4)),
		"spread": floor(scaleByMapSize(100, 100)),
		"minElevation": 100,
		"maxElevation": 120,
		"steepness": 4
	});
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
	var plateauTile = g_Terrains.dirt;

	if (mapSettings.biome == 2)
		plateauTile = g_Terrains.tier1Terrain;

	if (mapSettings.biome == 4 || mapSettings.biome == 6)
		plateauTile = g_Terrains.tier2Terrain;

	if (mapSettings.biome == 8)
		plateauTile = g_Terrains.tier4Terrain;

	addElevation(constraint, {
		"class": g_TileClasses.mountain,
		"painter": [g_Terrains.cliff, plateauTile],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(15, 15),
		"minSize": floor(scaleByMapSize(2, 2)),
		"maxSize": floor(scaleByMapSize(4, 4)),
		"spread": floor(scaleByMapSize(200, 200)),
		"minElevation": 20,
		"maxElevation": 30,
		"steepness": 8
	});
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

		var startX = mapSettings.centerOfMap + floor(mapSettings.centerOfMap * Math.cos(startAngle));
		var startZ = mapSettings.centerOfMap + floor(mapSettings.centerOfMap * Math.sin(startAngle));

		var endX = mapSettings.centerOfMap + floor(mapSettings.centerOfMap * Math.cos(endAngle));
		var endZ = mapSettings.centerOfMap + floor(mapSettings.centerOfMap * Math.sin(endAngle));

		var pMinSize = floor(minSize * offset);
		var pMaxSize = floor(maxSize * offset);
		var pSpread = floor(spread * offset);

		var placer = new PathPlacer(startX, startZ, endX, endZ, 12, 0.25, 1, 0.05, 0.3);
		var terrainPainter = new LayeredPainter([g_Terrains.water, g_Terrains.shore], [2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, elevation, 2);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(g_TileClasses.water)], constraint);
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
	if (mapSettings.mapHeight < 6)
		return;

	var minElevation = (-1 * mapSettings.mapHeight) / (size * (1 + deviation)) + 1;
	if (minElevation < -1 * mapSettings.mapHeight)
		minElevation = -1 * mapSettings.mapHeight;

	var valleySlope = g_Terrains.tier1Terrain;
	var valleyFloor = g_Terrains.tier4Terrain;

	if (mapSettings.biome == 0)
	{
		valleySlope = g_Terrains.dirt;
		valleyFloor = g_Terrains.tier2Terrain;
	}

	if (mapSettings.biome == 3)
	{
		valleySlope = g_Terrains.tier3Terrain;
		valleyFloor = g_Terrains.dirt;
	}

	if (mapSettings.biome == 5)
	{
		valleySlope = g_Terrains.tier2Terrain;
		valleyFloor = g_Terrains.dirt;
	}

	if (mapSettings.biome == 4 || mapSettings.biome == 6)
		valleyFloor = g_Terrains.tier2Terrain;

	if (mapSettings.biome == 7)
		valleySlope = g_Terrains.dirt;

	if (mapSettings.biome == 8)
		valleyFloor = g_Terrains.tier3Terrain;

	addElevation(constraint, {
		"class": g_TileClasses.valley,
		"painter": [valleySlope, valleyFloor],
		"size": size,
		"deviation": deviation,
		"fill": fill,
		"count": scaleByMapSize(8, 8),
		"minSize": floor(scaleByMapSize(5, 5)),
		"maxSize": floor(scaleByMapSize(8, 8)),
		"spread": floor(scaleByMapSize(30, 30)),
		"minElevation": minElevation,
		"maxElevation": -2,
		"steepness": 4
	});
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
		[new SimpleObject(g_Gaia.mainHuntableAnimal, 5 * groupOffset, 7 * groupOffset, 0, 4 * groupOffset)],
		[new SimpleObject(g_Gaia.secondaryHuntableAnimal, 2 * groupOffset, 3 * groupOffset, 0, 2 * groupOffset)]
	];
	var counts = [scaleByMapSize(30, 30) * fill, scaleByMapSize(30, 30) * fill];

	for (var i = 0; i < animals.length; ++i)
	{
		var group = new SimpleGroup(animals[i], true, g_TileClasses.animals);
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

	var count = scaleByMapSize(50, 50) * fill;
	var berries = [[new SimpleObject(g_Gaia.fruitBush, 5 * groupOffset, 5 * groupOffset, 0, 3 * groupOffset)]];

	for (var i = 0; i < berries.length; ++i)
	{
		var group = new SimpleGroup(berries[i], true, g_TileClasses.berries);
		createObjectGroups(group, 0, constraint, floor(count), 40);
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
		[new SimpleObject(g_Gaia.fish, 1 * groupOffset, 2 * groupOffset, 0, 2 * groupOffset)],
		[new SimpleObject(g_Gaia.fish, 2 * groupOffset, 4 * groupOffset, 10 * groupOffset, 20 * groupOffset)]
	];
	var counts = [scaleByMapSize(40, 40) * fill, scaleByMapSize(40, 40) * fill];

	for (var i = 0; i < fish.length; ++i)
	{
		var group = new SimpleGroup(fish[i], true, g_TileClasses.fish);
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
	if (mapSettings.biome == 6)
		return;

	var types = [
		[
			[g_Terrains.forestFloor2, g_Terrains.mainTerrain, f.forest1],
			[g_Terrains.forestFloor2, f.forest1]
		],
		[
			[g_Terrains.forestFloor2, g_Terrains.mainTerrain, f.forest2],
			[g_Terrains.forestFloor1, f.forest2]],
		[
			[g_Terrains.forestFloor1, g_Terrains.mainTerrain, f.forest1],
			[g_Terrains.forestFloor2, f.forest1]],
		[
			[g_Terrains.forestFloor1, g_Terrains.mainTerrain, f.forest2],
			[g_Terrains.forestFloor1, f.forest2]
		]
	];

	for (var i = 0; i < types.length; ++i)
	{
		var offset = getRandomDeviation(size, deviation);
		var minSize = floor(scaleByMapSize(3, 5) * offset);
		var maxSize = floor(scaleByMapSize(50, 50) * offset);
		var forestCount = scaleByMapSize(10, 10) * fill;

		var placer = new ChainPlacer(1, minSize, maxSize, 0.5);
		var painter = new LayeredPainter(types[i], [2]);
		createAreas(placer, [painter, paintClass(g_TileClasses.forest)], constraint, forestCount);
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
	var count = 1 + scaleByMapSize(20, 20) * fill;
	var mines = [[new SimpleObject(g_Gaia.metalLarge, 1 * offset, 1 * offset, 0, 4 * offset)]];

	for (var i = 0; i < mines.length; ++i)
	{
		var group = new SimpleGroup(mines[i], true, g_TileClasses.metal);
		createObjectGroups(group, 0, constraint, count, 100);
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
	var count = 1 + scaleByMapSize(20, 20) * fill;
	var mines = [
		[
			new SimpleObject(g_Gaia.stoneSmall, 0, 2 * offset, 0, 4 * offset),
			new SimpleObject(g_Gaia.stoneLarge, 1 * offset, 1 * offset, 0, 4 * offset)
		],
		[
			new SimpleObject(g_Gaia.stoneSmall, 2 * offset, 5 * offset, 1 * offset, 3 * offset)
		]
	];

	for (var i = 0; i < mines.length; ++i)
	{
		var group = new SimpleGroup(mines[i], true, g_TileClasses.rock);
		createObjectGroups(group, 0, constraint, count, 100);
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

	if (mapSettings.biome == 6 && fill < 0.8)
		fill = 0.8;

	var trees = [g_Gaia.tree1, g_Gaia.tree2, g_Gaia.tree3, g_Gaia.tree4];

	var treesPerPlayer = 40;

	var offset = getRandomDeviation(size, deviation);
	var treeCount = treesPerPlayer * mapSettings.numPlayers * fill;
	var totalTrees = scaleByMapSize(treeCount, treeCount);

	var count = floor(totalTrees / trees.length) * fill;
	var min = 1 * offset;
	var max = 4 * offset;
	var minDist = 1 * offset;
	var maxDist = 5 * offset;

	// render more trees for the african biome
	if (mapSettings.biome == 6)
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
		if (i == 2 && (mapSettings.biome == 3 || mapSettings.biome == 5))
			treesMax = 1;

		if (min > treesMax)
			min = treesMax

		var group = new SimpleGroup([new SimpleObject(trees[i], min, treesMax, minDist, maxDist)], true, g_TileClasses.forest);
		createObjectGroups(group, 0, constraint, count);
	}
}

///////////
// Terrain Helpers
///////////

// determine if the endline of the bluff is within the tilemap
function unreachableBluff(bb, corners, baseLine, endLine)
{
	// if we couldn't find a slope line
	if (baseLine.midX === undefined || endLine.midX === undefined)
		return 1;

	// if the end points aren't on the tilemap
	if ((!g_Map.validT(endLine.x1, endLine.z1) || checkIfInClass(endLine.x1, endLine.z1, g_TileClasses.player)) &&
		(!g_Map.validT(endLine.x2, endLine.z2) || checkIfInClass(endLine.x2, endLine.z2, g_TileClasses.player)))
		return 2;

	var minTilesInGroup = 1;
	var insideBluff = false;
	var outsideBluff = false;

	// if there aren't enough points in each row
	for (var x = 0; x < bb.length; ++x)
	{
		var count = 0;
		for (var z = 0; z < bb[x].length; ++z)
		{
			if (!bb[x][z].isFeature)
				continue;

			var valid = g_Map.validT(x + corners.minX, z + corners.minZ);

			if (valid)
				++count;

			if (!insideBluff && valid)
				insideBluff = true;

			if (outsideBluff && valid)
				return 3;
		}

		// we're expecting the end of the bluff
		if (insideBluff && count < minTilesInGroup)
			outsideBluff = true;
	}

	var insideBluff = false;
	var outsideBluff = false;

	// if there aren't enough points in each column
	for (var z = 0; z < bb[0].length; ++z)
	{
		var count = 0;
		for (var x = 0; x < bb.length; ++x)
		{
			if (!bb[x][z].isFeature)
				continue;

			var valid = g_Map.validT(x + corners.minX, z + corners.minZ);

			if (valid)
				++count;

			if (!insideBluff && valid)
				insideBluff = true;

			if (outsideBluff && valid)
				return 3;
		}

		// we're expecting the end of the bluff
		if (insideBluff && count < minTilesInGroup)
			outsideBluff = true;
	}

	// bluff is reachable
	return 0;
}

// remove the bluff class and turn it into a plateau
function removeBluff(points)
{
	for (var i = 0; i < points.length; ++i)
		addToClass(points[i].x, points[i].z, g_TileClasses.mountain);
}

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
			bb[w][l] = {
				"height": curHeight,
				"isFeature": false
			};
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
	var ground = createTerrain(g_Terrains.mainTerrain);
	for (var x = 0; x < bb.length; ++x)
		for (var z = 0; z < bb[x].length; ++z)
		{
			var pt = bb[x][z];
			if (!pt.isFeature && nextToFeature(bb, x, z))
			{
				var newEl = smoothElevation(x + minX, z + minZ);
				g_Map.setHeight(x + minX, z + minZ, newEl);
				ground.place(x + minX, z + minZ);
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
			if (bp.isFeature && g_Map.validT(x2, z2))
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
			clearLine = {
				"x1": x,
				"z1": z,
				"x2": lastX,
				"z2": lastZ,
				"midX": midX,
				"midZ": midZ,
				"height": mapSettings.mapHeight
			};
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
	var minX = mapSettings.mapSize + 1;
	var minZ = mapSettings.mapSize + 1;
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

	return { "minX": minX, "minZ": minZ, "maxX": maxX, "maxZ": maxZ };
}

// finds the average elevation around a point
function smoothElevation(x, z)
{
	var min = g_Map.getHeight(x, z);

	for (var xOffset = -1; xOffset <= 1; ++xOffset)
		for (var zOffset = -1; zOffset <= 1; ++zOffset)
		{
			var thisX = x + xOffset;
			var thisZ = z + zOffset;
			if (!g_Map.validT(thisX, thisZ))
				continue;

			var height = g_Map.getHeight(thisX, thisZ);
			if (height < min)
				min = height;
		}

	return min;
}

// determines if a point in a bounding box array is next to a terrain feature
function nextToFeature(bb, x, z)
{
	for (var xOffset = -1; xOffset <= 1; ++xOffset)
		for (var zOffset = -1; zOffset <= 1; ++zOffset)
		{
			var thisX = x + xOffset;
			var thisZ = z + zOffset;
			if (thisX < 0 || thisX >= bb.length || thisZ < 0 || thisZ >= bb[x].length || (thisX == 0 && thisZ == 0))
				continue;

			if (bb[thisX][thisZ].isFeature)
				return true;
		}

	return false;
}
