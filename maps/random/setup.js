///////////
// define the map constants
///////////
const m = getSettings(randInt(1, 8));
const t = constTerrains();
const g = constGaia();
const p = constProps();
const tc = constTileClasses();
const f = constForests();

///////////
// Gaia
///////////

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

///////////
// Map
///////////

// paints the entire map with a single tile type
function initTerrain(terrain, tc, elevation)
{
	var placer = new ClumpPlacer(m.mapArea, 1, 1, 1, m.centerOfMap, m.centerOfMap);
	var terrainPainter = new LayeredPainter([terrain], []);
	var elevationPainter = new SmoothElevationPainter(ELEVATION_SET, elevation, 1);
	createArea(placer, [terrainPainter, elevationPainter, paintClass(tc)], null);

	// update the map height
	m.mapHeight = getHeight(m["centerOfMap"], m["centerOfMap"]);
}

// find the distance between two points
function separation(x1, z1, x2, z2)
{
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
}

// sets the map Biome
// copied from randomizeBiome(), but modified to allow the user to set the biome
function setBiome(biomeID)
{
	var random_sky = randInt(1,3)
	if (random_sky==1)
		setSkySet("cirrus");
	else if (random_sky ==2)
		setSkySet("cumulus");
	else if (random_sky ==3)
		setSkySet("sunny");
	setSunRotation(randFloat(0, TWO_PI));
	setSunElevation(randFloat(PI/ 6, PI / 3));

	setUnitsAmbientColor(0.57, 0.58, 0.55);
	setTerrainAmbientColor(0.447059, 0.509804, 0.54902);

	//temperate
	if (biomeID == 1){

		// temperate ocean blue, a bit too deep and saturated perhaps but it looks nicer.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.114, 0.192, 0.463);
		setWaterTint(0.255, 0.361, 0.651);
		setWaterWaviness(5.5);
		setWaterMurkiness(0.83);

		setFogThickness(0.25);
		setFogFactor(0.4);

		setPPEffect("hdr");
		setPPSaturation(0.62);
		setPPContrast(0.62);
		setPPBloom(0.3);

		if (randInt(2))
		{
			rbt1 = "alpine_grass";
			rbt2 = "temp_forestfloor_pine";
			rbt3 = "temp_grass_clovers_2";
			rbt5 = "alpine_grass_a";
			rbt6 = "alpine_grass_b";
			rbt7 = "alpine_grass_c";
			rbt12 = "temp_grass_mossy";
		}
		else
		{
			rbt1 = "temp_grass_long_b";
			rbt2 = "temp_forestfloor_pine";
			rbt3 = "temp_plants_bog";
			rbt5 = "temp_grass_d";
			rbt6 = "temp_grass_c";
			rbt7 = "temp_grass_clovers_2";
			rbt12 = "temp_grass_plants";
		}

		rbt4 = ["temp_cliff_a", "temp_cliff_b"];

		rbt8 = ["temp_dirt_gravel", "temp_dirt_gravel_b"];
		rbt9 = ["temp_dirt_gravel", "temp_dirt_gravel_b"];
		rbt10 = "temp_road";
		rbt11 = "temp_road_overgrown";

		rbt13 = "temp_mud_plants";
		rbt14 = "sand_grass_25";
		rbt15 = "medit_sand_wet";

		// gaia entities
		var random_trees = randInt(3);

		if (random_trees == 0)
		{
			rbe1 = "gaia/flora_tree_oak";
			rbe2 = "gaia/flora_tree_oak_large";
		}
		else if (random_trees == 1)
		{
			rbe1 = "gaia/flora_tree_poplar";
			rbe2 = "gaia/flora_tree_poplar";
		}
		else
		{
			rbe1 = "gaia/flora_tree_euro_beech";
			rbe2 = "gaia/flora_tree_euro_beech";
		}
		rbe3 = "gaia/flora_tree_apple";
		random_trees = randInt(3);
		if (random_trees == 0)
		{
			rbe4 = "gaia/flora_tree_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}
		else if (random_trees == 1)
		{
			rbe4 = "gaia/flora_tree_pine";
			rbe5 = "gaia/flora_tree_pine";
		}
		else
		{
			rbe4 = "gaia/flora_tree_aleppo_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_sheep";
		rbe11 = "gaia/geology_stonemine_temperate_quarry";
		rbe12 = "gaia/geology_stone_temperate";
		rbe13 = "gaia/geology_metal_temperate_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_large_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_medit_me.xml";
		rba8 = "actor|props/flora/bush_medit_sm.xml";
		rba9 = "actor|flora/trees/oak.xml";
	}
	//snowy
	else if (biomeID == 2)
	{
		setSunColor(0.550, 0.601, 0.644);				// a little darker
		// Water is a semi-deep blue, fairly wavy, fairly murky for an ocean.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.067, 0.212, 0.361);
		setWaterTint(0.4, 0.486, 0.765);
		setWaterWaviness(5.5);
		setWaterMurkiness(0.83);

		rbt1 = ["polar_snow_b", "snow grass 75", "snow rocks", "snow forest"];
		rbt2 = "polar_tundra_snow";
		rbt3 = "polar_tundra_snow";
		rbt4 = ["alpine_cliff_a", "alpine_cliff_b"];
		rbt5 = "polar_snow_a";
		rbt6 = "polar_ice_snow";
		rbt7 = "polar_ice";
		rbt8 = ["polar_snow_rocks", "polar_cliff_snow"];
		rbt9 = "snow grass 2";
		rbt10 = "new_alpine_citytile";
		rbt11 = "polar_ice_cracked";
		rbt12 = "snow grass 2";
		rbt13 = "polar_ice";
		rbt14 = "alpine_shore_rocks_icy";
		rbt15 = "alpine_shore_rocks";

		// gaia entities
		rbe1 = "gaia/flora_tree_pine_w";
		rbe2 = "gaia/flora_tree_pine_w";
		rbe3 = "gaia/flora_tree_pine_w";
		rbe4 = "gaia/flora_tree_pine_w";
		rbe5 = "gaia/flora_tree_pine";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_muskox";
		rbe9 = "gaia/fauna_fish_tuna";
		rbe10 = "gaia/fauna_walrus";
		rbe11 = "gaia/geology_stonemine_alpine_quarry";
		rbe12 = "gaia/geology_stone_alpine_a";
		rbe13 = "gaia/geology_metal_alpine_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/pine_w.xml";

		setFogFactor(0.6);
		setFogThickness(0.21);
		setPPSaturation(0.37);
		setPPEffect("hdr");
	}
	//desert
	else if (biomeID == 3)
	{
		setSunColor(0.733, 0.746, 0.574);

		// Went for a very clear, slightly blue-ish water in this case, basically no waves.
		setWaterColor(0, 0.227, 0.843);
		setWaterTint(0, 0.545, 0.859);
		setWaterWaviness(1);
		setWaterMurkiness(0.22);

		setFogFactor(0.5);
		setFogThickness(0.0);
		setFogColor(0.852, 0.746, 0.493);

		setPPEffect("hdr");
		setPPContrast(0.67);
		setPPSaturation(0.42);
		setPPBloom(0.23);

		rbt1 = ["desert_dirt_rough", "desert_dirt_rough_2", "desert_sand_dunes_50", "desert_sand_smooth"];
		rbt2 = "forestfloor_dirty";
		rbt3 = "desert_forestfloor_palms";
		rbt4 = ["desert_cliff_1", "desert_cliff_2", "desert_cliff_3", "desert_cliff_4", "desert_cliff_5"];
		rbt5 = "desert_dirt_rough";
		rbt6 = "desert_dirt_rocks_1";
		rbt7 = "desert_dirt_rocks_2";
		rbt8 = ["desert_dirt_rocks_1", "desert_dirt_rocks_2", "desert_dirt_rocks_3"];
		rbt9 = ["desert_lakebed_dry", "desert_lakebed_dry_b"];
		rbt10 = "desert_city_tile";
		rbt11 = "desert_city_tile";
		rbt12 = "desert_dirt_rough";
		rbt13 = "desert_shore_stones";
		rbt14 = "desert_sand_smooth";
		rbt15 = "desert_sand_wet";

		// gaia entities
		if (randInt(2))
		{
			rbe1 = "gaia/flora_tree_cretan_date_palm_short";
			rbe2 = "gaia/flora_tree_cretan_date_palm_tall";
		}
		else
		{
			rbe1 = "gaia/flora_tree_date_palm";
			rbe2 = "gaia/flora_tree_date_palm";
		}
		rbe3 = "gaia/flora_tree_fig";
		if (randInt(2))
		{
			rbe4 = "gaia/flora_tree_tamarix";
			rbe5 = "gaia/flora_tree_tamarix";
		}
		else
		{
			rbe4 = "gaia/flora_tree_senegal_date_palm";
			rbe5 = "gaia/flora_tree_senegal_date_palm";
		}
		rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_camel";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_gazelle";
		rbe11 = "gaia/geology_stonemine_desert_quarry";
		rbe12 = "gaia/geology_stone_desert_small";
		rbe13 = "gaia/geology_metal_desert_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba5 = "actor|geology/stone_desert_med.xml";
		rba6 = "actor|geology/stone_desert_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/palm_date.xml";
	}
	//alpine
	else if (biomeID == 4)
	{
		// simulates an alpine lake, fairly deep.
		// this is not intended for a clear running river, or even an ocean.
		setWaterColor(0.0, 0.047, 0.286);				// dark majestic blue
		setWaterTint(0.471, 0.776, 0.863);				// light blue
		setWaterMurkiness(0.82);
		setWaterWaviness(2);

		setFogThickness(0.26);
		setFogFactor(0.4);

		setPPEffect("hdr");
		setPPSaturation(0.48);
		setPPContrast(0.53);
		setPPBloom(0.12);

		rbt1 = ["alpine_dirt_grass_50"];
		rbt2 = "alpine_forrestfloor";
		rbt3 = "alpine_forrestfloor";
		rbt4 = ["alpine_cliff_a", "alpine_cliff_b", "alpine_cliff_c"];
		rbt5 = "alpine_dirt";
		rbt6 = ["alpine_grass_snow_50", "alpine_dirt_snow", "alpine_dirt_snow"];
		rbt7 = ["alpine_snow_a", "alpine_snow_b"];
		rbt8 = "alpine_cliff_snow";
		rbt9 = ["alpine_dirt", "alpine_grass_d"];
		rbt10 = "new_alpine_citytile";
		rbt11 = "new_alpine_citytile";
		rbt12 = "new_alpine_grass_a";
		rbt13 = "alpine_shore_rocks";
		rbt14 = "alpine_shore_rocks_grass_50";
		rbt15 = "alpine_shore_rocks";

		// gaia entities
		rbe1 = "gaia/flora_tree_pine";
		rbe2 = "gaia/flora_tree_pine";
		rbe3 = "gaia/flora_tree_pine";
		rbe4 = "gaia/flora_tree_pine";
		rbe5 = "gaia/flora_tree_pine";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_goat";
		rbe9 = "gaia/fauna_fish_tuna";
		rbe10 = "gaia/fauna_deer";
		rbe11 = "gaia/geology_stonemine_alpine_quarry";
		rbe12 = "gaia/geology_stone_alpine_a";
		rbe13 = "gaia/geology_metal_alpine_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_a.xml";
		rba8 = "actor|props/flora/bush_desert_a.xml";
		rba9 = "actor|flora/trees/pine.xml";
	}
	//medit
	else if (biomeID == 5)
	{
		// Guess what, this is based on the colors of the mediterranean sea.
		setWaterColor(0.024,0.212,0.024);
		setWaterTint(0.133, 0.725,0.855);
		setWaterWaviness(3);
		setWaterMurkiness(0.8);

		setFogFactor(0.3);
		setFogThickness(0.25);

		setPPEffect("hdr");
		setPPContrast(0.62);
		setPPSaturation(0.51);
		setPPBloom(0.12);

		rbt1 = ["medit_grass_field_a", "medit_grass_field_b"];
		rbt2 = "medit_grass_field";
		rbt3 = "medit_grass_shrubs";
		rbt4 = ["medit_cliff_grass", "medit_cliff_greek", "medit_cliff_greek_2", "medit_cliff_aegean", "medit_cliff_italia", "medit_cliff_italia_grass"];
		rbt5 = "medit_grass_field_b";
		rbt6 = "medit_grass_field_brown";
		rbt7 = "medit_grass_field_dry";
		rbt8 = ["medit_rocks_grass_shrubs", "medit_rocks_shrubs"];
		rbt9 = ["medit_dirt", "medit_dirt_b"];
		rbt10 = "medit_city_tile";
		rbt11 = "medit_city_tile";
		rbt12 = "medit_grass_wild";
		rbt13 = "medit_sand";
		rbt14 = "sand_grass_25";
		rbt15 = "medit_sand_wet";

		// gaia entities
		var random_trees = randInt(3);

		if (random_trees == 0)
		{
			rbe1 = "gaia/flora_tree_cretan_date_palm_short";
			rbe2 = "gaia/flora_tree_cretan_date_palm_tall";
		}
		else if (random_trees == 1)
		{
			rbe1 = "gaia/flora_tree_carob";
			rbe2 = "gaia/flora_tree_carob";
		}
		else
		{
			rbe1 = "gaia/flora_tree_medit_fan_palm";
			rbe2 = "gaia/flora_tree_medit_fan_palm";
		}

		if (randInt(2))
		{
			rbe3 = "gaia/flora_tree_apple";
		}
		else
		{
			rbe3 = "gaia/flora_tree_poplar_lombardy";
		}

		if (randInt(2))
		{
			rbe4 = "gaia/flora_tree_cypress";
			rbe5 = "gaia/flora_tree_cypress";
		}
		else
		{
			rbe4 = "gaia/flora_tree_aleppo_pine";
			rbe5 = "gaia/flora_tree_aleppo_pine";
		}

		if (randInt(2))
			rbe6 = "gaia/flora_bush_berry";
		else
			rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_sheep";
		rbe11 = "gaia/geology_stonemine_medit_quarry";
		rbe12 = "gaia/geology_stone_mediterranean";
		rbe13 = "gaia/geology_metal_mediterranean_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_large_tall.xml";
		rba2 = "actor|props/flora/grass_soft_large.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_medit_me.xml";
		rba8 = "actor|props/flora/bush_medit_sm.xml";
		rba9 = "actor|flora/trees/palm_cretan_date.xml";
	}
	//savanah
	else if (biomeID == 6)
	{
		// Using the Malawi as a reference, in parts where it's not too murky from a river nearby.
		setWaterColor(0.055,0.176,0.431);
		setWaterTint(0.227,0.749,0.549);
		setWaterWaviness(1.5);
		setWaterMurkiness(0.77);

		setFogFactor(0.25);
		setFogThickness(0.15);
		setFogColor(0.847059, 0.737255, 0.482353);

		setPPEffect("hdr");
		setPPContrast(0.57031);
		setPPBloom(0.34);

		rbt1 = ["savanna_grass_a", "savanna_grass_b"];
		rbt2 = "savanna_forestfloor_a";
		rbt3 = "savanna_forestfloor_b";
		rbt4 = ["savanna_cliff_a", "savanna_cliff_b"];
		rbt5 = "savanna_shrubs_a";
		rbt6 = "savanna_dirt_rocks_b";
		rbt7 = "savanna_dirt_rocks_a";
		rbt8 = ["savanna_grass_a", "savanna_grass_b"];
		rbt9 = ["savanna_dirt_rocks_b", "dirt_brown_e"];
		rbt10 = "savanna_tile_a";
		rbt11 = "savanna_tile_a";
		rbt12 = "savanna_grass_a";
		rbt13 = "savanna_riparian";
		rbt14 = "savanna_riparian_bank";
		rbt15 = "savanna_riparian_wet";

		// gaia entities
		rbe1 = "gaia/flora_tree_baobab";
		rbe2 = "gaia/flora_tree_baobab";
		rbe3 = "gaia/flora_tree_baobab";
		rbe4 = "gaia/flora_tree_baobab";
		rbe5 = "gaia/flora_tree_baobab";
		rbe6 = "gaia/flora_bush_grapes";
		rbe7 = "gaia/fauna_chicken";
		var rts = randInt(1,4);
		if (rts==1){
			rbe8 = "gaia/fauna_wildebeest";
		}
		else if (rts==2)
		{
			rbe8 = "gaia/fauna_zebra";
		}
		else if (rts==3)
		{
			rbe8 = "gaia/fauna_giraffe";
		}
		else if (rts==4)
		{
			rbe8 = "gaia/fauna_elephant_african_bush";
		}
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_gazelle";
		rbe11 = "gaia/geology_stonemine_desert_quarry";
		rbe12 = "gaia/geology_stone_savanna_small";
		rbe13 = "gaia/geology_metal_savanna_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_savanna.xml";
		rba2 = "actor|props/flora/grass_medit_field.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_a.xml";
		rba4 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba5 = "actor|geology/stone_savanna_med.xml";
		rba6 = "actor|geology/stone_savanna_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_dry_a.xml";
		rba9 = "actor|flora/trees/baobab.xml";
	}
	//tropic
	else if (biomeID == 7)
	{

		// Bora-Bora ish. Quite transparent, not wavy.
		// Mostly for shallow maps. Maps where the water level goes deeper should use a much darker Water Color to simulate deep water holes.
		setWaterColor(0.584,0.824,0.929);
		setWaterTint(0.569,0.965,0.945);
		setWaterWaviness(1.5);
		setWaterMurkiness(0.35);

		setFogFactor(0.4);
		setFogThickness(0.2);

		setPPEffect("hdr");
		setPPContrast(0.67);
		setPPSaturation(0.62);
		setPPBloom(0.6);

		rbt1 = ["tropic_grass_c", "tropic_grass_c", "tropic_grass_c", "tropic_grass_c", "tropic_grass_plants", "tropic_plants", "tropic_plants_b"];
		rbt2 = "tropic_plants_c";
		rbt3 = "tropic_plants_c";
		rbt4 = ["tropic_cliff_a", "tropic_cliff_a", "tropic_cliff_a", "tropic_cliff_a_plants"];
		rbt5 = "tropic_grass_c";
		rbt6 = "tropic_grass_plants";
		rbt7 = "tropic_plants";
		rbt8 = ["tropic_cliff_grass"];
		rbt9 = ["tropic_dirt_a", "tropic_dirt_a_plants"];
		rbt10 = "tropic_citytile_a";
		rbt11 = "tropic_citytile_plants";
		rbt12 = "tropic_plants_b";
		rbt13 = "temp_mud_plants";
		rbt14 = "tropic_beach_dry_plants";
		rbt15 = "tropic_beach_dry";

		// gaia entities
		rbe1 = "gaia/flora_tree_toona";
		rbe2 = "gaia/flora_tree_toona";
		rbe3 = "gaia/flora_tree_palm_tropic";
		rbe4 = "gaia/flora_tree_palm_tropic";
		rbe5 = "gaia/flora_tree_palm_tropic";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_peacock";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_tiger";
		rbe11 = "gaia/geology_stonemine_tropic_quarry";
		rbe12 = "gaia/geology_stone_tropic_a";
		rbe13 = "gaia/geology_metal_tropic_slabs";

		// decorative props
		rba1 = "actor|props/flora/plant_tropic_a.xml";
		rba2 = "actor|props/flora/plant_lg.xml";
		rba3 = "actor|props/flora/reeds_pond_lush_b.xml";
		rba4 = "actor|props/flora/water_lillies.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/plant_tropic_large.xml";
		rba8 = "actor|props/flora/plant_tropic_large.xml";
		rba9 = "actor|flora/trees/tree_tropic.xml";
	}
	//autumn
	else if (biomeID == 8)
	{

		// basically temperate with a reddish twist in the reflection and the tint. Also less wavy.
		// this assumes ocean settings, maps that aren't oceans should reset.
		setWaterColor(0.157, 0.149, 0.443);
		setWaterTint(0.443,0.42,0.824);
		setWaterWaviness(2.5);
		setWaterMurkiness(0.83);

		setFogFactor(0.35);
		setFogThickness(0.22);
		setFogColor(0.82,0.82, 0.73);
		setPPSaturation(0.56);
		setPPContrast(0.56);
		setPPBloom(0.38);
		setPPEffect("hdr");

		rbt1 = ["temp_grass_aut", "temp_grass_aut", "temp_grass_d_aut"];
		rbt2 = "temp_plants_bog_aut";
		rbt3 = "temp_forestfloor_aut";
		rbt4 = ["temp_cliff_a", "temp_cliff_b"];
		rbt5 = "temp_grass_plants_aut";
		rbt6 = ["temp_grass_b_aut", "temp_grass_c_aut"];
		rbt7 = ["temp_grass_b_aut", "temp_grass_long_b_aut"];
		rbt8 = "temp_highlands_aut";
		rbt9 = ["temp_cliff_a", "temp_cliff_b"];
		rbt10 = "temp_road_aut";
		rbt11 = "temp_road_overgrown_aut";
		rbt12 = "temp_grass_plants_aut";
		rbt13 = "temp_grass_plants_aut";
		rbt14 = "temp_forestfloor_pine";
		rbt15 = "medit_sand_wet";

		// gaia entities
		rbe1 = "gaia/flora_tree_euro_beech_aut";
		rbe2 = "gaia/flora_tree_euro_beech_aut";
		rbe3 = "gaia/flora_tree_pine";
		rbe4 = "gaia/flora_tree_oak_aut";
		rbe5 = "gaia/flora_tree_oak_aut";
		rbe6 = "gaia/flora_bush_berry";
		rbe7 = "gaia/fauna_chicken";
		rbe8 = "gaia/fauna_deer";
		rbe9 = "gaia/fauna_fish";
		rbe10 = "gaia/fauna_rabbit";
		rbe11 = "gaia/geology_stonemine_temperate_quarry";
		rbe12 = "gaia/geology_stone_temperate";
		rbe13 = "gaia/geology_metal_temperate_slabs";

		// decorative props
		rba1 = "actor|props/flora/grass_soft_dry_small_tall.xml";
		rba2 = "actor|props/flora/grass_soft_dry_large.xml";
		rba3 = "actor|props/flora/reeds_pond_dry.xml";
		rba4 = "actor|geology/stone_granite_large.xml";
		rba5 = "actor|geology/stone_granite_large.xml";
		rba6 = "actor|geology/stone_granite_med.xml";
		rba7 = "actor|props/flora/bush_desert_dry_a.xml";
		rba8 = "actor|props/flora/bush_desert_dry_a.xml";
		rba9 = "actor|flora/trees/european_beech_aut.xml";
	}

}

///////////
// Defaults
///////////

// default to 10% deviation
function deviationOrDefault(deviation)
{
	return optionalParam(deviation, 0.1);
}

// default to 0.3 distance
function distanceOrDefault(distance)
{
	return optionalParam(distance, 0.3);
}

// default to filling 100% of the map
function fillOrDefault(fill)
{
	return optionalParam(fill, 1)
}

// default to 0.05 distance between teammates
function groupedDistanceOrDefault(groupedDistance)
{
	return optionalParam(groupedDistance, 0.05);
}

// default to 100% of normal size
function sizeOrDefault(size)
{
	return optionalParam(size, 1);
}

// default to "radial" placement
function typeOrDefault(type)
{
	return optionalParam(type, "radial");
}

///////////
// Players
///////////

/////////////////////////////////////////
// addBases
//
// Function for creating player bases
//
// type: "radial", "stacked", "stronghold", "random"
// distance: radial distance from the center of the map
//
/////////////////////////////////////////
function addBases(type, distance, groupedDistance)
{
	type = typeOrDefault(type);
	distance = distanceOrDefault(distance);
	groupedDistance = groupedDistanceOrDefault(groupedDistance);
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

/////////////////////////////////////////
// createBase
//
// Function for creating a single player base
//
// player: An object with the player's attributes (id, angle, x, z)
// walls: Iberian walls (true/false)
//
/////////////////////////////////////////
function createBase(player, walls)
{
	// get the x and z in tiles
	var fx = fractionToTiles(player.x);
	var fz = fractionToTiles(player.z);
	var ix = round(fx);
	var iz = round(fz);
	addToClass(ix, iz, tc.player);
	addToClass(ix + 5, iz, tc.player);
	addToClass(ix, iz + 5, tc.player);
	addToClass(ix - 5, iz, tc.player);
	addToClass(ix, iz - 5, tc.player);

	// create starting units
	if ((walls || walls === undefined) && m.mapSize > 192)
		placeCivDefaultEntities(fx, fz, player.id, m.mapRadius);
	else
		placeCivDefaultEntities(fx, fz, player.id, m.mapRadius, {'iberWall': false});

	// create the city patch
	var cityRadius = scaleByMapSize(15, 25) / 3;
	var placer = new ClumpPlacer(PI * cityRadius * cityRadius, 0.6, 0.3, 10, ix, iz);
	var painter = new LayeredPainter([t.roadWild, t.road], [1]);
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
			[new SimpleObject(g.chicken, 5, 5, 0, 2)],
			true, tc.baseResource, aX, aZ
		);
		createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));
	}

	// create berry bushes
	var bbAngle = randFloat(0, TWO_PI);
	var bbDist = 12;
	var bbX = round(fx + bbDist * cos(bbAngle));
	var bbZ = round(fz + bbDist * sin(bbAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.fruitBush, 5, 5, 0, 3)],
		true, tc.baseResource, bbX, bbZ
	);
	createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));

	// create metal mine
	var mAngle = bbAngle;
	while(abs(mAngle - bbAngle) < PI / 3)
		mAngle = randFloat(0, TWO_PI);

	var mDist = 12;
	var mX = round(fx + mDist * cos(mAngle));
	var mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.metalLarge, 1, 1, 0, 0)],
		true, tc.baseResource, mX, mZ
	);
	createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));

	// create stone mines
	mAngle += randFloat(PI / 8, PI / 4);
	mX = round(fx + mDist * cos(mAngle));
	mZ = round(fz + mDist * sin(mAngle));
	group = new SimpleGroup(
		[new SimpleObject(g.stoneLarge, 1, 1, 0, 2)],
		true, tc.baseResource, mX, mZ
	);
	createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));

	var hillSize = PI * m.mapRadius * m.mapRadius;

	// create starting trees
	var num = 5;
	var tAngle = randFloat(0, TWO_PI);
	var tDist = randFloat(12, 13);
	var tX = round(fx + tDist * cos(tAngle));
	var tZ = round(fz + tDist * sin(tAngle));

	group = new SimpleGroup(
		[new SimpleObject(g.tree1, num, num, 0, 3)],
		false, tc.baseResource, tX, tZ
	);
	createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));

	// create grass tufts
	var num = hillSize / 250;
	for (var j = 0; j < num; j++)
	{
		var gAngle = randFloat(0, TWO_PI);
		var gDist = m.mapRadius - (5 + randInt(7));
		var gX = round(fx + gDist * cos(gAngle));
		var gZ = round(fz + gDist * sin(gAngle));
		group = new SimpleGroup(
			[new SimpleObject(p.grassShort, 2, 5, 0, 1, -PI / 8, PI / 8)],
			false, tc.baseResource, gX, gZ
		);
		createObjectGroup(group, 0, avoidClasses(tc.baseResource, 2));
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
			teams[8 - ffaPlayers] = new Array();
			teams[8 - ffaPlayers].push(i + 1);
			ffaPlayers++;
			numTeams++;
		}
		else
		{
			if (teams[team] == null)
			{
				teams[team] = new Array();
				numTeams++;
			}
			teams[team].push(i+1);
		}
	}

	// consolidate the array
	var setTeams = new Array();
	var currentTeam = 0;
	for (var i = 1; i < 9; ++i)
	{
		if (teams[i] !== undefined)
		{
			setTeams[currentTeam] = teams[i];
			currentTeam++;
		}
	}

	return setTeams;
}

