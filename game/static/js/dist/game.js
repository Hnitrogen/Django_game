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
        this.render();
    }

    render()  {
        this.ctx.fillStyle = "rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);    //渲染地图(黑色)
    }
     
}class Player extends AcGameObject   {
    constructor(playground,x,y,radius,color,speed,is_me)   {
        super();
        this.playground = playground;   //存下了构造函数里面的界面
        this.ctx = this.playground.game_map.ctx;
        this.x = x ;
        this.y = y ;

        this.vx = 0 ;   // 速度
        this.vy = 0 ;
        this.move_length = 0 ;
        this.radius = radius ;
        this.color = color ;
        this.speed =speed ;
        this.is_me = is_me ;
        this.eps = 0.1;

        this.cur_skill = null ;
    }

    start() {
        if(this.is_me)  {
            this.add_listening_events();
        }
    }
    
    add_listening_events()  {
        let outer = this;   //存一下整个class 也就是调用这个函数的小球(用户)
        
        this.playground.game_map.$canvas.on("contextmenu",function() {      //截胡网页右键api
            return false ;
        });
        this.playground.game_map.$canvas.mousedown(function(e)  {
            if(e.which === 3)   //1 左键 2 滚轮 3 右键
                outer.move_to(e.clientX, e.clientY);
            else if(e.which === 1)  {
                if(outer.cur_skill === "fireball")  {   //火球
                    outer.shoot_fireball(e.clientX , e.clientY);
                }
                outer.cur_skill = null ;    //释放技能槽位
            }
        });

        $(window).keydown(function(e)  {    //keycode
            if(e.which === 81)  //q被按下
                outer.cur_skill = "fireball";
            return false;
        });
    } 

    shoot_fireball(tx,ty)   {   // 传入的是目的坐标
        console.log("shoot fireball",tx,ty); //构造player传入了playground
        let x = this.x , y = this.y ;
        let radius = this.playground.height*0.01;
        let angle = Math.atan2(ty-this.y,tx-this.x);    //this是player这个类
        let vx = Math.cos(angle) , vy = Math.sin(angle);
        let color = "pink";   
        let speed = this.playground.height*0.5;
        let move_length = this.playground.height*1.5;   //子弹射程
        
        new FireBall(this.playground,this,x,y,radius,vx,vy,color,speed,move_length);
    }
    
    get_dist(x1,y1,x2,y2)  {
        let dx = x1 - x2 ;
        let dy = y1 - y2 ;
        return Math.sqrt(dx * dx + dy * dy);    //求起点到目标点的距离
    }

    move_to(tx,ty)  {
        //console.log("move to" , tx ,ty);
        this.move_length = this.get_dist(this.x , this.y , tx , ty) ;
        let angle = Math.atan2(ty-this.y , tx-this.x);     //求角度
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);      //单位速度(r = 1)
    }

    update() {  
        if((this.move_length < this.eps))   {
            this.move_length = 0 ;
            this.vx = this.vy = 0 ;
        }   else {
            let moved = Math.min(this.move_length,this.speed/1000*this.timedelta);
            this.x += this.vx * moved ; 
            this.y += this.vy * moved ;
            this.move_length -= moved; 
        }
        this.render();
    }

    render()  {
        this.ctx.beginPath();
        //画圆
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);          
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}class FireBall extends AcGameObject {
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length)  {
        super();
        this.playground = playground ;
        this.player = player ;
        this.ctx = this.playground.game_map.ctx;
        this.x = x ;
        this.y = y ;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length ;    //射程
        this.eps = 0.1; 
        
    }

    start() { 
    }

    update() {
        if(this.move_length < this.eps)   {
            this.destroy();
            return false;
        }             
        //在射程 和 路程 取 min 
        let moved = Math.min(this.move_length, this.speed*this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
        this.render();

        // this.render();

    }

    //还是画圆
    render() {
        console.log("render a fireball");
        //console.log(this.move_length);
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill() ;

        
    }
}class AcGamePlayground  {
    constructor(root)   {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`)
        //this.hide();
        this.root.$ac_game.append(this.$playground);    //web.html里面的ac_game 
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.players = [];
        this.players.push(new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.15,true) );
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
