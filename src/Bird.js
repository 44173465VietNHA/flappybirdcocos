///**
// * Created by Fresher_LOCAL on 6/2/2020.
// */
//var Bird = cc.Sprite.extend({
//    status : 'waiting',
//    actions : {
//        waiting : null,
//        flying : null,
//        animation : null
//    },
//    circle : {x: 0, y: 0, r: 12, offset: {x: -1, y: 0}},
//    frameGroup : [
//        [cc.rect(0, 0, 34, 24), cc.rect(35, 0, 34, 24), cc.rect(70, 0, 34, 24)],
//        [cc.rect(0, 25, 34, 24), cc.rect(35, 25, 34, 24), cc.rect(70, 25, 34, 24)],
//        [cc.rect(0, 50, 34, 24), cc.rect(35, 50, 34, 24), cc.rect(70, 50, 34, 24)]
//    ],
//    frames : [],
//    gravity : 1500,
//    initialSpeed : {
//        x: -1,
//        y: 0
//    },
//    jumpForce : 375,
//    rotation : 0,
//    listeners : [],
//    topLimit : null,
//    animAction : null,
//    acrossedPipes : [],
//
//    ctor : function (fromMenuLayer) {
//        this._super();
//        this.init();
//        this.center();
//        this.rotation = this.getRotation();
//        this.topLimit = cc.winSize.height + this.frames[0].height;
//        this.scheduleUpdate();
//        this.animate();
//
//        if (!fromMenuLayer) this.setEvents();
//
//        this.waitingTap();
//    },
//
//    setBirdFrames : function () {
//        var randFrames = Math.floor(cc.rand() % this.framesGroup.length);
//        this.frames = this.framesGroup[randFrames];
//    },
//
//    waitingTap : function () {
//        var seq = cc.sequence(
//            cc.MoveBy(0.4, 0, 10),
//            cc.MoveBy(0.4, 0, -10)
//        );
//        this.actions.waiting = cc.repeatForever(seq);
//        this.runAction(this.actions.waiting);
//    },
//
//    center : function () {
//        this.setPosition(
//            (cc.winSize.width / 2) - 60,
//            (cc.winSize.height / 2)
//        );
//    },
//
//    getBoundingCircle : function () {
//        this.circle.x = this.getPositionX() + this.circle.offset.x;
//        this.circle.x = this.getPositionY() + this.circle.offset.y;
//
//        return this.circle;
//    },
//
//    animate : function () {
//        var animFrames = [];
//
//        for (var k in this.frames) {
//            var frame = cc.SpriteFrame.create(resources.Entities_png, this.frames[k]);
//            animFrames.push(frame);
//        }
//
//        var animation = cc.Animation.create(animFrames, 0.1),
//            actionToRepeat = cc.Animate.create(animation);
//
//        this.actions.animation = cc.RepeatForever.create(actionToRepeat);
//        this.runAction(this.actions.animation);
//    },
//
//    update : function (dt) {
//        if (cc.director.getRunningScene().status == 'playing')
//            this.fall(dt);
//    },
//
//    fall : function (dt) {
//        if (cc.director.getRunningScene().status == 'stopped')
//            return;
//        if (this.parent.checkBirdCollision(this.parent.floor, this))
//            return this.hit();
//
//        this.rotateOnFall(dt);
//        if (this.getPositionY() > this.topLimit)
//            return this.setPositionY(this.topLimit);
//
//        if (this.getPositionY() < (this.parent.floor.height + this.height))
//            if (this.parent.speed.y > this.initialSpeed.y * 2)
//                this.parent.speed.y = this.initialSpeed.y;
//
//        this.setPositionY(this.getPositionY() - (this.parent.speed.y * dt));
//        this.parent.speed.y += this.gravity * dt;
//
//        if (this.parent.speed.y >= this.parent.limitSpeed.y)
//            this.parent.speed.y = this.parent.limitSpeed.y;
//    },
//
//    rotateOnFall : function(dt) {
//        if (this.rotation >= 90)
//            this.rotation = 90;
//        if (this.rotation <= -22.5)
//            this.rotation = -22.5;
//
//        this.setRotation(this.rotation);
//        if (this.parent.speed.y > this.initialSpeed.y * 2)
//            this.rotation += this.parent.speed.y / 2 * dt;
//    },
//
//    hit : function () {
//        cc.director.getRunningScene().status = 'stopped';
//
//        cc.eventManager.removeListeners(this);
//
//        this.unscheduleUpdate();
//
//        for (k in this.actions)
//            if (this.actions[k] != null && this.actions[k].isStopped)
//                this.stopAction(this.action[k]);
//
//        this.runAction(cc.rotateTo(0.1, 90));
//        var limitFloor = (this.parent.floor.height + this.circle.r);
//
//        if (this.getBoundingCircle().y > limitFloor)
//            this.runAction(cc.moveTo(0.4, this.getPositionX(), limitFloor));
//
//        this.parent.gameOver();
//        return true;
//    },
//
//    checkAcrossPipe : function (pipeUp){
//        var pipeX = pipeUp.getPositionX();
//        var birdX = this.getPositionX() + this.width / 2;
//
//        if (this.accrossedPipes.indexOf(pipeUp) == -1 && birdX > pipeX) {
//            this.acrossedPipes.push(pipeUp);
//            this.parent.statusLayer.updateScore('+1');
//            this.parent.x += 0.1;
//
//            if (this.parent.speed.x >= this.parent.limitSpeed.x)
//                this.parent.speed.x = this.parent.limitSpeed.x;
//        }
//    }
//});