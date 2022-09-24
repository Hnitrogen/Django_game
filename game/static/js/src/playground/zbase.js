class AcGamePlayground  {
    constructor(root)   {
        this.root = root;
        this.$playground = $(`<div class="ac-game-playground">游戏界面</div>`)
        //this.hide();
        this.root.$ac_game.append(this.$playground);    //web.html里面的ac_game 
        
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
} 