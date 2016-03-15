RMS.LoadLibrary("rmgen");
InitMap();

randomizeBiome();
mapSettings = getMapSettings();
g_TileClasses = constTileClasses();

initTerrain(g_Terrains.mainTerrain, g_TileClasses.land, 30);
RMS.SetProgress(20);

var pos = getStartingPositions();
var players = addBases("stronghold", pos.distance, pos.separation);
RMS.SetProgress(30);

addElements(shuffleArray([
	{
		"func": addBluffs,
		"tile": "g_TileClasses.bluff",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.hill, 5, g_TileClasses.mountain, 20, g_TileClasses.player, 30, g_TileClasses.valley, 5, g_TileClasses.water, 7],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 15, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"sizes": ["normal", "big"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.player, 20, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.player, 40, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addValleys,
		"tile": "g_TileClasses.valley",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 5, g_TileClasses.mountain, 25, g_TileClasses.player, 40, g_TileClasses.valley, 15, g_TileClasses.water, 10],
		"sizes": ["normal", "big"],
		"mixes": allMixes,
		"amounts": allAmounts
	}
]));
RMS.SetProgress(60);

addElements([
	{
		"func": addLayeredPatches,
		"tile": "g_TileClasses.dirt",
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.player, 12, g_TileClasses.valley, 5, g_TileClasses.water, 3],
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
RMS.SetProgress(70);

addElements(shuffleArray([
	{
		"func": addMetal,
		"tile": "g_TileClasses.metal",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 10, g_TileClasses.metal, 20, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "g_TileClasses.stone",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 20, g_TileClasses.metal, 10, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 18, g_TileClasses.metal, 3, g_TileClasses.mountain, 5, g_TileClasses.player, 20, g_TileClasses.rock, 3, g_TileClasses.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
]));
RMS.SetProgress(80);

addElements(shuffleArray([
	{
		"func": addBerries,
		"tile": "g_TileClasses.berries",
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.bluff, 5, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"tile": "g_TileClasses.animals",
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.bluff, 5, g_TileClasses.forest, 0, g_TileClasses.mountain, 1, g_TileClasses.player, 20, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 1, g_TileClasses.mountain, 1, g_TileClasses.player, 12, g_TileClasses.rock, 1, g_TileClasses.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();
