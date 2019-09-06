var CanvasInvadersEngine = {};

CanvasInvadersEngine.Math = {
	DIRECTIONS : {
		RIGHT: 0,
		RIGHT_DOWN:45,
		DOWN : 90,
		LEFT_UP:135,
		LEFT: 180,
		LEFT_UP:225,
		UP: 270,
		RIGHT_UP:315
	},
	getPoint : function(centerX, centerY, degree, radius){
		return new CanvasInvadersEngine.Coordenate(	centerX + (radius * Math.cos(degree * Math.PI/180)),
									centerY + (radius * Math.sin(degree * Math.PI/180))	);
	}
};

CanvasInvadersEngine.EngineClass = class EngineClass{
	get className(){
		return this.constructor.name;
	}
	get engine(){
		return CanvasInvadersEngine;
	}
	get class(){
		return this.engine[this.className];
	}	
}

CanvasInvadersEngine.Coordenate = class Coordenate extends CanvasInvadersEngine.EngineClass{
	constructor(x,y){
		super();
		this.x = x;
		this.y = y;
	}
}

CanvasInvadersEngine.Drawable = class Drawable extends CanvasInvadersEngine.EngineClass{
	constructor(game){
		super();
		if(game instanceof this.engine.Game){
			this.game = game;
		} else {
			throw new Error("game of " + this.className+ " must be a instance of this.engine.Game");
		}
	}

	get context(){
		return this.game.canvas.getContext("2d");
	}

	draw(){
		throw new Error(this.className+ " Components must implements draw()");
	}	
}

CanvasInvadersEngine.Updatable = class Updatable extends CanvasInvadersEngine.Drawable{
	constructor(game){
		super(game);
	}

	update(){
		throw new Error(this.className+ " Components must implements update()");
	}
}
CanvasInvadersEngine.Entity = class Entity extends CanvasInvadersEngine.Updatable{
	static get TYPES(){
		return {
				PLAYER : 0,
				PLAYER_SHOOT : 1,
				METEOR :2,
				SHOOT : 3,
				ENEMY_SPACE_SHIP : 4,
				STAR: 5
		};
	}

	get TYPES(){
		return this.class.TYPES;
	}
	
	constructor(game, type, x, y, width, height){
		super(game);
		this.type = type;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.centerX = this.width/2;
		this.centerY = this.height/2;
	}

	get DIRECTIONS(){
		return this.engine.Math.DIRECTIONS;
	}

	getPoint(degree, distance){
		return this.engine.Math.getPoint(this.x, this.y, degree, distance);
	}

	move(distance, degree = this.DIRECTIONS.UP){
		let coord = this.getPoint(degree, distance);
		this.x = coord.x;
		this.y = coord.y;
		this.checkScreenColision();
	}

	checkScreenColision(){
		if(this.level instanceof this.engine.Screen){
			let info = new this.engine.Colision();
			let touch = false;
			let getOut = false;

			if(this.x <= 0){
				info.addColision(this.engine.Colision.BORDER.LEFT);
				touch=true;
				if((this.x + this.width) <= 0){
					getOut=true;
				}
			}
			
			if((this.x + this.width) >= this.level.width){
				info.addColision(this.engine.Colision.BORDER.RIGHT);
				touch=true;
				if(this.x >= (this.level.width + this.width)){
					getOut=true;
				}
			}
			
			if(this.y <= 0){
				info.addColision(this.engine.Colision.BORDER.UP);
				touch=true;
				if((this.y + this.height) <= 0){
					getOut=true;
				}
			}

			if((this.y + this.height) >= this.level.height){
				info.addColision(this.engine.Colision.BORDER.BOTTOM);
				touch=true;
				if(this.y >= this.level.height){
					getOut=true;
				}
			}
			
			if(touch == true){
				this.onTouchBorderScreen(info);
			}
			
			if(getOut == true){
				this.onGetOutOfScreen(info);
			}
		}
	}

	onTouchBorderScreen(info){
	}
	
	
	onGetOutOfScreen(info){
	}
	
}

