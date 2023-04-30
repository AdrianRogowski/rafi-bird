class IntroScene extends Phaser.Scene {
    constructor() {
      super("introScene");
    }
  
    create() {
      // Add background and "Click Start to Play" text
      this.add.text(240, 260, "Rafi Bird", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
      this.add.text(240, 320, "Click Start to Play", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
  
      // Add input event listener for pointerdown (touchscreen taps or mouse clicks)
      this.input.on("pointerdown", () => {
        // Start the main game scene
        this.scene.start("mainScene");
      });
    }
  }
  
const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 640,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 1000 },
        debug: false,
      },
    },
    scene: [IntroScene, {
        key: "mainScene",
        preload: preload,
        create: create,
        update: update,
      }],
  };

  
let rafi;
let pipes;
let jumpSound;
let gameOver;
let scoreText;
let score = 0;

function preload() {
  this.load.image("rafi", "assets/rafi_head.png");
  this.load.image("pipe", "assets/pipe.png");
  this.load.audio("shortE", "assets/shortE.wav");
  this.load.audio("longE", "assets/longE.wav");
}

function create() {
    rafi = this.physics.add.sprite(100, 245, "rafi");
    rafi.setCollideWorldBounds(true);
    rafi.displayWidth = 37;
    rafi.displayHeight = 48;
  
    jumpSound = this.sound.add("shortE");
    gameOver = this.sound.add("longE");
  
    pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1500, callback: addPipes, callbackScope: this, loop: true });
  
    this.physics.add.collider(rafi, pipes, () => {
      // Play the extended "E" sound when the game ends
      gameOver.play();
      this.scene.restart();
    });
  
    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#000" });
  
    // // Add input event listener for pointerdown (touchscreen taps or mouse clicks)
    // this.input.on("pointerdown", () => {
    //   jump();
    // });
  
    // // Add input event listener for spacebar key
    // this.input.keyboard.on("keydown-SPACE", () => {
    //   jump();
    // });
}  

function jump() {
    // Play the short "E" sound
    jumpSound.play();
  
    // Apply an upward velocity to Rafi
    rafi.setVelocityY(-350);
}

function update() {
  if (rafi.y > this.sys.game.config.height || rafi.y < 0) {
    gameOver.play();
    this.scene.restart();
  }
}

function addPipes() {
    const pipeWidth = 169;
    const pipeHeight = 420;
    const gapHeight = 150;
    const pipeX = this.sys.game.config.width;
    const pipeY = (Math.random() * (pipeHeight / 2)) + (pipeHeight / 4);
  
    const topPipe = this.physics.add.sprite(pipeX, pipeY - pipeHeight - gapHeight, "pipe");
    const bottomPipe = this.physics.add.sprite(pipeX, pipeY + gapHeight, "pipe");
  
    topPipe.setOrigin(0, 1);
    bottomPipe.setOrigin(0, 0);

    // Set the display width and height of the pipes
    topPipe.displayWidth = pipeWidth;
    topPipe.displayHeight = pipeHeight;
    bottomPipe.displayWidth = pipeWidth;
    bottomPipe.displayHeight = pipeHeight;
  
    pipes.add(topPipe);
    pipes.add(bottomPipe);
  
    this.physics.add.existing(topPipe);
    this.physics.add.existing(bottomPipe);
  
    topPipe.setVelocityX(-200);
    bottomPipe.setVelocityX(-200);
  
    topPipe.allowGravity = false;
    bottomPipe.allowGravity = false;
  
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
  
    // Remove pipes when they go off-screen
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        topPipe.destroy();
        bottomPipe.destroy();
        updateScore();
      },
      callbackScope: this
    });
}

  