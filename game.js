const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Load the bird image
const birdImage = new Image();
birdImage.src = "9d63676d959ceb7fc33cb1b73cc2780f-removebg-preview.png"; // Path to your bird image

const bird = {
  x: 50, // Start position of the bird
  y: canvas.height / 2,
  width: 40, // Set to your image's width
  height: 50, // Set to your image's height
  gravity: 0.3,
  lift: -6,
  velocity: 0,
};

const pipes = [];
const pipeWidth = 50;
const pipeGap = 250;
const pipeSpeed = 2;
let frame = 0;
let score = 0;
let gameOver = false;
let showHitbox = false;

function drawBird() {
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
  if (showHitbox) {
    drawBirdHitbox(); // Draw the hitbox for debugging
  }
}

function drawBirdHitbox() {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 2;
  ctx.strokeRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  });
}

function drawScore() {
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function drawEasterEgg(message) {
  ctx.fillStyle = "purple";
  ctx.font = "32px Arial";
  ctx.fillText(message, canvas.width / 2 - 100, canvas.height / 2);
}

function updateBird() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height) {
    bird.y = canvas.height - bird.height;
    bird.velocity = 0;
  }
  if (bird.y < 0) {
    bird.y = 0;
    bird.velocity = 0;
  }
}

function updatePipes() {
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;
  });
  if (pipes.length && pipes[0].x < -pipeWidth) {
    pipes.shift();
    score++;
  }
  if (frame % 90 === 0) {
    const top = Math.random() * (canvas.height - pipeGap - 40) + 20;
    const bottom = canvas.height - top - pipeGap;
    pipes.push({ x: canvas.width, top, bottom });
  }
}

function checkCollision() {
  return pipes.some((pipe) => {
    if (bird.x + bird.width > pipe.x && bird.x < pipe.x + pipeWidth) {
      if (
        bird.y < pipe.top ||
        bird.y + bird.height > canvas.height - pipe.bottom
      ) {
        return true;
      }
    }
    return false;
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  drawScore();
  updateBird();
  updatePipes();

  if (score === 50) {
    drawEasterEgg("You are gay!");
  } else if (score === 100) {
    drawEasterEgg("You are Gay x2!");
  }

  if (checkCollision()) {
    gameOver = true;
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    document.getElementById("playAgainButton").style.display = "block";
    return;
  }
}

function gameLoop() {
  if (!gameOver) {
    frame++;
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function resetGame() {
  bird.x = 50;
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes.length = 0;
  score = 0;
  frame = 0;
  gameOver = false;
  document.getElementById("playAgainButton").style.display = "none";
  gameLoop();
}

document.getElementById("playAgainButton").addEventListener("click", resetGame);
document.getElementById("toggleHitboxButton").addEventListener("click", () => {
  showHitbox = !showHitbox;
});

document.addEventListener("keydown", () => {
  if (!gameOver) {
    bird.velocity = bird.lift;
  }
});

birdImage.onload = () => {
  gameLoop();
};
