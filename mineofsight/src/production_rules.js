var mos_prod_rules = [

	{
		"must_not_be" : [],
		"must_be"     : [],
		"must_touch"  : [],
		"must_not_touch" : [],

		// mine - must be in range of a maxed out counter

		"new_tile" : 2,
	},

	{
		// empty - must be in range of a 0 counter
		"new_tile" : 100,
	},

	// adding hints is always free

	{
		"new_tile" : 1,
	},

	{
		"new_tile" : 2,
	},

	{
		"new_tile" : 11,
	},

	
	{
		"new_tile" : 49,	// zap
	},
];