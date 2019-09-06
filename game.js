CanvasInvadersEngine.Game = class Game extends CanvasInvadersEngine.EngineClass{
	static get CONSTANTS(){
		return {
					ONE_SECOND		: 100,
					TWO_SECONDS		: 200,
					THREE_SECONDS	: 300,
					FOUR_SECONDS	: 400,
					FIVE_SECONDS	: 500,
					TEN_SECONDS		: 1000,
					ONE_MINUTE		: 6000
				};
	}

	get CONSTANTS(){
		return this.class.CONSTANTS;
	}

	constructor(canvasId){	
		super();
		this.canvas = document.getElementById(canvasId);
	}

	loop(){
		if(this.screen.running == true){
			let ctx = this.canvas.getContext("2d");
			ctx.fillStyle = "#000000";
			ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
			this.screen.loop();
		}
	}

	pause(){
		this.screen.pause();
	}

	resume(){
		this.screen.resume();
	}

	start(){
		let player = new this.engine.PlayeableChar(this);
		this.screen = new this.engine.Level1(this, player);
		this.screen.start();
		
		if(this.interval) clearInteval(this.interval);
		this.interval = setInterval(this.loop.bind(this),10);
		
		
	}
}
CanvasInvadersEngine.game = new CanvasInvadersEngine.Game("game");
