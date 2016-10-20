GameEngineClass = Class.extend({

	state_stack: null,

	dialog_box: "",

	//factory: {},
	//entities: [],	// moved to play state

	//-----------------------------

	init: function() {
		this.state_stack = new Array();
		this.dialog_box = "";
	},

	setup: function () {

		

		// Call our input setup method to bind
		// our keys to actions and set the
		// event listeners.
		gInputEngine.setup();

		// Notice that we don't setup the factory
		// here! We set it up in each individual
		// Entity's defining file.
		// e.g: At the bottom of LandmineClass.js
		// gGameEngine.factory['Landmine'] = LandmineClass;
	},

	change_state: function(new_state) {
		this.pop_state();
		this.push_state(new_state);
	},

	push_state: function(new_state) {
		//console.log("Pushed new state");
		this.state_stack.push(new_state);
	},

	pop_state: function() {
		this.state_stack.pop();
		// Garbage collector will handle this state?
	},

	get_state:function() {
		return this.state_stack[this.state_stack.length - 1];
	},

	on_screen_resize: function() {
		if(this.state_stack.length == 0) return;
		this.state_stack[this.state_stack.length - 1].screen_resized(this);
	},

	handle_events: function(x, y, event_type) {

		if(event_type == Types.Events.MOUSE_CLICK ) {
			this.dialog_box = "";
		}

		// Call handle_eventson the topmost element of the state stack
		//console.log("Event received by game engine");
		this.state_stack[this.state_stack.length - 1].handle_events(this, x, y, event_type);

		
		
	},

	bullet_update: function() {
		this.state_stack[this.state_stack.length - 1].update_bullets();
	},

	update: function () {
		// Call update on the topmost element of the state stack
		this.state_stack[this.state_stack.length - 1].update(this);	
	},

	reset:function() {

		this.state_stack = new Array();

		menu_state = new MainMenuStateClass();

		gGameEngine.push_state(menu_state);
	},

	draw: function() {
		// Call draw on the topmost element of the state stack
		this.state_stack[this.state_stack.length - 1].draw(this);	

		
	}	

});

gGameEngine = new GameEngineClass();
