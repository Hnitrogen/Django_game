class AcGame {
	constructor(id) {
		//console.log("create AcGame");
		this.id = id ;
		this.$ac_game = $('#' + id);	//找到id为传入id 的 <div> ，用 ac_game 存起来 
		this.menu = new AcGameMenu(this);
	}
}