CanvasInvadersEngine.Star = class Star extends CanvasInvadersEngine.Entity{
	constructor(level,x,y,size=10, speed=1){
		super(level.game, CanvasInvadersEngine.Star.TYPES.STAR, x, y, size, size);
		this.level = level;
		this.speed = speed;
	}

	update(){
		this.move(this.speed, this.DIRECTIONS.DOWN);
	}
	
	onGetOutOfScreen(info){
		if(info.colide(this.engine.Colision.BORDER.BOTTOM) == true){
			this.y = -this.height;
		}
	}

	draw(){
		let ctx = this.context;
		ctx.fillStyle = "#AAAAAA";
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+(this.width/2-1),this.y-1);
		ctx.lineTo(this.x+(this.width/2),this.y-(this.height/2));
		ctx.lineTo(this.x+(this.width/2+1),this.y-1);								
		ctx.lineTo(this.x+(this.width),this.y);
		ctx.lineTo(this.x+(this.width/2+1),this.y+1);
		ctx.lineTo(this.x+(this.width/2),this.y+(this.height/2));
		ctx.lineTo(this.x+(this.width/2-1),this.y+1);
		ctx.fill();
		ctx.closePath();
	}
}

CanvasInvadersEngine.Face = class Face extends CanvasInvadersEngine.EngineClass{
	constructor(faceDirection = 0, name="", coordenadeA=undefined, coordenadeB=undefined, properties = undefined){
		super();
		this._coordenades = [];
		this.faceDirection  = faceDirection;
		this.name=name;
		if(coordenadeA instanceof this.engine.Coordenate){
			add(coordenadeA);
		}
		if(coordenadeB instanceof this.engine.Coordenate){
			add(coordenadeB);
		}
		if(properties != undefined){
			this._fill(properties);
		}
	}
	
	_fill(properties){
		for (i in properties){
			if(face.hasOwnProperty(i)){
				this[i] = properties[i];
			} else {
				let property = properties[i];
				if(property instanceof this.engine.Coordenate){
					this.add(property);
				}else if(property instanceof Array && property.length == 2){
					this.add(new this.engine.Coordenate(property[0],property[1]));
				}else if(typeof(property) == "number"){
					this.faceDirection = property;
				}else if(typeof(property) == "string"){
					this.name = property;
				}else{
					throw new Error(i+" is a invalid value to build Face [" + property + "]");
				}
			}
		}
	}	

	add(coordenade){
		if(coordenade instanceof this.egine.Coordenate){
			this._coordenades.push(coordenade);
			return this;
		}else{
			throw new Error("coordenade must be a instace of this.egine.Coordenate");
		}
	}

	
}

CanvasInvadersEngine.Perimeter = class Perimeter extends CanvasInvadersEngine.EngineClass{
	constructor(name="", faces = undefined){
		super();
		this.name = name;
		this._faces = [];
		if(faces instanceof Array){
			for(i in faces){
				this.add(faces[i]);
			}
		}
	}

	add(face){
		if(face instanceof this.egine.Face){
			this._faces.push(face);
			return this;
		}else{
			this._faces.push(new this.egine.Face(props = face));
			return this;
		}		
	}

	path(startX, startY){
		return {	x:startX,
					y:startY,
					perimeter:this,
					end:function(){
						return this.perimeter;
					},
					to:function(x,y, faceDirection, name=""){
						this.perimeter.add([name, faceDirection, [this.x,this.y], [x,y]]);
						this.x = x;
						this.y = y;
						return this;
					},
					m: function(degree, distance, name=""){
						let pos = this.perimeter.engine.Math.getPoint(this.x, thix.y, degree, distance);
						let faceDirection;
						//if(degree < 180)
						// TODO
						return this;
					},
					r: function(degrees){
						// TODO
						return this;
					},
					rm: function(degrees, distance, name=""){
						// TODO
						return this;
					},
					rmu: function(degrees, x, y){
						// TODO
						return this;
					}
		};
	}

	/*addArc(centerX, centerY, radius, degreeA, degreeB, degreePrecision=36){
		let degreeStep = (degreeB-degreeA / (360/degreePrecision));
 
		for(let degree = degreeA; degree <= degreeB; degree += degreeStep){
			this.add(this.engine.Math.getPoint(centerX, centerY, degree, radius));
		}
	}*/

}

