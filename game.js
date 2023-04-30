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
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
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
  this.load.audio("shortE", "assets/shortE.mp3");
  this.load.audio("longE", "assets/longE.mp3");
}

function create() {
  rafi = this.physics.add.sprite(100, 245, "rafi");
  rafi.setCollideWorldBounds(true);

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

  this.input.on("pointerdown", () => {
    rafi.setVelocityY(-350);
    jumpSound.play();
  });
}

function update() {
  if (rafi.y > this.sys.game.config.height || rafi.y < 0) {
    gameOver.play();
    this.scene.restart();
  }
}

function addPipes() {
    const pipeHeight = 320;
    const gapHeight = 150;
    const pipeX = this.sys.game.config.width;
    const pipeY = (Math.random() * (pipeHeight / 2)) + (pipeHeight / 4);
  
    const topPipe = this.physics.add.sprite(pipeX, pipeY - pipeHeight - gapHeight, "pipe");
    const bottomPipe = this.physics.add.sprite(pipeX, pipeY + gapHeight, "pipe");
  
    topPipe.setOrigin(0, 1);
    bottomPipe.setOrigin(0, 0);
  
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
  
  function updateScore() {
    score++;
    scoreText.setText("Score: " + score);
  }
  