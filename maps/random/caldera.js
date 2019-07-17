// Map gen time: 8 players, normal size (~5s)

// TODO: nomad, stronghold placement

Engine.LoadLibrary("rmgen");
Engine.LoadLibrary("rmgen-common");

const numPlayers = g_MapSettings.PlayerData.filter(Boolean).length;

const terrain = {
    "bump": ["dirt_rocks_a", "steppe_dirt_rocks_a", "dirt_broken_rocks"],
    "caldera": ["dirt_brown_d", "dirt_brown_e", "DirtTests4"],
    "calderaBump": ["dirt_brown_e"],
    "city": ["desert_dirt_persia_rocky"],
    "cityPlaza": ["desert_cliff_base"],
    "cliff": ["medit_cliff_italia", "medit_dirt_e"],
    "dirt": ["steppe_grass_dirt_66"],
    "forestFloor": ["steppe_grass_dirt_66", "forestfloor_dirty", "forestfloor_pine"],
    "primary": ["dirt_rocks_a", "steppe_dirt_rocks_a", "steppe_dirt_a", "steppe_dirt_b"],
    "rim": ["dirt_rocks_a", "steppe_dirt_rocks_a", "dirt_broken_rocks"],
};

const gaia = {
    "berryBush": "gaia/flora_bush_berry",
    "gameLarge": "gaia/fauna_deer",
    "gameMedium": "gaia/fauna_goat",
    "gameSmall": "gaia/fauna_chicken",
    "metal": "gaia/geology_metal_desert_badlands_slabs",
    "metalSmall": "gaia/geology_metal_alpine",
    "stone": "gaia/geology_stonemine_desert_badlands_quarry",
    "stoneSmall": "gaia/geology_stone_temperate",
    "treeLarge": "gaia/flora_tree_cedar_atlas_2_young",
    "treeMedium": "gaia/flora_tree_pine_black",
    "treeSmall": "gaia/flora_tree_cedar_atlas_1_sapling",
    "treeDeadLarge": "gaia/flora_tree_pine_black_dead"
};

const actors = {
    "bushLarge": "actor|props/flora/bush_desert_dry_a.xml",
    "bushMedium": "actor|props/flora/bush_highlands.xml",
    "bushSmall": "actor|props/flora/bush_medit_sm_dry.xml",
    "grassLarge": "actor|props/flora/grass_soft_dry_large.xml",
    "grassMedium": "actor|props/flora/grass_soft_tuft_a.xml",
    "grassSmall": "actor|props/flora/grass_field_parched_short.xml",
    "rockMedium": "actor|geology/stone_granite_med.xml",
    "rockSmall": "actor|geology/stone_granite_small.xml"
};

const heightLand = 14;
const heightSlope = 55;
const heightCaldera = 5;
const heightRim = 16;

// TODO: RandomMap creates a RandomMapLogger which references getNumPlayers() in rmgen-common
var g_Map = new RandomMap(heightLand, terrain.primary);
const mapRadius = g_Map.getSize() / 2;
const mapCenter = g_Map.getCenter();

var tiles = {
    "animals": g_Map.createTileClass(),
    "base": g_Map.createTileClass(),
    "baseResource": g_Map.createTileClass(),
    "berries": g_Map.createTileClass(),
    "caldera": g_Map.createTileClass(),
    "calderaGrass": g_Map.createTileClass(),
    "expansion": g_Map.createTileClass(),
    "forest": g_Map.createTileClass(),
    "grass": g_Map.createTileClass(),
    "grove": g_Map.createTileClass(),
    "metal": g_Map.createTileClass(),
    "metalSmall": g_Map.createTileClass(),
    "neutral": g_Map.createTileClass(),
    "props": g_Map.createTileClass(),
    "rim": g_Map.createTileClass(),
    "stone": g_Map.createTileClass(),
    "stoneSmall": g_Map.createTileClass(),
    "thicket": g_Map.createTileClass(),
};

function teamTileClass(id)
{
    return `team${id}`
}

function teamExpTileClass(id)
{
    return `exp${id}`
}

function teamNeutralTileClass(id)
{
    return `neutral${id}`
}

function playerTileClass(id)
{
    return `player${id}`
}

/**
 * WedgePlacer - creates a triangular slice from a center point and two angles.
 */
function WedgePlacer(centerPoint, startAngle, stopAngle, failFraction = 100)
{
    this.normalize = 0;
    this.centerPoint = centerPoint;
    this.startAngle = startAngle;
    this.stopAngle = stopAngle;

    // add 2 * Math.PI to ensure a positive angle
    if (this.startAngle < 0 || this.stopAngle < 0)
    {
        this.normalize = 2 * Math.PI;
        this.startAngle = startAngle + this.normalize;
        this.stopAngle = stopAngle + this.normalize;
    }

    this.failFraction = failFraction;
}

