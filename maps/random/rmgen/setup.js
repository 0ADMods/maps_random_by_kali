var mapSettings;
var g_Terrains;
var g_Gaia;
var g_Decoratives;
var g_TileClasses;
var g_Forests;
var g_Props;

// adds an array of elements to the map
function addElements(els)
{
	for (var i = 0; i < els.length; ++i)
	{
		var stay = null;
		if (els[i].stay !== undefined)
			stay = els[i].stay;

		els[i].func(
			[avoidClasses.apply(null, els[i].avoid), stayClasses.apply(null, stay)],
			pickSize(els[i].sizes),
			pickMix(els[i].mixes),
			pickAmount(els[i].amounts)
		);
	}
}

// converts "amount" terms to numbers
function pickAmount(amounts)
{
	var amount = randInt(amounts.length);
	switch(amounts[amount])
	{
		case "scarce":
			return 0.2;
		case "few":
			return 0.5;
		case "many":
			return 1.75;
		case "tons":
			return 3;
	}

	return 1;
}

// converts "mix" terms to numbers
function pickMix(mixes)
{
	var mix = randInt(mixes.length);
	switch(mixes[mix])
	{
		case "same":
			return 0;
		case "similar":
			return 0.1;
		case "varied":
			return 0.5;
		case "unique":
			return 0.75;
	}

	return 0.25;
}

// converst "size" terms to numbers
function pickSize(sizes)
{
	var size = randInt(sizes.length);
	switch(sizes[size])
	{
		case "tiny":
			return 0.5;
		case "small":
			return 0.75;
		case "big":
			return 1.25;
		case "huge":
			return 1.5;
	}

	return 1;
}

// paints the entire map with a single tile type
function initTerrain(terrain, tc, elevation)
{
	mapSettings.mapSize = getMapSize();
	mapSettings.mapArea = mapSettings.mapSize * mapSettings.mapSize;
	mapSettings.centerOfMap = floor(mapSettings.mapSize / 2);
	mapSettings.mapRadius = -PI / 4;

	var placer = new ClumpPlacer(mapSettings.mapArea, 1, 1, 1, mapSettings.centerOfMap, mapSettings.centerOfMap);
	var terrainPainter = new LayeredPainter([terrain], []);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, elevation, 1);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc)], null);

	// update the map height
	mapSettings.mapHeight = getHeight(mapSettings.centerOfMap, mapSettings.centerOfMap);
}

// euclidian distance between two points
function euclid_distance(x1, z1, x2, z2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
}

// Function for creating player bases
//
// type: "radial", "stacked", "stronghold", "random"
// distance: radial distance from the center of the map
function addBases(type, distance, groupedDistance)
{
	type = type || "radial";
	distance = distance || 0.3;
	groupedDistance = groupedDistance || 0.05;

	var playerIDs = randomizePlayers();
	var players = {};

	switch(type)
	{
		case "line":
			players = placeLine(playerIDs, distance, groupedDistance);
			break;
		case "radial":
			players = placeRadial(playerIDs, distance);
			break;
		case "random":
			players = placeRandom(playerIDs);
			break;
		case "stronghold":
			players = placeStronghold(playerIDs, distance, groupedDistance);
			break;
	}

	return players;
}

