RMS.LoadLibrary("rmgen");

InitMap();

initTerrain(g_Terrains.mainTerrain, tc.land, 2);
RMS.SetProgress(10);

var pos = getStartingPositions();
var players = addBases(pos.setup, pos.distance, pos.separation);
RMS.SetProgress(20);

addElements([
	{
		"func": addBluffs,
		"tile": "tc.bluff",
		"avoid": [tc.bluff, 12, tc.hill, 5, tc.player, 35],
		"sizes": ["normal", "big", "huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.player, 20],
		"sizes": ["normal", "big"],
		"mixes": ["normal"],
		"amounts": ["tons"]
	}
]);
RMS.SetProgress(30);

addElements([
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
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
RMS.SetProgress(50);

addElements(randArray([
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 10, tc.metal, 20, tc.water, 3],
		"stay": [tc.bluff, 5],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 20, tc.metal, 10, tc.water, 3],
		"stay": [tc.bluff, 5],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.water, 2],
		"stay": [tc.bluff, 5],
		"sizes": ["big", "huge"],
		"mixes": ["normal"],
		"amounts": ["tons"]
	}
]));
RMS.SetProgress(70);

addElements(randArray([
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["scarce"]
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.bluff, 5, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.water, 3],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["scarce"]
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5],
		"sizes": ["tiny"],
		"mixes": ["same"],
		"amounts": ["many"]
	},
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.water, 3],
		"stay": [tc.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.water, 3],
		"stay": [tc.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.water, 5],
		"stay": [tc.bluff, 5],
		"sizes": ["huge"],
		"mixes": ["same"],
		"amounts": ["tons"]
	}
]));
RMS.SetProgress(90);

ExportMap();