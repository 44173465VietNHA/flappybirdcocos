var Bird = cc.Sprite.extend({
    status : 'waiting',
    action : {
        waiting : null,
        animation : null
    },
    circle : {x: 0, y: 0, r: 12, offset: {x: -1, y: 0}},
    framesGroup : [
        [cc.rect(0, 0, 34, 24), cc.rect(35, 0, 34, 24), cc.rect(70, 0, 34, 24)],
        [cc.rect(0, 25, 34, 24), cc.rect(35, 25, 34, 24), cc.rect(70, 25, 34, 24)],
        [cc.rect(0, 50, 34, 24), cc.rect(35, 50, 34, 24), cc.rect(70, 50, 34, 24)]
    ],
    frames : [],
    gravity : 1500,
    initialSpeed : {x: 100, y: 100},
    jumpForce : 375,
    rotationb : 0,
    listeners : [],
    topLimit : null,
    //animAction : null,
    accrossedPipes : [],

    ctor : function (fromMenuLayer) {

        this._super();

        this.init();

        this.setBirdFrames();

        this.center();

        this.rotationb = this.getRotation();

        this.topLimit = cc.winSize.height + this.frames[0].height;

        this.scheduleUpdate();

        this.animate();

        if(!fromMenuLayer)
            this.setEvents();

        this.waitingTap();
    },

    setEvents : function () {

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed:  function(keyCode, event){

            }
        }, this);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event){
                event.getCurrentTarget().fly();
            }
        }, this);
    },

    setBirdFrames : function () {

        var randFrames = Math.floor(cc.rand() % this.framesGroup.length);

        this.frames = this.framesGroup[randFrames];
    },

    waitingTap : function() {

        var seq = cc.Sequence.create(
            cc.moveBy(0.4, 0, 10),
            cc.moveBy(0.4, 0, -10)
        );

        this.action.waiting = cc.repeatForever(seq);
        this.runAction(this.action.waiting);
    },

    center : function () {

        this.setPosition(
            (cc.winSize.width / 2) - 60,
            (cc.winSize.height / 2)
        );
    },

    getBoundingCircle : function () {

        this.circle.x = this.getPositionX() + this.circle.offset.x;
        this.circle.y = this.getPositionY() + this.circle.offset.y;

        return this.circle;
    },

    animate : function () {

        var animFrames = [];

        for(var k in this.frames)
        {
            var frame = cc.SpriteFrame.create(resources.Entities_png, this.frames[k]);
            animFrames.push(frame);
        }

        var animationb = cc.Animation.create(animFrames, 0.1),
            actionToRepeat = cc.Animate.create(animationb);

        this.action.animation = cc.RepeatForever.create(actionToRepeat);

        this.runAction(this.action.animation);
    },

    update : function (dt) {

        if( cc.director.getRunningScene().status == 'playing' )
            this.fall(dt);
    },

    fall : function (dt) {

        if(cc.director.getRunningScene().status == 'stopped')
            return;

        if(this.parent.checkBirdCollision(this.parent.floor, this))
            return this.hit();

        //this.rotateOnFall(dt);

        if(this.getPositionY() > this.topLimit)
            return this.setPositionY(this.topLimit);

        if(this.getPositionY() < (this.parent.floor.height + this.height))
            if(this.parent.speed.y > this.initialSpeed.y * 2)
                this.parent.speed.y = this.initialSpeed.y;

        this.setPositionY(this.getPositionY() - (this.parent.speed.y * dt));

        this.parent.speed.y += this.gravity * dt;

        if(this.parent.speed.y >= this.parent.limitSpeed.y)
            this.parent.speed.y = this.parent.limitSpeed.y;
    },

    rotateOnFall : function(dt) {

        if(this.rotationb >= 90)
            this.rotationb = 90;

        if(this.rotationb <= -22.5)
            this.rotationb = -22.5;

        this.setRotation(this.rotationb);

        if(this.parent.speed.y > this.initialSpeed.y * 2 )
            this.rotationb += this.parent.speed.y/2 * dt;
    },

    fly : function () {

        if( cc.director.getRunningScene().status == 'waiting' ) {
            this.parent.statusLayer.hideInstructions();
            cc.director.getRunningScene().status = 'playing';
        }

        //if(!this.action.waiting.isStopped)
        //    this.stopAction(this.action.waiting);

        //cc.audioEngine.playEffect(resources.Sfx_wing_ogg);

        this.parent.speed.y = -this.jumpForce;

        //this.runAction(cc.rotateTo(0.1, -22.5));
    },

    hit : function () {

        // mark current scene as stopped
        cc.director.getRunningScene().status = 'stopped';

        // remove key and mouse events
        cc.eventManager.removeListeners(this);

        //cc.audioEngine.playEffect(resources.Sfx_hit_ogg);

        // unschedule update method
        this.unscheduleUpdate();

        //for( k in this.action )
        //    if(this.action[k] != null && !this.action[k].isStopped) {
        //        this.stopAction(this.action[k]);
        //        cc.log(this.action[k]);
        //    }
        // finalizamos la rotacion
        //this.runAction(cc.rotateTo(0.1, 90));

        // definimos el limite inferior (el piso)
        var limitFloor = (this.parent.floor.height + this.circle.r);

        // si el pajaro esta mas abajo del limite lo acomodamos
        //if(this.getBoundingCircle().y < limitFloor)
        //    this.setPositionY(limitFloor);

        // si el pajaro ha parado de volar pero no ha topado el piso, lo hacemos caer
        if(this.getBoundingCircle().y > limitFloor)
            this.runAction(cc.moveTo(0.4, this.getPositionX(), limitFloor));

        // GAME OVER :(
        this.parent.gameOver();

        return true;
    },

    checkAcrossPipe : function (pipeUp) {

        var pipeX = pipeUp.getPositionX(); // + pipeUp.width/2;
        var birdX = this.getPositionX() + this.width / 2; // - this.width / 2;

        if(this.accrossedPipes.indexOf(pipeUp) == -1 && birdX > pipeX)
        {
            this.accrossedPipes.push(pipeUp);
            this.parent.statusLayer.updateScore('+1');
            //cc.audioEngine.playEffect(resources.Sfx_point_ogg);
            this.parent.speed.x += 0.1;

            if(this.parent.speed.x >= this.parent.limitSpeed.x)
                this.parent.speed.x = this.parent.limitSpeed.x;
        }
    }
});