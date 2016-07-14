RMS.LoadLibrary("rmgen");
RMS.LoadLibrary("rmgen2");

InitMap();

randomizeBiome();
initMapSettings();
initTileClasses();
var mapSize = getMapSize();

RMS.SetProgress(10);

// Pick a random elevation
var randElevation = randInt(4);

resetTerrain(g_Terrains.mainTerrain, g_TileClasses.land, randElevation);
RMS.SetProgress(20);

addBases("radial");
RMS.SetProgress(40);

var features = [
	{
		"func": addBluffs,
		"avoid": [
			g_TileClasses.bluff, 20,
			g_TileClasses.hill, 10,
			g_TileClasses.mountain, 20,
			g_TileClasses.plateau, 15,
			g_TileClasses.player, 35,
			g_TileClasses.valley, 5,
			g_TileClasses.water, 7
		],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	},
	{
		"func": addLakes,
		"avoid": [
			g_TileClasses.bluff, 7,
			g_TileClasses.hill, 2,
			g_TileClasses.mountain, 15,
			g_TileClasses.plateau, 10,
			g_TileClasses.player, 40,
			g_TileClasses.valley, 10,
			g_TileClasses.water, 25
		],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["tons"]
	}
];

addElements(shuffleArray(features));
RMS.SetProgress(50);
var count = 1;

for (var x = 0; x < mapSize/2; ++x)
{
	for (var y = mapSize/2; y < mapSize; ++y)
	{
		setHeight(x, y, getHeight(x, mapSize/2 - count));

		if(g_Map.validT(x, mapSize/2 - count))
		{
			var texture = getTerrainTexture(x, mapSize/2 - count);
			if (texture == g_Terrains.roadWild || texture == g_Terrains.road)
				texture = g_Terrains.mainTerrain;

			placeTerrain(x, y, texture);
		}
		count++;
	}
	count = 1;
}

count = 1;
for (var x = mapSize/2; x < mapSize; ++x)
{
	for (var y = 0; y < mapSize; ++y)
	{
		setHeight(x, y, getHeight(mapSize/2 - count, y));

		if(g_Map.validT(mapSize/2 - count, y))
		{
			var texture = getTerrainTexture(mapSize/2 - count, y);
			if (texture == g_Terrains.roadWild || texture == g_Terrains.road)
				texture = g_Terrains.mainTerrain;

			placeTerrain(x, y, texture);
		}
	}
	count++;
}

/*
addElements([
	{
		"func": addLayeredPatches,
		"avoid": [
			g_TileClasses.bluff, 2,
			g_TileClasses.dirt, 5,
			g_TileClasses.forest, 2,
			g_TileClasses.mountain, 2,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 12,
			g_TileClasses.water, 3
		],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"avoid": [
			g_TileClasses.bluff, 2,
			g_TileClasses.forest, 2,
			g_TileClasses.mountain, 2,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 12,
			g_TileClasses.water, 3
		],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
]);
RMS.SetProgress(60);

addElements(shuffleArray([
	{
		"func": addMetal,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 3,
			g_TileClasses.mountain, 2,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 30,
			g_TileClasses.rock, 10,
			g_TileClasses.metal, 20,
			g_TileClasses.water, 3
		],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": g_AllAmounts
	},
	{
		"func": addStone,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 3,
			g_TileClasses.mountain, 2,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 30,
			g_TileClasses.rock, 20,
			g_TileClasses.metal, 10,
			g_TileClasses.water, 3
		],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": g_AllAmounts
	},
	{
		"func": addForests,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 18,
			g_TileClasses.metal, 3,
			g_TileClasses.mountain, 5,
			g_TileClasses.plateau, 5,
			g_TileClasses.player, 20,
			g_TileClasses.rock, 3,
			g_TileClasses.water, 2
		],
		"sizes": g_AllSizes,
		"mixes": g_AllMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
]));
RMS.SetProgress(70);

addElements(shuffleArray([
	{
		"func": addBerries,
		"avoid": [
			g_TileClasses.berries, 30,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 5,
			g_TileClasses.metal, 10,
			g_TileClasses.mountain, 2,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 20,
			g_TileClasses.rock, 10,
			g_TileClasses.water, 3
		],
		"sizes": g_AllSizes,
		"mixes": g_AllMixes,
		"amounts": g_AllAmounts
	},
	{
		"func": addAnimals,
		"avoid": [
			g_TileClasses.animals, 20,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 2,
			g_TileClasses.metal, 2,
			g_TileClasses.mountain, 1,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 20,
			g_TileClasses.rock, 2,
			g_TileClasses.water, 3
		],
		"sizes": g_AllSizes,
		"mixes": g_AllMixes,
		"amounts": g_AllAmounts
	},
	{
		"func": addStragglerTrees,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 7,
			g_TileClasses.metal, 2,
			g_TileClasses.mountain, 1,
			g_TileClasses.plateau, 2,
			g_TileClasses.player, 12,
			g_TileClasses.rock, 2,
			g_TileClasses.water, 5
		],
		"sizes": g_AllSizes,
		"mixes": g_AllMixes,
		"amounts": g_AllAmounts
	}
]));
*/
RMS.SetProgress(90);

ExportMap();
