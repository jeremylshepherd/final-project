const CHAR_FPS = 10;
const BLAST_FPS = 20;
const MAX_FEATURES = 4;
const LG = 64;
const MD = 32;
const SM = 16;
const SCORE_URL = `https://magnificent-swamp-gardenia.glitch.me/api/score`;
const WIDTH = 600;
const HEIGHT = 780;

const config = {
    width: WIDTH, 
    height: HEIGHT,
    backgroundColor: 0xff00ff,
    scene: [GameScene01, GameScene02],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    highScore: 0
};

const gameSettings = {
    playerSpeed: 200
}

window.onload = () => { const game = new Phaser.Game(config); }