// 总的JS
export class AcGame {	//调包导入js
	constructor(id, AcWingOS) {			// 第二个参适配 第二种前端(传的是api)
		//console.log("create AcGame");
		this.id = id;
		this.$ac_game = $('#' + id);	//找到id为传入id 的 <div> ，用 ac_game 存起来 
		this.AcWingOS = AcWingOS;
		if(this.AcWingOS)	console.log("AcWingOs!") ; 

		this.settings = new Settings(this); 

		this.menu = new AcGameMenu(this);
		this.playground = new AcGamePlayground(this);

		this.start();
	}

	start() {

	}
}
