RMS.LoadLibrary("rmgen");
InitMap();

///////////
// setup the map
///////////

initTerrain(t.cliff, tc.land, 50);
var pos = getStartingPositions();
var players = addBases("radial", 0.4, pos.separation);
RMS.SetProgress(20);

///////////
// customize the map
///////////
createSunkenTerrain(players);

RMS.SetProgress(40);
///////////
// add terrain
///////////

// decorative elements
var decoration = [
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12],
		"stay": [tc.settlement, 7],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.dirt, 5, tc.forest, 2],
		"stay": [tc.player, 1],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.forest, 2],
		"stay": [tc.player, 1],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.step, 2],
		"stay": [tc.valley, 7],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.forest, 2, tc.mountain, 2, tc.player, 12],
		"stay": [tc.settlement, 7],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.forest, 2, tc.mountain, 2, tc.player, 12],
		"stay": [tc.step, 7],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["scarce"]
	}
];
addElements(decoration);
RMS.SetProgress(60);

///////////
// add gaia
///////////
// primary resources
var primaryRes = [
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.player, 30, tc.rock, 10, tc.metal, 20],
		"stay": [tc.settlement, 7],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.player, 10, tc.rock, 10, tc.metal, 20, tc.mountain, 5, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.player, 30, tc.rock, 20, tc.metal, 10],
		"stay": [tc.settlement, 7],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.player, 10, tc.rock, 20, tc.metal, 10, tc.mountain, 5, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 18, tc.metal, 3, tc.player, 20, tc.rock, 3],
		"stay": [tc.settlement, 7],
		"sizes": ["normal", "big"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 3, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 5, tc.rock, 3, tc.step, 1],
		"stay": [tc.valley, 7],
		"sizes": ["normal", "big"],
		"mixes": ["same"],
		"amounts": ["tons"]
	}
];
primaryRes = randArray(primaryRes);

// secondary resources
var secondaryRes = [
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.forest, 5, tc.metal, 10, tc.player, 20, tc.rock, 10],
		"stay": [tc.settlement, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["tons"]
	},
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.forest, 5, tc.metal, 10, tc.mountain, 5, tc.player, 10, tc.rock, 10, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.forest, 0, tc.metal, 1, tc.player, 20, tc.rock, 1],
		"stay": [tc.settlement, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["tons"]
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.forest, 0, tc.metal, 1, tc.mountain, 5, tc.player, 10, tc.rock, 1, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 7, tc.metal, 3, tc.player, 12, tc.rock, 3],
		"stay": [tc.settlement, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["tons"]
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 7, tc.metal, 3, tc.mountain, 5, tc.player, 10, tc.rock, 3, tc.step, 5],
		"stay": [tc.valley, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.metal, 5, tc.rock, 5],
		"stay": [tc.player, 1],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
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

