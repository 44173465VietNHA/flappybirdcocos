/**
 * Created by Fresher_LOCAL on 6/2/2020.
 */
var GamePlayLayer = cc.Layer.extend({
    sprite: null,
    floor: null,
    bird: null,
    pipes: null,
    speed: {x: 150, y: 100},
    limitSpeed: {x: 250, y: 1000},
    ctor: function (scene) {

        this._super();

        this.statusLayer = scene.layers.gameStatus;
        this.scene = scene;

        this.floor = new Floor();
        this.bird = new Bird();
        this.pipes = new PipesLayer();

        this.addChild(this.pipes, 0);
        this.addChild(this.bird, 1);
        this.addChild(this.floor, 2);

        this.scheduleUpdate();

        this.bird.parent = this.pipes.parent = this;

        return true;
    },

    update : function (dt) {
        this.floor.scroll(dt, this.speed.x);
    },

    gameOver : function () {
        this.unscheduleUpdate();

        // add game over layer to game scene
        this.parent.addChild(new GameOverLayer(), 3, LAYER_TAGS.GAMEOVER);
    },

    checkBirdCollision : function (rectObj, bird) {

        var circleDistance = {x: 0, y: 0};

        var rect = rectObj.getBoundingBox();
        var circle = bird.getBoundingCircle();
        //var circle = bird.getBoundingBox();


        circle.x = circle.x - circle.r * 2;
        rect.y = (rect.y - rect.height / 2) + rect.height;

        circleDistance.x = Math.abs(circle.x - rect.x);
        circleDistance.y = Math.abs(circle.y - rect.y);

        if (circleDistance.x > (rect.width/2 + circle.r))
            return false;

        if (circleDistance.y > (rect.height/2 + circle.r))
            return false;

        if (circleDistance.x <= (rect.width/2))
            return true;

        if (circleDistance.y <= (rect.height/2))
            return true;

        var cornerDistance_sq = (circleDistance.x - rect.width/2)*(circleDistance.x - rect.width/2) +
            (circleDistance.y - rect.height/2)*(circleDistance.y - rect.height/2);

        return (cornerDistance_sq <= (circle.r)*(circle.r));
    }

});



