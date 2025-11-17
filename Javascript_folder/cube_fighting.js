const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const messageBox = document.getElementById('messageBox');
const resetButton = document.getElementById('resetButton');

const PLATFORM_RADIUS = 220;
const CUBE_SIZE = 30;
const PLAYER_SPEED = 0.5;
const AI_SPEED = 0.25;
const DRAG = 0.95;
const BUMP_FORCE = 8;

let player, ai, platform;
let keys = {};
let gameRunning = true;

class Platform {
        constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = '#4a5568';
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

class Cube {
    constructor(x, y, size, color, speed) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.size = size;
        this.color = color;
        this.speed = speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }

    update() {
        this.vx *= DRAG;
        this.vy *= DRAG;

        this.x += this.vx;
        this.y += this.vy;
    }

    isOffPlatform(platform) {
        const dist = Math.sqrt(Math.pow(this.x - platform.x, 2) + Math.pow(this.y - platform.y, 2));
        return dist > platform.radius;
    }
}

function init() {
    platform = new Platform(canvas.width / 2, canvas.height / 2, PLATFORM_RADIUS);

    player = new Cube(canvas.width / 2 - 50, canvas.height / 2, CUBE_SIZE, '#3b82f6', PLAYER_SPEED); 

    ai = new Cube(canvas.width / 2 + 50, canvas.height / 2, CUBE_SIZE, '#ef4444', AI_SPEED); 

    keys = {};
    gameRunning = true;
    messageBox.textContent = '';
}

function handleInput() {
    if (keys['w'] || keys['ArrowUp']) player.vy -= player.speed;
    if (keys['s'] || keys['ArrowDown']) player.vy += player.speed;
    if (keys['a'] || keys['ArrowLeft']) player.vx -= player.speed;
    if (keys['d'] || keys['ArrowRight']) player.vx += player.speed;
}

function updateAI() {
    const dx = player.x - ai.x;
    const dy = player.y - ai.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 0) {
        ai.vx += (dx / dist) * ai.speed;
        ai.vy += (dy / dist) * ai.speed;
    }
}

function checkCollisions() {
    const dx = player.x - ai.x;
    const dy = player.y - ai.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const minCollisionDist = player.size / 2 + ai.size / 2;

    if (dist < minCollisionDist) {
        const nx = dx / dist;
        const ny = dy / dist;

        player.vx += nx * BUMP_FORCE;
        player.vy += ny * BUMP_FORCE;
        ai.vx -= nx * BUMP_FORCE;
        ai.vy -= ny * BUMP_FORCE;

        const overlap = minCollisionDist - dist;
        player.x += nx * overlap / 2;
        player.y += ny * overlap / 2;
        ai.x -= nx * overlap / 2;
        ai.y -= ny * overlap / 2;
    }
}

function checkWinCondition() {
    if (ai.isOffPlatform(platform)) {
        gameRunning = false;
        messageBox.textContent = 'You Win!';
        messageBox.style.color = '#34d399'; 
    } else if (player.isOffPlatform(platform)) {
        gameRunning = false;
        messageBox.textContent = 'AI Wins!';
        messageBox.style.color = '#ef4444'; 
    }
}

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platform.draw();

    player.draw();
    ai.draw();
}

function gameLoop() {
    if (gameRunning) {

        handleInput();

        updateAI();

        player.update();
        ai.update();

        checkCollisions();

        checkWinCondition();
    }

    draw();

    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

resetButton.addEventListener('click', init);

init();
gameLoop();