WedgePlacer.prototype.place = function (constraint)
{
    let points = [];
    let count = 0;
    let failed = 0;

    let point = new Vector2D(0, 0);

    for (point.x = 0; point.x < g_Map.size; ++point.x)
        for (point.y = 0; point.y < g_Map.size; ++point.y)
        {
            ++count;

            let radians = this.centerPoint.angleTo(point) + this.normalize;
            if (radians < 0)
                radians += 2 * Math.PI;

            // check if this angle is between the two angles (plus an optional full rotation)
            if (g_Map.inMapBounds(point) &&
                (radians >= this.startAngle && radians < this.stopAngle ||
                    radians + 2 * Math.PI >= this.startAngle && radians + 2 * Math.PI < this.stopAngle) &&
                constraint.allows(point))

                points.push(point.clone());
            else
                ++failed;
        }

    return failed <= this.failFraction * count ? points : undefined;
}

// Create lookups to easily find a player's team and players on a team
var ffaTeamID = 101;
var players = {};
var teams = {};
for (let playerID = 1; playerID <= numPlayers; ++playerID)
{
    let teamID = g_MapSettings.PlayerData[playerID].Team === undefined || g_MapSettings.PlayerData[playerID].Team == -1 ? ffaTeamID++ : g_MapSettings.PlayerData[playerID].Team;

    // for new teams, initialize the array and create a new tile class
    if (teams[teamID] === undefined)
    {
        teams[teamID] = [];
        tiles[teamTileClass(teamID)] = g_Map.createTileClass();
    }
    teams[teamID].push(playerID);

    // create expansion and bounty tile classes for each team
    tiles[teamExpTileClass(teamID)] = g_Map.createTileClass();
    tiles[teamNeutralTileClass(teamID)] = g_Map.createTileClass();

    // create new tile classes for each player
    players[playerID] = teamID;
    tiles[playerTileClass(playerID)] = g_Map.createTileClass();
}
var numTeams = Object.keys(teams).length;

const resourceRetries = 500;

const radianTeamEdgePadding = Math.PI / (5 * numTeams);
const radianNeutralEdgePadding = radianTeamEdgePadding / 3;
const baseDistanceFromCenter = mapRadius * 0.7;
const radiansPerTeam = 2 * Math.PI / numTeams - (2 * radianTeamEdgePadding);

const mapScale = g_MapSettings.Size / 320;
const teamScale = radiansPerTeam / (2 * Math.PI) * mapScale;
const playerScale = radiansPerTeam * numTeams / numPlayers / (2 * Math.PI) * mapScale;
const openSpaceScale = (mapScale - (teamScale * numTeams)) / numTeams;

g_Map.log(`mapScale: ${mapScale}; teamScale: ${teamScale}; playerScale: ${playerScale}; openSpaceScale: ${openSpaceScale}`);

// create random resource ranges

const ratio1 = Math.random() * 0.6 + 0.2;
const ratio2 = 1 - ratio1;

const forestTrees = randIntInclusive(600, 1200) * mapScale;
const forestTreesPerGroup = Math.ceil(randIntInclusive(20, 30) * mapScale);
const forestGroupsPerPlayer = Math.round(playerScale * forestTrees / forestTreesPerGroup);

g_Map.log(`Forest trees: ${forestTreesPerGroup * forestGroupsPerPlayer} per player; groups: ${forestGroupsPerPlayer}`);

const groveTrees = randIntInclusive(400, 800) * mapScale;
const groveTreesPerGroup = Math.ceil(randIntInclusive(12, 18) * mapScale);
const groveGroupsPerPlayer = Math.round(playerScale * groveTrees / groveTreesPerGroup);

g_Map.log(`Grove trees: ${groveTreesPerGroup * groveGroupsPerPlayer} per player; groups: ${groveGroupsPerPlayer}`);

const thicketTrees = randIntInclusive(150, 300) * mapScale;
const thicketTreesPerGroup = Math.ceil(randIntInclusive(4, 6) * mapScale);
const thicketGroupsPerPlayer = Math.round(playerScale * thicketTrees / thicketTreesPerGroup);

g_Map.log(`Thicket trees: ${thicketTreesPerGroup * thicketGroupsPerPlayer} per player; groups: ${thicketGroupsPerPlayer}`);

const stoneSmall = randIntInclusive(30, 60) * mapScale;
const stoneSmallPerGroup = Math.ceil(randIntInclusive(2, 6) * mapScale);
const stoneSmallGroupsPerPlayer = Math.round(playerScale * stoneSmall / stoneSmallPerGroup);

g_Map.log(`Small Stones: ${stoneSmallPerGroup * stoneSmallGroupsPerPlayer} per player; groups: ${stoneSmallGroupsPerPlayer}`);

