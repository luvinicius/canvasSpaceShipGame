CanvasInvadersEngine.Screen =  class Screen extends CanvasInvadersEngine.Updatable{
	static get STATES(){
		return {
			STARTING:0,
			RUNNING:0,
			PAUSING:0,
			PAUSED:1,
			RESUMING:0,
			STOPPING:0,
			STOPED:0
		};
	}

	get STATES(){
		return this.class.STATES;
	}

	constructor(game, width, height){
		super(game);
		this.state = CanvasInvadersEngine.Screen.STATES.STOPED;
		this._eventsListeners = {};
		this.width = width;
		this.height = height;
	}

	addEventListener(event, handler){
		this._eventsListeners(event, handler);
	}
	
	get running(){
		return this.state == this.STATES.RUNNING;
	}
	
	get context(){
		return this.game.canvas.getContext("2d");
	}
		
	onStarting(){

	}

	start(){
		this.state = this.STATES.STARTING;
		this.onStarting();
		this.resume();
	}

	onResuming(){

	}

	resume(){
		this.state = this.STATES.RESUMING;
		this.onResuming();
		for(event in this._eventsListeners){
			document.addEventListener(event , this._eventsListeners(event).bind(this));
		}
		this.state = this.STATES.RUNNING;
	}
	

	onRunning(){
	
	}

	loop(){
		if(this.running==true){
			this.update();
			this.draw();
			this.onRunning();
		}
	}

	onPausing(){

	}

	pause(){
		this.state = this.STATES.PAUSING;
		this.onPausing();
		for(event in this._eventsListeners){
			document.removeEventListener(event , this._eventsListeners(event).bind(this));
		}
		this.state = this.STATES.PAUSED;
	}

	onStopping(){
		
	}

	onStoped(){
		
	}

	stop(){
		this.state = this.STATES.STOPPING;
		this.onStopping();
		this.state = this.STATES.STOPED;
		this.onStoped();
	}
}
