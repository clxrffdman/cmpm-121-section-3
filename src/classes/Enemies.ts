import * as Phaser from "phaser";

export default class Enemy extends Phaser.GameObjects.Sprite {
    speed: number;
    baseX: number;
    baseY: number;
    player: Phaser.GameObjects.Shape;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Phaser.GameObjects.Shape, speed: number) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.player = player;
        this.speed = speed;
        this.baseX = x;
        this.baseY = y;
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
                this.reset();
            }
    }

    
}

export class Waver extends Enemy {
    amplitude: number;
    frequency: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, player: Phaser.GameObjects.Shape, speed: number) {
        super(scene, x, y, texture, player, speed);
        scene.add.existing(this);
        this.amplitude = 80;
        this.frequency = 0.005;
    }

    update(delta: number){
        this.move(delta);
        this.checkBounds();
        this.checkCollision();
    }

    move(delta: number){
        this.x += this.speed * delta;
        this.y = this.baseY + (this.amplitude * Math.cos(this.scene.time.now * this.frequency));
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

            this.reset();
        }
    }

    
}