const metalSmall = randIntInclusive(30, 60) * mapScale;
const metalSmallPerGroup = Math.ceil(randIntInclusive(2, 6) * mapScale);
const metalSmallGroupsPerPlayer = Math.round(playerScale * metalSmall / metalSmallPerGroup);

g_Map.log(`Small Metal: ${metalSmallPerGroup * metalSmallGroupsPerPlayer} per player; groups: ${metalSmallGroupsPerPlayer}`);

const animals = randIntInclusive(60, 180) * mapScale;
const animalsPerGroup = Math.ceil(randIntInclusive(4, 8) * mapScale);
const animalGroupsPerPlayer = Math.round(playerScale * animals / animalsPerGroup);

g_Map.log(`Animals: ${animalsPerGroup * animalGroupsPerPlayer} per player; groups: ${animalGroupsPerPlayer}`);

const berries = randIntInclusive(40, 100) * mapScale;
const berriesPerGroup = Math.ceil(randIntInclusive(3, 6) * mapScale);
const berryGroupsPerPlayer = Math.round(playerScale * berries / berriesPerGroup);

g_Map.log(`Berries: ${berriesPerGroup * berryGroupsPerPlayer} per player; groups: ${berryGroupsPerPlayer}`);

const bonusStone = Math.round(randIntInclusive(1, 8) / numTeams * mapScale);
const bonusStonePerGroup = 1;
const bonusStoneGroupsPerTeam = Math.round(bonusStone / bonusStonePerGroup);

g_Map.log(`Bonus Stone: ${bonusStonePerGroup * bonusStoneGroupsPerTeam} per team; groups: ${bonusStoneGroupsPerTeam}`);

const bonusMetal = Math.round(randIntInclusive(1, 8) / numTeams * mapScale);
const bonusMetalPerGroup = 1;
const bonusMetalGroupsPerTeam = Math.round(bonusMetal / bonusMetalPerGroup);

g_Map.log(`Bonus Metal: ${bonusMetalPerGroup * bonusMetalGroupsPerTeam} per team; groups: ${bonusMetalGroupsPerTeam}`);

const expStoneSmall = Math.round(randIntInclusive(1, 16) / numTeams * mapScale);
const expStoneSmallPerGroup = Math.ceil(randIntInclusive(2, 6) * mapScale);
const expStoneSmallGroupsPerTeam = Math.round(expStoneSmall / expStoneSmallPerGroup);

g_Map.log(`Expansion Stone Small: ${expStoneSmallPerGroup * expStoneSmallGroupsPerTeam} per expansion; groups: ${expStoneSmallGroupsPerTeam}`);

const expMetalSmall = Math.round(randIntInclusive(1, 16) / numTeams * mapScale);
const expMetalSmallPerGroup = Math.ceil(randIntInclusive(2, 6) * mapScale);
const expMetalSmallGroupsPerTeam = Math.round(expMetalSmall / expMetalSmallPerGroup);

g_Map.log(`Expansion Metal Small: ${expMetalSmallPerGroup * expMetalSmallGroupsPerTeam} per expansion; groups: ${expMetalSmallGroupsPerTeam}`);

const expStone = Math.round(randIntInclusive(1, 4) / numTeams * mapScale);
const expStonePerGroup = 1;
const expStoneGroupsPerTeam = Math.round(expStone / expStonePerGroup);

g_Map.log(`Expansion Stone: ${expStonePerGroup * expStoneGroupsPerTeam} per expansion; groups: ${expStoneGroupsPerTeam}`);

const expMetal = Math.round(randIntInclusive(1, 4) / numTeams * mapScale);
const expMetalPerGroup = 1;
const expMetalGroupsPerTeam = Math.round(expMetal / expMetalPerGroup);

g_Map.log(`Expansion Metal: ${expMetalPerGroup * expMetalGroupsPerTeam} per expansion; groups: ${expMetalGroupsPerTeam}`);

// slope the map

// createArea(placer, painters, constraints)
// DiskPlacer(radius, centerPosition = undefined)
// SmoothElevationPainter(type, elevation, blendRadius, randomElevation)
createArea(
    new DiskPlacer(mapRadius, mapCenter),
    new SmoothElevationPainter(ELEVATION_MODIFY, heightSlope, heightSlope * 2, 0)
);
Engine.SetProgress(10);

// create the rim

// createArea(placer, painters, constraints)
// ClumpPlacer(size, coherence, smoothness, failFraction, centerPosition)
// LayeredPainter(terrains, widths)
// SmoothElevationPainter(type, elevation, blendRadius, randomElevation)
createArea(
    new ClumpPlacer(diskArea(mapRadius / 3.5), 0.85, 0.15, 0, mapCenter),
    [
        new LayeredPainter([terrain.rim], []),
        new SmoothElevationPainter(ELEVATION_MODIFY, heightRim, heightRim / 2, 2),
        new TileClassPainter(tiles.rim)
    ]
);
Engine.SetProgress(20);

