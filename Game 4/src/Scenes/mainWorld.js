class mainWorld extends Phaser.Scene {
    constructor() {
        super("mainWorld");
    }

    init(){
        this.ACCELERATION = 650;
        this.DRAG = 20;    // DRAG < ACCELERATION = icy slide
        this.SCALE = .5;
        this.physics.world.gravity.y = 0;
        this.lastMeteor = 0;
    }

    create() {
        // Add a tile map
        // "map" refers to the key from load.tilemapTiledJSON
        // The map uses 16x16 pixel tiles, and is 10x10 tiles large
        this.map = this.add.tilemap("mainWorld", 64, 64, 180, 180);

        // Add a tileset to the map
        // First parameter: the name we gave to the tileset when it was added to Tiled
        // Second parameter: the key for the tilesheet (from this.load.image above)
        this.tileset = this.map.addTilesetImage("Simple", "Space_Tiles");

        // Create a tile map layer
        // First parameter: name of the layer from Tiled
        this.backgroundMap = this.map.createLayer("background", this.tileset, 0, 0);

        this.backgroundMap.setCollisionByProperty({
            collides: true
        })

        //the spawn of the player
        this.SpawnPoint = this.map.createFromObjects("Spawn", {
            name: "spawnPoint",
            key: "Space_ships",
            frame: "spaceMeteors_001.png"
        });

        //meteors are the structure the player enters to complete levels. 
        this.meteors = this.map.createFromObjects("Objects", {
            name: "meteor",
            key: "Space_ships",
            frame: "spaceMeteors_001.png"
        });

        //these are enemies which follow and attack the player
        this.enemies = this.map.createFromObjects("Enemies", {
            name: "enemy",
            key: "Space_sheet",
            frame: 18
        });

        this.physics.world.enable(this.meteors, Phaser.Physics.Arcade.STATIC_BODY);
        
        //the player uses arcade physics to have the movement work in a certain way
        my.sprite.player = this.physics.add.sprite(this.SpawnPoint[0].x, this.SpawnPoint[0].y, "Space_sheet",  0);
        
        if(stage > 1){
            console.log("Stage: " + stage);
            my.sprite.player.x = this.meteors[stage-2].x;
            my.sprite.player.y = this.meteors[stage-2].y;
        }
        
        my.sprite.player.setSize(12, 12);
        my.sprite.player.setOffset(26, 28);
        my.sprite.player.setCollideWorldBounds(false);
        console.log("X: " + this.SpawnPoint[0].x + " Y: " + this.SpawnPoint[0].y);
        console.log("X: " + my.sprite.player.x + " Y: " + my.sprite.player.y);
        my.sprite.player.body.maxVelocity.x = 90;
        my.sprite.player.body.maxVelocity.y = 90;

        this.instructTxt = this.add.bitmapText(1000, 1000, 'Ariel', "Door");
        this.instructTxt.setScale(2);

        //inputs for the player
        this.selectKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.LeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.RightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.DownKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        for(let meteor of this.meteors){
            
            meteor.setScale(0.5);
        }

        //camera that follows the player
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
            this.enemies[n].setScale(0.6);
            if(Hypotenuse <= 400 && this.enemies[n].active){
                //console.log("N: " + n);
                this.enemies[n].setRotation(enemyRotation + 1.5);
                if(my.sprite.player.x > this.enemies[n].x){
                    this.enemies[n].x += 0.2;
                }else if(my.sprite.player.x < this.enemies[n].x){
                    this.enemies[n].x -= 0.2;
                }
                if(my.sprite.player.y > this.enemies[n].y){
                    this.enemies[n].y+=0.2;
                }else if(my.sprite.player.y < this.enemies[n].y){
                    this.enemies[n].y-= 0.2;
                }
                if(this.hit(this.enemies[n], my.sprite.player)){
                    if(Phaser.Math.Distance.Between(this.enemies[n].x, this.enemies[n].y, this.meteors[this.lastMeteor].x, this.meteors[this.lastMeteor].y) < 30){
                        this.enemies[n].y -= 600;
                    }
                    this.enemies[n].active = false;
                    this.enemies[n].visible = false;
                    this.respawnPlayer();
                }
                
            }
        }
        if(this.hit(my.sprite.player, this.meteors[0])){
            this.instructTxt.y = this.meteors[0].y - 25
            this.instructTxt.x = this.meteors[0].x - 15
            if(stage >= 1){
                this.instructTxt.setText("press E to land on the meteor ");
                if(this.selectKey.isDown){
                    this.scene.start("Lvl1");
                }
            }else{
                this.instructTxt.setText("You can't access this meteor until\n you've completed another meteor");
            }
        }
        if(this.hit(my.sprite.player, this.meteors[1])){
            this.instructTxt.y = this.meteors[1].y - 25
            this.instructTxt.x = this.meteors[1].x - 15
            if(stage >= 1){
                this.instructTxt.setText("press E to land on the meteor ");
                if(this.selectKey.isDown){
                    this.scene.start("Lvl2");
                }
            }else{
                this.instructTxt.setText("You can't access this meteor until\n you've completed meteor 1");
            }
        }
        if(this.hit(my.sprite.player, this.meteors[2])){
            this.instructTxt.y = this.meteors[2].y - 25
            this.instructTxt.x = this.meteors[2].x - 15
            if(stage >= 1){
                this.instructTxt.setText("press E to land on the meteor ");
                if(this.selectKey.isDown){
                    this.scene.start("Lvl3");
                }
            }else{
                this.instructTxt.setText("You can't access this meteor until\n you've completed meteor 2");
            }
        }
        
    }
}