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
        gravity: { y: 0 },
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
  this.load.image("pipeTop", "assets/pipeTop.png");
  this.load.image("pipeBottom", "assets/pipeBottom.png");
  this.load.audio("shortE", "assets/shortE.wav");
  this.load.audio("longE", "assets/longE.wav");
}

function create() {
    rafi = this.physics.add.sprite(100, 245, "rafi");
    rafi.setCollideWorldBounds(true);
    rafi.displayWidth = 37;
    rafi.displayHeight = 48;
    rafi.setGravityY(1000);
  
    jumpSound = this.sound.add("shortE");
    gameOver = this.sound.add("longE");
  
    pipes = this.physics.add.group();
    this.time.addEvent({ delay: 500, callback: addPipes, callbackScope: this, loop: true });
  
    this.physics.add.collider(rafi, pipes, () => {
      // Play the extended "E" sound when the game ends
      gameOver.play();
      this.scene.restart();
    });
  
    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" });
  
    // Add input event listener for pointerdown (touchscreen taps or mouse clicks)
    this.input.on("pointerdown", () => {
      jump();
    });
  
    // Add input event listener for spacebar key
    this.input.keyboard.on("keydown-SPACE", () => {
      jump();
    });

    // Add input event listener for "R" key
    this.input.keyboard.on("keydown-R", () => {
        this.scene.restart();
      });
}  

function jump() {
    // Play the short "E" sound
    jumpSound.play();
  
    // Apply an upward velocity to Rafi
    rafi.setVelocityY(-350);
}

function update() {
    if (rafi.y > this.sys.game.config.height || rafi.y < 0) {
      // Play the extended "E" sound when the game ends
      gameOver.play();
  
      // Display "Game Over" text
      this.add.text(240, 260, "Game Over", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
  
      // Restart the game after a delay
      this.time.addEvent({
        delay: 2000,
        callback: () => {
          this.scene.restart();
        },
        callbackScope: this
      });
    }
  
    pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0) {
        pipe.destroy();
      }
    });
  }

  function addPipes() {
    const pipeWidth = 85;
    const pipeHeight = 210;
    const gapHeight = 150;
    const pipeX = this.sys.game.config.width;
    const pipeY = (Math.random() * (pipeHeight / 2)) + (pipeHeight / 4);
  
    const topPipe = this.physics.add.sprite(pipeX, pipeY - pipeHeight - gapHeight, 'pipeTop');
    const bottomPipe = this.physics.add.sprite(pipeX, pipeY + gapHeight, 'pipeBottom');
  
    topPipe.setOrigin(0, 1);
    bottomPipe.setOrigin(0, 0);
  
    topPipe.displayWidth = 85;
    topPipe.displayHeight = 210;
    bottomPipe.displayWidth = 85;
    bottomPipe.displayHeight = 210;
  
    topPipe.allowGravity = false;
    bottomPipe.allowGravity = false;
  
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
  
    pipes.add(topPipe);
    pipes.add(bottomPipe);
  
    topPipe.setVelocityX(-200);
    bottomPipe.setVelocityX(-200);
    topPipe.setVelocityY(0); // Ensures that the top pipe doesn't fall down
    bottomPipe.setVelocityY(0); // Ensures that the bottom pipe doesn't fall down
  
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

function updateScore() {
    score++;
    scoreText.setText("Score: " + score);
    console.log("Score updated"); // Add this line for debugging
  }
  