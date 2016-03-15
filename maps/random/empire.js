RMS.LoadLibrary("rmgen");
InitMap();

randomizeBiome();
mapSettings = getMapSettings();
g_TileClasses = constTileClasses();

var randElevation = randInt(5);
initTerrain(g_Terrains.mainTerrain, g_TileClasses.land, randElevation);

addBases("stronghold", 0.37, 0.04);

// change the starting angle and add the players again
var rotation = PI;

if (mapSettings.teams.length == 2)
	rotation = PI / 2;

if (mapSettings.teams.length == 4)
	rotation = PI + PI / 4;

mapSettings.startAngle = mapSettings.startAngle + rotation;

addBases("stronghold", 0.15, 0.04);
RMS.SetProgress(40);

var terrain = shuffleArray([
	{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 15, g_TileClasses.mountain, 2, g_TileClasses.plateau, 5, g_TileClasses.player, 20, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["tons"]
	},
	{
		"func": addMountains,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 20, g_TileClasses.player, 20, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["huge"],
		"mixes": ["same", "similar"],
		"amounts": ["tons"]
	},
	{
		"func": addPlateaus,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 20, g_TileClasses.player, 40, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": ["huge"],
		"mixes": ["same", "similar"],
		"amounts": ["tons"]
	}
]);

var decoration = [
	{
		"func": addLayeredPatches,
		"tile": "g_TileClasses.dirt",
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.dirt, 5, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "g_TileClasses.dirt",
		"avoid": [g_TileClasses.bluff, 2, g_TileClasses.forest, 2, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
];

// add decorative elements to the end of the terrain rendering
addElements(terrain.concat(decoration));
RMS.SetProgress(60);

var primaryRes = shuffleArray([
	{
		"func": addMetal,
		"tile": "g_TileClasses.metal",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 10, g_TileClasses.metal, 20, g_TileClasses.plateau, 2, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "g_TileClasses.stone",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.player, 30, g_TileClasses.rock, 20, g_TileClasses.metal, 10, g_TileClasses.plateau, 2, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 18, g_TileClasses.metal, 3, g_TileClasses.mountain, 5, g_TileClasses.plateau, 2, g_TileClasses.player, 20, g_TileClasses.rock, 3, g_TileClasses.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
]);

var secondaryRes = shuffleArray([
	{
		"func": addBerries,
		"tile": "g_TileClasses.berries",
		"avoid": [g_TileClasses.berries, 30, g_TileClasses.bluff, 5, g_TileClasses.forest, 5, g_TileClasses.metal, 10, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 20, g_TileClasses.rock, 10, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"tile": "g_TileClasses.animals",
		"avoid": [g_TileClasses.animals, 20, g_TileClasses.bluff, 5, g_TileClasses.forest, 2, g_TileClasses.metal, 2, g_TileClasses.mountain, 1, g_TileClasses.plateau, 2, g_TileClasses.player, 20, g_TileClasses.rock, 2, g_TileClasses.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 7, g_TileClasses.metal, 2, g_TileClasses.mountain, 1, g_TileClasses.plateau, 2, g_TileClasses.player, 12, g_TileClasses.rock, 2, g_TileClasses.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}
]);

addElements(primaryRes.concat(secondaryRes));
RMS.SetProgress(90);
ExportMap();
