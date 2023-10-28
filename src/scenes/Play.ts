import * as Phaser from "phaser";

import starfieldUrl from "/assets/starfield.png";
import enemyUrl from "/assets/enemy.png";
import Enemy, { Waver } from "../classes/Enemies";
import { Vector } from "matter";

export default class Play extends Phaser.Scene {
  fire?: Phaser.Input.Keyboard.Key;
  left?: Phaser.Input.Keyboard.Key;
  right?: Phaser.Input.Keyboard.Key;
  shipLaunched?: boolean;

  starfield?: Phaser.GameObjects.TileSprite;
  ship?: Phaser.GameObjects.Shape;
  startX?: number;
  startY?: number;
  enemyArray? : Enemy[] = [];
  score?: number;
  scoreText? : Phaser.GameObjects.Text;

  constructor() {
    super("play");
  }

  preload() {
    this.load.image("starfield", starfieldUrl);
    this.startX = 100;
    this.startY = this.game.config.height as number - 100;
    this.shipLaunched = false;
    this.score = 0;
  }

  #addKey(
    name: keyof typeof Phaser.Input.Keyboard.KeyCodes,
  ): Phaser.Input.Keyboard.Key {
    return this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes[name]);
  }

  create() {
    this.fire = this.#addKey("F");
    this.left = this.#addKey("LEFT");
    this.right = this.#addKey("RIGHT");

    this.starfield = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width as number,
        this.game.config.height as number,
        "starfield",
      )
      .setOrigin(0, 0);

    this.ship = this.add.rectangle(this.startX, this.startY, 50, 50, 0x4fb589);
    this.scoreText = this.add.text(0, 0, 'Score: 0', { font: '"Press Start 2P"'});
    
    this.enemyArray?.push(new Waver(this, -100, 100, enemyUrl, this.ship, 0.5, 100));
    this.enemyArray?.push(new Enemy(this, -100, 150, enemyUrl, this.ship, 0.3, 50));
    this.enemyArray?.push(new Waver(this, -150, 100, enemyUrl, this.ship, 0.2, 100));
  }

  update(_timeMs: number, delta: number) {
    this.starfield!.tilePositionX -= 4;
    this.checkMovement(delta);

    if (this.fire!.isDown && !this.shipLaunched) {
      this.fire!.isDown = false;
      this.launch();
    }

    this.enemyArray?.forEach((element) => element.update(delta));
  }

  updateScoreText(){
    this.scoreText?.setText(`Score: ${this.score}`);
  }

  removeEnemy(enemy : Enemy){
    
  }

  checkMovement(delta: number){

    if(this.shipLaunched){
      return;
    }

    if (this.left!.isDown && this.ship!.x > 0) {
      this.ship!.x -= 1 * delta;
    }
    if (this.right!.isDown && this.ship!.x < (this.game.config.width as number)) {
      this.ship!.x += 1 * delta;
    }
  }

  launch(){
    this.shipLaunched = true;
    this.tweens.add({
      targets: this.ship,
      y: { from: this.startY, to: 0 },
      duration: 300,
      ease: Phaser.Math.Easing.Sine.Out,
    });
    this.tweens.add({
      delay: 300,
      targets: this.ship,
      y: { from: 0, to: this.startY },
      scale: { from: 1.1, to: 0 },
      duration: 200,
      ease: Phaser.Math.Easing.Sine.In,
      onComplete: () => {
        this.shipLaunched = false;
        this.ship!.scaleX = 1;
        this.ship!.scaleY = 1;  
      }
    });
  }
}
