class FireBall extends AcGameObject {
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

}