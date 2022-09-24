class Player extends AcGameObject   {
    constructor(playground,x,y,radius,color,speed,is_me)   {
        super();
        this.playground = playground;
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
        });
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
}