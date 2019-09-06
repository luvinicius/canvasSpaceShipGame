CanvasInvadersEngine.Level = class Level extends CanvasInvadersEngine.Screen{
	static get LAYERS(){
		return {	BACKGROUND1 : 0,
					BACKGROUND2 : 1,
					BACKGROUND3 : 2,
					ENTITIES : 3,
					SHOTS:4,
					ATNIMATIONS:5,
					FRONT1 :6,
					FRONT2 :7,
					FRONT3 :8 		};
	}

	get LAYERS(){
		return this.class.LAYERS;
	}

	constructor(game, width, height, player){
		super(game, width, height);
		if(player instanceof this.engine.PlayeableChar) {
			this.player = player;
		} else {
			throw new Error("player of "+this.className+" must be a instance of this.engine.PlayeableChar");
		}
		this.centerX = this.width/2;
		this.centerY = this.height/2;
		this.difficulty = 1;
		this.points = 0;
		this._entities = [];
		this._entities[this.LAYERS.BACKGROUND1] = [];
		this._entities[this.LAYERS.BACKGROUND2] = [];
		this._entities[this.LAYERS.BACKGROUND3] = [];
		this._entities[this.LAYERS.ENTITIES] = [];
		this._entities[this.LAYERS.SHOTS] = [];
		this._entities[this.LAYERS.ATNIMATIONS] = [];
		this._entities[this.LAYERS.FRONT1] = [];
		this._entities[this.LAYERS.FRONT2] = [];
		this._entities[this.LAYERS.FRONT3] = [];
		this.hud = new CanvasInvadersEngine.LevelHUD(this);
	}
	
	get speed(){
		return this.player.speed;
	}

	addEntity(entity, LAYER = this.LAYERS.ENTITIES){
		if(entity instanceof this.engine.Entity){
			entity.level = this;
			entity.layer = LAYER;
			entity.index = this._entities[LAYER].length;
			this._entities[LAYER].push(entity);
		}else{
			throw new Error("entity must be a instansce of this.engine.Entity");
		}
	};
	
	removeEntity(entity){
		if(entity instanceof this.engine.Entity){
			if(typeof(entity.layer) == "number" && typeof(entity.index) == "number") {
				this._entities[entity.layer].splice(entity.index,1);
			} else {
				throw new Error("Can't remove entity because it don't have a layer or index member");
			}
		} else {
			throw new Error("entity must be a instansce of this.engine.Entity");
		}
	};

	forEachEntity(handler, layer = undefined){
		if(layer == undefined){
			if(typeof(handler) == "function"){
				this._entities.forEach(layer=>layer.forEach(handler));
			}else if(typeof(handler) == "string"){
				this._entities.forEach(layer=>layer.forEach(entity=>entity[handler]()));
			}else{
				throw new Error("handler must be a function or a string with the name of a member function of entity");
			}
		}else{
			if(typeof(handler) == "function"){
				this._entities[layer].forEach(handler);
			}else if(typeof(handler) == "string"){
				this._entities[layer].forEach(entity=>entity[handler]());
			}else{
				throw new Error("handler must be a function or a string with the name of a member function of entity");
			}
		}
	}

	update(){
		this.forEachEntity("update");
		this.player.update();
	};

	draw(){
		this.forEachEntity("draw", this.LAYERS.BACKGROUND1);
		this.forEachEntity("draw", this.LAYERS.BACKGROUND2);
		this.forEachEntity("draw", this.LAYERS.BACKGROUND3);
		this.forEachEntity("draw", this.LAYERS.ENTITIES);
		this.player.draw();
		this.forEachEntity("draw", this.LAYERS.SHOTS);
		this.forEachEntity("draw", this.LAYERS.ATNIMATIONS);
		this.forEachEntity("draw", this.LAYERS.FRONT1);
		this.forEachEntity("draw", this.LAYERS.FRONT2);
		this.forEachEntity("draw", this.LAYERS.FRONT3);
		this.hud.draw();
	};

}

CanvasInvadersEngine.Level1 = class Level1 extends CanvasInvadersEngine.Level{
	constructor(game, player){
		super(game, game.canvas.width, game.canvas.height,player);
		this.timer = 0;
		this.sleep = [this.game.CONSTANTS.TEN_SECONDS, this.game.CONSTANTS.ONE_SECOND];
	}

	onRunning(){
		this.timer++;
							
		if(this.timer > this.sleep[0]){
			this.sleep[0] += this.difficulty * this.game.CONSTANTS.ONE_MINUTE;
			this.difficulty ++;
		}
		if(this.timer > this.sleep[1]){
			let respawDelay = Math.round(this.game.CONSTANTS.TWO_SECONDS + (Math.random() * this.game.CONSTANTS.TEN_SECONDS - this.game.CONSTANTS.TWO_SECONDS) - (this.difficulty / 2 * this.game.CONSTANTS.ONE_SECOND)); 
			if(respawDelay < this.game.CONSTANTS.TWO_SECONDS) respawDelay = this.game.CONSTANTS.TWO_SECONDS;
			this.sleep[1] += respawDelay;
			

			/*let nEnemies = 1 + Math.round(Math.random() * this.difficulty);
			if(nEnemies > 6) nEnemies=6;
			if(nEnemies > 0){
				let spaceBetween = Math.round(game.canvas.width/(nEnemies+1));

				let minX = Math.round(25 + (Math.random() * 50) +  spaceBetween);

				for(let i=0; i< nEnemies;i++){
					this._entities.push(game.createSmallMeteor(this,minX,0));
					minX += (50+spaceBetween);
					if(minX > (game.canvas.width-50)){
						if(minX<game.canvas.width){
							minX = game.canvas.width -100;
						}else{
							i = nEnemies;
						}
					}
				}
			}*/
		}
	}

	onStarting(){
		this.player.level = this;		
		this.player.x = this.centerX - this.player.centerX;
		this.player.y = this.height - 10;

		for(let y=0; y<this.height; y += (Math.random() * 30 + 50)) {
			for(let x=0; x<this.width; x+=(Math.random() * 30 + 50)){
				this.addEntity(new CanvasInvadersEngine.Star(this,(Math.random() * 50 + x-70),(Math.random() * 70 + y-20),5,0.5), this.LAYERS.BACKGROUND1);
				this.addEntity(new CanvasInvadersEngine.Star(this,(Math.random() * 50 + x),(Math.random() * 50 + y),10,0.75), this.LAYERS.BACKGROUND2);
			}
		}
	}
	
}