// Function for creating a single player base
//
// player: An object with the player's attributes (id, angle, x, z)
// walls: Iberian walls (true/false)
function createBase(player, walls)
{
	// get the x and z in tiles
	var fx = fractionToTiles(player.x);
	var fz = fractionToTiles(player.z);
	var ix = round(fx);
	var iz = round(fz);
	addToClass(ix, iz, g_TileClasses.player);
	addToClass(ix + 5, iz, g_TileClasses.player);
	addToClass(ix, iz + 5, g_TileClasses.player);
	addToClass(ix - 5, iz, g_TileClasses.player);
	addToClass(ix, iz - 5, g_TileClasses.player);

	// create starting units
	if ((walls || walls === undefined) && mapSettings.mapSize > 192)
		placeCivDefaultEntities(fx, fz, player.id, mapSettings.mapRadius);
	else
		placeCivDefaultEntities(fx, fz, player.id, mapSettings.mapRadius, { 'iberWall': false });

	// create the city patch
	var cityRadius = scaleByMapSize(15, 25) / 3;
	var placer = new ClumpPlacer(PI * cityRadius * cityRadius, 0.6, 0.3, 10, ix, iz);
	var painter = new LayeredPainter([g_Terrains.roadWild, g_Terrains.road], [1]);
	createArea(placer, painter, null);

	// custom base terrain function

	// create animals
	for (var j = 0; j < 2; ++j)
	{
		var aAngle = randFloat(0, TWO_PI);
		var aDist = 7;
		var aX = round(fx + aDist * cos(aAngle));
		var aZ = round(fz + aDist * sin(aAngle));
		var group = new SimpleGroup(
			[new SimpleObject(g_Gaia.chicken, 5, 5, 0, 2)],
			true, g_TileClasses.baseResource, aX, aZ
		);
		createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));
	}

	// create berry bushes
	var bbAngle = randFloat(0, TWO_PI);
	var bbDist = 12;
	var bbX = round(fx + bbDist * cos(bbAngle));
	var bbZ = round(fz + bbDist * sin(bbAngle));
	group = new SimpleGroup(
		[new SimpleObject(g_Gaia.fruitBush, 5, 5, 0, 3)],
		true, g_TileClasses.baseResource, bbX, bbZ
	);
	createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));

	// create metal mine
	var mAngle = bbAngle;
	while(abs(mAngle - bbAngle) < PI / 3)
		mAngle = randFloat(0, TWO_PI);

	var mDist = 12;
	var mX = round(fx + mDist * cos(mAngle));
	var mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g_Gaia.metalLarge, 1, 1, 0, 0)],
		true, g_TileClasses.baseResource, mX, mZ
	);
	createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));

	// create stone mines
	mAngle += randFloat(PI / 8, PI / 4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g_Gaia.stoneLarge, 1, 1, 0, 2)],
		true, g_TileClasses.baseResource, mX, mZ
	);
	createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));

	var hillSize = PI * mapSettings.mapRadius * mapSettings.mapRadius;

	// create starting trees
	var num = 5;
	var tAngle = randFloat(0, TWO_PI);
	var tDist = randFloat(12, 13);
	var tX = round(fx + tDist * cos(tAngle));
	var tZ = round(fz + tDist * sin(tAngle));

	group = new SimpleGroup(
		[new SimpleObject(g_Gaia.tree1, num, num, 0, 3)],
		false, g_TileClasses.baseResource, tX, tZ
	);
	createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));

	// create grass tufts
	var num = hillSize / 250;
	for (var j = 0; j < num; ++j)
	{
		var gAngle = randFloat(0, TWO_PI);
		var gDist = mapSettings.mapRadius - (5 + randInt(7));
		var gX = round(fx + gDist * cos(gAngle));
		var gZ = round(fz + gDist * sin(gAngle));
		group = new SimpleGroup(
			[new SimpleObject(g_Decoratives.grassShort, 2, 5, 0, 1, -PI / 8, PI / 8)],
			false, g_TileClasses.baseResource, gX, gZ
		);
		createObjectGroup(group, 0, avoidClasses(g_TileClasses.baseResource, 2));
	}
}

// generates an array of teams
function getTeams(numPlayers)
{
	var ffaPlayers = 0;
	var numTeams = 0;
	var teams = new Array(9);
	for (var i = 0; i < numPlayers; ++i)
	{
		var team = getPlayerTeam(i) + 1;
		if (team < 1)
		{
			teams[8 - ffaPlayers] = [];
			teams[8 - ffaPlayers].push(i + 1);
			++ffaPlayers;
			++numTeams;
		}
		else
		{
			if (teams[team] == null)
			{
				teams[team] = [];
				++numTeams;
			}
			teams[team].push(i+1);
		}
	}

	// consolidate the array
	var setTeams = [];
	var currentTeam = 0;
	for (var i = 1; i < 9; ++i)
	{
		if (teams[i] !== undefined)
		{
			setTeams[currentTeam] = teams[i];
			++currentTeam;
		}
	}

	return setTeams;
}

// picks a random starting style
function getStartingPositions()
{
	var formats = ["radial"];

	// enable stronghold if we have a few teams and a big enough map
	if (mapSettings.teams.length >= 2 && mapSettings.numPlayers >= 4 && mapSettings.mapSize >= 256)
		formats.push("stronghold");

	// enable random if we have enough teams or enough players on a big enough map
	if (mapSettings.mapSize >= 256 && (mapSettings.teams.length >= 3 || mapSettings.numPlayers > 4))
		formats.push("random");

	// enable line if we have enough teams and players on a big enough map
	if (mapSettings.teams.length >= 2 && mapSettings.numPlayers >= 4 && mapSettings.mapSize >= 384)
		formats.push("line");

	return {
		"setup": formats[randInt(formats.length)],
		"distance": randFloat(0.2, 0.35),
		"separation": randFloat(0.05, 0.1)
	};
}

