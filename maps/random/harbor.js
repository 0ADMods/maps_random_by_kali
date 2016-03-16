RMS.LoadLibrary("rmgen");

InitMap();

randomizeBiome();
mapSettings = getMapSettings();
g_TileClasses = createTileClasses();

initTerrain(g_Terrains.mainTerrain, g_TileClasses.land, 2);
var players = addBases("radial", 0.38);
RMS.SetProgress(20);

addLake();

if (mapSettings.mapSize >= 192)
	addHarbors(players);

addSpines();
RMS.SetProgress(40);

addElements(shuffleArray([
	{
		"func": addHills,
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 15, g_TileClasses.mountain, 2, g_TileClasses.plateau, 5, g_TileClasses.player, 20, g_TileClasses.spine, 5, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"sizes": ["tiny", "small"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 20, g_TileClasses.player, 20, g_TileClasses.spine, 20, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["small"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 20, g_TileClasses.player, 40, g_TileClasses.spine, 20, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["small"],
		"mixes": allMixes,
		"amounts": allAmounts
	}
]));
RMS.SetProgress(60);

addElements([
	{
		"func": addLayeredPatches,
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.spine, 5, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.spine, 5, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
]);
RMS.SetProgress(70);

addElements(shuffleArray([
	{
		"func": addBerries,
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.bluff, 5, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.spine, 2, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.bluff, 5, g_TileClasses.forest, 2, g_TileClasses.metal, 2, g_TileClasses.mountain, 1, g_TileClasses.plateau, 2, g_TileClasses.player, 20, g_TileClasses.rock, 2, g_TileClasses.spine, 2, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 2, g_TileClasses.mountain, 1, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.rock, 2, g_TileClasses.spine, 2, g_TileClasses.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}
]));
RMS.SetProgress(80);

addElements(shuffleArray([
	{
		"func": addBerries,
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.bluff, 5, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.spine, 2, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.bluff, 5, g_TileClasses.forest, 0, g_TileClasses.mountain, 1, g_TileClasses.player, 20, g_TileClasses.spine, 2, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 1, g_TileClasses.mountain, 1, g_TileClasses.player, 12, g_TileClasses.rock, 1, g_TileClasses.spine, 2, g_TileClasses.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();

function addLake()
{
	var lSize = sqrt(sqrt(sqrt(scaleByMapSize(1, 6))));

	var placer = new ChainPlacer(2, floor(scaleByMapSize(2, 12)), floor(scaleByMapSize(35, 160)), 1, mapSettings.centerOfMap, mapSettings.centerOfMap, 0, [floor(mapSettings.mapSize * 0.17 * lSize)]);
	var terrainPainter = new LayeredPainter([g_Terrains.shore, g_Terrains.water, g_Terrains.water], [1, 100]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, -18, 10);

	createArea(placer, [terrainPainter, elevationPainter, paintClass(g_TileClasses.water)], avoidClasses(g_TileClasses.player, 20));

	var fDist = 50;
	if (mapSettings.mapSize <= 192)
		fDist = 20;

	// create a bunch of fish
	var group = new SimpleGroup([new SimpleObject(g_Gaia.fish, 20, 30, 0, fDist)], true, g_TileClasses.baseResource, mapSettings.centerOfMap, mapSettings.centerOfMap);
	createObjectGroup(group, 0, [avoidClasses(g_TileClasses.player, 5, g_TileClasses.hill, 3, g_TileClasses.mountain, 3), stayClasses(g_TileClasses.water, 5)]);
}

function addHarbors(players)
{
	for (var i = 0; i < players.length; ++i)
	{
		var ix = round(fractionToTiles(players[i].x));
		var iz = round(fractionToTiles(players[i].z));
		var playerDistX = mapSettings.centerOfMap - ix;
		var playerDistZ = mapSettings.centerOfMap - iz;
		var offsetX = round(playerDistX / 2.5);
		var offsetZ = round(playerDistZ / 2.5);

		var placer = new ClumpPlacer(scaleByMapSize(1200, 1200), 0.5, 0.5, 1, ix + offsetX, iz + offsetZ)
		var terrainPainter = new LayeredPainter([g_Terrains.shore, g_Terrains.water],	[2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, -11, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(g_TileClasses.water)], avoidClasses(g_TileClasses.player, 15, g_TileClasses.hill, 1));

		// create fish in harbor
		var group = new SimpleGroup(
			[new SimpleObject(g_Gaia.fish, 6, 6, 1, 20)],
			true, g_TileClasses.baseResource, ix + offsetX, iz + offsetZ
		);
		createObjectGroup(group, 0, [avoidClasses(g_TileClasses.hill, 3, g_TileClasses.mountain, 3), stayClasses(g_TileClasses.water, 5)]);
	}
}

function addSpines()
{
	var spineTile = g_Terrains.dirt;
	var elevation = 35;

	if (mapSettings.biome == 2)
		spineTile = g_Terrains.tier1Terrain;

	if (mapSettings.biome == 4 || mapSettings.biome == 6)
		spineTile = g_Terrains.tier2Terrain;

	if (mapSettings.biome == 8)
		spineTile = g_Terrains.tier4Terrain;

	var split = 1;
	if (mapSettings.numPlayers <= 3 || (mapSettings.mapSize >= 320 && mapSettings.numPlayers <= 4))
		split = 2;

	for (var i = 0; i < mapSettings.numPlayers * split; ++i)
	{
		var tang = mapSettings.startAngle + (i + 0.5) * TWO_PI / (mapSettings.numPlayers * split);

		var fx = fractionToTiles(0.5);
		var fz = fractionToTiles(0.5);
		var ix = round(fx);
		var iz = round(fz);

		var mStartCo = 0.12
		var mStopCo = 0.40
		var mSize = 0.5;
		var mWaviness = 0.6;
		var mOffset = 0.4;
		var mTaper = -1.4;

		// make small mountain dividers if we're on a small map
		if (mapSettings.mapSize <= 192)
		{
			mSize = 0.02;
			mTaper = -0.1;
			elevation = 20;
		}

		var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(14, mSize), mWaviness, 0.1, mOffset, mTaper);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, spineTile], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, elevation, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(g_TileClasses.spine)], avoidClasses(g_TileClasses.player, 5));
	}

	addElements([
		{
			"func": addDecoration,
			"avoid": [g_TileClasses.bluff, 2, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
			"stay": [g_TileClasses.spine, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	]);

	addElements([
		{
			"func": addProps,
			"avoid": [g_TileClasses.forest, 2, g_TileClasses.player, 2, g_TileClasses.prop, 20, g_TileClasses.water, 3],
			"stay": [g_TileClasses.spine, 8],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["scarce"]
		}
	]);
}
