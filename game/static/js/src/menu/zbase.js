class AcGameMenu 
{
    constructor(root) 
    {  
        this.root = root ;  //存调用函数的对象 
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
        this.$single_mode = this.$menu.find('.ac-game-menu-item-single-mode');    //用find函数找到对应class 对应的 div
        this.$muti_mode = this.$menu.find('.ac-game-menu-item-field-muti-mode');
        this.$settings = this.$menu.find('.ac-game-menu-item-field-settings');

        this.start();   //启动新窗口
    }

    start() { 
        this.add_listening_events();
    }

    add_listening_events()  {
        let outer = this;
        this.$single_mode.click(function()
        {
            console.log("click single_mode");
        });
    }
}