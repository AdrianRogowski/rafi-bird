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
    highScore: 0
  };

  
let rafi;
let pipes;
let jumpSound;
let gameOver;
let scoreText;
let score = 0;
let highScore = 0;
let highScoreText;

function preload() {
  this.load.image("rafi", "assets/rafi_head.png");
  this.load.image("pipeTop", "assets/pipeTop.png");
  this.load.image("pipeBottom", "assets/pipeBottom.png");
  this.load.audio("shortE", "assets/shortE.wav");
  this.load.audio("longE", "assets/longE.wav");
}

function create() {
    this.gameOver = false;

    rafi = this.physics.add.sprite(100, 245, "rafi");
    rafi.setCollideWorldBounds(true);
    rafi.displayWidth = 37;
    rafi.displayHeight = 48;
    rafi.setGravityY(1000);
  
    jumpSound = this.sound.add("shortE");
    gameOver = this.sound.add("longE");
  
    pipes = this.physics.add.group();
    this.time.addEvent({ delay: 1000, callback: addPipes, callbackScope: this, loop: true });
  
    this.physics.add.collider(rafi, pipes, () => {
      // Play the extended "E" sound when the game ends
      gameOver.play();
  
      // Call the showGameOver function
      showGameOver.call(this);
    });

    scoreText = this.add.text(16, 16, "Score: 0", { fontSize: "32px", fill: "#fff" });

    highScoreText = this.add.text(400, 16, "High: " + config.highScore, { fontSize: "32px", fill: "#fff" });
    highScoreText.setOrigin(1, 0);

    resetGame.call(this);
  
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
    if (this.gameOver) return;
  
    // Play the short "E" sound
    jumpSound.play();
  
    // Apply an upward velocity to Rafi
    rafi.setVelocityY(-350);
}

function update() {
  if (this.gameOver) {
    pipes.setVelocityX(0);
    return;
  }

  if (rafi.y > this.sys.game.config.height || rafi.y < 0) {
    // Play the extended "E" sound when the game ends
    gameOver.play();

    // Call the showGameOver function
    showGameOver.call(this);
}
  
    pipes.getChildren().forEach((pipe) => {
      if (pipe.getBounds().right < 0 || this.time.now - pipe.createdTime > 5000) {
        if (pipe.texture.key === 'pipeTop') {
          updateScore();
        }
        pipe.destroy();
      }
    });
  }

  function addPipes() {
    const pipeWidth = 128;
    const pipeHeight = 315;
    const pipeX = this.sys.game.config.width;
    const pipeY = Math.floor(Math.random() * (-140)); // Adjusted calculation

    const topPipe = this.physics.add.sprite(pipeX, pipeY, 'pipeTop');
    const bottomPipe = this.physics.add.sprite(pipeX, pipeY + 840, 'pipeBottom');  
  
    topPipe.setOrigin(0, 0);
    bottomPipe.setOrigin(0, 1);

    pipes.add(topPipe);
    pipes.add(bottomPipe);
  
    topPipe.displayWidth = 128;
    topPipe.displayHeight = 315;
    bottomPipe.displayWidth = 128;
    bottomPipe.displayHeight = 315;
    topPipe.createdTime = this.time.now;
    bottomPipe.createdTime = this.time.now;
  
    topPipe.allowGravity = false;
    bottomPipe.allowGravity = false;
  
    topPipe.body.immovable = true;
    bottomPipe.body.immovable = true;
  
    topPipe.setVelocityX(-200);
    bottomPipe.setVelocityX(-200);
    topPipe.setVelocityY(0);
    bottomPipe.setVelocityY(0);


}

function resetGame() {
  // Reset game score
  score = 0;
  scoreText.setText("Score: " + score);
}

function showGameOver() {
    this.gameOver = true;

    // Display "Game Over" text
    const gameOverText = this.add.text(240, 260, "Game Over", { fontSize: "32px", fill: "#fff" }).setOrigin(0.5);
    const finalScoreText = this.add.text(240, 300, "Score: " + score, { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);
    const clickToContinueText = this.add.text(240, 340, "Click to Continue", { fontSize: "24px", fill: "#fff" }).setOrigin(0.5);

  this.input.once("pointerdown", () => {
      // Remove Game Over elements
      gameOverText.destroy();
      finalScoreText.destroy();
      clickToContinueText.destroy();

      // Reset the gameOver flag
      this.gameOver = false;

      // Restart the game
      this.scene.restart();
  });
}

function updateScore() {
  score++;
  scoreText.setText("Score: " + score);
  if (score > config.highScore) {
      config.highScore = score;
      highScoreText.setText("High: " + config.highScore);
  }
}
  