RMS.LoadLibrary("rmgen");
RMS.LoadLibrary("rmgen2");

InitMap();

randomizeBiome([6]);
initMapSettings();
initTileClasses();
var mapSize = getMapSize();

// Get the a single player's slice of the map in radians
var playerRadians = 2 * PI / g_MapInfo.numPlayers;

// If there is an odd number we halve the slice so we stay symmetrical
if (g_MapInfo.teams.length % 2 != 0)
	playerRadians = playerRadians / 2;

g_MapInfo.startAngle = playerRadians / 2;

RMS.SetProgress(10);

// Pick a random elevation
var randElevation = randInt(4);

resetTerrain(g_Terrains.mainTerrain, g_TileClasses.land, randElevation);
RMS.SetProgress(20);

// Find the starting locations
let playerDist = (randInt(0,10) + 30) / 100;
var players = getRadial(randomizePlayers(), playerDist)
for (let p = 0; p < players.length; ++p)
{
	var fx = fractionToTiles(players[p].x);
	var fz = fractionToTiles(players[p].z);
	var ix = round(fx);
	var iz = round(fz);
	addToClass(ix, iz, g_TileClasses.player);
	addToClass(ix + 5, iz, g_TileClasses.player);
	addToClass(ix, iz + 5, g_TileClasses.player);
	addToClass(ix - 5, iz, g_TileClasses.player);
	addToClass(ix, iz - 5, g_TileClasses.player);
}

RMS.SetProgress(40);

addElements(shuffleArray([
	{
		"func": addBluffs,
		"avoid": [
			g_TileClasses.bluff, 10,
			g_TileClasses.hill, 10,
			g_TileClasses.mountain, 10,
			g_TileClasses.plateau, 10,
			g_TileClasses.player, 30,
			g_TileClasses.valley, 10,
			g_TileClasses.water, 10
		],
		"sizes": ["small"],
		"mixes": ["similar"],
		"amounts": ["few"]
	},
	{
		"func": addMountains,
		"avoid": [
			g_TileClasses.bluff, 10,
			g_TileClasses.hill, 10,
			g_TileClasses.mountain, 10,
			g_TileClasses.plateau, 10,
			g_TileClasses.player, 30,
			g_TileClasses.valley, 10,
			g_TileClasses.water, 10
		],
		"sizes": ["small"],
		"mixes": ["similar"],
		"amounts": ["few"]
	},
	{
		"func": addPlateaus,
		"avoid": [
			g_TileClasses.bluff, 10,
			g_TileClasses.hill, 10,
			g_TileClasses.mountain, 10,
			g_TileClasses.plateau, 10,
			g_TileClasses.player, 30,
			g_TileClasses.valley, 10,
			g_TileClasses.water, 10
		],
		"sizes": ["small"],
		"mixes": ["similar"],
		"amounts": ["few"]
	},
	{
		"func": addLakes,
		"avoid": [
			g_TileClasses.bluff, 10,
			g_TileClasses.hill, 10,
			g_TileClasses.mountain, 10,
			g_TileClasses.plateau, 10,
			g_TileClasses.player, 30,
			g_TileClasses.valley, 10,
			g_TileClasses.water, 10
		],
		"sizes": ["small"],
		"mixes": ["similar"],
		"amounts": ["few"]
	}
]));

RMS.SetProgress(50);

addElements(shuffleArray([
	{
		"func": addForests,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 6,
			g_TileClasses.metal, 3,
			g_TileClasses.mountain, 5,
			g_TileClasses.plateau, 5,
			g_TileClasses.player, 20,
			g_TileClasses.rock, 3,
			g_TileClasses.water, 2
		],
		"sizes": ["big"],
		"mixes": ["similar"],
		"amounts": ["normal"]
	},
	{
		"func": addStragglerTrees,
		"avoid": [
			g_TileClasses.berries, 5,
			g_TileClasses.bluff, 5,
			g_TileClasses.forest, 5,
			g_TileClasses.metal, 3,
			g_TileClasses.mountain, 5,
			g_TileClasses.plateau, 5,
			g_TileClasses.player, 20,
			g_TileClasses.rock, 3,
			g_TileClasses.water, 2
		],
		"sizes": ["big"],
		"mixes": ["similar"],
		"amounts": ["normal"]
	},
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
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["normal", "many"]
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
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["many"]
	},
	{
		"func": addFish,
		"avoid": [
			g_TileClasses.fish, 12,
			g_TileClasses.player, 8
		],
		"stay": [g_TileClasses.water, 4],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": ["many"]
	},
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
		"amounts": ["tons"]
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
		"amounts": ["tons"]
	}
]));
RMS.SetProgress(60);

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
RMS.SetProgress(70);

