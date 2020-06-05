/**
 * Created by Fresher_LOCAL on 6/2/2020.
 */
var GameOverLayer = cc.Layer.extend({
    ctor : function() {

        this._super();

        this.hitOverlay();

        var seq = new cc.Sequence(
            cc.DelayTime.create(0.1),
            cc.callFunc(this.showGameOverLetter, this),
            cc.DelayTime.create(1.0),
            cc.callFunc(this.showFinalScore, this),
            cc.DelayTime.create(0.5),
            cc.callFunc(this.showMenuButtons, this)
        );

        this.runAction(seq);
    },

    hitOverlay : function () {

        var overlay = cc.LayerColor.create(
            new cc.Color(255, 255, 255, 200),
            cc.winSize.width,
            cc.winSize.height
        );

        cc.director.getRunningScene().addChild(overlay, 4);

        overlay.runAction(cc.Sequence.create(
            cc.fadeOut(0.2),
            cc.callFunc(function(target){
                target.removeChild(overlay);
            }, this)
        ));
    },

    showGameOverLetter : function () {

        this.gameOverLetter = new cc.Sprite(resources.Gui_png, new cc.rect(0, 62, 204, 52));

        this.gameOverLetter.setPosition(
            cc.winSize.width / 2,
            cc.winSize.height / 2 + 125
        );

        this.addChild(this.gameOverLetter);

        this.gameOverLetter.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1),
            cc.moveBy(0.1, 0, -10)
        ));
    },

    showFinalScore : function () {

        var scoreContainer = new cc.Sprite(resources.Gui_png, new cc.rect(0, 302, 238, 126));

        scoreContainer.setPosition(
            cc.winSize.width / 2,
            cc.winSize.height / 2
        );

        this.addChild(scoreContainer);

        scoreContainer.runAction(new cc.Sequence(
            cc.fadeOut(0),
            cc.fadeIn(0.1),
            cc.moveBy(0.1, 0, -10),
            cc.callFunc(this.calcScore, scoreContainer, this)
        ));
    },

    calcScore : function(container, currentLayer) {

        var totalScore = cc.sys.localStorage.getItem("score");
        var bestScore = cc.sys.localStorage.getItem("bestScore");
        var lastBestScore = cc.sys.localStorage.getItem("lastBestScore");
        var isNewRecord = false;

        totalScore = parseInt(totalScore);
        lastBestScore = lastBestScore ? parseInt(lastBestScore) : 0;

        if( !bestScore )
            cc.sys.localStorage.setItem("bestScore", totalScore);

        else if(totalScore > bestScore)
            cc.sys.localStorage.setItem("bestScore", totalScore);

        if(!bestScore && totalScore > 0)
            isNewRecord = true;

        bestScore = parseInt(cc.sys.localStorage.getItem("bestScore"));
        cc.sys.localStorage.setItem("lastBestScore", bestScore);

        if(bestScore > lastBestScore)
            isNewRecord = true;

        var scoreLabel = new cc.LabelBMFont("0", resources.FlappyBird_fnt, -1, cc.TEXT_ALIGNMENT_RIGHT);
        var bestScoreLabel = new cc.LabelBMFont(bestScore.toString(), resources.FlappyBird_fnt, -1, cc.TEXT_ALIGNMENT_RIGHT);
        var newLabel = new cc.Sprite(resources.Gui_png, new cc.rect(127, 236, 32, 14));

        scoreLabel.setScale(0.5); scoreLabel.setAnchorPoint(0, 0);
        bestScoreLabel.setScale(0.5); bestScoreLabel.setAnchorPoint(0, 0);
        newLabel.setAnchorPoint(0, 0);

        scoreLabel.setPosition(
            211 - (scoreLabel.width - ((scoreLabel.width * 50)/100)),
            72
        );

        bestScoreLabel.setPosition(
            211 - (bestScoreLabel.width - ((bestScoreLabel.width * 50)/100)),
            32
        );

        cc.callFunc(this.setCoin, container);
        var increase = 0;
        var delayTime = (0.5/totalScore);
        var delay = new cc.DelayTime(delayTime);
        var incrementSeq = new cc.Sequence(
            delay,
            cc.callFunc(function(){

                scoreLabel.setString(increase.toString());

                scoreLabel.setPosition(
                    211 - (scoreLabel.width - ((scoreLabel.width * 50)/100)),
                    72
                );

                if(totalScore == increase) {
                    scoreLabel.stopAllActions();
                    return;
                }

                increase++;

            }, this)
        );

        scoreLabel.runAction(new cc.RepeatForever(incrementSeq));

        newLabel.setPosition(
            bestScoreLabel.getPositionX() - newLabel.width - 12,
            bestScoreLabel.getPositionY() + newLabel.height + 6
        );

        container.addChild(scoreLabel);
        container.addChild(bestScoreLabel);

        if(isNewRecord)
            container.addChild(newLabel);
    },

    showMenuButtons : function () {

        var floor = this.parent.layers.gamePlay.floor;

        var btn = new ccui.Button(resources.Play_png);
        btn.setPosition(
            cc.winSize.width / 2,
            floor.height + btn.height/2
        );
        this.addChild(btn);
        btn.addClickEventListener(this.onClickPlay.bind(this));

    },

    onClickPlay : function(){
        var newScene = cc.TransitionFade.create(1.5, new GameScene(), cc.color(0,0,0));

        cc.director.runScene(newScene);
    },
});
