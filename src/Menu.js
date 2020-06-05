/**
 * Created by Fresher_LOCAL on 6/2/2020.
 */
var GameMenuLayer = cc.Layer.extend({
    playButton : null,
    rankingButton : null,
    playBtnSprite : null,
    rankingBtnSprite : null,
    floor : null,
    ctor : function() {

        this._super();

        var logo = new cc.Sprite(resources.Gui_png, new cc.rect(0, 252, 178, 48));

        logo.setPosition(
            cc.winSize.width / 2,
            cc.winSize.height / 2 + 100
        );

        var bird = new Bird(true);

        bird.setPosition(cc.winSize.width/2, bird.getPositionY() - 20);

        this.floor = new Floor();

        //var playBtnSprite = new cc.Sprite(resources.Gui_png, new cc.rect(0, 436, 116, 70));
        //
        //this.playButton = new cc.MenuItemSprite(playBtnSprite, null, this.play, this);
        //
        ////cc.log(this.floor);
        //
        //this.playButton.setEnabled(true);
        //var menu =  new cc.Menu(this.playButton, this.rankingButton);
        ////cc.log(this.floor.abc);
        ////menu.setPosition(
        ////    cc.winSize.width / 2 - this.playButton.width/2 - 5,
        ////    this.floor.height + this.playButton.height/2 - 10
        ////);
        //cc.log(menu);
        ////this.addChild(menu);

        var btn = new ccui.Button(resources.Play_png);
        btn.setPosition(
            cc.winSize.width / 2,
            this.floor.height + btn.height/2
        );
        this.addChild(btn);
        btn.addClickEventListener(this.onClickPlay.bind(this));

        this.addChild(logo);
        this.addChild(bird);
        this.addChild(this.floor);
        //
        this.scheduleUpdate();
        return true;
    },

    onClickPlay : function(){
        var newScene = cc.TransitionFade.create(1.5, new GameScene(), cc.color(0,0,0));

        cc.director.runScene(newScene);
    },

    play : function() {


        var newScene = cc.TransitionFade.create(1.5, new GameScene(), cc.color(0,0,0));

        cc.director.runScene(newScene);
    },

    update : function(dt) {

        this.floor.scroll(dt, 150);
    }
});