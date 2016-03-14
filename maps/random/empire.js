RMS.LoadLibrary("rmgen");
InitMap();

var randElevation = randInt(5);
initTerrain(g_Terrains.mainTerrain, tc.land, randElevation);

var players = addBases("stronghold", 0.37, 0.04);

// change the starting angle and add the players again
var rotation = PI;

if (mapSettings.teams.length == 2)
	rotation = PI / 2;

if (mapSettings.teams.length == 4)
	rotation = PI + PI / 4;

mapSettings.startAngle = mapSettings.startAngle + rotation;

players = addBases("stronghold", 0.15, 0.04);
RMS.SetProgress(40);

var terrain = randArray([
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.valley, 2, tc.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["tons"]
	},
	{
		"func": addMountains,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 20, tc.valley, 10, tc.water, 15],
		"sizes": ["huge"],
		"mixes": ["same", "similar"],
		"amounts": ["tons"]
	},
	{
		"func": addPlateaus,
		"tile": "tc.mountain",
		"avoid": [tc.bluff, 20, tc.mountain, 25, tc.player, 40, tc.valley, 10, tc.water, 15],
		"sizes": ["huge"],
		"mixes": ["same", "similar"],
		"amounts": ["tons"]
	}
]);

var decoration = [
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
];

// add decorative elements to the end of the terrain rendering
addElements(terrain.concat(decoration));
RMS.SetProgress(60);

var primaryRes = randArray([
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
]);

var secondaryRes = randArray([
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
]);

addElements(primaryRes.concat(secondaryRes));
RMS.SetProgress(90);
ExportMap();
