CanvasInvadersEngine.Colision = class Colision extends CanvasInvadersEngine.EngineClass{
	static get SIDES(){ return {TOP:270, RIGH:0, BOTTOM:90, LEFT:180}; }
	get sides(){ return this.class.BORDER; }

	constructor(object, side, speed){
		super();
		this.object = object;
		this.side = side;
		this.speed = speed;
	}
}

CanvasInvadersEngine.ColidedInPoint = class CanvasInvadersEngine.ColidedInPoint extends this.egine.Engine(Boolean){
	constructor(colisions, colisionFilter){
		super(colisions.some(colisionFilter));
		this._in = new this.engine.ColidedIn(colisions, colisionFilter);
	}
	get in(){ return this._in; }
}

CanvasInvadersEngine.ColidedIn = class CanvasInvadersEngine.ColidedIn extends this.egine.EngineClass{
	constructor(colisions, colisionFilter){
		super();
		this._colisions = colisions;
	}
	
	get top()		{	return this.degree(this.engine.Colision.SIDES.TOP);		}
	get right()		{	return this.degree(this.engine.Colision.SIDES.RIGHT);	}
	get bottom()	{	return this.degree(this.engine.Colision.SIDES.BOTTOM);	}
	get left()		{	return this.degree(this.engine.Colision.SIDES.LEFT);	}
	degree(degree)	{	this._colisionFilter.push(
									function(c, side){ 
										return c.side == side; 
									}, degree); 
						return this._colisions.some( this._colisionFilter ); }
	
}

CanvasInvadersEngine.ColidedWith = class CanvasInvadersEngine.ColidedWith extends this.egine.Engine(Boolean){
	constructor(colisions, colisionFilter){
		super(colisions.some(colisionFilter));
		this._colisions = colisions;
		this._colisionFilter = colisionFilter;
	}
	
	from(owner){ 
		this._colisionFilter.push(
			function(c, owner){
				if(typeof(owner) == "function"){
					if(owner.name != undefined && CanvasInvadersEngine[owner.name] == owner){
						return c.object.owner instanceof owner;
					}else{
						return owner(c.object.owner);
					}
				} else {
					return c.object.owner == owner;
				}
			}, owner );
		return new this.engine.ColidedInPoint(this._colisions, this._colisionFilter);
	}
}

CanvasInvadersEngine.Colided = class Colided extends CanvasInvadersEngine.Engine(Boolean){
	constructor(colisions){
		super(colisions.length>0);
		this._colisions = colisions;
		this._colisionFilter = function(c){return this._colisionFilter.result(c);};
		this._colisionFilter.filters = [];
		this._colisionFilter.push = function(filter, ...parameters){ 
			this.filters.push({
						call:filter,
						parameters:parameters
					});
		};
		this._colisionFilter.result = function(c){
			let result = true;
			if(this.filters.length > 0){
				for(i in this.filters){
					result &= this.filters[i].call(c, ...this.filters[i].parameters);
				}
			}
			return result;
		};
		this._in = new this.engine.ColidedIn(this._colisions, this._colisionFilter);
	}

	get colisions(){ return this._colisions;}

	get in(){ return this._in; }

	get with(object){
		this._colisionFilter.push(
			function(c, object){
				if(typeof(object) == "function"){
					if(object.name != undefined && CanvasInvadersEngine[object.name] == object){
						return c.object instanceof object;
					}else{
						return object(c.object);
					}
				} else if(c.object.name != undefined && typeof(object) == "string"){
					return c.object.name = object;
				} else {
					return c.object == object;
				}
			}, object );
		return new this.engine.ColidedWith(this, this._colisionFilter);
	}
}

CanvasInvadersEngine.Colisions = class Colisions extends CanvasInvadersEngine.Engine(Array){
	constructor(){
		super();
	}

	push(colision, side){
		if(colision instanceof this.engine.Colision){
			super.push(colision);
		}if(side != undefined){
			super.push(new this.engine.Colision(colision, side));
		}else{
			throw new Error("colision must be a instance of this.engine.Colision");
		}
	}

	pushTop(colision){ this.push(colision, this.sides.TOP);}
	pushRight(colision){ this.push(colision, this.sides.RIGHT);}
	pushBottom(colision){ this.push(colision, this.sides.BOTTOM);}
	pushLeft(colision){ this.push(colision, this.sides.LEFT);}

	get colided(){ return  new this.engine.Colided(this);}
}

CanvasInvadersEngine.Face = class Face extends CanvasInvadersEngine.EngineClass{
	constructor(owner, perimeter, degree, name="", coordenadeA=undefined, coordenadeB=undefined, ... properties){
		super();
		this._owner;
		this._perimeter;
		this._coordenades = [];
		this.faceDirection  = faceDirection;
		this.name=name;
		if(coordenadeA instanceof this.engine.Coordenate){
			push(coordenadeA);
		}
		if(coordenadeB instanceof this.engine.Coordenate){
			push(coordenadeB);
		}
		if(properties != undefined){
			this._fill(properties);
		}
	}
	get owner(){ this._owner; };
	get perimeter(){ return this._perimeter; };
	
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

	push(coordenade){
		if(coordenade instanceof this.egine.Coordenate){
			this._coordenades.push(coordenade);
			return this;
		}else{
			throw new Error("coordenade must be a instace of this.egine.Coordenate");
		}
	}

	get colisions(){ return this._colisions; }

	get colided(){
		if(this._colisions instanceof  this.engine.Colisions()){
			return this._colisions.colided;
		}
		return undefined;
	}
}

CanvasInvadersEngine.PerimeterBuilder = class PerimeterBuilder extends CanvasInvadersEngine.Coordenate {
	constructor(perimeter, x, y){
		super(x, y);
		this._perimeter = perimeter;
	}
	to:function(x,y, faceDirection, name=""){
		this.perimeter.add([name, faceDirection, [this.x,this.y], [x,y]]);
		this.set(x, y);
		return this;
	}
	m: function(degree, distance, name=""){
		let pos = this.perimeter.engine.Math.getPoint(this.x, thix.y, degree, distance);
		let faceDirection;
		//if(degree < 180)
		// TODO
		return this;
	}
	r: function(degrees){
		// TODO
		return this;
	}
	rm: function(degrees, distance, name=""){
		// TODO
		return this;
	}
	rmu: function(degrees, x, y){
		// TODO
		return this;
	}

		
	end:function(){
		return this.perimeter;
	}
}

CanvasInvadersEngine.Perimeter = class Perimeter extends CanvasInvadersEngine.EngineClass{
	constructor(width, height, name=""){
		super();
		this.name = name;
		this._width = width;
		this._height = height;

		/*this._faces = [];
		if(faces instanceof Array){
			for(i in faces){
				this.add(faces[i]);
			}
		}*/
	}

	/*add(face){
		if(face instanceof this.egine.Face){
			this._faces.push(face);
			return this;
		}else{
			this._faces.push(new this.egine.Face(props = face));
			return this;
		}		
	}

	drawPerimeter(startX, startY){
		return new this.engine.PerimeterBuilder(this, startX, startY, );
	}

	addArc(centerX, centerY, radius, degreeA, degreeB, degreePrecision=36){
		let degreeStep = (degreeB-degreeA / (360/degreePrecision));
 
		for(let degree = degreeA; degree <= degreeB; degree += degreeStep){
			this.add(this.engine.Math.getPoint(centerX, centerY, degree, radius));
		}
	}*/

	get width(){ return this._width;}
	get height(){ return this._height;}

	get centerX{ return this.width/2;}
	get centerY{ return this.heigth/2;}

	get colided{
		return false;
	}
}