// picks a random starting style
function getStartingPositions()
{
	var starting = {};
	var formats = ["radial"];

	// enable stronghold if we have a few teams and a big enough map
	if (m.teams.length >= 2 && m.numPlayers >= 4 && m.mapSize >= 256)
		formats.push("stronghold");

	// enable random if we have enough teams or enough players on a big enough map
	if (m.mapSize >= 256 && (m.teams.length >= 3 || m.numPlayers > 4))
		formats.push("random");

	// enable line if we have enough teams and players on a big enough map
	if (m.teams.length >= 2 && m.numPlayers >= 4 && m.mapSize >= 384)
		formats.push("line");

	var use = randInt(formats.length);

	starting["setup"] = formats[use];
	starting["distance"] = getRand(0.2, 0.35, 100);
	starting["separation"] = getRand(0.05, 0.1, 100);

	return starting;
}

// randomize player order
function randomizePlayers()
{
	var playerIDs = [];
	for (var i = 0; i < m.numPlayers; i++)
		playerIDs.push(i + 1);

	playerIDs = sortPlayers(playerIDs);

	return playerIDs
}

/////////////////////////////////////////
// placeLine
//
// Function for placing teams in a line pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
//
/////////////////////////////////////////
function placeLine(playerIDs, distance, groupedDistance)
{
	var players = new Array();

	for (var i = 0; i < m.teams.length; ++i) {
		var safeDist = distance;
		if (distance + m.teams[i].length * groupedDistance > 0.45)
			safeDist = 0.45 - m.teams[i].length * groupedDistance;

		var teamAngle = m.startAngle + (i + 1) * TWO_PI / m.teams.length;

		// create player base
		for (var p = 0; p < m.teams[i].length; ++p)
		{
			var player = {"id": m.teams[i][p], "angle": m.startAngle + (p + 1) * TWO_PI / m.teams[i].length};
			player["x"] = 0.5 + (safeDist + p * groupedDistance) * cos(teamAngle);
			player["z"] = 0.5 + (safeDist + p * groupedDistance) * sin(teamAngle);
			players[m.teams[i][p]] = player;
			createBase(players[m.teams[i][p]], false)
		}
	}

	return players;
}

