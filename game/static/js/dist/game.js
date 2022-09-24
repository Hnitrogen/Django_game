class AcGameMenu 
{
    constructor(root) 
    {  
        this.root = root ;  //存调用函数的对象 
        //$符号表示对象是html文件
        this.$menu = $(`                        
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                        单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-muti-mode">
                        多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                        设置
                    </div>
                </div>
            </div>
        `);
        
        this.root.$ac_game.append(this.$menu);

        //class 加. id是加 #
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');    //用find函数找到对应class 对应的 div
        this.$muti_mode = this.$menu.find('.ac-game-menu-field-item-muti-mode');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();   //启动新窗口
    }

    start() { 
        this.add_listening_events();
    }
    
    //点击产生新界面
    add_listening_events()  {
        let outer = this;      //outer是外面的this,也就是line3那个this
        this.$single_mode.click(function()
        {
            outer.hide();   
            outer.root.playground.show();       //root 是line3的root 等于line3 的this.root --> outer.root
            //console.log("click single_mode");
        });

        this.$muti_mode.click(function()
        {
            console.log("click muti_mode");
        });

        this.$settings.click(function()
        {
            console.log("click settings_mode");
        });
    }

    show()  {   //显示menu界面
        this.$menu.show();
    }

    hide()  {   //关闭menu界面
        this.$menu.hide();
    }
}let AC_GAME_OBJECTS = [];

class AcGameObject  {
    constructor() {
        AC_GAME_OBJECTS.push(this);

        this.has_called_start = false;
        this.timedelta = 0 ;
    }

    start() {
    }

    update() {
    }
    
    on_destroy() {
    }

    destroy() {
        this.on_destroy();

        for(let i = 0 ; i < AC_GAME_OBJECTS.length ; i++)
            if(AC_GAME_OBJECTS[i] === this) {
                AC_GAME_OBJECTS.splice(i,1);
                break;
            }
    }

}

let last_timestamp;
let AC_GAME_ANIMATION = function(timestamp)  {
    
    for(let i = 0 ; i < AC_GAME_OBJECTS.length ; i++)   {
        let obj = AC_GAME_OBJECTS[i];
        if(!obj.has_called_start)   {
            obj.start();
            obj.has_called_start = true;
        }   else {
            obj.timedelta = timestamp - last_timestamp ;
            obj.update();
        }
    }
    last_timestamp = timestamp ;
    
    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);class GameMap extends  AcGameObject  {
    constructor(playground)  {
        super();    // 调用基类构造函数
        this.playground = playground;
        this.$canvas = $(`<canvas></canvas>`);

        this.ctx = this.$canvas[0].getContext('2d');
        this.ctx.canvas.width = this.playground.width;
        this.ctx.canvas.height = this.playground.height;
        this.playground.$playground.append(this.$canvas);

    }

    start()  {
    }

    update() {
    }

    
}class AcGamePlayground  {
    constructor(root)   {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground">游戏界面</div>`)
        //this.hide();
        this.root.$ac_game.append(this.$playground);    //web.html里面的ac_game 
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.start();
    }

    start() {
    }

    update() {

    }

    show() {    // 打开playground界面
        this.$playground.show();
    }

    hide() {    // 关闭playground界面
        this.$playground.hide();
    }
} // 总的JS
export class AcGame {	//调包导入js
	constructor(id) {
		//console.log("create AcGame");
		this.id = id ;
		this.$ac_game = $('#' + id);	//找到id为传入id 的 <div> ，用 ac_game 存起来 
		// this.menu = new AcGameMenu(this);
		this.playground = new AcGamePlayground(this);
		
		this.start();
	}

	start() {

	}
}
