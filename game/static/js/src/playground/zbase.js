class AcGamePlayground  {
    constructor(root)   {
        this.root = root;
        this.$playground = $(`<div>游戏界面</div>`)

        this.root.$ac_game.append(this.$playground);    //web.html里面的ac_game 
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