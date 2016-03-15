RMS.LoadLibrary("rmgen");
InitMap();

randomizeBiome();
mapSettings = getMapSettings();
g_TileClasses = constTileClasses();

// pick a random elevation with a bias towards lower elevations
var randElevation = randInt(30);
if (randElevation < 25)
	randElevation = 1 + randInt(4);

initTerrain(g_Terrains.mainTerrain, g_TileClasses.land, randElevation);
RMS.SetProgress(20);

var pos = getStartingPositions();
addBases(pos.setup, pos.distance, pos.separation);
RMS.SetProgress(40);

var features = [
	{
		"func": addBluffs,
		"tile": "g_TileClasses.bluff",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.hill, 10, g_TileClasses.mountain, 20, g_TileClasses.plateau, 15, g_TileClasses.player, 30, g_TileClasses.valley, 5, g_TileClasses.water, 7],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addHills,
		"tile": "g_TileClasses.hill",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 15, g_TileClasses.mountain, 2, g_TileClasses.plateau, 15, g_TileClasses.player, 20, g_TileClasses.valley, 2, g_TileClasses.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addMountains,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 15, g_TileClasses.player, 20, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addPlateaus,
		"tile": "g_TileClasses.mountain",
		"avoid": [g_TileClasses.bluff, 20, g_TileClasses.mountain, 25, g_TileClasses.plateau, 25, g_TileClasses.plateau, 25, g_TileClasses.player, 40, g_TileClasses.valley, 10, g_TileClasses.water, 15],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}
];

var valleys = [
	{
		"func": addValleys,
		"tile": "g_TileClasses.valley",
		"avoid": [g_TileClasses.bluff, 5, g_TileClasses.hill, 5, g_TileClasses.mountain, 25, g_TileClasses.plateau, 20, g_TileClasses.player, 40, g_TileClasses.valley, 15, g_TileClasses.water, 10],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}
];

var lakes = [
	{
		"func": addLakes,
		"tile": "g_TileClasses.water",
		"avoid": [g_TileClasses.bluff, 7, g_TileClasses.hill, 2, g_TileClasses.mountain, 15, g_TileClasses.plateau, 10, g_TileClasses.player, 20, g_TileClasses.valley, 10, g_TileClasses.water, 25],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	}
];

if (randElevation < 4)
	features = features.concat(lakes);

if (randElevation > 20)
	features = features.concat(valleys);

addElements(shuffleArray(features));
RMS.SetProgress(50);

addElements([
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
]);
RMS.SetProgress(60);

addElements(shuffleArray([
	{
		"func": addMetal,
		"tile": "g_TileClasses.metal",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 30, g_TileClasses.rock, 10, g_TileClasses.metal, 20, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "g_TileClasses.stone",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 3, g_TileClasses.mountain, 2, g_TileClasses.plateau, 2, g_TileClasses.player, 30, g_TileClasses.rock, 20, g_TileClasses.metal, 10, g_TileClasses.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "g_TileClasses.forest",
		"avoid": [g_TileClasses.berries, 5, g_TileClasses.bluff, 5, g_TileClasses.forest, 18, g_TileClasses.metal, 3, g_TileClasses.mountain, 5, g_TileClasses.plateau, 5, g_TileClasses.player, 20, g_TileClasses.rock, 3, g_TileClasses.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
]));
RMS.SetProgress(70);

addElements(shuffleArray([
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
]));
RMS.SetProgress(90);

ExportMap();
