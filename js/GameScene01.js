class GameScene01 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        this.load.image("background", "./assets/images/Digital rain - background.png");
        this.load.spritesheet("bug_01", "./assets/spritesheets/bug_01.png", {
            frameWidth: MD,
            frameHeight: MD
        });
        this.load.spritesheet("bug_02", "./assets/spritesheets/bug_02_lg.png", {
            frameWidth: LG,
            frameHeight: LG
        });
        this.load.spritesheet("bug_03", "./assets/spritesheets/bug_03_lg.png", {
            frameWidth: LG,
            frameHeight: LG
        });
        this.load.spritesheet("blast", "./assets/spritesheets/large_blast.png", {
            frameWidth: MD,
            frameHeight: MD
        });
        this.load.spritesheet("feature", "./assets/spritesheets/feature_lg.png", {
            frameWidth: LG,
            frameHeight: LG
        });
        this.load.spritesheet("player", "./assets/spritesheets/codr_02_lg.png", {
            frameWidth: LG,
            frameHeight: LG
        });
        this.load.spritesheet("shot", "./assets/spritesheets/shot_md.png", {
            frameWidth: MD,
            frameHeight: MD
        });

        this.load.spritesheet("button", "./assets/spritesheets/phaser_button_sprite.png", {
            frameWidth: 200,
            frameHeight: 100
        });

        this.load.bitmapFont("pixelFont", "./assets/font/font.png", "./assets/font/font.xml");

        this.load.audio("audio_shot", ["./assets/sounds/beam.ogg", "./assets/sounds/beam.mp3"]);
        this.load.audio("audio_blast", ["./assets/sounds/explosion.ogg", "./assets/sounds/explosion.mp3"]);
        this.load.audio("audio_pickup", ["./assets/sounds/pickup.ogg", "./assets/sounds/pickup.mp3"]);
        this.load.audio("music", ["./assets/sounds/sci-fi_platformer12.ogg", "./assets/sounds/sci-fi_platformer12.mp3"]);

        this.getHighScore();
    }

    create() {
        this.add.text(20, 20, "Loading game...");
        this.scene.start("playGame");

        this.anims.create({
            key: "bug_01_anim",
            frames: this.anims.generateFrameNumbers("bug_01"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "bug_02_anim",
            frames: this.anims.generateFrameNumbers("bug_02"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "bug_03_anim",
            frames: this.anims.generateFrameNumbers("bug_03"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "boom",
            frames: this.anims.generateFrameNumbers("blast"),
            frameRate: 20,
            repeat: 0,
            hideOnComplete: true
        });

        
        this.anims.create({
            key: "code",
            frames: this.anims.generateFrameNumbers("player"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "feature_anim",
            frames: this.anims.generateFrameNumbers("feature"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "shot_anim",
            frames: this.anims.generateFrameNumbers("shot"),
            frameRate: CHAR_FPS,
            repeat: -1
        });
        this.anims.create({
            key: "button_anim",
            frames: this.anims.generateFrameNumbers("button"),
            frameRate: 4,
            repeat: -1
        });

    }

    getHighScore() {          
        fetch(SCORE_URL)
        .then(response => response.json())
        .then(response => {
            config.highScore = Number(response.score);
        })
        .catch(err => {
            console.error('High Score nor retrievable at the moment. Check back soon');
            config.highScore = 200;
        });
    }
}