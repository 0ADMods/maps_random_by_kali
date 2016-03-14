RMS.LoadLibrary("rmgen");

log("Initializing map...");
InitMap();

initTerrain(g_Terrains.mainTerrain, tc.land, 2);
var players = addBases("radial", 0.38);
RMS.SetProgress(20);

addLake();

if(mapSettings.mapSize >= 192)
	addHarbors(players);

addSpines();
RMS.SetProgress(40);

addElements(randArray([
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.spine, 5, tc.valley, 2, tc.water, 2],
		"sizes": ["tiny", "small"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 20, tc.spine, 20, tc.valley, 10, tc.water, 15],
		"sizes": ["small"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 40, tc.spine, 20, tc.valley, 10, tc.water, 15],
		"sizes": ["small"],
		"mixes": allMixes,
		"amounts": allAmounts
	}
]));
RMS.SetProgress(60);

addElements([
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
]);
RMS.SetProgress(70);

addElements(randArray([
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 10, tc.metal, 20, tc.spine, 2, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 20, tc.metal, 10, tc.spine, 2, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.spine, 2, tc.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
]));
RMS.SetProgress(80);

addElements(randArray([
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.spine, 2, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.bluff, 5, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.spine, 2, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.spine, 2, tc.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();

// add the center lake
function addLake() {
	var lSize = sqrt(sqrt(sqrt(scaleByMapSize(1, 6))));

	var placer = new ChainPlacer(2, floor(scaleByMapSize(2, 12)), floor(scaleByMapSize(35, 160)), 1, mapSettings.centerOfMap, mapSettings.centerOfMap, 0, [floor(mapSettings.mapSize * 0.17 * lSize)]);
	var terrainPainter = new LayeredPainter([g_Terrains.shore, g_Terrains.water, g_Terrains.water], [1, 100]);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, -18, 10);

	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], avoidClasses(tc.player, 20));

	var fDist = 50;
	if(mapSettings.mapSize <= 192) {
		fDist = 20;
	}

	// create a bunch of fish
	var group = new SimpleGroup([new SimpleObject(g_Gaia.fish, 20, 30, 0, fDist)], true, tc.baseResource, mapSettings.centerOfMap, mapSettings.centerOfMap);
	createObjectGroup(group, 0, [avoidClasses(tc.player, 5, tc.hill, 3, tc.mountain, 3), stayClasses(tc.water, 5)]);
}

// add player harbors
function addHarbors(players) {
	for(var i = 0; i < players.length; ++i) {
		// create player harbors
		var ix = round(fractionToTiles(players[i].x));
		var iz = round(fractionToTiles(players[i].z));
		var playerDistX = mapSettings.centerOfMap - ix;
		var playerDistZ = mapSettings.centerOfMap - iz;
		var offsetX = round(playerDistX / 2.5);
		var offsetZ = round(playerDistZ / 2.5);

		var placer = new ClumpPlacer(scaleByMapSize(1200, 1200), 0.5, 0.5, 1, ix + offsetX, iz + offsetZ)
		var terrainPainter = new LayeredPainter([g_Terrains.shore, g_Terrains.water],	[2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, -11, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.water)], avoidClasses(tc.player, 15, tc.hill, 1));

		// create fish in harbor
		var group = new SimpleGroup(
			[new SimpleObject(g_Gaia.fish, 6, 6, 1, 20)],
			true, tc.baseResource, ix + offsetX, iz + offsetZ
		);
		createObjectGroup(group, 0, [avoidClasses(tc.hill, 3, tc.mountain, 3), stayClasses(tc.water, 5)]);
	}
}

// add mountain spines
function addSpines() {
	var spineTile = g_Terrains.dirt;
	var elevation = 35;

	if (mapSettings.biome == 2)
		spineTile = g_Terrains.tier1Terrain;

	if (mapSettings.biome == 4 || mapSettings.biome == 6)
		spineTile = g_Terrains.tier2Terrain;

	if (mapSettings.biome == 8)
		spineTile = g_Terrains.tier4Terrain;

	var split = 1;
	if(mapSettings.numPlayers <= 3 || (mapSettings.mapSize >= 320 && mapSettings.numPlayers <= 4)) {
		split = 2;
	}

	for (var i = 0; i < mapSettings.numPlayers * split; ++i) {
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
		if(mapSettings.mapSize <= 192) {
			mSize = 0.02;
			mTaper = -0.1;
			elevation = 20;
		}

		var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(14, mSize), mWaviness, 0.1, mOffset, mTaper);
		var terrainPainter = new LayeredPainter([g_Terrains.cliff, spineTile], [3]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_MODIFY, elevation, 3);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.spine)], avoidClasses(tc.player, 5));
	}

	// decorative elements
	var decoration = [
		{
			"func": addDecoration,
			"tile": "tc.dirt",
			"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
			"stay": [tc.spine, 5],
			"sizes": ["normal"],
			"mixes": ["normal"],
			"amounts": ["normal"]
		}
	];
	addElements(decoration);
}
