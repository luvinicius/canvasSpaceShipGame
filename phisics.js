CanvasInvadersEngine.Force = class Force extends CanvasInvadersEngine.Updatable(CanvasInvadersEngine.EngineClass){
	constructor(force, direction, duration=-1, dontMoveThis=false, dontMoveOthers=false){
		super();
		this.force = force;
		this.direction = direction;
		this.duration = durantion;
		this.dontMoveThis = dontMoveThis;
		this.dontMoveOthers = dontMoveOthers;
	}

	update(){
		if(this.duration > 0){
			this.duration--;
		}else if(this.duration == 0){
			this.force--;
		}
	}

}

CanvasInvadersEngine.Body = class Body extends CanvasInvadersEngine.Entity{
	constructor(game, type, x, y, perimeter, mass){
		super(game, type, x, y, perimeter, mass);
		this.mass = mass;
		this._forces = [];
	}

	push(force){
		if(force instanceof this.egine.Force){
			this._forces.push(force);
		}
	}
	
	update(){
		this._forces.forEach((f,i,arr)=>{
			f.update();
			this.move();
		});
	}


	move(distance, degree, ignoreColisionCheck=false){
		super.move(distance, degree, ignoreColisionCheck);
		
		if(ignoreColisionCheck == false){
			if(this.level instanceof this.engine.Level){
				this.forEachEntity(e => {if (e instanceof Body) this.checkColision(e);});
			}
			
			if(this.colided || this.perimeter.colided){
				onColide();
			}
		}
	}
	
	checkColision(body){
		// TODO
	}

	onColide(){
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

	constructor(game, type, x, y, perimeter, life){
		super(game, type, x, y, perimeter);
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
		super.update();
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

