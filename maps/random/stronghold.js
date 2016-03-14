RMS.LoadLibrary("rmgen");
InitMap();

initTerrain(g_Terrains.mainTerrain, tc.land, 30);
RMS.SetProgress(20);

var pos = getStartingPositions();
var players = addBases("stronghold", pos.distance, pos.separation);
RMS.SetProgress(30);

addElements(randArray([
	{
		"func": addBluffs,
		"tile": "tc.bluff",
		"avoid": [tc.bluff, 20, tc.hill, 5, tc.mountain, 20, tc.player, 30, tc.valley, 5, tc.water, 7],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.valley, 2, tc.water, 2],
		"sizes": ["normal", "big"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 20, tc.valley, 10, tc.water, 15],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 40, tc.valley, 10, tc.water, 15],
		"sizes": ["big", "huge"],
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addValleys,
		"tile": "tc.valley",
		"avoid": [tc.bluff, 5, tc.hill, 5, tc.mountain, 25, tc.player, 40, tc.valley, 15, tc.water, 10],
		"sizes": ["normal", "big"],
		"mixes": allMixes,
		"amounts": allAmounts
	}
]));
RMS.SetProgress(60);

addElements([
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.valley, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
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
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 10, tc.metal, 20, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 20, tc.metal, 10, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.water, 2],
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
		"avoid": [tc.berries, 30, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
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
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();