// create the caldera

// createArea(placer, painters, constraints)
// ClumpPlacer(size, coherence, smoothness, failFraction, centerPosition)
// LayeredPainter(terrains, widths)
// SmoothElevationPainter(type, elevation, blendRadius, randomElevation)
createArea(
    new ClumpPlacer(diskArea(mapRadius / 4), 0.85, 0.15, 0, mapCenter),
    [
        new LayeredPainter([terrain.cliff, terrain.caldera], [4]),
        new SmoothElevationPainter(ELEVATION_SET, heightCaldera, 4, 1),
        new TileClassPainter(tiles.caldera)
    ]
);
Engine.SetProgress(30);

// determine the team placement

// distributePointsOnCircle(pointCount, startAngle, radius, center)
let teamPoints = distributePointsOnCircle(numTeams, Math.random() * Math.PI, baseDistanceFromCenter, mapCenter);

let teamIndex = 1;

// TODO: It seems like this could call placePlayerBases? Mostly createFoods, createMines were the calls to be deprecated

for (let key in teams) {
    g_Map.log(`Place team ${key}`);

    // define the team areas
    let startTeamAngle = teamPoints[1][teamIndex - 1] + radianTeamEdgePadding;
    let stopTeamAngle = teamPoints[1][teamIndex] || teamPoints[1][0] + 2 * Math.PI;
    stopTeamAngle -= radianTeamEdgePadding;

    // distributePointsOnCircularSegment(pointCount, maxAngle, startAngle, radius, center)
    let playerPoints = distributePointsOnCircularSegment(teams[key].length * 2 + 1, stopTeamAngle - startTeamAngle, startTeamAngle, baseDistanceFromCenter, mapCenter);

    // define neutral and expansion areas
    let expStartAngle = teamPoints[1][teamIndex - 1] - radianNeutralEdgePadding;
    let expStopAngle = teamPoints[1][teamIndex - 1] + radianNeutralEdgePadding;

    let neutralStartAngle = teamPoints[1][teamIndex - 1] - radianTeamEdgePadding;
    let neutralStopAngle = teamPoints[1][teamIndex - 1] + radianTeamEdgePadding;

    // createArea(placer, painters, constraints)
    // WedgePlacer(centerPoint, startAngle, stopAngle, failFraction = 100)
    createArea(
        new WedgePlacer(mapCenter, expStartAngle, expStopAngle),
        new TileClassPainter(tiles[teamExpTileClass(key)])
    );

    // createArea(placer, painters, constraints)
    // WedgePlacer(centerPoint, startAngle, stopAngle, failFraction = 100)
    createArea(
        new WedgePlacer(mapCenter, neutralStartAngle, neutralStopAngle),
        new TileClassPainter(tiles[teamNeutralTileClass(key)])
    );

    // place each player on the team
    for (let i = 0; i < teams[key].length; ++i) {
        let playerID = teams[key][i];
        let playerCiv = g_MapSettings.PlayerData[playerID].Civ;

        let playerCenter = playerPoints[0][i * 2 + 1];
        let stopPlayerAngle = playerPoints[1][i * 2 + 2];
        let startPlayerAngle = playerPoints[1][i * 2];

        // tile the area for placing team and player resources

        // createArea(placer, painters, constraints)
        // WedgePlacer(centerPoint, startAngle, stopAngle, failFraction = 100)
        createArea(
            new WedgePlacer(mapCenter, startPlayerAngle, stopPlayerAngle),
            [
                new TileClassPainter(tiles[playerTileClass(playerID)]),
                new TileClassPainter(tiles[teamTileClass(key)])
            ]
        );

        let playerEntities = g_CivData[playerCiv].StartEntities;

        // place the Civ Center
        g_Map.placeEntityPassable(playerEntities[0].Template, playerID, playerCenter, BUILDING_ORIENTATION);

        let entityDistance = 3 * mapScale + 7;

        // place the walls
        if (playerCiv == "iber" && g_Map.getSize() > 128) {
            let numSections = 8;
            let wallAngle = Math.random() * Math.PI;
            let wallPoints = distributePointsOnCircle(numSections, wallAngle, 21, playerCenter);
            //let turretPoints = distributePointsOnCircle(numSections - 1, wallAngle + (Math.PI / numSections), 21, playerCenter);

            for (let i = 0; i < numSections; ++i) {
                g_Map.placeEntityPassable("structures/iber_wall_tower", playerID, wallPoints[0][i], wallPoints[1][i]);
                //g_Map.placeEntityPassable("structures/iber_wall_long", playerID, wallPoints[0][i], wallPoints[1][i]);
            }
        }

        let placeAngle = Math.random() * Math.PI;

        // distributePointsOnCircle(pointCount, startAngle, radius, center)
        let entityPoints = distributePointsOnCircle(playerEntities.length - 1, placeAngle, entityDistance, playerCenter);

        // place starting units
        for (let j = 1; j < playerEntities.length; ++j) {
            let numEntities = playerEntities[j].Count || 1;

            // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
            // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
            let group = new SimpleGroup(
                [new SimpleObject(playerEntities[j].Template, numEntities, numEntities, 1, 1)],
                true,
                tiles[playerTileClass(playerID)],
                entityPoints[0][j - 1]
            );
            // SimpleGroup.prototype.place = function(playerID, constraint)
            group.place(playerID, new NullConstraint);
        }

        // tile the base

        // createArea(placer, painters, constraints)
        // DiskPlacer(radius, centerPosition = undefined)
        // LayeredPainter(terrains, widths)
        createArea(
            new DiskPlacer(12, playerCenter),
            [
                new LayeredPainter([terrain.city, terrain.cityPlaza], [3]),
                new TileClassPainter(tiles.base)
            ]
        );

        // place starting resources

        // distributePointsOnCircle(pointCount, startAngle, radius, center)
        let baseResourcePoints = distributePointsOnCircle(5, placeAngle - Math.PI / 6, entityDistance + 4, playerCenter);

        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        // SimpleGroup.prototype.place = function(playerID, constraint)
        new SimpleGroup(
            [new SimpleObject(gaia.berryBush, 5, 5, 0, 3)],
            true,
            tiles.baseResource,
            baseResourcePoints[0][0]
        ).place(0, avoidClasses(tiles.baseResource, 2));

        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        // SimpleGroup.prototype.place = function(playerID, constraint)
        new SimpleGroup(
            [new SimpleObject(gaia.metal, 1, 1, 0, 1)],
            true,
            tiles.baseResource,
            baseResourcePoints[0][1]
        ).place(0, avoidClasses(tiles.baseResource, 2));

        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        // SimpleGroup.prototype.place = function(playerID, constraint)
        new SimpleGroup(
            [
                new SimpleObject(gaia.treeLarge, 2, 2, 0, 2),
                new SimpleObject(gaia.treeMedium, 2, 2, 1, 3),
                new SimpleObject(gaia.treeSmall, 2, 2, 2, 4)
            ],
            true,
            tiles.baseResource,
            baseResourcePoints[0][2]
        ).place(0, avoidClasses(tiles.baseResource, 2));

        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        // SimpleGroup.prototype.place = function(playerID, constraint)
        new SimpleGroup(
            [new SimpleObject(gaia.stone, 1, 1, 0, 1)],
            true,
            tiles.baseResource,
            baseResourcePoints[0][3]
        ).place(0, avoidClasses(tiles.baseResource, 2));

        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        // SimpleGroup.prototype.place = function(playerID, constraint)
        new SimpleGroup(
            [new SimpleObject(gaia.gameSmall, 10, 10, 0, 3)],
            true,
            tiles.baseResource,
            baseResourcePoints[0][4]
        ).place(0, avoidClasses(tiles.baseResource, 2));

        // place trees

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [
                    new SimpleObject(gaia.treeLarge, forestTreesPerGroup * ratio1, forestTreesPerGroup * ratio1, 1, Math.ceil(forestTreesPerGroup / 3)),
                    new SimpleObject(gaia.treeMedium, forestTreesPerGroup * ratio2, forestTreesPerGroup * ratio2, 1, Math.ceil(forestTreesPerGroup / 3))
                ],
                true,
                tiles.forest
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 8, tiles.base, 8, tiles.forest, 4, tiles.rim, 15)
            ],
            forestGroupsPerPlayer,
            resourceRetries
        );

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [
                    new SimpleObject(gaia.treeLarge, groveTreesPerGroup * ratio1, groveTreesPerGroup * ratio1, 1, Math.ceil(groveTreesPerGroup / 3)),
                    new SimpleObject(gaia.treeSmall, groveTreesPerGroup * ratio2, groveTreesPerGroup * ratio2, 1, Math.ceil(groveTreesPerGroup / 3))
                ],
                true,
                tiles.grove
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 7, tiles.base, 6, tiles.forest, 7, tiles.grove, 4, tiles.rim, 6)
            ],
            groveGroupsPerPlayer,
            resourceRetries
        );

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [
                    new SimpleObject(gaia.treeLarge, thicketTreesPerGroup * ratio1, thicketTreesPerGroup * ratio1, 1, Math.ceil(thicketTreesPerGroup * 2)),
                    new SimpleObject(gaia.treeDeadLarge, thicketTreesPerGroup * ratio2, thicketTreesPerGroup * ratio2, 1, Math.ceil(thicketTreesPerGroup * 2))
                ],
                true,
                tiles.thicket
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 6, tiles.base, 3, tiles.forest, 7, tiles.grove, 7, tiles.thicket, 3, tiles.rim, 6)
            ],
            thicketGroupsPerPlayer,
            resourceRetries
        );

        // place stone

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [new SimpleObject(gaia.stoneSmall, stoneSmallPerGroup, stoneSmallPerGroup, 1, stoneSmallPerGroup)],
                true,
                tiles.stoneSmall
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 15, tiles.base, 8, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.caldera, 7, tiles.stoneSmall, 15)
            ],
            stoneSmallGroupsPerPlayer,
            resourceRetries
        );

        // place metal

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [new SimpleObject(gaia.metalSmall, metalSmallPerGroup, metalSmallPerGroup, 1, metalSmallPerGroup)],
                true,
                tiles.metalSmall
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 15, tiles.base, 8, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.caldera, 7, tiles.stoneSmall, 5, tiles.metalSmall, 15)
            ],
            metalSmallGroupsPerPlayer,
            resourceRetries
        );

        // place animals

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [
                    new SimpleObject(gaia.gameLarge, animalsPerGroup * ratio1, animalsPerGroup * ratio1, 1, animalsPerGroup),
                    new SimpleObject(gaia.gameMedium, animalsPerGroup * ratio2, animalsPerGroup * ratio2, 1, animalsPerGroup)
                ],
                true,
                tiles.animals
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 15, tiles.base, 8, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.caldera, 6, tiles.metalSmall, 3, tiles.stoneSmall, 3, tiles.animals, 15)
            ],
            animalGroupsPerPlayer,
            resourceRetries
        );

        // place berries

        // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
        // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
        // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
        createObjectGroups(
            new SimpleGroup(
                [new SimpleObject(gaia.berryBush, berriesPerGroup, berriesPerGroup, 1, berriesPerGroup)],
                true,
                tiles.berries
            ),
            0,
            [
                stayClasses(tiles[playerTileClass(playerID)], 0),
                avoidClasses(tiles.baseResource, 15, tiles.base, 8, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.rim, 7, tiles.stoneSmall, 5, tiles.metalSmall, 5, tiles.animals, 2, tiles.berries, 15)
            ],
            berryGroupsPerPlayer,
            resourceRetries
        );
    }

    // place expansion resources

    // place forest

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [
                new SimpleObject(gaia.treeLarge, forestTreesPerGroup * ratio1, forestTreesPerGroup * ratio1, 1, Math.ceil(forestTreesPerGroup / 3)),
                new SimpleObject(gaia.treeMedium, forestTreesPerGroup * ratio2, forestTreesPerGroup * ratio2, 1, Math.ceil(forestTreesPerGroup / 3))
            ],
            true,
            tiles.forest
        ),
        0,
        [
            stayClasses(tiles[teamNeutralTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 8, tiles.base, 8, tiles.forest, 4, tiles.rim, 15, tiles.metal, 5, tiles.metalSmall, 5, tiles.stone, 5, tiles.stoneSmall, 5, tiles.animals, 5, tiles.berries, 5)
        ],
        Math.round(openSpaceScale * forestTrees / forestTreesPerGroup),
        resourceRetries
    );

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [
                new SimpleObject(gaia.treeLarge, groveTreesPerGroup * ratio1, groveTreesPerGroup * ratio1, 1, Math.ceil(groveTreesPerGroup / 3)),
                new SimpleObject(gaia.treeSmall, groveTreesPerGroup * ratio2, groveTreesPerGroup * ratio2, 1, Math.ceil(groveTreesPerGroup / 3))
            ],
            true,
            tiles.grove
        ),
        0,
        [
            stayClasses(tiles[teamNeutralTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 7, tiles.base, 6, tiles.forest, 7, tiles.grove, 4, tiles.rim, 6, tiles.metal, 5, tiles.metalSmall, 5, tiles.stone, 5, tiles.stoneSmall, 5, tiles.animals, 5, tiles.berries, 5)
        ],
        Math.round(openSpaceScale * groveTrees / groveTreesPerGroup),
        resourceRetries
    );

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [
                new SimpleObject(gaia.treeLarge, thicketTreesPerGroup * ratio1, thicketTreesPerGroup * ratio1, 1, Math.ceil(thicketTreesPerGroup * 2)),
                new SimpleObject(gaia.treeDeadLarge, thicketTreesPerGroup * ratio2, thicketTreesPerGroup * ratio2, 1, Math.ceil(thicketTreesPerGroup * 2))
            ],
            true,
            tiles.thicket
        ),
        0,
        [
            stayClasses(tiles[teamNeutralTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 6, tiles.base, 3, tiles.forest, 7, tiles.grove, 7, tiles.thicket, 3, tiles.rim, 6, tiles.metal, 5, tiles.metalSmall, 5, tiles.stone, 5, tiles.stoneSmall, 5, tiles.animals, 5, tiles.berries, 5)
        ],
        Math.round(openSpaceScale * thicketTrees / thicketTreesPerGroup),
        resourceRetries
    );

    // place metal

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.metal, expMetalPerGroup, expMetalPerGroup, 1, expMetalPerGroup)],
            true,
            tiles.metal
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.caldera, 7, tiles.metal, 25, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3)
        ],
        expMetalGroupsPerTeam,
        resourceRetries
    );

    // place stone

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.stone, expStonePerGroup, expStonePerGroup, 1, expStonePerGroup)],
            true,
            tiles.stone
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.caldera, 7, tiles.stone, 25, tiles.metal, 15, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3)
        ],
        expStoneGroupsPerTeam,
        resourceRetries
    );

    // place small metal

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.metalSmall, expMetalSmallPerGroup, expMetalSmallPerGroup, 1, expMetalSmallPerGroup)],
            true,
            tiles.metalSmall
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.caldera, 7, tiles.metalSmall, 25, tiles.metal, 25, tiles.stone, 15, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3)
        ],
        expMetalSmallGroupsPerTeam,
        resourceRetries
    );

    // place small stone

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.stoneSmall, expStoneSmallPerGroup, expStoneSmallPerGroup, 1, expStoneSmallPerGroup)],
            true,
            tiles.stoneSmall
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.caldera, 7, tiles.stoneSmall, 25, tiles.metalSmall, 15, tiles.metal, 25, tiles.stone, 15, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3)
        ],
        expStoneSmallGroupsPerTeam,
        resourceRetries
    );

    // place animals

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [
                new SimpleObject(gaia.gameLarge, animalsPerGroup * ratio1, animalsPerGroup * ratio1, 1, animalsPerGroup),
                new SimpleObject(gaia.gameMedium, animalsPerGroup * ratio2, animalsPerGroup * ratio2, 1, animalsPerGroup)
            ],
            true,
            tiles.animals
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.caldera, 7, tiles.stoneSmall, 5, tiles.metalSmall, 5, tiles.animals, 25, tiles.metal, 5, tiles.stone, 5, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3)
        ],
        Math.round(openSpaceScale * animals / animalsPerGroup),
        resourceRetries
    );

    // place berries

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.berryBush, berriesPerGroup, berriesPerGroup, 1, berriesPerGroup)],
            true,
            tiles.berries
        ),
        0,
        [
            stayClasses(tiles[teamExpTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 20, tiles.base, 20, tiles.forest, 5, tiles.grove, 4, tiles.thicket, 3, tiles.caldera, 15, tiles.stoneSmall, 5, tiles.metalSmall, 5, tiles.animals, 3, tiles.berries, 25, tiles.metal, 5, tiles.stone, 5)
        ],
        Math.round(openSpaceScale * berries / berriesPerGroup),
        resourceRetries
    );

    teamIndex++;
}
Engine.SetProgress(40);


