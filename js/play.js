/**
 * Created by Administrator on 2016/2/18.
 */
eat.Play = function (game) {};
var now = 2;
var player;
var cursors;
var platforms;
var stars;
var blocksforms;

var jumpLimit = 1;
var canJump = 0;
var limitblock = 5;
var score = 0;
var scoreText;
eat.Play = {
    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background');
        platforms = game.add.group();
        platforms.enableBody = true;
        blocksforms = game.add.group();
        blocksforms.enableBody = true;
        stars = game.add.group();
        stars.enableBody = true;
        var ground = platforms.create(0, game.world.height - 32, 'platform');
        for (var i = 1; i < 9; ++i)
        {
            ground = platforms.create(i * 34, game.world.height - 32, 'platform');
        }


        player = game.add.sprite(32, game.world.height - 150, 'baddie');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.animations.add('left', [0, 1], 10, true);
        player.animations.add('right', [2, 3], 10, true);

        cursors = game.input.keyboard.createCursorKeys();

        var height = 12;
        for (var i = 0; i < limitblock; ++i)
        {
            var block = blocksforms.create(parseInt(Math.random() * 800 / 100) * 34,height * 34, 'platform');
            height -= parseInt(Math.random() * 300 / 100) + 1;
        }
        scoreText = game.add.text(16, 16, 'score:0', { fontSize: '32px', fill: '#000' });
        game.time.events.loop(10000, this.refreshBlocks, this);
        game.time.events.loop(3000, this.refreshStar, this);
    },
    test: function () {
        score += 10;
        scoreText.text = 'Score:' + score;
    },
    update: function() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(stars, platforms);
        game.physics.arcade.collide(player, blocksforms);
        game.physics.arcade.collide(stars, blocksforms);

        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);

        player.body.velocity.x = 0;
        if (game.input.activePointer.isDown)
        {
            var x = game.input.activePointer.worldX;
            var y = game.input.activePointer.worldY;
            if (x < player.body.x)
            {
                player.body.velocity.x = -150;
                player.animations.play('left');
                now = 1;
                if (!player.body.touching.down)
                {
                    player.animations.stop();
                    player.frame = 0;
                }
            }
            else
            if (x > player.body.x)
            {
                player.body.velocity.x = 150;
                player.animations.play('right');
                now = 2;
                if (!player.body.touching.down)
                {
                    player.animations.stop();
                    player.frame = 3;
                }
            }
            if (canJump < jumpLimit)
            {
                canJump++;
                player.body.velocity.y = -350;
            }
        }
        else
        {
            player.animations.stop();
            player.frame = now;
        }
        //if (cursors.left.isDown)
        //{
        //    player.body.velocity.x = -150;
        //    player.animations.play('left');
        //    now = 1;
        //    if (!player.body.touching.down)
        //    {
        //        player.animations.stop();
        //        player.frame = 0;
        //    }
        //}
        //else if (cursors.right.isDown)
        //{
        //    player.body.velocity.x = 150;
        //    player.animations.play('right');
        //    now = 2;
        //    if (!player.body.touching.down)
        //    {
        //        player.animations.stop();
        //        player.frame = 3;
        //    }
        //}
        //else
        //{
        //    player.animations.stop();
        //    player.frame = now;
        //}
        //if (cursors.up.isDown && canJump < jumpLimit)
        //{
        //    canJump = 1;
        //    player.body.velocity.y = -350;
        //}
        if (player.body.touching.down)
        {
            canJump = 0;
        }
        if (player.body.y > game.world.height + 1000)
        {
            this.gameOver();
        }
        //if (game.input.activePointer.isDown)
        //{
        //    this.test();
        //}
    },
    refreshBlocks: function () {
        blocksforms.removeAll();
        canJump = 0;
        var height = 12;
        for (var i = 0; i < limitblock; ++i)
        {
            var block = blocksforms.create(parseInt(Math.random() * 800 / 100) * 34,height * 34, 'platform');
            height -= parseInt(Math.random() * 300 / 100) + 1;
        }
    },
    refreshStar: function () {
        var star = stars.create(parseInt(Math.random() * 240), 0, 'star');
        star.body.gravity.y = 300;
        star.body.bounce.y = 1;
    },
    collectStar: function (player, star) {
        star.kill();
        score += 10;
        scoreText.text = 'Score:' + score;
        canJump = 0;
    },
    gameOver: function () {
        var btn = game.add.button(game.width / 2, game.height / 2, 'btn', function() {
            game.state.start('Play');
        });
    }
};