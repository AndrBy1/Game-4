// Andrew Byi
// 6/7/2024
//
// game 4
//
// 
// Art assets from Kenny Assets "Shape Characters" set:
// https://kenney.nl/assets/shape-characters

// debug with extreme prejudice
"use strict"

let stage = 0;
let doubleJump = false;

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    width: 900,         // 10 tiles, each 16 pixels, scaled 4x
    height: 750,
    scene: [Load, mainWorld, Lvl0, Lvl1, Lvl2, Lvl3, end]
}

var cursors;
const SCALE = 2.0
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);