CanvasInvadersEngine.Meteor = class Meteor extends CanvasInvadersEngine.LivingBeing{
	constructor(game,x,y, size, speed, direction = CanvasInvadersEngine.Utils.degrees.DOWN){
		super(game, x , y, new CanvasInvadersEngine.Perimeter(size, size), life, speed);
		this.life = life;
		this.speed = speed;
		this.direction = direction;
	}
	
	onAlive(){
		this.move(this.speed, this.direction);
	}

	onGetOutOfScreen(info){
		this.level.removeEntity(this);
	}

	onColide(){
		if(this.colided.with(this.engine.Shoot)){
			this.colision
					.filter(c => c instanceof this.engine.Shoot)
					.forEach(c => this.takeDamage(c.object.damage));
		} else if(this.colided.with(this.engine.Meteor)){
			this.colision
				.filter(c => c instanceof this.engine.Shoot)
				.forEach(c => { let colisiontType = c.side == this.engine.Utils.i(c.object.direction)? 1 // FRONTAL
											: ;
								
								if(this.c.object.mass > this.mass){
									
								}else if (this.c.object.mass < this.mass){
									
								}else{
									
								}
								this.takeDamage(1); });
		}
	}

	draw(){
		let ctx = this.context;
		ctx.fillStyle = "#AAAAAA";
		ctx.beginPath();
		ctx.arc(this.x+this.width/2, this.y, this.width, 0, 2 * Math.PI);
		ctx.fill();
		ctx.closePath();
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
