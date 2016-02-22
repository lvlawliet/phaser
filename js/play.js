/**
 * Created by Administrator on 2016/2/18.
 */
eat.Play = function (game) {};
var now = 2;
var player;
var cursors;
var platforms;
var stars;
var aids;
var blocksforms;
var ceilblocks;

var jumpLimit = 1;
var canJump = 0;
var limitblock = 9;
var score = 0;
var scoreText;
var jumpText;
var aftertouchJump = 1;
var limitOfAid = 100;
var aidCanOut = 0;
var starDownG = 150;
var limitblocks = 9;

var heighList = new Array(5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19);

eat.Play = {
    create: function () {
        score = 0;
        jumpLimit = 1;
        canJump = 0;
        limitblock = 11;
        aftertouchJump = 1;
        limitOfAid = 100;
        aidCanOut = 0;
        starDownG = 300;
        limitblocks = 11;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'background');
        platforms = game.add.group();
        platforms.enableBody = true;
        blocksforms = game.add.group();
        blocksforms.enableBody = true;
        stars = game.add.group();
        stars.enableBody = true;
        aids = game.add.group();
        aids.enableBody = true;
        ceilblocks = game.add.group();
        ceilblocks.enableBody = true;
        var ground = platforms.create(0, game.world.height - 32, 'platform');
        for (var i = 1; i < 12; ++i)
        {
            ground = platforms.create(i * 34, game.world.height - 32, 'platform');
        }
        var ceilblock = ceilblocks.create(0, -32, 'platform');
        ceilblock.body.immovable = true;
        for (var i =  1; i < 12; ++i)
        {
            ceilblock = ceilblocks.create(i * 34, -60, 'platform');
            ceilblock.body.immovable = true;
        }

        player = game.add.sprite(32, 80, 'baddie');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0.2;
        player.body.gravity.y = 300;
        player.animations.add('left', [0, 1], 10, true);
        player.animations.add('right', [2, 3], 10, true);

        cursors = game.input.keyboard.createCursorKeys();

        this.refreshBlocks();
        scoreText = game.add.text(16, 16, 'score:0', { fontSize: '32px', fill: '#000' });
        jumpText = game.add.text(game.world.width - 85, 16, 'Jump', { fontSize: '32px', fill: 'green' });
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
        game.physics.arcade.collide(aids, platforms);
        game.physics.arcade.collide(player, blocksforms);
        game.physics.arcade.collide(stars, blocksforms);
        game.physics.arcade.collide(aids, blocksforms);
        game.physics.arcade.collide(player, ceilblocks);
        game.physics.arcade.collide(stars, ceilblocks);
        game.physics.arcade.collide(aids, ceilblocks);

        game.physics.arcade.overlap(player, stars, this.collectStar, null, this);
        game.physics.arcade.overlap(player, aids, this.collectAid, null, this);

        player.body.velocity.x = 0;
        if (game.input.activePointer.isDown)
        {
            var x = game.input.activePointer.worldX;
            if (x < game.world.width / 2)
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
            if (x > game.world.width / 2)
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
            if (canJump < jumpLimit && aftertouchJump == 1)
            {
                aftertouchJump = 0;
                canJump++;
                player.body.velocity.y = -350;
            }
        }
        else
        {
            player.animations.stop();
            player.frame = now;
        }
        if (game.input.activePointer.isUp)
        {
            aftertouchJump = 1;
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
        if (cursors.up.isDown && canJump < jumpLimit)
        {
            canJump = 1;
            player.body.velocity.y = -350;
        }
        if (player.body.touching.down)
        {
            canJump = 0;
        }
        if (player.body.y > game.world.height + 1000)
        {
            this.gameOver();
        }
        if (canJump >= jumpLimit)
        {
            jumpText.fill = 'red';
        }
        else
        {
            jumpText.fill = 'green';
        }
    },
    refreshBlocks: function () {
        blocksforms.removeAll();
        canJump = 0;
        var list = this.createRandomArray(12, 1);
        var height = this.createRandomArray(15, 0);
        for (var i = 0; i < limitblock; ++i)
        {
            var block = blocksforms.create(list[i] * 34, height[i] * 34, 'platform');
        }
    },
    refreshStar: function () {
        if (aidCanOut == 1)
        {
            var aid = aids.create(parseInt(Math.random() * 260), 0, 'aid');
            aid.body.gravity.y = 300;
            aid.body.bounce.y = 1;
            aidCanOut = 0;
        }
        else
        {
            var star = stars.create(parseInt(Math.random() * 260), 0, 'star');
            star.body.gravity.y = starDownG;
            star.body.bounce.y = 1;
            //starDownG += 5;
            //if (starDownG > 400)
            //{
            //    starDownG = 400;
            //}
        }
    },
    collectStar: function (player, star) {
        star.kill();
        score += 10;
        scoreText.text = 'Score:' + score;
        canJump = 0;
        if (score >= limitOfAid)
        {
            aidCanOut = 1;
            limitOfAid += 200;
        }
        limitblock = limitblocks - parseInt(score / 100);
        if (limitblock < 4)
        {
            limitblock = 4;
        }
    },
    collectAid: function (player, aid) {
        aid.kill();
        canJump = 0;
        score += 50;
        scoreText.text = 'Score:' + score;
        platforms.removeAll();
        var ground = platforms.create(0, game.world.height - 32, 'platform');
        for (var i = 1; i < 12; ++i)
        {
            ground = platforms.create(i * 34, game.world.height - 32, 'platform');
        }
        if (score >= limitOfAid)
        {
            aidCanOut = 1;
            limitOfAid += 200;
        }
    },
    gameOver: function () {
        var btn = game.add.button(game.width / 2, game.height / 2, 'btn', function() {
            game.state.start('Play');
        });
    },
    createRandomArray: function (num, flag) {
        var aLuanXu = [];
        if (flag == 1)
        {
            for (var i = 0; i < num; ++i)
            {
                aLuanXu[i] = i;
            }
        }
        else
        if (flag == 0)
        {
            for (var i = 0; i < num; ++i)
            {
                aLuanXu[i] = heighList[i];
            }
        }
        for (var i = 0; i < num; i++)
        {
            var iRand = parseInt(num * Math.random());
            var temp = aLuanXu[i];
            aLuanXu[i] = aLuanXu[iRand];
            aLuanXu[iRand] = temp;
        }
        return aLuanXu;
    },
    render: function () {
    }
};