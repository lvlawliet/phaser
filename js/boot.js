/**
 * Created by Administrator on 2016/2/18.
 */
var eat = {};
eat.Boot = function(game) {};
eat.Boot.prototype = {
    preload: function () {
        game.load.image('loading', 'assets/preloader.gif');
    },
    create: function () {
        game.input.maxPointers = 1;
        game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.scale.setScreenSize(true);
        game.state.start('Preloader');
    }
};