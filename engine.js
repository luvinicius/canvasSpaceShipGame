var CanvasInvadersEngine = {};

CanvasInvadersEngine.Engine = superclass => class Engine extends CanvasInvadersEngine[superclass]{
	get className(){ return this.constructor.name; }
	get engine(){ return CanvasInvadersEngine; }
	get class(){ return this.engine[this.className];}
}

CanvasInvadersEngine.EngineClass = class EngineClass extends CanvasInvadersEngine.Engine(Object){}

CanvasInvadersEngine.Utils = new class Utils extends CanvasInvadersEngine.EngineClass{
	constructor(){
		super();
		this._degrees = {
			RIGHT: 0,
			RIGHT_DOWN:45,
			DOWN : 90,
			LEFT_UP:135,
			LEFT: 180,
			LEFT_UP:225,
			UP: 270,
			RIGHT_UP:315
		};
	}

	get degrees() { return this._degrees; }
	
	c(x, y){ return new this.engine.Coordenate(x,y); }

	p(centerX, centerY, degree, radius){
		return this.c(	centerX + (radius * Math.cos(degree * Math.PI/180)),
									centerY + (radius * Math.sin(degree * Math.PI/180))	);
	}

	i(degree){ return this.r(degree,180); }

	r(degree, rotate){
		if(rotate > 0){
			return rotate + degree>360? this.r(degree-360, rotate) : rotate + degree;
		}else if(rotate < 0){
			return rotate + degree<0? this.r(degree+360, rotate) : rotate + degree;
		}else{
			return degree;
		}
	}
}();

CanvasInvadersEngine.Drawable = superclass => class Drawable extends CanvasInvadersEngine[superclass]{
	draw(){ throw new Error(this.className+ " must implements draw()"); }	
}

CanvasInvadersEngine.Updatable = superclass => class Updatable extends CanvasInvadersEngine[superclass] {
	update(){ throw new Error(this.className+ " must implements update()");}
}

CanvasInvadersEngine.GameObject = class GameObject extends CanvasInvadersEngine.EngineClass{
	constructor(game){
		super();
		if(game instanceof this.engine.Game){
			this._game = game;
		} else {
			throw new Error("game of " + this.className+ " must be a instance of this.engine.Game");
		}
	}

	get game(){
		return this._game;
	}
	get context(){
		return this._game.canvas.getContext("2d");
	}
}

CanvasInvadersEngine.LevelObject = class LevelObject extends CanvasInvadersEngine.GameObject{
	constructor(parent){
		super(parent instanceof CanvasInvadersEngine.Game ? parent : parent instanceof CanvasInvadersEngine.Level ? parent.game : undefined);

		if(parent instanceof this.engine.Level){
			this._level = parent;
		}
	}

	get level(){
		if(this._level instanceof this.egine.Level){
			return this._level;
		}else{
			throw new Error(this.className+ " must contains a level member who is a instance of this.engine.Level");
		}
	}

	set level(level){
		this._level = level;
	}
}

CanvasInvadersEngine.Coordenate = class Coordenate extends CanvasInvadersEngine.EngineClass{
	constructor(x,y){
		super();
		this._historyX = [x];
		this._historyY = [y];
		this._pos = 0;
		this._moves = {};
		
	}

	lockX(postion){ this._lockX = postion;}

	releaseX(){ this._lockX = undefined;}

	lockY(postion){ this._lockY = postion; }

	releaseX(){ this._lockY = undefined;}
	
	back(){
		this._pos--;
		if(this._pos==0) this._pos=0;
	}

	foward(){
		this._pos++;
		if(this._pos > this._historyX.length-1) this._pos = this._historyX.length-1;
	}

	reset(){
		this._historyX = [this._historyX[0]];
		this._historyY = [this._historyY[0]];
		this._pos = 0;
	}

	move(distance, degree){
		if(degree<0 || degree>360){
			throw new Error("It's not possible move this coordenate in a degree that is not between 0 and 360");
		}
		this.set( 	
					if(this.lockX) ? this.lockX : this.x + (distance * Math.cos(degree * Math.PI/180)),
					if(this.lockY) ? this.lockY :this.y + (distance * Math.sin(degree * Math.PI/180))
				);
	}

	get move(){		
		return this._moves;
	}

	get x(){ return this._historyX[this._pos]; }
	get y(){ return this._historyX[this._pos]; }
	
	set x(x){ this.set(x, this.y); }
	set y(y){ this.set(this.x, y); }

	set(x, y){
		this._historyX.push(x);
		this._historyY.push(y);
		this._pos = this._historyX.length - 1;
	}
}








