class GameScene02 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        const { width, height } = config;
        this.background = this.add.tileSprite(0, 0, width, height, "background");
        this.background.setOrigin(0,0);

        this.bug_01 = this.add.sprite(width/2 - 50, height/2, "bug_01");
        this.bug_02 = this.add.sprite(width/2, height/2, "bug_02");
        this.bug_03 = this.add.sprite(width/2 + 50, height/2, "bug_03");

        this.enemies = this.physics.add.group();
        this.enemies.add(this.bug_01);
        this.enemies.add(this.bug_02);
        this.enemies.add(this.bug_03);
        
        this.features = this.physics.add.group();
        this.featuresCount = MAX_FEATURES;
        this.generateFeatures(this.features, MAX_FEATURES);

        this.player = this.physics.add.sprite(width/2 - 8, height - 64, 'player');
        this.player.play('code');
        this.player.setCollideWorldBounds(true);
        
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.projectiles = this.add.group();

        this.bug_01.play("bug_01_anim");
        this.bug_02.play("bug_02_anim");
        this.bug_03.play("bug_03_anim");

        this.bug_01.setInteractive();
        this.bug_02.setInteractive();
        this.bug_03.setInteractive();

        this.input.on('gameobjectdown', this.destroyBug, this);
        
        this.physics.add.collider(this.projectiles, this.features, (projectile, feature) => {
            projectile.destroy();
        });
        this.physics.add.overlap(this.player, this.features, this.pickupFeature, null, this);
        this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.hitEnemy, null, this);

        const graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.75);
        graphics.beginPath();
        graphics.moveTo(0,0);
        graphics.lineTo(config.width, 0);
        graphics.lineTo(config.width, 20);
        graphics.lineTo(0, 20);
        graphics.lineTo(0, 0);
        graphics.closePath();
        graphics.fillPath();

        this.score = 0;
        this.lives = 3;
        this.extraLives = 3;
        this.scoreLabel = this.add.bitmapText(10, 5, "pixelFont", `SCORE: ${this.zeroPad(this.score, 6)}`, 16);
        this.highScoreLabel = this.add.bitmapText(width/2 - 60, 5, "pixelFont", `HIGH SCORE: ${this.zeroPad(config.highScore, 6)}`, 16);
        this.livesLabel = this.add.bitmapText(width - 50, 5, "pixelFont", `Lives: ${this.lives}`, 16);       
        
        this.shotSound = this.sound.add("audio_shot");
        this.blastSound = this.sound.add("audio_blast");
        this.pickupSound = this.sound.add("audio_pickup");
        
        this.music = this.sound.add("music");
        
        const musicConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: false,
            delay: 0
        };

        this.music.play(config);
    }

    moveBug(bug, speed) {
        bug.y += speed;
        if ( bug.y > config.height) {
            this.resetBugPos(bug);
        }
    }

    generateFeatures(featuresGroup, num) {
        for (let i = 0; i < num; i++) {
            const feature = this.physics.add.sprite(config.width/2, config.height/2, "feature");
            featuresGroup.add(feature);
            feature.setRandomPosition(0, 0, config.width, config.height);
            feature.play('feature_anim');
            feature.setVelocity(100, 100);
            feature.setCollideWorldBounds(true);
            feature.setBounce(1);
        }
    }


    setHighScore() {
        const data = JSON.stringify({ score: this.score });
        fetch(SCORE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: data
        });
    }

    resetBugPos(bug) {
        bug.y = 0;
        const ranndomX = Phaser.Math.Between(0, config.width);
        bug.x = ranndomX;
    }

    destroyBug(pointer, gameObject) {
        gameObject.setTexture('blast');
        gameObject.play('boom')
    }

    movePlayerManager() {
        if (this.cursorKeys.left.isDown)
            this.player.setVelocityX(-gameSettings.playerSpeed);
        
        if (this.cursorKeys.right.isDown)
            this.player.setVelocityX(gameSettings.playerSpeed);

        if (this.cursorKeys.left.isUp && this.cursorKeys.right.isUp)
            this.player.setVelocityX(0);

        if (this.cursorKeys.up.isDown)
            this.player.setVelocityY(-gameSettings.playerSpeed);
        
        if (this.cursorKeys.down.isDown)
            this.player.setVelocityY(gameSettings.playerSpeed);

        if (this.cursorKeys.up.isUp && this.cursorKeys.down.isUp)
            this.player.setVelocityY(0);
    }

    shoot() {
        const shot = new Shot(this);
        this.shotSound.play();
    }

    updateScore(score, label, text) {
        const formattedScore = this.zeroPad(score, 6);
        label.text = `${text} ${formattedScore}`;
    }

    pickupFeature(player, feature) {
        feature.disableBody(true, true);
        this.pickupSound.play();
        this.featuresCount--;
        if(this.featuresCount < 1) {
            this.lives++;
            this.extraLives--;
            this.score += 100;
            this.updateScore(this.score, this.scoreLabel, `SCORE`);
            this.livesLabel.text = `Lives: ${this.lives}`;
            if(this.extraLives > 0) {
                this.featuresCount = 4;
                this.generateFeatures(this.features, MAX_FEATURES);
            }
        }
    }

    hurtPlayer(player, enemy) {
        if (player.alpha < 1)
            return;

        this.resetBugPos(enemy);
        const blast = new Blast(this, player.x, player.y);
        player.disableBody(true, true);     
        if (this.lives > 0) {   
            this.time.addEvent({
                delay: 1000,
                callback: this.resetPlayer,
                callbackScope: this,
                loop: false
            });
        }
        this.blastSound.play();
        this.lives--;
        if (this.lives < 0) {
            this.gameOverMan();
        } else {
            this.livesLabel.text = `Lives: ${this.lives}`;        
        }
    }

    gameOverMan() {
        if (this.score > config.highScore) {
            this.setHighScore();
        }
        const { width, height } = config;
        const modal = this.add.graphics();
        modal.fillStyle(0x000018, 0.80);
        modal.lineStyle(3, 0x000000);
        modal.beginPath();
        modal.moveTo(30,30);
        modal.lineTo(width - 30, 30);
        modal.lineTo(width - 30, height - 30);
        modal.lineTo(30, height - 30);
        modal.lineTo(30, 30);
        modal.closePath();
        modal.fillPath();
        modal.strokePath();
        this.gameOverLabel = this.add.bitmapText(width/2, height/2, "pixelFont", `GAME OVER, MAN!`, 32).setOrigin(0.5);
        this.resetButton = this.add.sprite(width/2, height/2 + 50, "button").setScale(.5).setOrigin(0.5);
        this.resetButton.setInteractive().on('pointerdown', () => {
            this.scene.restart();
        });
    }

    hitEnemy(projectile, enemy) {
        const blast = new Blast(this, enemy.x, enemy.y);
        projectile.destroy();
        this.resetBugPos(enemy);
        this.score += 15;
        this.updateScore(this.score, this.scoreLabel, `SCORE`);
        this.blastSound.play();
    }

    resetPlayer() {
        const x = config.width/2 - 8;
        const y = config.height - 64;
        this.player.enableBody(true, x, y, true, true);
        this.player.alpha = 0.5;

        const tween = this.tweens.add({
            targets: this.player,
            y: config.height - 64,
            ease: "Power1",
            duration: 1500,
            repeat: 0,
            onComplete: function() {
                this.player.alpha = 1;
            }, callbackScope: this
        });
    }

    zeroPad(number, size) {
        let stringNumber = String(number);
        while(stringNumber.length < (size || 2)) {
            stringNumber = `0${stringNumber}`;
        }
        return stringNumber;
    }

    bugSpeed(num) {
        if (this.score < 1000) {
            return num;
        } else {
            return num + (this.score * .0005);
        }
    }

    update() {        
        this.moveBug(this.bug_01, this.bugSpeed(1));
        this.moveBug(this.bug_02, this.bugSpeed(2));
        this.moveBug(this.bug_03, this.bugSpeed(3));

        this.background.tilePositionY -= 1.5;

        this.movePlayerManager();

        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.player.active)
                this.shoot();
        }
        
        for (let i = 0; i < this.projectiles.getChildren().length; i++) {
            const shot = this.projectiles.getChildren()[i];
            shot.update();
        }
    }
}