// create the sunken terrain
function createSunkenTerrain(players)
{
	var base = t.mainTerrain;
	var middle = t.dirt;
	var lower = t.tier2Terrain;
	var road = t.road;

	if (m.biome == 2)
	{
		middle = t.tier2Terrain;
		lower = t.tier1Terrain;
	}

	if (m.biome == 4)
	{
		middle = t.shore;
		lower = t.tier4Terrain;
	}

	if (m.biome == 5)
	{
		middle = t.tier1Terrain;
		lower = t.forestFloor1;
	}

	if (m.biome == 6)
	{
		middle = t.tier2Terrain;
		lower = t.tier4Terrain;
	}

	if (m.biome == 7 || m.biome == 8)
		road = t.roadWild;

	if (m.biome == 8)
		middle = t.shore;

	var expSize = m.mapArea * 0.015 / (m.numPlayers / 4);
	var expDist = 0.1 + (m.numPlayers / 200);
	if (m.numPlayers == 2)
		expSize = m.mapArea * 0.015 / 0.7;

	var nRoad = 0.44;
	var nExp = 0.425;

	if (m.numPlayers < 4)
	{
		nRoad = 0.42;
		nExp = 0.4;
	}

	// create central valley
	var placer = new ClumpPlacer(m.mapArea * 0.26, 1, 1, 1, m.centerOfMap, m.centerOfMap);
	var terrainPainter = new LayeredPainter([t.cliff, lower], [3]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 0, 3);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.valley)]);

	// create the center hill
	var placer = new ClumpPlacer(m.mapArea * 0.14, 1, 1, 1, m.centerOfMap, m.centerOfMap);
	var terrainPainter = new LayeredPainter([t.cliff, t.cliff], [3]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, m.mapHeight, 3);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.mountain)]);

	for(var i = 0; i < players.length; ++i)
	{
		var playerAngle = m.startAngle + i * TWO_PI / m.numPlayers;
		var pX = round(fractionToTiles(0.5 + 0.4 * cos(playerAngle)));
		var pZ = round(fractionToTiles(0.5 + 0.4 * sin(playerAngle)));
		var expX = round(fractionToTiles(0.5 + expDist * cos(m.startAngle + (i + 0.75) * TWO_PI / m.numPlayers)));
		var expZ = round(fractionToTiles(0.5 + expDist * sin(m.startAngle + (i + 0.75) * TWO_PI / m.numPlayers)));
		var rearX = round(fractionToTiles(0.5 + 0.47 * cos(playerAngle)));
		var rearZ = round(fractionToTiles(0.5 + 0.47 * sin(playerAngle)));
		var prePlayerAngle = m.startAngle + (i - 0.5) * TWO_PI / m.numPlayers;
		var preX = round(fractionToTiles(0.5 + nRoad * cos(prePlayerAngle)));
		var preZ = round(fractionToTiles(0.5 + nRoad * sin(prePlayerAngle)));
		var nextPlayerAngle = m.startAngle + (i + 0.5) * TWO_PI / m.numPlayers;
		var nextX = round(fractionToTiles(0.5 + nRoad * cos(nextPlayerAngle)));
		var nextZ = round(fractionToTiles(0.5 + nRoad * sin(nextPlayerAngle)));

		// create path to expansion
		var placer = new PathPlacer(pX, pZ, expX, expZ, scaleByMapSize(12, 12), 0.7, 0.5, 0.1, -1);
		var terrainPainter = new LayeredPainter([t.cliff, middle, road], [3, 4]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create path to neighbor
		var placer = new PathPlacer(rearX, rearZ, nextX, nextZ, scaleByMapSize(19, 19), 0.4, 0.5, 0.1, -0.6);
		var terrainPainter = new LayeredPainter([t.cliff, middle, road], [3, 6]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create path to neighbor
		var placer = new PathPlacer(rearX, rearZ, preX, preZ, scaleByMapSize(19, 19), 0.4, 0.5, 0.1, -0.6);
		var terrainPainter = new LayeredPainter([t.cliff, middle, road], [3, 6]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create the den
		var placer = new ClumpPlacer(m.mapArea * 0.03, 0.9, 0.3, 1, pX, pZ);
		var terrainPainter = new LayeredPainter([t.cliff, base], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 22, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.valley)]);

		// create the expansion
		var placer = new ClumpPlacer(expSize, 0.9, 0.3, 1, expX, expZ);
		var terrainPainter = new LayeredPainter([t.cliff, base], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 22, 3);
		var area = createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.settlement)], [avoidClasses(tc.settlement, 2)]);
		var unpainter = new TileClassUnPainter(new TileClass(m.mapSize, tc.mountain));
		unpainter.paint(area);
	}

	// create the neighbor expansions
	for (var i = 0; i < m.numPlayers; ++i)
	{
		var nextPlayerAngle = m.startAngle + (i + 0.5) * TWO_PI / m.numPlayers;
		var nextX = round(fractionToTiles(0.5 + nExp * cos(nextPlayerAngle)));
		var nextZ = round(fractionToTiles(0.5 + nExp * sin(nextPlayerAngle)));

		// create the neightbor expansion
		var placer = new ClumpPlacer(expSize, 0.9, 0.3, 1, nextX, nextZ);
		var terrainPainter = new LayeredPainter([t.cliff, lower], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 0, 3);
		var area = createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.settlement)]);
	}
}
