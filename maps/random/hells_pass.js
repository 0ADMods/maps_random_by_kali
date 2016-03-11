RMS.LoadLibrary("rmgen");
InitMap();

///////////
// setup the map
///////////
initTerrain(t.mainTerrain, tc.land, 1);
var pos = getStartingPositions();
var players = addBases("line", 0.2, 0.08);
RMS.SetProgress(20);

///////////
// customize the map
///////////
placeBarriers();
RMS.SetProgress(40);

///////////
// add terrain
///////////

// terrain features
var features = [
	{
		"func": addBluffs,
		"tile": "tc.bluff",
		"avoid": [tc.bluff, 20, tc.hill, 5, tc.mountain, 20, tc.player, 30, tc.spine, 15, tc.valley, 5, tc.water, 7],
		"sizes": ["normal", "big"],
		"mixes": ["varied"],
		"amounts": ["few"]
	},
	{
		"func": addHills,
		"tile": "tc.hill",
		"avoid": [tc.bluff, 5, tc.hill, 15, tc.mountain, 2, tc.player, 20, tc.spine, 15, tc.valley, 2, tc.water, 2],
		"sizes": ["normal", "big"],
		"mixes": ["varied"],
		"amounts": ["few"]
	},
	{
		"func": addLakes,
		"tile": "tc.water",
		"avoid": [tc.bluff, 7, tc.hill, 2, tc.mountain, 15, tc.player, 20, tc.spine, 15, tc.valley, 10, tc.water, 25],
		"sizes": ["big", "huge"],
		"mixes": ["varied", "unique"],
		"amounts": ["few"]
	}
];
features = randArray(features);

// decorative elements
var decoration = [
	{
		"func": addLayeredPatches,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.dirt, 5, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	},
	{
		"func": addDecoration,
		"tile": "tc.dirt",
		"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["normal"],
		"amounts": ["normal"]
	}
]

// add decorative elements to the end of the terrain rendering
var terrain = features.concat(decoration);
addElements(terrain);
RMS.SetProgress(60);

///////////
// add gaia
///////////

// primary resources
var primaryRes = [
	{
		"func": addMetal,
		"tile": "tc.metal",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 10, tc.metal, 20, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addStone,
		"tile": "tc.stone",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 3, tc.mountain, 2, tc.player, 30, tc.rock, 20, tc.metal, 10, tc.spine, 5, tc.water, 3],
		"sizes": ["normal"],
		"mixes": ["same"],
		"amounts": allAmounts
	},
	{
		"func": addForests,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 18, tc.metal, 3, tc.mountain, 5, tc.player, 20, tc.rock, 3, tc.spine, 5, tc.water, 2],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["few", "normal", "many", "tons"]
	}
];
primaryRes = randArray(primaryRes);

// secondary resources
var secondaryRes = [
	{
		"func": addBerries,
		"tile": "tc.berries",
		"avoid": [tc.berries, 30, tc.bluff, 5, tc.forest, 5, tc.metal, 10, tc.mountain, 2, tc.player, 20, tc.rock, 10, tc.spine, 5, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addAnimals,
		"tile": "tc.animals",
		"avoid": [tc.animals, 20, tc.bluff, 5, tc.forest, 0, tc.mountain, 1, tc.player, 20, tc.spine, 5, tc.water, 3],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": allAmounts
	},
	{
		"func": addStragglerTrees,
		"tile": "tc.forest",
		"avoid": [tc.berries, 5, tc.bluff, 5, tc.forest, 7, tc.metal, 1, tc.mountain, 1, tc.player, 12, tc.rock, 1, tc.spine, 5, tc.water, 5],
		"sizes": allSizes,
		"mixes": allMixes,
		"amounts": ["normal", "many", "tons"]
	}
];
secondaryRes = randArray(secondaryRes);

var gaia = primaryRes.concat(secondaryRes);
addElements(gaia);
RMS.SetProgress(80);

///////////
// export the map
///////////
RMS.SetProgress(100);
ExportMap();

///////////
// Custom map functions
///////////

// place the mountainous barriers between the teams
function placeBarriers()
{
	var spineTerrain = t.dirt;

	if (m.biome == 2)
		spineTerrain = t.tier1Terrain;

	if (m.biome == 4 || m.biome == 6)
		spineTerrain = t.tier2Terrain;

	if (m.biome == 8)
		spineTerrain = t.tier4Terrain;

	// create mountain ranges
	for (var i = 0; i < m.teams.length; ++i)
	{
	  var tang = m.startAngle + (i + 0.5) * TWO_PI / m.teams.length;

	  var fx = fractionToTiles(0.5);
	  var fz = fractionToTiles(0.5);
	  var ix = round(fx);
	  var iz = round(fz);

		var mStartCo = 0.07;
		var mStopCo = 0.42;
		var mSize = 8;
		var mWaviness = 0.6;
		var mOffset = 0.5;
		var mTaper = -1.5;

		if(m.teams.length > 3 || m.mapSize <= 192)
		{
			mWaviness = 0.2;
			mOffset = 0.2;
			mTaper = -1;
		}

		if(m.teams.length >= 5)
		{
			mSize = 4;
			mWaviness = 0.2;
			mOffset = 0.2;
			mTaper = -0.7;
		}

		// place barrier
		var placer = new PathPlacer(fractionToTiles(0.5 + mStartCo * cos(tang)), fractionToTiles(0.5 + mStartCo * sin(tang)), fractionToTiles(0.5 + mStopCo * cos(tang)), fractionToTiles(0.5 + mStopCo * sin(tang)), scaleByMapSize(14, mSize), mWaviness, 0.1, mOffset, mTaper);
		var terrainPainter = new LayeredPainter([t.cliff, spineTerrain], [2]);
		var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, 30, 2);
		createArea(placer, [terrainPainter, elevationPainter, paintClass(tc.spine)], avoidClasses(tc.player, 5, tc.baseResource, 5));
	}

	// decorative elements
	var decoration = [
		{
			"func": addDecoration,
			"tile": "tc.dirt",
			"avoid": [tc.bluff, 2, tc.forest, 2, tc.mountain, 2, tc.player, 12, tc.water, 3],
			"stay": [tc.spine, 5],
			"sizes": ["huge"],
			"mixes": ["unique"],
			"amounts": ["tons"]
		}
	]
	addElements(decoration);
}