/////////////////////////////////////////
// placeRadial
//
// Function for placing players in a radial pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
//
/////////////////////////////////////////
function placeRadial(playerIDs, distance)
{
	var players = new Array();

	for (var i = 0; i < m.numPlayers; ++i)
	{
		players[i] = {"id": playerIDs[i], "angle": m.startAngle + i * TWO_PI / m.numPlayers};
		players[i]["x"] = 0.5 + distance * cos(players[i].angle);
		players[i]["z"] = 0.5 + distance * sin(players[i].angle);

		createBase(players[i])
	}

	return players;
}

/////////////////////////////////////////
// placeRandom
//
// Function for placing players in a random pattern
//
// playerIDs: array of randomized playerIDs
//
/////////////////////////////////////////
function placeRandom(playerIDs)
{
	var players = new Array();
	var placed = new Array();

	for (var i = 0; i < m.numPlayers; ++i)
	{
		var attempts = 0;
		var playerAngle = randFloat(0, TWO_PI);
		var distance = randFloat(0, 0.42);
		var x = 0.5 + distance * cos(playerAngle);
		var z = 0.5 + distance * sin(playerAngle);

		var tooClose = false;
		for (var j = 0; j < placed.length; ++j)
		{
			var sep = separation(x, z, placed[j].x, placed[j].z);
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

		players[i] = {"id": playerIDs[i], "angle": playerAngle, "x": x, "z": z};
		placed.push(players[i]);
	}

	// create the bases
	for (var i = 0; i < m.numPlayers; ++i)
		createBase(players[i]);

	return players;
}

/////////////////////////////////////////
// placeStronghold
//
// Function for placing teams in a stronghold pattern
//
// playerIDs: array of randomized playerIDs
// distance: radial distance from the center of the map
// groupedDistance: distance between teammates
//
/////////////////////////////////////////
function placeStronghold(playerIDs, distance, groupedDistance)
{
	var players = new Array();

	for (var i = 0; i < m.teams.length; ++i) {
		var teamAngle = m.startAngle + (i + 1) * TWO_PI / m.teams.length;
		var fractionX = 0.5 + distance * cos(teamAngle);
		var fractionZ = 0.5 + distance * sin(teamAngle);

		// if we have a team of above average size, make sure they're spread out
		if (m.teams[i].length > 4)
			groupedDistance = getRand(0.08, 0.12, 100);

		// if we have a team of below average size, make sure they're together
		if (m.teams[i].length < 3)
			groupedDistance = getRand(0.04, 0.06, 100);

		// if we have a solo player, place them on the center of the team's location
		if (m.teams[i].length == 1)
			groupedDistance = 0;

		// create player base
		for (var p = 0; p < m.teams[i].length; ++p)
		{
			var player = {"id": m.teams[i][p], "angle": m.startAngle + (p + 1) * TWO_PI / m.teams[i].length};
			player["x"] = fractionX + groupedDistance * cos(player.angle);
			player["z"] = fractionZ + groupedDistance * sin(player.angle);
			players[m.teams[i][p]] = player;
			createBase(players[m.teams[i][p]], false)
		}
	}

	return players;
}

///////////
// Constants
///////////

// terrains
function constTerrains()
{
	var t = {};
	t["mainTerrain"] = rBiomeT1();
	t["forestFloor1"] = rBiomeT2();
	t["forestFloor2"] = rBiomeT3();
	t["cliff"] = rBiomeT4();
	t["tier1Terrain"] = rBiomeT5();
	t["tier2Terrain"] = rBiomeT6();
	t["tier3Terrain"] = rBiomeT7();
	t["hill"] = rBiomeT8();
	t["dirt"] = rBiomeT9();
	t["road"] = rBiomeT10();
	t["roadWild"] = rBiomeT11();
	t["tier4Terrain"] = rBiomeT12();
	t["shoreBlend"] = rBiomeT13();
	t["shore"] = rBiomeT14();
	t["water"] = rBiomeT15();
	return t;
}

// gaia entities
function constGaia()
{
	var g = {};
	g["tree1"] = rBiomeE1();
	g["tree2"] = rBiomeE2();
	g["tree3"] = rBiomeE3();
	g["tree4"] = rBiomeE4();
	g["tree5"] = rBiomeE5();
	g["fruitBush"] = rBiomeE6();
	g["chicken"] = rBiomeE7();
	g["mainHuntableAnimal"] = rBiomeE8();
	g["fish"] = rBiomeE9();
	g["secondaryHuntableAnimal"] = rBiomeE10();
	g["stoneLarge"] = rBiomeE11();
	g["stoneSmall"] = rBiomeE12();
	g["metalLarge"] = rBiomeE13();
	return g;
}

// props
function constProps()
{
	var p = {};
	p["grass"] = rBiomeA1();
	p["grassShort"] = rBiomeA2();
	p["reeds"] = rBiomeA3();
	p["lillies"] = rBiomeA4();
	p["rockLarge"] = rBiomeA5();
	p["rockMedium"] = rBiomeA6();
	p["bushMedium"] = rBiomeA7();
	p["bushSmall"] = rBiomeA8();
	return p;
}

// tile classes
function constTileClasses(newClasses)
{
	var defaultClasses = ["animals", "baseResource", "berries", "bluff", "bluffSlope", "dirt", "fish", "food", "forest", "hill", "land", "map", "metal", "mountain", "player", "ramp", "rock", "settlement", "spine", "valley", "water"];
	var classes = defaultClasses;
	if (newClasses !== undefined)
		classes = defaultClasses.concat(newClasses)

	var tc = {};
	for (var i = 0; i < classes.length; ++i)
		tc[classes[i]] = createTileClass();

	return tc;
}

// forests
function constForests()
{
	var f = {};
	f["forest1"] = [t.forestFloor2 + TERRAIN_SEPARATOR + g.tree1, t.forestFloor2 + TERRAIN_SEPARATOR + g.tree2, t.forestFloor2];
	f["forest2"] = [t.forestFloor1 + TERRAIN_SEPARATOR + g.tree4, t.forestFloor1 + TERRAIN_SEPARATOR + g.tree5, t.forestFloor1];
	return f;
}

// put some useful map settings into an object
function getSettings(biomeID)
{
	var m = {};
	setBiome(biomeID);
	m["biome"] = biomeID;
	m["numPlayers"] = getNumPlayers();
	m["mapSize"] = getMapSize();
	m["mapArea"] = m["mapSize"] * m["mapSize"];
	m["centerOfMap"] = floor(m["mapSize"] / 2);
	m["mapHeight"] = getHeight(m["centerOfMap"], m["centerOfMap"]);
	m["mapRadius"] = -PI / 4;
	m["teams"] = getTeams(m["numPlayers"]);
	m["startAngle"] = randFloat(0, TWO_PI);
	return m;
}

///////////
// Generic Helpers
///////////

// gets a number of elements from a randomized array
function randArray(array)
{
	var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

	return array;
}

// gets a random number between two values
function getRand(min, max, factor)
{
	return ((min * factor) + randInt((max - min) * factor)) / factor;
}

// gets a number within a random deviation of a base number
function getRandomDeviation(base, randomness)
{
	if (randomness > base)
		randomness = base;

	var deviation = base + (-1 * randomness + (randInt(20 * randomness) + 0.0001) / 10);
	return floor(deviation * 100) / 100;
}

// return a parameteter or it's default value
function optionalParam(param, defaultVal)
{
	return param || defaultVal;
}
