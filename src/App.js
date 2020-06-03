var LAYER_TAGS = {
    BACKGROUND : 1,
    GAMEPLAY : 2,
    GAMESTATUS : 3,
    GAMEOVER : 4
};

var GameMenuScene = cc.Scene.extend({
    onEnter : function () {

        this._super();

        var background = new BackgroundLayer();
        var menu = new GameMenuLayer();

        this.addChild(background, 0);
        this.addChild(menu, 1);
    }
});

var GameScene = cc.Scene.extend({

    status : 'waiting',
    layers : {
        background : null,
        gamePlay : null,
        gameStatus : null
    },

    onEnter : function () {

        this._super();

        this.layers.background = new BackgroundLayer();
        this.layers.gameStatus = new GameStatusLayer();
        this.layers.gamePlay = new GamePlayLayer(this);

        this.addChild(this.layers.background, 0, LAYER_TAGS.BACKGROUND);
        this.addChild(this.layers.gamePlay, 1, LAYER_TAGS.GAMEPLAY);
        this.addChild(this.layers.gameStatus, 2, LAYER_TAGS.GAMESTATUS);
    }
});