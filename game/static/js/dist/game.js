class AcGameMenu 
{
    constructor(root) 
    {  
        this.root = root ;  //存调用函数的对象 
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single">
                        单人模式
                    </div>
                    
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-muti">
                        多人模式
                    </div>
                    
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        
        this.root.$ac_game.append(this.$menu);

        //class 加. id是加 #
        this.$single = this.$menu.find('.ac-game-menu-item-single');    //用find函数找到对应class 对应的 div
        this.$muti = this.$menu.find('.ac-game-menu-item-field-muti');
        this.$settings = this.$menu.find('.ac-game-menu-item-field-settings');

    }
}class AcGame {
	constructor(id) {
		//console.log("create AcGame");
		this.id = id ;
		this.$ac_game = $('#' + id);	//找到id为传入id 的 <div> ，用 ac_game 存起来 
		this.menu = new AcGameMenu(this);
	}
}