// randomize player order
function randomizePlayers()
{
	var playerIDs = [];
	for (var i = 0; i < mapSettings.numPlayers; ++i)
		playerIDs.push(i + 1);

	playerIDs = sortPlayers(playerIDs);

	return playerIDs
}

// Function for placing teams in a line pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
function placeLine(playerIDs, distance, groupedDistance)
{
	var players = [];

	for (var i = 0; i < mapSettings.teams.length; ++i)
	{
		var safeDist = distance;
		if (distance + mapSettings.teams[i].length * groupedDistance > 0.45)
			safeDist = 0.45 - mapSettings.teams[i].length * groupedDistance;

		var teamAngle = mapSettings.startAngle + (i + 1) * TWO_PI / mapSettings.teams.length;

		// create player base
		for (var p = 0; p < mapSettings.teams[i].length; ++p)
		{
			players[mapSettings.teams[i][p]] = {
				"id": mapSettings.teams[i][p],
				"angle": mapSettings.startAngle + (p + 1) * TWO_PI / mapSettings.teams[i].length,
				"x": 0.5 + (safeDist + p * groupedDistance) * cos(teamAngle),
				"z": 0.5 + (safeDist + p * groupedDistance) * sin(teamAngle)
			};
			createBase(players[mapSettings.teams[i][p]], false)
		}
	}

	return players;
}

// Function for placing players in a radial pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
function placeRadial(playerIDs, distance)
{
	var players = new Array(mapSettings.numPlayers);

	for (var i = 0; i < mapSettings.numPlayers; ++i)
	{
		var angle = mapSettings.startAngle + i * TWO_PI / mapSettings.numPlayers;
		players[i] = {
			"id": playerIDs[i],
			"angle": angle,
			"x": 0.5 + distance * cos(angle),
			"z": 0.5 + distance * sin(angle)
		};
		createBase(players[i])
	}

	return players;
}

// Function for placing players in a random pattern
//
// playerIDs: array of randomized playerIDs
function placeRandom(playerIDs)
{
	var players = [];
	var placed = [];

	for (var i = 0; i < mapSettings.numPlayers; ++i)
	{
		var attempts = 0;
		var playerAngle = randFloat(0, TWO_PI);
		var distance = randFloat(0, 0.42);
		var x = 0.5 + distance * cos(playerAngle);
		var z = 0.5 + distance * sin(playerAngle);

		var tooClose = false;
		for (var j = 0; j < placed.length; ++j)
		{
			var sep = euclid_distance(x, z, placed[j].x, placed[j].z);
			if (sep < 0.25)
			{
				tooClose = true;
				break;
			}
		}

		if (tooClose)
		{
			--i;
			++attempts;

			// reset if we're in what looks like an infinite loop
			if (attempts > 100)
			{
				players = [];
				placed = [];
				i = -1;
				attempts = 0;
			}

			continue;
		}

		players[i] = {
			"id": playerIDs[i],
			"angle": playerAngle,
			"x": x,
			"z": z
		};

		placed.push(players[i]);
	}

	// create the bases
	for (var i = 0; i < mapSettings.numPlayers; ++i)
		createBase(players[i]);

	return players;
}

// Function for placing teams in a stronghold pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
function placeStronghold(playerIDs, distance, groupedDistance)
{
	var players = [];

	for (var i = 0; i < mapSettings.teams.length; ++i)
	{
		var teamAngle = mapSettings.startAngle + (i + 1) * TWO_PI / mapSettings.teams.length;
		var fractionX = 0.5 + distance * cos(teamAngle);
		var fractionZ = 0.5 + distance * sin(teamAngle);

		// if we have a team of above average size, make sure they're spread out
		if (mapSettings.teams[i].length > 4)
			groupedDistance = randFloat(0.08, 0.12);

		// if we have a team of below average size, make sure they're together
		if (mapSettings.teams[i].length < 3)
			groupedDistance = randFloat(0.04, 0.06);

		// if we have a solo player, place them on the center of the team's location
		if (mapSettings.teams[i].length == 1)
			groupedDistance = 0;

		// create player base
		for (var p = 0; p < mapSettings.teams[i].length; ++p)
		{
			var angle = mapSettings.startAngle + (p + 1) * TWO_PI / mapSettings.teams[i].length;
			players[mapSettings.teams[i][p]] = {
				"id": mapSettings.teams[i][p],
				"angle": angle,
				"x": fractionX + groupedDistance * cos(angle),
				"z": fractionZ + groupedDistance * sin(angle)
			};
			createBase(players[mapSettings.teams[i][p]], false)
		}
	}

	return players;
}

