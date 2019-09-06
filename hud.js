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
