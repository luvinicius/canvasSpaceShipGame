CanvasInvadersEngine.Shoot = class extends CanvasInvadersEngine.Body{
	constructor(owner, direction, width =4, height =10, speed = 20, damage = 1){
		super(owner.game, 
			x = (parent.x+parent.width/2-2), y = (parent.y-parent.height-2),
			new CanvasInvadersEngine.Perimeter(width, height)));

		if(owner instanceof this.engine.Entity){
			if(owner.level instanceof this.engine.Level){
				this.level = owner.level;
			}else{
				throw new Error("parent of "+this.className+" must contains a level member who is a instance of this.engine.Entity");
			}
			this.owner = owner;
		} else {
			throw new Error("parent of "+this.className+" must be a instance of this.engine.Entity");
		}

		this.speed = speed;
		this.direction = direction;
		this.damage = damage;
	}
	
	update(){
		if(this.fadding == true){
			this.faddingAnimation++;
			if(this.faddingAnimation > this.width/2){
				this.level.removeEntity(this);
			}
		}else{
			this.move[this.direction](this.speed);
		}
	}
	
	onGetOutOfScreen(){
		this.level.removeEntity(this);
	}

	onColide(){
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
