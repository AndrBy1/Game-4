class Lvl1 extends Phaser.Scene {
    constructor() {
        super("Lvl1");
    }

    init(){
        this.ACCELERATION = 650;
        this.DRAG = 20;    // DRAG < ACCELERATION = icy slide
        this.SCALE = .5;
        this.lastMeteor = 0;
    }

    create() {
        // Add a tile map
        // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#tilemap__anchor
        // "map" refers to the key from load.tilemapTiledJSON
        // The map uses 16x16 pixel tiles, and is 10x10 tiles large
        this.map = this.add.tilemap("Lvl1", 64, 64, 180, 180);

        // Add a tileset to the map
        // First parameter: the name we gave to the tileset when it was added to Tiled
        // Second parameter: the key for the tilesheet (from this.load.image above)
        // https://photonstorm.github.io/phaser3-docs/Phaser.Tilemaps.Tilemap.html#addTilesetImage__anchor
        this.tileset = this.map.addTilesetImage("Simple", "Space_Tiles");

        // Create a tile map layer
        // First parameter: name of the layer from Tiled
        // https://newdocs.phaser.io/docs/3.54.0/Phaser.Tilemaps.Tilemap#createLayer
        this.backgroundLayer = this.map.createLayer("background", this.tileset2, 0, 0);

        this.SpawnPoint = this.map.createFromObjects("Spawn", {
            name: "start",
            key: "Space_sheet",
            frame: 28
        });

        this.enemies = this.map.createFromObjects("Enemies", {
            name: "enemy",
            key: "Space_sheet",
            frame: 18
        });

        my.sprite.player = this.physics.add.sprite(this.SpawnPoint[0].x, this.SpawnPoint[0].y, "Space_sheet",  0);
        
        my.sprite.player.setSize(24, 24);
        my.sprite.player.setOffset(20, 18);
        my.sprite.player.setCollideWorldBounds(false);
        console.log("X: " + this.SpawnPoint[0].x + " Y: " + this.SpawnPoint[0].y);
        console.log("X: " + my.sprite.player.x + " Y: " + my.sprite.player.y);
        my.sprite.player.body.maxVelocity.x = 90;
        my.sprite.player.body.maxVelocity.y = 90;

        this.instructTxt = this.add.bitmapText(my.sprite.player.x, my.sprite.player.y, 'Ariel', "get to the very top!");
        this.instructTxt.setScale(1);

        
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.LeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.RightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        document.getElementById('description').innerHTML = '<h2>move: WASD</h2>'
    }

    respawnPlayer(){
        console.log("death");
        my.sprite.player.x = this.meteors[0].x;
        my.sprite.player.y = this.meteors[0].y - 50;
        my.sprite.player.setVelocity(0, 0);
    }

    hit(bullet, target){
        if (Math.abs(bullet.x - target.x) > (bullet.displayWidth/2 + target.displayWidth/2)){
            return false;
        }
        if (Math.abs(bullet.y - target.y) > (bullet.displayHeight/2 + target.displayHeight/2)){
            return false;
        }
        return true;
    }

    update() {
        let enemyRotation;
        if(this.UpKey.isDown){
            my.sprite.player.body.setAccelerationY(-this.ACCELERATION);
            my.sprite.player.resetFlip();
        }
        else if(this.DownKey.isDown){
            my.sprite.player.body.setAccelerationY(this.ACCELERATION);
            my.sprite.player.setFlip(false, true);
        }
        else{
            my.sprite.player.body.setAccelerationY(0);
            my.sprite.player.body.setDragY(this.DRAG);
            
        }
        if(this.LeftKey.isDown){
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.setRotation(-1.5);
        }
        else if(this.RightKey.isDown){
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.setRotation(1.5);
        }
        else{
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.setRotation(0);
        }

        for(let n = 0; n < this.enemies.length; n++){
            enemyRotation = Phaser.Math.Angle.Between(this.enemies[n].x, this.enemies[n].y, my.sprite.player.x, my.sprite.player.y);
            let Hypotenuse = Math.sqrt((this.enemies[n].x - my.sprite.player.x) ** 2 + (this.enemies[n].y - my.sprite.player.y) ** 2);
            this.enemies[n].setScale(1);
            if(Hypotenuse <= 200 && this.enemies[n].active){
                //console.log("N: " + n);
                if(my.sprite.player.x > this.enemies[n].x){
                    this.enemies[n].x += 0.2;
                }else if(my.sprite.player.x < this.enemies[n].x){
                    this.enemies[n].x -= 0.2;
                }
                if(this.hit(this.enemies[n], my.sprite.player)){
                    this.scene.start("Lvl1");
                }
                
            }
            this.enemies[n].y+=0.2;
        }
        if(my.sprite.player.y <= 0)
        {
            if(stage < 2){
                stage = 2;
            }
            console.log("stage: " + stage);
            this.scene.start("mainWorld");
        }
        


    }
}