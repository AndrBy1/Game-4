class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load characters spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");
        this.load.atlasXML("Space_ships", "spaceShooter2_spritesheet.png", "spaceShooter2_spritesheet.xml");

        // Load tilemap information
        this.load.image("Space_Tiles", "simpleSpace_tilesheet.png");                         // Packed tilemap
        this.load.image("Platform_Tiles", "tilemap_packed.png");
        this.load.image("enemyFire", "meteor_detailedSmall.png");
        this.load.tilemapTiledJSON("mainWorld", "WorldMap.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("Lvl0", "introLvl.tmj");
        this.load.tilemapTiledJSON("Lvl1", "1stLvl.tmj");
        this.load.tilemapTiledJSON("Lvl2", "2ndLvl.tmj");
        this.load.tilemapTiledJSON("Lvl3", "3rdLvl.tmj");
        //this.load.tilemapTiledJSON("theEnd", "Platformer-end.tmj");
        this.load.multiatlas("kenny-particles", "kenny-particles.json");
        this.load.bitmapFont('Ariel', 'Font_0.png', 'Font.xml');
        this.load.spritesheet("Space_sheet", "simpleSpace_tilesheet.png", {
            frameWidth: 64,
            frameHeight: 64
        });
        this.load.spritesheet("Platform_sheet",  "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        })
        //this.load.audio("moveSound", "slime_000.ogg");
        //this.load.audio("jumpSound", "forceField_001.ogg")
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 6,
                end: 7,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0006.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0007.png" }
            ],
        });

         // ...and pass to the next Scene
         
         this.scene.start("Lvl0");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}