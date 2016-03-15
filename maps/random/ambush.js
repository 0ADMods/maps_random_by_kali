RMS.LoadLibrary("rmgen");
InitMap();

randomizeBiome();
mapSettings = getMapSettings();
g_TileClasses = constTileClasses();

initTerrain(g_Terrains.mainTerrain, g_TileClasses.land, 2);
RMS.SetProgress(10);

var pos = getStartingPositions();
var players = addBases(pos.setup, pos.distance, pos.separation);
RMS.SetProgress(20);

addElements([
	{
		"func": addBluffs,
		"tile": "g_TileClasses.bluff",
		"avoid": [g_TileClasses.bluff, 12, g_TileClasses.hill, 5, g_TileClasses.player, 35],
		"sizes": ["normal", "big", "huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 15, g_TileClasses.player, 20],
		"sizes": ["normal", "big"],
		"mixes": ["normal"],
		"amounts": ["tons"]
	}
]);
RMS.SetProgress(30);

addElements([
	{
		"func": addLayeredPatches,
		"tile": "g_TileClasses.dirt",
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "g_TileClasses.dirt",
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
]);
RMS.SetProgress(50);

addElements(shuffleArray([
	{
		"func": addMetal,
		"tile": "g_TileClasses.metal",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 10, g_TileClasses.metal, 20, g_TileClasses.water, 3],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addStone,
		"tile": "g_TileClasses.stone",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 20, g_TileClasses.metal, 10, g_TileClasses.water, 3],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addForests,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.forest, 18, g_TileClasses.metal, 3, g_TileClasses.mountain, 5, g_TileClasses.player, 20, g_TileClasses.rock, 3, g_TileClasses.water, 2],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["big", "huge"],
		"mixes": ["normal"],
		"amounts": ["tons"]
	}
]));
RMS.SetProgress(70);

addElements(shuffleArray([
	{
		"func": addBerries,
		"tile": "g_TileClasses.berries",
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.bluff, 5, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.water, 3],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["scarce"]
	},
	{
		"func": addAnimals,
		"tile": "g_TileClasses.animals",
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.bluff, 5, g_TileClasses.forest, 0, g_TileClasses.mountain, 1, g_TileClasses.player, 20, g_TileClasses.water, 3],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["scarce"]
	},
	{
		"func": addStragglerTrees,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 1, g_TileClasses.mountain, 1, g_TileClasses.player, 12, g_TileClasses.rock, 1, g_TileClasses.water, 5],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["many"]
	},
	{
		"func": addBerries,
		"tile": "g_TileClasses.berries",
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.water, 3],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addAnimals,
		"tile": "g_TileClasses.animals",
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.forest, 0, g_TileClasses.mountain, 1, g_TileClasses.player, 20, g_TileClasses.water, 3],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addStragglerTrees,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 1, g_TileClasses.mountain, 1, g_TileClasses.player, 12, g_TileClasses.rock, 1, g_TileClasses.water, 5],
		"stay": [g_TileClasses.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();