// place team bonus resources

for (let key in teams) {

    // place metal

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.metal, bonusMetalPerGroup, bonusMetalPerGroup, 1, bonusMetalPerGroup)],
            true,
            tiles.metal
        ),
        0,
        [
            stayClasses(tiles[teamTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 20, tiles.base, 20, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.caldera, 7, tiles.stoneSmall, 5, tiles.metalSmall, 20, tiles.animals, 3, tiles.berries, 5, tiles.metal, 20, tiles.stone, 20)
        ],
        bonusMetalGroupsPerTeam,
        resourceRetries
    );

    // place stone

    // createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
    // SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
    // SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
    createObjectGroups(
        new SimpleGroup(
            [new SimpleObject(gaia.stone, bonusStonePerGroup, bonusStonePerGroup, 1, bonusStonePerGroup)],
            true,
            tiles.stone
        ),
        0,
        [
            stayClasses(tiles[teamTileClass(key)], 0),
            avoidClasses(tiles.baseResource, 20, tiles.base, 20, tiles.forest, 4, tiles.grove, 4, tiles.thicket, 4, tiles.caldera, 7, tiles.stoneSmall, 20, tiles.metalSmall, 5, tiles.animals, 3, tiles.berries, 5, tiles.metal, 20, tiles.stone, 20)
        ],
        bonusStoneGroupsPerTeam,
        resourceRetries
    );
}