CanvasInvadersEngine.Colision = class Colision extends CanvasInvadersEngine.EngineClass{
	static get BORDER(){
		return {TOP:0, RIGH:1, BOTTOM:2, LEFT:3};
	}

	constructor(speed = undefined){
		super();
		this._colisions = [];
		this.speed = speed;
	}
		
	addColision(border){
		this._colisions.push(border);
	}

	colide(border = undefined){
		if(border != undefined){
			for(let i in this._colisions){
				return border == this._colisions[i];
			}
		}else{
			return this._colisions.length>0;
		}
	}
}

CanvasInvadersEngine.Body = class Body extends CanvasInvadersEngine.Entity{
	constructor(game, type, x, y, width, height){
		super(game, type, x, y, width, height);
	}

	move(entity, distance, angle=90){
		super.move(entity, distance, angle);
		if(this.level instanceof this.engine.Level){
			this.forEachEntity(e => {if (e instanceof Body) e.checkColision(entity);});
		}
	}
	
	checkColision(body){
		// TODO
	}

	onColide(body, info){
		throw new Error(this.className+ " Components must implements onClide()");
	}	
};

CanvasInvadersEngine.LivingBeing = class LivingBeing extends CanvasInvadersEngine.Body{
	static get STATES(){
		return {
				ALIVE : 0,
				TAKING_DAMAGE:1,
				DYING : 2,
				DEAD : 3
		};
	}

	get STATES(){
		return this.class.STATES;
	}

	constructor(game, type, x, y, width, height, life){
		super(game, type, x, y, width, height);
		this.life = life;
		this.state = this.STATES.ALIVE;
	}

	onAlive(){
		throw new Error(this.className+ " Components must implements onAlive()");
	}

	onTakingDamage(){
		damageTaked();
	}

	onDying(){
		die();
	}
	
	update(){
		if(this.state == this.STATES.ALIVE){
			this.onAlive();
		} else if(this.state == this.STATES.TAKING_DAMAGE){
			this.onTakingDamage();
		} else if(this.state == this.STATES.DYING){
			this.onDying();
		}
	}
	
	takeDamage(damage){
		this.state = this.STATES.TAKING_DAMAGE;
		this.life -= damage;
	}

	damageTaked(){
		if(this.life == 0){
			this.state = this.STATES.DYING;
		}else{
			this.state = this.STATES.ALIVE;
		}
	}

	onDead(){

	}

	die(){
		this.state = this.STATES.DEAD;
		this.onDead();
	}
}
CanvasInvadersEngine.Shoot = class extends CanvasInvadersEngine.Body{
	constructor(parent, type, direction, width =4, height =10, speed = 20){
		super(parent.game, type,
			x = (parent.x+parent.width/2-2), y = (parent.y-parent.height-2),
			width , height);
		if(parent instanceof this.engine.Entity){
			if(parent.level instanceof this.engine.Level){
				this.level = parent.level;
			}else{
				throw new Error("parent of "+this.className+" must contains a level member who is a instance of this.engine.Entity");
			}
		} else {
			throw new Error("parent of "+this.className+" must bew a instance of this.engine.Entity");
		}
		this.speed = speed;
		this.direction = direction;
	}
	
	update(){
		if(this.fadding == true){
			this.faddingAnimation++;
			if(this.faddingAnimation > this.width/2){
				this.level.removeEntity(this);
			}
		}else{
			this.move(this.speed, this.direction);
		}
	}
	
	onGetOutOfScreen(){
		this.level.removeEntity(this);
	}

	onColide(body, info){
		this.fadding = true;
		this.faddingAnimation = 0;
	}

	draw(){
		let ctx = game.canvas.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		
		if(this.fadding == true){
			// TODO
		}else{
			ctx.moveTo(centerX, centerY); // A1

			ctx.bezierCurveTo(
				centerX + width/2, centerY - height/2, // C1
				centerX + width/2, centerY + height/2, // C2
				centerX, centerY + height/2); // A2

			ctx.bezierCurveTo(
				centerX - width/2, centerY + height/2, // C3
				centerX - width/2, centerY - height/2, // C4
				centerX, centerY - height/2); // A1

			ctx.fill();
			ctx.closePath();
		}
	}

}
CanvasInvadersEngine.PlayeableChar = class PlayeableChar extends CanvasInvadersEngine.LivingBeing{
	constructor(game){
		super(game,CanvasInvadersEngine.PlayeableChar.TYPES.PLAYER,0,0,64,64,3);
		this.life = 3;
		this.speed = 40;
	}
	
	onAlive(){
		if(this.movingLeft == true){
			this.move(this.speed, this.DIRECTIONS.LEFT);
		}

		if(this.movingRight == true){
			this.move(this.speed, this.DIRECTIONS.RIGHT);
		}

		if(this.shooting == true){
			if(this.level instanceof this.engine.Level){
				this.level.addEntity(new this.engine.Shoot(this, this.TYPES.SHOOT, this.DIRECTIONS.UP));
			}else{
				throw new Error(this.className+" must contains a level member who is a instance of this.engine.Entity to be able to shoot");
			}
		}
	}

	onTouchScreenBorder(info){
		if(info.colide(this.engine.Colision.BORDER.LEFT) == true){
			this.x = 0;
		}

		if(info.colide(this.engine.Colision.BORDER.RIGHT) == true){
			this.x = this.level.width;
		}
	}

	onColide(body, info){
		if(body.type != this.type && body.type != this.TYPES.PLAYER_SHOOT){
			if(body.damage) {
				this.takeDamage(body.damage);
			} else if(body.life) {
				this.takeDamage(body.life);
			} else {
				this.takeDamage(1);
			}
		}
	}

	draw(){
		let ctx = this.context;
		let widthLeftWind = 30;
		let xLeftWind = this.x;
		let widthRightWind = 30;
		let xRightWind = this.x+this.width;
		if(this.movingLeft == true){
			widthLeftWind = 20;
			widthRightWind = 40;
			xLeftWind +=20;
			xRightWind -=10;
		}else if(this.movingRight == true){
			widthLeftWind = 40;
			widthRightWind = 20;
			xLeftWind +=10;
			xRightWind -=20;
		}

		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.moveTo(xLeftWind-widthLeftWind/2, this.y);
		ctx.lineTo(xLeftWind, this.y-this.height/1.5);
		ctx.lineTo(xLeftWind+widthLeftWind/2, this.y);
		ctx.closePath();
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(xRightWind-widthRightWind/2, this.y);
		ctx.lineTo(xRightWind, this.y-this.height/1.5);
		ctx.lineTo(xRightWind+widthRightWind/2, this.y);
		ctx.closePath();
		ctx.fill();
		
		ctx.beginPath();
		ctx.moveTo(this.x +(this.movingLeft==true?10:0), this.y);
		ctx.lineTo(this.x +(this.movingLeft==true?15:0), this.y-(this.height/4));
		ctx.lineTo(this.x+this.width/2, this.y-this.height);
		ctx.lineTo(this.x+this.width-(this.movingRight==true?15:0), this.y-(this.height/4));
		ctx.lineTo(this.x+this.width-(this.movingRight==true?10:0), this.y);
		ctx.fill();
		ctx.closePath();

		ctx.fillStyle = "#CECEFF";
		let centerX = this.x+this.width/2;
		let centerY = this.y-this.height/2;
		let width = 20;
		let height = 30;

		ctx.beginPath();
		ctx.moveTo(centerX, centerY - height/2); // A1

		ctx.bezierCurveTo(
			centerX + width/2, centerY - height/2, // C1
			centerX + width/2, centerY + height/2, // C2
			centerX, centerY + height/2); // A2

		ctx.bezierCurveTo(
			centerX - width/2, centerY + height/2, // C3
			centerX - width/2, centerY - height/2, // C4
			centerX, centerY - height/2); // A1

		ctx.closePath();
		ctx.fill();
		ctx.stroke();

	}
	
	walkLeft(){
		this.movingLeft = true;
	}
	
	walkRight(){
		this.movingRight = true;
	}

	shoot(){
		this.shooting = true;
	}

}
CanvasInvadersEngine.Meteor = class Meteor extends CanvasInvadersEngine.LivingBeing{
	constructor(game,x,y, size, speed){
		super(game, CanvasInvadersEngine.Meteor.TYPES.METEOR, x , y, size, size, life, speed);
		this.life = life;
		this.speed = speed;
	}
	
	onAlive(){
		this.move(this.speed, this.DIRECTIONS.DOWN);
	}

	onGetOutOfScreen(info){
		this.level.removeEntity(this);
	}

	draw(){
		let ctx = this.context;
		ctx.fillStyle = "#AAAAAA";
		ctx.beginPath();
		ctx.arc(this.x+this.width/2, this.y, this.width, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
	}

	onColide(body, info){

	}
}

/*createRoolingMeteor: function(level, x, y){
	let roolingMeteor = this.createSmallMeteor(level,x,y);
	return roolingMeteor;
},

createBigMeteor: function(level, x, y){
	let bigMeteor = this.createSmallMeteor(level,x,y);
	bigMeteor.speed = 0.25;
	bigMeteor.width = 50;
	bigMeteor.height = 50;
	bigMeteor.life = 3;
	return bigMeteor;
},

createBossMeteor: function(level, x, y){
	let boosMeteor = this.createSmallMeteor(level,x,y);
	boosMeteor.speed = 0.1;
	boosMeteor.width = 100;
	boosMeteor.height = 100;
	boosMeteor.life = 3;
	return boosMeteor;
},

createShootingStar: function(level, x, y){
	let shootingStar = this.createRoolingMeteor(level,x,y);
	shootingStar.speed = 2;
	return shootingStar;
},*/
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
		this.eventsListeners = {};
		this.width = width;
		this.height = height;
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
		for(event in this.eventsListeners){
			document.addEventListener(event , this.eventsListeners(event).bind(this));
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
		for(event in this.eventsListeners){
			document.removeEventListener(event , this.eventsListeners(event).bind(this));
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
CanvasInvadersEngine.LevelHUD = class LevelHUD extends CanvasInvadersEngine.Drawable{

	constructor(level){
		super(level.game);
		this.level = level;
	}
	
	draw(){
		let ctx = this.context;

		ctx.fillStyle = "#FFFFFF";
		ctx.font = "12px Arial";
		
			
		let texts = [	"time : " + Math.round(this.level.timer/this.game.CONSTANTS.ONE_SECOND),
				"points : " + this.level.points,
				"difficulty : " + this.level.difficulty,
				"difficulty next step : " + Math.round(this.level.sleep[0]/this.game.CONSTANTS.ONE_SECOND),
				"next respaw : " + Math.round(this.level.sleep[1]/this.game.CONSTANTS.ONE_SECOND)	];
		let geaterTextWidth = 0;
		
		for(let i=0; i<texts.length; i++){
			let textWidth = ctx.measureText(texts[i]).width;
			if(geaterTextWidth < textWidth){
				geaterTextWidth = textWidth;
			}
		}
		
		let x = this.level.width-(geaterTextWidth + 10);
		texts.forEach((text, i)=>{ctx.fillText(text, x ,(i * 15 + 25));});
		
		ctx.font = "24px Arial";
		ctx.fillText("life : "+ this.level.player.life, 10 ,24);
		ctx.fillText("speed : "+ this.level.player.speed, 10 ,58);
	}
}
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


	/*this.keyDownEventListener = function(event){
		if(this.level.running == true){
			
			this.mainChar.keydown = event.keyCode;
			if(event.keyCode==37 || this.mainChar.movingLeft ==true){
				this.mainChar.walkLeft();
			}
			if(event.keyCode==39 || this.mainChar.movingRight==true){
				this.mainChar.walkRight();
			} 
			if(event.keyCode==38 || this.mainChar.shooting==true){
				this.mainChar.shoot();
			}
		}
	};

	this.keyUpEventListener = function(event){
		if(this.level.running == true){
			if(event.keyCode==37){
				this.mainChar.movingLeft = false;
			} else if(event.keyCode==39){
				this.mainChar.movingRight = false;
			} 
			if(event.keyCode==38){
				this.mainChar.shooting = false;
			}
		}
	};*/
}
CanvasInvadersEngine.game = new CanvasInvadersEngine.Game("game");
