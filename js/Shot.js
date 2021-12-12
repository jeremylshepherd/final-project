class Shot extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        const x = scene.player.x;
        const y = scene.player.y;

        super(scene, x, y, "shot");
        scene.add.existing(this);

        this.play("shot_anim");
        scene.physics.world.enableBody(this);
        this.body.velocity.y = - 250;

        scene.projectiles.add(this);
    }

    update() {
        if (this.y < 20) {
            this.destroy();
        }
    }
}