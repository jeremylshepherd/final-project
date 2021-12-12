class Blast extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "blast");
        scene.add.existing(this);
        this.play("boom");
    }
}