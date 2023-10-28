import * as Phaser from "phaser";
import Play from "../scenes/Play";

export default class Enemy extends Phaser.GameObjects.Sprite {
    speed: number;
    value: number;
    baseX: number;
    baseY: number;
    player: Phaser.GameObjects.Shape;
    playScene: Play; 

    constructor(scene: Play, x: number, y: number, texture: string, player: Phaser.GameObjects.Shape, speed: number, value: number) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.player = player;
        this.speed = speed;
        this.baseX = x;
        this.baseY = y;
        this.value = value;
        this.playScene = scene;
    }

    update(delta: number){
        this.move(delta);
        this.checkBounds();
        this.checkCollision();
    }

    move(delta: number){
        this.x += this.speed * delta;
    }

    checkBounds(){
        if(this.x > (this.scene.game.config.width as number)){
            this.reset();
        }
    }

    reset(){
        this.x = this.baseX;
    }

    checkCollision(){
        if(this.player.x < this.x + this.width && 
            this.player.x + this.player.width > this.x && 
            this.player.y < this.y + this.height &&
            this.player.height + this.player.y > this.y){
                this.onDestroy();
            }
    }

    onDestroy(){
        this.playScene.score! += this.value;
        this.playScene.updateScoreText();
        this.reset();
    }

    
}

export class Waver extends Enemy {
    amplitude: number;
    frequency: number;

    constructor(scene: Play, x: number, y: number, texture: string, player: Phaser.GameObjects.Shape, speed: number, value: number) {
        super(scene, x, y, texture, player, speed, value);
        scene.add.existing(this);
        this.amplitude = 80;
        this.frequency = 0.005;
    }

    move(delta: number){
        this.x += this.speed * delta;
        this.y = this.baseY + (this.amplitude * Math.cos(this.scene.time.now * this.frequency));
    }

    
}

export class Sweeper extends Enemy {
    amplitude: number;
    frequency: number;

    constructor(scene: Play, x: number, y: number, texture: string, player: Phaser.GameObjects.Shape, speed: number, value: number) {
        super(scene, x, y, texture, player, speed, value);
        scene.add.existing(this);
        this.amplitude = 1.2;
        this.frequency = 0.005;
    }

    move(delta: number){
        this.x += Math.abs((this.amplitude * Math.cos(this.scene.time.now * this.frequency))) * delta;
        this.y = this.baseY + (this.amplitude * 40 * Math.cos(this.scene.time.now * this.frequency));
    }

    
}