Engine.SetProgress(60);

// add bumps
let bumpSize = Math.round(randIntInclusive(25, 75) * mapScale);
let bumpHeight = Math.round(randIntInclusive(10, 30) * mapScale);
let bumpCount = Math.round(randIntInclusive(40, 120) * mapScale);

// createAreas(centeredPlacer, painter, constraints, amount, retryFactor = 10)
// ClumpPlacer(size, coherence, smoothness, failFraction, centerPosition)
// scaleByMapSize(min, max, minMapSize = 128, maxMapSize = 512)
// SmoothElevationPainter(type, elevation, blendRadius, randomElevation)
// LayeredPainter(terrains, widths)
createAreas(
    new ClumpPlacer(bumpSize, 0.2, 0.06, 0),
    [
        new SmoothElevationPainter(ELEVATION_MODIFY, bumpHeight, bumpHeight),
        new LayeredPainter([terrain.bump], [])
    ],
    avoidClasses(tiles.caldera, 0, tiles.base, 1),
    bumpCount
);

g_Map.log(`Bumps: ${bumpCount}; size: ${bumpSize}; height: ${bumpHeight}`);

// add caldera bumps

let calderaBumpSize = Math.round(25 * mapScale);
let calderaBumpHeight = Math.round(15 * mapScale);
let calderaBumpCount = Math.round(25 * mapScale);

