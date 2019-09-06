CanvasInvadersEngine.PlayeableChar = class PlayeableChar extends CanvasInvadersEngine.LivingBeing{
	constructor(game){
		super(game,0,0, new CanvasInvadersEngine.Perimeter(64, 64),3);
		this.life = 3;
		this.speed = 40;
		this._acting = [];
	}

	get ACTIONS(){
		return {
			MOVE : {
						LEFT: "ML",
						RIGHT: "MR",
			}
			SHOOT: "S"
		};
	}

	get moving(){
		return {
					left : this._acting.contains(this.ACTIONS.MOVE.LEFT),
					right : this._acting.contains(this.ACTIONS.MOVE.RIGHT)
		};
	}

	get isMovingRight(){

	}
	
	get isShooting(){

	}
	
	onAlive(){
		if(){
			this.move.left(this.speed);
		}

		if(){
			this.move.right(this.speed);
		}

		if(this._acting.contains(this.ACTIONS.MOVE.SHOOT)){
			if(this.level instanceof this.engine.Level){
				this.level.addEntity(new this.engine.Shoot(this, this.TYPES.SHOOT, this.DIRECTIONS.UP));
			}else{
				throw new Error(this.className+" must contains a level member who is a instance of this.engine.Entity to be able to shoot");
			}
		}
	}

	onTouchScreenBorder(info){
		if(info.colide.left){
			this.x = 0;
		}

		if(info.colide.right){
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

	this.keyDownEventListener = function(event){
		if(this.level.running == true){
			if(event.keyCode==37 || this.movingLeft ==true){
				this.walkLeft();
			}

			if(event.keyCode==39 || this.movingRight==true){
				this.walkRight();
			}

			if(event.keyCode==38 || this.shooting==true){
				this.shoot();
			}
		}
	};

	this.keyUpEventListener = function(event){
		if(this.level.running == true){
			if(event.keyCode==37){
				this.movingLeft = false;
			} 
			if(event.keyCode==39){
				this.movingRight = false;
			} 
			if(event.keyCode==38){
				this.shooting = false;
			}
		}
	};

}
