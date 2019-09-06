CanvasInvadersEngine.Entity = class Entity extends CanvasInvadersEngine.Updatable(Drawable(LevelObject)){
	constructor(parent, x, y, perimeter){
		super(parent);
		this._type = type;
		this._position = this.engine.Utils.c(x, y);
		if(perimeter instanceof this.engine.Perimeter){
			this._perimeter = perimeter;
		}else{
			throw new Error("perimeter of " + this.className+ " must be a instance of this.engine.Perimeter");
		}
	}

	get perimeter(){ return this._perimeter; }
	set perimeter(perimeter){ this._perimeter = perimeter; };
	get width(){ return this._perimeter.width; }
	get heigth(){ return this._perimeter.height;}
	get centerX{ return this._perimeter.centerX}
	get centerY{ return this._perimeter.centerY;}

	resetPosition(){ this._position.reset(); }
	setPosition(x, y){ return this._position.set(x, y);}
	get x( return this._position.x);
	get y( return this._position.y);

	get degrees(){ return this.engine.Utils.degrees; }

	move(distance, degree, ignoreColisionCheck=false){
		this._position.move(distance, degree);
		this._colisions = new this.engine.Colisions();
		//TODO
		if(ignoreColisionCheck == false){
			this.checkScreenColision();
		}
	}

	get colisions(){ return this._colisions; }

	get colided(){
		if(this._colisions instanceof  this.engine.Colisions()){
			return this._colisions.colided;
		}
		return undefined;
	}

	checkScreenColision(){
		if(this.level instanceof this.engine.Screen){
			let touch = false;
			let getOut = false;

			if(this.x <= 0){
				this._colisions.pushLeft(this.level);
				touch=true;
				if((this.x + this.width) <= 0){
					getOut=true;
				}
			}
			
			if((this.x + this.width) >= this.level.width){
				this._colisions.pushRight(this.level);
				touch=true;
				if(this.x >= (this.level.width + this.width)){
					getOut=true;
				}
			}
			
			if(this.y <= 0){
				this._colisions.pushTop(this.level);
				touch=true;
				if((this.y + this.height) <= 0){
					getOut=true;
				}
			}

			if((this.y + this.height) >= this.level.height){
				this._colisions.pushBottom(this.level);
				touch=true;
				if(this.y >= this.level.height){
					getOut=true;
				}
			}
			
			if(touch == true){
				this.onTouchBorderScreen();
			}
			
			if(getOut == true){
				this.onGetOutOfScreen();
			}
		}
	}

	onTouchBorderScreen(){
	}
	
	
	onGetOutOfScreen(){
	}
	
}

CanvasInvadersEngine.Star = class Star extends CanvasInvadersEngine.Entity{
	constructor(level,x,y,size=10, speed=1){
		super(level.game, CanvasInvadersEngine.Star.TYPES.STAR, x, y, new CanvasInvadersEngine.Perimeter(size, size));
		this.level = level;
		this.speed = speed;
	}

	update(){
		this.move.down(this.speed);
	}
	
	onGetOutOfScreen(info){
		if(this.colided.with(this.sceen).in.bottom){
			this.resetPosition();
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