// createAreas(centeredPlacer, painter, constraints, amount, retryFactor = 10)
// ClumpPlacer(size, coherence, smoothness, failFraction, centerPosition)
// scaleByMapSize(min, max, minMapSize = 128, maxMapSize = 512)
// SmoothElevationPainter(type, elevation, blendRadius, randomElevation)
// LayeredPainter(terrains, widths)
createAreas(
    new ClumpPlacer(calderaBumpSize, 0.2, 0.06, 0),
    [
        new SmoothElevationPainter(ELEVATION_MODIFY, calderaBumpHeight, calderaBumpHeight),
        new LayeredPainter([terrain.calderaBump], [])
    ],
    stayClasses(tiles.caldera, 6),
    calderaBumpCount
);
Engine.SetProgress(70);

g_Map.log(`Caldera Bumps: ${calderaBumpCount}; size: ${calderaBumpSize}; height: ${calderaBumpHeight}`);

// add caldera grass

let calderaGrassCount = Math.round(50 * mapScale);

g_Map.log(`Caldera grass patches: ${calderaGrassCount}`);

// createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
// SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
// SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
createObjectGroups(
    new SimpleGroup(
        [
            new SimpleObject(actors.grassSmall, 3, 3, 0, 10),
            new SimpleObject(actors.bushSmall, 2, 2, 0, 10),
            new SimpleObject(actors.bushLarge, 1, 1, 0, 10),
            new SimpleObject(actors.rockMedium, 4, 4, 0, 5),
            new SimpleObject(actors.rockSmall, 7, 7, 0, 7),
        ],
        false,
        tiles.calderaGrass
    ),
    0,
    stayClasses(tiles.caldera, 4),
    calderaGrassCount
);
Engine.SetProgress(80);