function createTileClasses(newClasses)
{
	var defaultClasses = [
		"animals",
		"baseResource",
		"berries",
		"bluff",
		"bluffSlope",
		"dirt",
		"fish",
		"food",
		"forest",
		"hill",
		"land",
		"map",
		"metal",
		"mountain",
		"plateau",
		"player",
		"prop",
		"ramp",
		"rock",
		"settlement",
		"spine",
		"valley",
		"water"
	];

	var classes = defaultClasses;
	if (newClasses !== undefined)
		classes = defaultClasses.concat(newClasses)

	var tileClasses = {};
	for (var className or classes)
		tileClasses[className] = createTileClass();

	return tileClasses;
}

// put some useful map settings into an object
function getMapSettings()
{
	let numPlayers = getNumPlayers();

	g_Terrains = {
		"mainTerrain": rBiomeT1(),
		"forestFloor1": rBiomeT2(),
		"forestFloor2": rBiomeT3(),
		"cliff": rBiomeT4(),
		"tier1Terrain": rBiomeT5(),
		"tier2Terrain": rBiomeT6(),
		"tier3Terrain": rBiomeT7(),
		"hill": rBiomeT8(),
		"dirt": rBiomeT9(),
		"road": rBiomeT10(),
		"roadWild": rBiomeT11(),
		"tier4Terrain": rBiomeT12(),
		"shoreBlend": rBiomeT13(),
		"shore": rBiomeT14(),
		"water": rBiomeT15()
	};

	g_Gaia = {
		"tree1": rBiomeE1(),
		"tree2": rBiomeE2(),
		"tree3": rBiomeE3(),
		"tree4": rBiomeE4(),
		"tree5": rBiomeE5(),
		"fruitBush": rBiomeE6(),
		"chicken": rBiomeE7(),
		"mainHuntableAnimal": rBiomeE8(),
		"fish": rBiomeE9(),
		"secondaryHuntableAnimal": rBiomeE10(),
		"stoneLarge": rBiomeE11(),
		"stoneSmall": rBiomeE12(),
		"metalLarge": rBiomeE13()
	};

	g_Decoratives = {
		"grass": rBiomeA1(),
		"grassShort": rBiomeA2(),
		"reeds": rBiomeA3(),
		"lillies": rBiomeA4(),
		"rockLarge": rBiomeA5(),
		"rockMedium": rBiomeA6(),
		"bushMedium": rBiomeA7(),
		"bushSmall": rBiomeA8(),
		"tree": rBiomeA9()
	};

	g_Props = {
		"barrels": "actor|props/special/eyecandy/barrels_buried.xml",
		"crate": "actor|props/special/eyecandy/crate_a.xml",
		"cart": "actor|props/special/eyecandy/handcart_1_broken.xml",
		"well": "actor|props/special/eyecandy/well_1_c.xml",
		"skeleton": "actor|props/special/eyecandy/skeleton.xml",
		"blood": "actor|props/units/blood_01.xml",
		"bigBlood": "actor|props/units/blood_whale.xml"
	};

	g_Forests = {
		"forest1": [
			g_Terrains.forestFloor2 + TERRAIN_SEPARATOR + g_Gaia.tree1,
			g_Terrains.forestFloor2 + TERRAIN_SEPARATOR + g_Gaia.tree2,
			g_Terrains.forestFloor2
		],
		"forest2": [
			g_Terrains.forestFloor1 + TERRAIN_SEPARATOR + g_Gaia.tree4,
			g_Terrains.forestFloor1 + TERRAIN_SEPARATOR + g_Gaia.tree5,
			g_Terrains.forestFloor1
		]
	};

	return {
		"biome": biomeID,
		"numPlayers": numPlayers,
		"teams": getTeams(numPlayers),
		"startAngle": randFloat(0, TWO_PI)
	};
}

// gets a number within a random deviation of a base number
function getRandomDeviation(base, randomness)
{
	if (randomness > base)
		randomness = base;

	var deviation = base + (-1 * randomness + (randInt(20 * randomness) + 0.0001) / 10);
	return floor(deviation * 100) / 100;
}
