RMS.LoadLibrary("rmgen");
InitMap();

initTerrain(g_Terrains.cliff, tc.land, 50);
RMS.SetProgress(10);

var pos = getStartingPositions();
var players = addBases("radial", 0.4, pos.separation);
RMS.SetProgress(20);

createSunkenTerrain(players);
RMS.SetProgress(40);

addElements([
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
]);
RMS.SetProgress(60);

addElements(randArray([
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
]));
RMS.SetProgress(70);

addElements(randArray([
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
]));
RMS.SetProgress(90);

ExportMap();

// create the sunken terrain
function createSunkenTerrain(players)
{
	var base = g_Terrains.mainTerrain;
	var middle = g_Terrains.dirt;
	var lower = g_Terrains.tier2Terrain;
	var road = g_Terrains.road;

	if (mapSettings.biome == 2)
	{
		middle = g_Terrains.tier2Terrain;
		lower = g_Terrains.tier1Terrain;
	}

	if (mapSettings.biome == 4)
	{
		middle = g_Terrains.shore;
		lower = g_Terrains.tier4Terrain;
	}

	if (mapSettings.biome == 5)
	{
		middle = g_Terrains.tier1Terrain;
		lower = g_Terrains.forestFloor1;
	}

	if (mapSettings.biome == 6)
	{
		middle = g_Terrains.tier2Terrain;
		lower = g_Terrains.tier4Terrain;
	}

	if (mapSettings.biome == 7 || mapSettings.biome == 8)
		road = g_Terrains.roadWild;

	if (mapSettings.biome == 8)
		middle = g_Terrains.shore;

	var expSize = mapSettings.mapArea * 0.015 / (mapSettings.numPlayers / 4);
	var expDist = 0.1 + (mapSettings.numPlayers / 200);
	if (mapSettings.numPlayers == 2)
		expSize = mapSettings.mapArea * 0.015 / 0.7;

	var nRoad = 0.44;
	var nExp = 0.425;

	if (mapSettings.numPlayers < 4)
	{
		nRoad = 0.42;
		nExp = 0.4;
	}

	// create central valley
	var placer = new ClumpPlacer(mapSettings.mapArea * 0.26, 1, 1, 1, mapSettings.centerOfMap, mapSettings.centerOfMap);
	var terrainPainter = new LayeredPainter([g_Terrains.cliff, lower], [3]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 0, 3);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.valley)]);

	// create the center hill
	var placer = new ClumpPlacer(mapSettings.mapArea * 0.14, 1, 1, 1, mapSettings.centerOfMap, mapSettings.centerOfMap);
	var terrainPainter = new LayeredPainter([g_Terrains.cliff, g_Terrains.cliff], [3]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, mapSettings.mapHeight, 3);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.mountain)]);

	for(var i = 0; i < players.length; ++i)
	{
		var playerAngle = mapSettings.startAngle + i * TWO_PI / mapSettings.numPlayers;
		var pX = round(fractionToTiles(0.5 + 0.4 * cos(playerAngle)));
		var pZ = round(fractionToTiles(0.5 + 0.4 * sin(playerAngle)));
		var expX = round(fractionToTiles(0.5 + expDist * cos(mapSettings.startAngle + (i + 0.75) * TWO_PI / mapSettings.numPlayers)));
		var expZ = round(fractionToTiles(0.5 + expDist * sin(mapSettings.startAngle + (i + 0.75) * TWO_PI / mapSettings.numPlayers)));
		var rearX = round(fractionToTiles(0.5 + 0.47 * cos(playerAngle)));
		var rearZ = round(fractionToTiles(0.5 + 0.47 * sin(playerAngle)));
		var prePlayerAngle = mapSettings.startAngle + (i - 0.5) * TWO_PI / mapSettings.numPlayers;
		var preX = round(fractionToTiles(0.5 + nRoad * cos(prePlayerAngle)));
		var preZ = round(fractionToTiles(0.5 + nRoad * sin(prePlayerAngle)));
		var nextPlayerAngle = mapSettings.startAngle + (i + 0.5) * TWO_PI / mapSettings.numPlayers;
		var nextX = round(fractionToTiles(0.5 + nRoad * cos(nextPlayerAngle)));
		var nextZ = round(fractionToTiles(0.5 + nRoad * sin(nextPlayerAngle)));

		// create path to expansion
		var placer = new PathPlacer(pX, pZ, expX, expZ, scaleByMapSize(12, 12), 0.7, 0.5, 0.1, -1);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, middle, road], [3, 4]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create path to neighbor
		var placer = new PathPlacer(rearX, rearZ, nextX, nextZ, scaleByMapSize(19, 19), 0.4, 0.5, 0.1, -0.6);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, middle, road], [3, 6]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create path to neighbor
		var placer = new PathPlacer(rearX, rearZ, preX, preZ, scaleByMapSize(19, 19), 0.4, 0.5, 0.1, -0.6);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, middle, road], [3, 6]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 10, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.step)]);

		// create the den
		var placer = new ClumpPlacer(mapSettings.mapArea * 0.03, 0.9, 0.3, 1, pX, pZ);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, base], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 22, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.valley)]);

		// create the expansion
		var placer = new ClumpPlacer(expSize, 0.9, 0.3, 1, expX, expZ);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, base], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 22, 3);
		var area = createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.settlement)], [avoidClasses(tc.settlement, 2)]);
		var unpainter = new TileClassUnPainter(new TileClass(mapSettings.mapSize, tc.mountain));
		unpainter.paint(area);
	}

	// create the neighbor expansions
	for (var i = 0; i < mapSettings.numPlayers; ++i)
	{
		var nextPlayerAngle = mapSettings.startAngle + (i + 0.5) * TWO_PI / mapSettings.numPlayers;
		var nextX = round(fractionToTiles(0.5 + nExp * cos(nextPlayerAngle)));
		var nextZ = round(fractionToTiles(0.5 + nExp * sin(nextPlayerAngle)));

		// create the neightbor expansion
		var placer = new ClumpPlacer(expSize, 0.9, 0.3, 1, nextX, nextZ);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, lower], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 0, 3);
		var area = createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.settlement)]);
	}
}