// add grass patches

let grassCount = Math.round(randIntInclusive(150, 250) * mapScale);

g_Map.log(`Grass patches: ${grassCount}`);

// createObjectGroups(group, player, constraints, amount, retryFactor = 10, behaveDeprecated = false)
// SimpleGroup(objects, avoidSelf = false, tileClass = undefined, centerPosition = undefined)
// SimpleObject(templateName, minCount, maxCount, minDistance, maxDistance, minAngle = 0, maxAngle = 2 * Math.PI, avoidDistance = 1)
createObjectGroups(
    new SimpleGroup(
        [
            new SimpleObject(actors.grassSmall, 15, 30, 0, 10),
            new SimpleObject(actors.grassMedium, 5, 10, 0, 1),
            new SimpleObject(actors.grassLarge, 10, 20, 0, 7),
            new SimpleObject(actors.bushSmall, 2, 10, 0, 10),
            new SimpleObject(actors.bushMedium, 2, 6, 0, 3),
            new SimpleObject(actors.bushLarge, 4, 8, 0, 10)
        ],
        false,
        tiles.grass
    ),
    0,
    avoidClasses(tiles.base, 5, tiles.caldera, 1),
    grassCount
);
Engine.SetProgress(80);

// add terrain textures

// createArea(placer, painters, constraints)
// DiskPlacer(radius, centerPosition = undefined)
createArea(
    new DiskPlacer(mapRadius, mapCenter),
    new TerrainPainter(terrain.dirt),
    borderClasses(tiles.grove, 0, 3)
);

// createArea(placer, painters, constraints)
// DiskPlacer(radius, centerPosition = undefined)
createArea(
    new DiskPlacer(mapRadius, mapCenter),
    new TerrainPainter(terrain.forestFloor),
    borderClasses(tiles.forest, 0, 3)
);

g_Map.ExportMap();
