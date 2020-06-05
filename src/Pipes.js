/**
 * Created by Fresher_LOCAL on 6/2/2020.
 */
var Pipe = cc.Sprite.extend({
    MAX_Y : null,
    MIDDLE_SPACE : 100,
    floor : null,
    bird : null,
    updateRect : false,
    lowerNeighbor : false,

    ctor : function (lowerNeighbor) {
        if (typeof lowerNeighbor != null) {
            this._super(resources.Entities_png, new cc.rect(52, 75, 52, 320));
            this.lowerNeighbor = lowerNeighbor;
        }
        else
            this._super(resources.Entities_png, new cc.rect(52, 75, 52, 320));

        var currentScene = cc.director.getRunningScene();

        this.floor = currentScene.getChildByTag(LAYER_TAGS.GAMEPLAY).floor;
        this.bird = currentScene.getChildByTag(LAYER_TAGS.GAMEPLAY).bird;

        this.MAX_Y = this.getTextureRect().height / 2 + this.floor.height;

        this.spawn();
        this.scheduleUpdate();
    },

    update : function (dt) {
        if (cc.director.getRunningScene().status != 'playing')
            return;
        if (!this.updateRect) {
            if (this.lowerNeighbor)
                this.setTextureRect(new cc.rect(52, 75, 52, 320));
            else
                this.setTextureRect(new cc.rect(0, 75, 52, 320));

            //this.updatedRect = true;
        }

        if (this.parent.parent.checkBirdCollision(this, this.bird)) {
            this.bird.hit();
            this.unscheduleUpdate();
            this.parent.unscheduleUpdate();
        }

        if (!this.lowerNeighbor)
            this.bird.checkAcrossPipe(this);

        this.scroll(dt);
    },

    scroll : function (dt) {
        if (this.getPosition() < -(this.width / 2)) {
            this.parent.removeChild(this);
            this.bird.accrossedPipes.prop();

            return;
        }

        this.setPositionX(this.getPositionX() - this.parent.parent.speed.x * dt);

        if (this.lowerNeighbor)
            this.lowerNeighbor.setPositionX(this.getPositionX());
    },

    spawn : function () {
        var posX = this.width / 2 + cc.winSize.width,
            posY = Math.floor(cc.rand() % (this.MAX_Y - this.MIDDLE_SPACE)) + 40;

        if (this.lowerNeighbor) {
            posY = cc.winSize.height - this.height * 6/7;
            posY += this.lowerNeighbor.getPositionY() + this.MIDDLE_SPACE;
        }

        this.setPosition(posX, posY);
    }
});

var PipesLayer = cc.Layer.extend({
    lastPipe : null,
    delaySpawn : 3,
    startSpawn : false,
    lastPipes : {
        up : null,
        down : null,
        getPositionX : function () {
            return this.up.getPositionX();
        }
    },

    ctor : function () {
        this._super();
        this.lastPipes.down = null;
        this.lastPipes.up = null;

        this.scheduleUpdate();
    },

    update : function (dt) {
        this.spawnPipes(dt);
    },

    spawnPipes : function (dt) {
        if (cc.director.getRunningScene().status != 'playing')
            return;
        if (!this.startSpawn) {
            if (this.startSpawn) {
                if (this.delaySpawn > 0)
                    this.delaySpawn -= dt;
                else {
                    this.startSpawn = true;
                    this.delaySpawn = 3;
                }
                return;
            }
        }
        if (this.lastPipes.down == null || (this.lastPipes.getPositionX() < (cc.winSize.width / 2 + this.lastPipes.down.width / 2))) {
            this.lastPipes.down = new Pipe();
            this.lastPipes.up = new Pipe(this.lastPipes.down);
            this.addChild(this.lastPipes.down, 0);
            this.addChild(this.lastPipes.up, 0);
        }
    }
});