// Find all entities placed on the map
var templateObjects = {};
var newObjects = g_Map.objects;
for (let o = 0; o < g_Map.objects.length; ++o)
{
	let tileX = Math.round(g_Map.objects[o].position.x / 4);
	let tileZ = Math.round(g_Map.objects[o].position.z / 4);
	let radians = Math.atan2(tileZ - g_MapInfo.centerOfMap, tileX - g_MapInfo.centerOfMap)

	// If an entity is in the reference player's slice, save it
	if (radians >= 0 && radians <= playerRadians)
		templateObjects[tileX + "," + tileZ] = g_Map.objects[o];
}

// Clear the map of entities
g_Map.objects = [];

// Add all the entities in the reference player's slice to the map
for (let key in templateObjects) {
  if (templateObjects.hasOwnProperty(key)) {
    g_Map.addObject(new Entity(templateObjects[key].templateName, templateObjects[key].player, Math.floor(templateObjects[key].position.x/4), Math.floor(templateObjects[key].position.z/4), templateObjects[key].rotation.y));
  }
}

// Cycle through each tile
for (let x = 0; x < mapSize; ++x)
	for (let z = 0; z < mapSize; ++z)
	{
		if(g_Map.validH(x, z))
		{
			// Find the angle in radians from the current point to the center of the map
			// TODO: see if g_MapInfo.centerOfMap - 0.5 helps center things
			let radians = Math.atan2(z - g_MapInfo.centerOfMap, x - g_MapInfo.centerOfMap)

			// Check if we're outside of the reference player's slice
			if (radians < 0 || radians > playerRadians)
			{
				// If a tree was placed outside the reference slice, remove it
				if (g_Map.terrainObjects[x][z] !== undefined)
					g_Map.terrainObjects[x][z] = undefined

				// determine which direction we're replicating in
				let flips = Math.floor(Math.abs(radians) / playerRadians);
				var relRadians = playerRadians - Math.abs(radians) % playerRadians;
				if (flips % 2 == 0)
					relRadians = Math.abs(radians) % playerRadians;

				// find the distance from the current tile to the center
				let dist = Math.sqrt(Math.pow((g_MapInfo.centerOfMap - x),2) + Math.pow((g_MapInfo.centerOfMap - z),2))

				// match the distance to a similar angle in the reference slice
				let relX = Math.round(dist * Math.cos(relRadians)) + g_MapInfo.centerOfMap;
				let relZ = Math.round(dist * Math.sin(relRadians)) + g_MapInfo.centerOfMap;
				
				// set the height to that of the height in the reference slice
				if(g_Map.validT(x, z))
					setHeight(x, z, getHeight(relX, relZ));

				// set the terrain texture and trees to that of the reference slice
				// we don't need to copy classes because we're adding objects directly to g_Map
				if(g_Map.validT(x, z, 2))
				{
					let texture = getTerrainTexture(relX, relZ);
					placeTerrain(x, z, texture);

					if (g_Map.terrainObjects[relX][relZ] !== undefined)
						g_Map.addObject(new Entity(g_Map.terrainObjects[relX][relZ].templateName, 0, x, z, 0));
				}

				// if there was an entity (metal, stone, decoration, animal, etc.), replicate it
				let key = relX + "," + relZ;
				if (templateObjects[key] != undefined)
					g_Map.addObject(new Entity(templateObjects[key].templateName, templateObjects[key].player, x, z, templateObjects[key].rotation.y));
			}
		}
	}

// Place the players
addBases("radial", playerDist);

RMS.SetProgress(90);

ExportMap();
