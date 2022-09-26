class Player extends AcGameObject   {
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
            const rect = outer.ctx.canvas.getBoundingClientRect();  //获取相对位置
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
        this.ctx.beginPath();
        //画圆
        this.ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);          
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}