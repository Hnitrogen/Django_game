class AcGameMenu 
{
    constructor(root) 
    { 
        this.root = root ;  //存调用函数的对象 
        
        this.$menu = $(
            <div class="ac-game-menu">
            </div>
        );
        
        this.root.$ac_game.append(this.$menu);

    }
}