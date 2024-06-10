class end extends Phaser.Scene{
    constructor(){
        super("end");
    }

    create(){
        this.endTxt = this.add.bitmapText(10, 50, 'Ariel', "congratulations \nyou escaped the empire!");
        this.endTxt.setScale(2);
        this.instructTxt = this.add.bitmapText(50, 300, 'Ariel', "press R to restart");
        this.instructTxt.setScale(1);
        this.restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    }

    update(){
        if(this.restartKey.isDown){
            this.scene.start("Lvl0");
            stage = 0;
            doubleJump = false;
        }
    }
}