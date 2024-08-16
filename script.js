const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Create the pong paddles and ball
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
let player = { x: 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#fff', dy: 4 };
let ai = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, width: paddleWidth, height: paddleHeight, color: '#fff', dy: 4 };
let ball = { x: canvas.width / 2, y: canvas.height / 2, size: ballSize, dx: 5, dy: 3, color: '#fff' };

let playerScore = 0;
let aiScore = 0;
let tries = 3;

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = ai.color;
    ctx.fillRect(ai.x, ai.y, ai.width, ai.height);

    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function update() {
    // Ball movement
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (ball.x <= player.x + player.width && ball.y + ball.size >= player.y && ball.y <= player.y + player.height) {
        ball.dx *= -1;
    }
    
    if (ball.x + ball.size >= ai.x && ball.y + ball.size >= ai.y && ball.y <= ai.y + ai.height) {
        ball.dx *= -1;
    }

    // Ball reset if it goes off-screen
    if (ball.x <= 0) {
        aiScore++;
        resetBall();
        tries--;
        if (tries <= 0) {
            alert('Game Over! No more tries left.');
            location.reload();
        }
    } else if (ball.x + ball.size >= canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement
    ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.05;
    ai.y = Math.max(Math.min(ai.y, canvas.height - ai.height), 0);
}

function handleInput() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            player.y = Math.max(player.y - player.dy, 0);
        } else if (e.key === 'ArrowDown') {
            player.y = Math.min(player.y + player.dy, canvas.height - player.height);
        }
    });
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx *= -1;
}

function updateUI() {
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('aiScore').textContent = aiScore;
    document.getElementById('progress').style.width = `${(tries / 3) * 100}%`;

    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
        heart.style.visibility = index < tries ? 'visible' : 'hidden';
    });
}

function gameLoop() {
    draw();
    update();
    updateUI();
    requestAnimationFrame(gameLoop);
}

handleInput();
gameLoop();
