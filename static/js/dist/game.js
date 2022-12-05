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
        
        this.$menu.hide();        // 先关闭menu
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
}let AC_GAME_OBJECTS = [];      //存对象的

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
     
}class Particle extends AcGameObject     {
    constructor(playground , x , y , radius , vx , vy , color , speed)   {
        super();
        this.playground = playground ;
        this.ctx = this.playground.game_map.ctx ; 
        this.x = x ;
        this.y = y ;
        this.radius = Math.abs(radius) ;    //修bug
        this.vx = vx ;
        this.vy = vy ;
        this.color = color ;
        this.speed = speed ;
        this.friction = 0.9 ;
        this.eps = 0.1 ;
    }

    start()     {
    }

    update()    {
        if(this.speed < this.eps)   {
            this.destroy();
            return false;
        }

        this.x += this.vx * this.speed * this.timedelta / 1000;
        this.y += this.vy * this.speed * this.timedelta / 1000;
        this.speed *= this.friction ;

        this.render();
        //console.log("update: ",this.color) ;
    }

    render()    {
        this.ctx.beginPath() ;
        this.ctx.arc(this.x , this.y , this.radius , 0 , Math.PI * 2 , false) ;
        this.ctx.fillStyle  = this.color ;
        //console.log("render: ",this.color);
        this.ctx.fill();
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
        this.damage_x = 0 ;
        this.damage_y = 0 ;
        this.damage_speed = 0 ;
        this.move_length = 0 ;
        this.radius = radius ;
        this.color = color ;
        this.speed =speed ;
        this.is_me = is_me ;
        this.eps = 0.1;
        this.spent_time = 0 ;   //无敌时间
        this.friction = 0.9 ; //碰撞后的反速度衰减(摩擦力)
        this.cur_skill = null ;

        if(this.is_me)  {
            console.log("is_me!") ; 
            this.img = new Image() ; 
            this.img.src = this.playground.root.settings.photo ;
        }
    }

    start() {
        if(this.is_me)  {
            this.add_listening_events();
        }   else {                              //AI敌人的随机移动
            let x = Math.random() * this.playground.width;
            let y = Math.random() * this.playground.height;
            this.move_to(x,y);
        }
    }
    
    add_listening_events()  {
        let outer = this;   //存一下整个class 也就是调用这个函数的小球(用户)
        
        this.playground.game_map.$canvas.on("contextmenu",function() {      //截胡网页右键api
            return false ;
        });
        this.playground.game_map.$canvas.mousedown(function(e)  {
            const rect = outer.ctx.canvas.getBoundingClientRect();  //获取相对位置 --- 适配视窗 --> getBoundingClientReat 
            if(e.which === 3)   //1 左键 2 滚轮 3 右键
                outer.move_to(e.clientX - rect.left, e.clientY - rect.top);
            else if(e.which === 1)  {
                if(outer.cur_skill === "fireball")  {   //火球
                    outer.shoot_fireball(e.clientX -rect.left, e.clientY -rect.top);    
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
        //console.log("shoot fireball",tx,ty); //构造player传入了playground
        let x = this.x , y = this.y ;
        let radius = this.playground.height*0.01;
        let angle = Math.atan2(ty-this.y,tx-this.x);    //this是player这个类
        let vx = Math.cos(angle) , vy = Math.sin(angle);
        let color = "orange";   
        let speed = this.playground.height*0.5;
        let move_length = this.playground.height*0.8 ;   //子弹射程
        
        new FireBall(this.playground,this,x,y,radius,vx,vy,color,speed,move_length,this.playground.height*0.01);
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


    is_attacked(angle,damage)     {

        for(let i = 0 ; i < 10 + Math.random() * 5 ; i++)   {
                let x = this. x , y = this.y ;
                let radius = this.radius * Math.random() * 0.1;
                let angle = Math.PI * 2 * Math.random();
                let vx = Math.cos(angle) , vy = Math.sin(angle);
                let color = this.color ;
                let speed = this.speed * 3 ;
                //console.log(this.color);
                //console.log("is_atk: ",this.color);
                new Particle(this.playground, x , y , radius , vx , vy , color , speed) ; //生成粒子效果
            }

        this.radius -= damage ;
        if(this.radius < 10)    {
            this.destroy();
            return false ;
        }
        this.damage_x = Math.cos(damage);
        this.damage_y = Math.sin(damage);
        this.damage_speed = 200 * damage ;   //如果这个击退速度的模很小(就变成击中后眩晕一段时间)
        this.damage_speed *= 0.8;


    }

    update() {  
        this.spent_time += this.timedelta /1000 ;           // AI自动攻击
        if(!this.is_me && this.spent_time > 5 && Math.random() < 1/300)    {
            let player = this.playground.players[ Math.floor(Math.random()*this.playground.players.length)];
            this.shoot_fireball(player.x,player.y);
        }
        if(this.damage_speed > 10 )   {
            this.vx = 0 , this.vy = 0 , this.move_length = 0;      //受击失控
            
            //        方向                速度                时间
            this.x += this.damage_x * this.damage_speed * this.timedelta/1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta/1000;
            this.damage_speed *= this.friction ;    //阻力
        }else {        
            if((this.move_length < this.eps))   {
                this.move_length = 0 ;
                this.vx = this.vy = 0 ;
                // 如果对象是敌人  --> 随机游走
                if(this.is_me === false)      {
                    let x = Math.random() * this.playground.width;
                    let y = Math.random() * this.playground.height;
                    this.move_to(x,y)
                }
            }   else {
                let moved = Math.min(this.move_length,this.speed/1000*this.timedelta);
                this.x += this.vx * moved ; 
                this.y += this.vy * moved ;
                this.move_length -= moved; 
            }
        }
        this.render();
    }

    render()  {
        if(this.is_me)      // 画用户头像
        {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2); 
            this.ctx.restore();
        }   
        else
        {
            this.ctx.beginPath();
            //画圆
            this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);          
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
        }

    }
}class FireBall extends AcGameObject {
    constructor(playground,player,x,y,radius,vx,vy,color,speed,move_length,damage)  {
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
        this.damage = damage ;
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

        
        for(let i = 0 ; i < this.playground.players.length ; i++)   {
            let player = this.playground.players[i];
            
            if(this.is_collision(player) && this.player !== player)     //对象不是玩家自己(不能打到自己)
            {
                //console.log("invoke is_collision");
                this.attack(player);
            }        
               
        }
        this.render();

        // this.render();   //调试渲染是否成功
    }

    //还是画圆
    render() {
        //console.log("render a fireball");
        //console.log(this.move_length);
        this.ctx.beginPath();
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill() ;
    }

    get_dist(x1,y1,x2,y2)   {
        let dx = x1 - x2;
        let dy = y1 - y2;
        return Math.sqrt(dx * dx + dy * dy);        
    }   
    
    //判断是否碰撞
    is_collision(player)    {
        //console.log("is_invoked");
        let distance = this.get_dist(this.x , this.y , player.x , player.y)
        if(distance < this.radius + player.radius)
            return true;
        return false ;        
    }

    attack(player)      {
        let angle = Math.atan2(player.y - this.y , player.x - this.x);
        player.is_attacked(angle,this.damage);
        this.destroy();     //火球消失

    }

}class AcGamePlayground  {
    constructor(root)   {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground"></div>`)
        this.hide();

        this.start();
    }

    get_random_color()      {
        let colors = ["purple","red","green","yellow","blue"] ;
        return colors[Math.floor( Math.random() * 4) ] ;
    }

    start() {
    }

    update() {

    }

    show() {    // 打开playground界面
        this.$playground.show();
        this.root.$ac_game.append(this.$playground);    //web.html里面的ac_game 
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);

        this.players = [];
        
        this.players.push(new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.35  ,true) );
        
        for(let i = 0 ; i < 5 ; i++)    {
            this.players.push(new   Player(this,this.width/2,this.height/2,this.height*0.05,this.get_random_color(),this.height*0.35  ,false) );
        }
    }

    hide() {    // 关闭playground界面
        this.$playground.hide();
    }
} class Settings	{
	constructor(root)	{
		this.root = root ;
		this.platform = "WEB" ;
		if(this.root.AcWingOS)	this.platform = "ACAPP" ; 

		this.start() ; 
	}

	start() {
		this.getinfo() ; 
	}

	register() {	// 打开注册界面
	}

	login() {	// 打开登录界面
	}
	
	getinfo() {		// 获取服务器信息
		let outer = this ; 

		$.ajax({		// ajax是向url发请求 --- getinfo向后端发请求 --- 获取平台
			url: "https://app3500.acapp.acwing.com.cn/settings/getinfo/",	 // 传入一个字典
			type: "GET",
			data: {
				platform: outer.platform ,
			},
			success: function(resp)	{	// 回调函数
				console.log(resp);
				if(resp.result === "success")	{
 					outer.username = resp.username ;
					outer.photo = resp.photo ;		// 存用户名和头像
					outer.hide() ; 
					outer.root.menu.show() ; 
				}	else {
					outer.login() ; 
				}
			}
		});
	}

	hide() {

	}

	show() {

	}
}
// 总的JS
export class AcGame {	//调包导入js
	constructor(id, AcWingOS) {			// 第二个参适配 第二种前端(传的是api)
		//console.log("create AcGame");
		this.id = id;
		this.$ac_game = $('#' + id);	//找到id为传入id 的 <div> ，用 ac_game 存起来 
		this.AcWingOs = AcWingOS;

		this.settings = new Settings(this); 
		this.menu = new AcGameMenu(this);
		this.playground = new AcGamePlayground(this);

		this.start();
	}

	start() {

	}
}
