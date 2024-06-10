class Lvl2 extends Phaser.Scene {
    constructor() {
        super("Lvl2");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 650;
        this.DRAG = 700;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -500;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.6;
        this.checkpoint = false;
        this.textDuration = 90;
        this.frame = 0;
        this.secondJump = false;
        this.enemyBulletCount = 3;
        this.enemyBulletCool = 15;
        this.bulletSpeed = 35;
    }

    create() {
        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("Lvl2", 18, 18, 90, 50);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("platformer", "Platform_Tiles");
        this.tileset2 = this.map.addTilesetImage("Space", "Space_Tiles");
        
        // Create a layer
        this.backgroundLayer = this.map.createLayer("background", this.tileset2, 0, 0);
        this.groundLayer = this.map.createLayer("GroundPlatforms", this.tileset, 0, 0);
        
        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        this.SpawnPoint = this.map.createFromObjects("Spawn", {
            name: "start",
            key: "Platform_sheet",
            frame: 112
        });

        this.respawn = this.map.createFromObjects("Spawn", {
            name: "checkPoint",
            key: "Platform_sheet",
            frame: 112
        });

        this.exit = this.map.createFromObjects("LvlExit", {
            name: "endLvl",
            key: "Space_sheet",
            frame: 0
        });

        this.enemies = this.map.createFromObjects("Mob", {
            name: "enemy",
            key: "Space_sheet",
            frame: 18
        });

        this.upgrade = this.map.createFromObjects("Powerup", {
            name: "upgrade",
            key: "Space_sheet",
            frame: 47
        })

        my.sprite.bulletGroup = this.add.group({
            key: "Space_sheet",
            frame: 35,
            maxSize: 10
        })
        my.sprite.bulletGroup.createMultiple({
            active: false,
            key: my.sprite.bulletGroup.defaultKey,
            repeat: my.sprite.bulletGroup.maxSize - 1
        });

        my.sprite.enemybulletGroup = this.add.group({
            defaultKey: "enemyFire",
            maxSize: this.enemyBulletCount
        })
        my.sprite.enemybulletGroup.createMultiple({
            active: false,
            key: my.sprite.enemybulletGroup.defaultKey,
            repeat: my.sprite.enemybulletGroup.maxSize - 1
        });

        //this.physics.world.enable(this.enemies, Phaser.Physics.Arcade.STATIC_BODY);
        //this.enemyGroup = this.add.group(this.enemies);
        this.physics.world.enable(this.upgrade, Phaser.Physics.Arcade.STATIC_BODY);

        this.physics.world.enable(this.exit, Phaser.Physics.Arcade.STATIC_BODY);
        this.exit[0].setScale(1.8);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(this.SpawnPoint[0].x, this.SpawnPoint[0].y, "platformer_characters", "tile_0002.png");
        my.sprite.player.setCollideWorldBounds(false);
        my.sprite.player.body.maxVelocity.x = 250;

        my.sprite.player.setSize(18, 18);
        my.sprite.player.setOffset(3, 4);
        
        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.checkText = this.add.bitmapText(this.respawn[0].x -15, this.respawn[0].y-25, 'Ariel', "Checkpoint!");
        this.checkText.setScale(0.3);
        this.checkText.visible = false;

        // debug key listener (assigned to D key)

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['dirt_02.png', 'dirt_03.png'],
            // TODO: Try: add random: true
            addRandom: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 3,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['light_02.png', 'light_03.png'],
            // TODO: Try: add random: true
            addRandom: true,
            scale: {start: 0.03, end: 0.1},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 10,
            lifespan: 350,
            // TODO: Try: gravityY: -400,
            gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping.stop();

        this.physics.add.overlap(my.sprite.player, this.upgrade, (obj1, obj2) => {
            //this.powerTxt = this.add.bitmapText(obj2.x, obj2.y, 'Ariel', "You just got the Double Jump!\n press jump while in midair!");
            //this.powerTxt.setScale(0.3);
            obj2.destroy();
            doubleJump = true;
            //my.vfx.powerup.start();
            //my.vfx.powerup.startFollow(obj2, obj2.displayWidth/2-10, obj2.displayHeight/2-5, false);
            //my.vfx.powerup.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
        });

        this.physics.add.overlap(my.sprite.player, this.exit[0], (obj1, obj2) => {
            if(stage < 3){
                stage = 3;
            }
            this.scene.start("mainWorld");

            
        });

        this.LeftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.RightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.UpKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);

        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 100, 100); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(1, 1);
        this.cameras.main.setZoom(this.SCALE);
        
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

    fireProjectile(x,y){
        const projectile = this.getFirstDead(false);
        if(projectile == false){
            this.body.reset(x, y);
            this.active = true;
            this.visible = true;

            this.setVelocity(-20);
        }
    }

    respawnPlayer(){
        console.log("death");
        if(this.checkpoint == true){
            my.sprite.player.x = this.respawn[0].x;
            my.sprite.player.y = this.respawn[0].y - 50;
            my.sprite.player.setVelocity(0, 0);
        }
        else{
            my.sprite.player.x = this.SpawnPoint[0].x;
            my.sprite.player.y = this.SpawnPoint[0].y - 50;
            my.sprite.player.setVelocity(0, 0);
        }
        this.physics.world.gravity.y = 1500;
    }

    twoJump(){
        if(doubleJump == true && this.secondJump == true){
            console.log("check1");
            if(!my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.UpKey)){
                my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

                //this.sound.play("jumpsound");

                my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
                my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
                if (my.sprite.player.body.blocked.down) {
                    my.vfx.jumping.start();
                }
                this.secondJump = false;
            }
        }
        if(!my.sprite.player.body.blocked.down){
            
            this.secondJump = true;
        }
    }


    update() {
        this.frame++;
        let enemyRotation;

        //left and right movement: 
        if(this.LeftKey.isDown) {
            // TODO: have the player accelerate to the left
            my.sprite.player.body.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);

            if(this.frame % 30 == 0){
                //this.sound.play("walksound");
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(this.RightKey.isDown) {
            
            //console.log(Math.sqrt((this.enemies[0].x - my.sprite.player.x) ** 2 + (this.enemies[0].y - my.sprite.player.y) ** 2));
            // TODO: have the player accelerate to the right
            my.sprite.player.body.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);

            if(this.frame % 30 == 0){
                //this.sound.play("walksound");
            }

            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            // TODO: set acceleration to 0 and have DRAG take over
            my.sprite.player.body.setAccelerationX(0);
            my.sprite.player.body.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(this.UpKey)) {
            // TODO: set a Y velocity to have the player "jump" upwards (negative Y direction)
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);

            //this.sound.play("jumpsound");

            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.jumping.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.jumping.start();
            }
        }
        else
        {
            my.vfx.jumping.stop();
        }
        if(doubleJump == true){
            this.twoJump();
        }
        if(my.sprite.player.y >= 800){
            this.respawnPlayer();
        }
        if(this.hit(my.sprite.player, this.respawn[0])){
            this.checkpoint = true;
            this.checkText.visible = true;
        }

        for(let n = 0; n < this.enemies.length; n++){
            enemyRotation = Phaser.Math.Angle.Between(this.enemies[n].x, this.enemies[n].y, my.sprite.player.x, my.sprite.player.y);
            let Hypotenuse = Math.sqrt((this.enemies[n].x - my.sprite.player.x) ** 2 + (this.enemies[n].y - my.sprite.player.y) ** 2);
            this.enemies[n].setScale(0.6);
            if(Hypotenuse <= 200 && this.enemies[n].active){
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
                    if(Phaser.Math.Distance.Between(this.enemies[n].x, this.enemies[n].y, this.respawn[0].x, this.respawn[0].y) < 30){
                        this.enemies[n].y -= 50;
                    }
                    if(Phaser.Math.Distance.Between(this.enemies[n].x, this.enemies[n].y, this.SpawnPoint[0].x, this.SpawnPoint[0].y) < 30){
                        this.enemies[n].y -= 50;
                    }
                    this.respawnPlayer();
                }
            }
            for(let bullet of my.sprite.enemybulletGroup.getChildren()){
                
                if(bullet.x > 900){
                    bullet.active = false;
                    bullet.visible = false;
                }
            }
        }

        if(this.hit(my.sprite.player, this.respawn[0])){
            this.checkpoint = true;
            this.checkText.visible = true;
        }
        
    }
}