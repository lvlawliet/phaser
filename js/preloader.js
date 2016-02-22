/**
 * Created by Administrator on 2016/2/18.
 */
eat.Preloader = function (game) {};
eat.Preloader.prototype = {
    preload: function () {
        game.load.image('background', 'assets/background.jpg');
        game.load.spritesheet('baddie', 'assets/baddie.png', 32, 32);
        game.load.image('platform', 'assets/platform1.png');
        game.load.image('star', 'assets/star.png');
        game.load.image('btn', 'assets/start-button.png');
        game.load.image('aid', 'assets/firstaid.png');
    },
    create: function () {
        game.state.start('Play');
    }
};
