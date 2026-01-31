const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

// Game State
let maze = [];
let width, height;
let cellSize = 20;
let player = { x: 1, y: 1 };
let end = { x: 1, y: 1 };
let lives = 3;
let maxLives = 3;
let gameRunning = false;
let currentDifficulty = 1;

// Constants
const WALL = 1;
const PATH = 0;

// Colors
const COLOR_WALL = '#3b82f6'; // Blue
const COLOR_PATH = '#0a0a0a'; // Dark
const COLOR_PLAYER = '#ffffff'; // White
const COLOR_END = '#10b981'; // Green

// Directions (Up, Down, Left, Right)
const dx = [0, 0, -2, 2];
const dy = [-2, 2, 0, 0];

function initGame(difficulty) {
    currentDifficulty = difficulty;

    // Set dimensions based on difficulty (must be odd)
    if (difficulty === 1) { // Easy
        width = 21;
        height = 21;
        cellSize = 25;
    } else if (difficulty === 2) { // Medium
        width = 31;
        height = 31;
        cellSize = 18;
    } else { // Hard
        width = 41;
        height = 41;
        cellSize = 14;
    }

    // Adjust canvas size
    canvas.width = width * cellSize;
    canvas.height = height * cellSize;

    // Initialize Maze
    maze = Array(height).fill().map(() => Array(width).fill(WALL));

    // Generate Maze
    generateMaze(1, 1);

    // Set Player and End
    player = { x: 1, y: 1 };
    end = { x: width - 2, y: height - 2 };

    // Reset State
    lives = maxLives;
    gameRunning = true;
    updateUI();

    // Hide Overlay
    document.getElementById('overlay').classList.add('hidden');

    draw();
}

function generateMaze(x, y) {
    maze[y][x] = PATH;

    // Randomize directions
    const dirs = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

    for (let i = 0; i < 4; i++) {
        const dir = dirs[i];
        const nx = x + dx[dir];
        const ny = y + dy[dir];

        if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === WALL) {
            maze[y + dy[dir] / 2][x + dx[dir] / 2] = PATH;
            generateMaze(nx, ny);
        }
    }
}

function draw() {
    // Clear
    ctx.fillStyle = COLOR_PATH;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Walls
    ctx.fillStyle = COLOR_WALL;
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (maze[y][x] === WALL) {
                ctx.shadowBlur = 10;
                ctx.shadowColor = COLOR_WALL;
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                ctx.shadowBlur = 0;
            }
        }
    }

    // Draw End
    ctx.fillStyle = COLOR_END;
    ctx.shadowBlur = 15;
    ctx.shadowColor = COLOR_END;
    ctx.fillRect(end.x * cellSize, end.y * cellSize, cellSize, cellSize);
    ctx.shadowBlur = 0;

    // Draw Player
    ctx.fillStyle = COLOR_PLAYER;
    ctx.beginPath();
    ctx.arc(
        player.x * cellSize + cellSize / 2,
        player.y * cellSize + cellSize / 2,
        cellSize / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function move(dx, dy) {
    if (!gameRunning) return;

    const nextX = player.x + dx;
    const nextY = player.y + dy;

    // Check bounds
    if (nextX < 0 || nextX >= width || nextY < 0 || nextY >= height) return;

    // Check collision
    if (maze[nextY][nextX] === WALL) {
        handleCollision();
    } else {
        player.x = nextX;
        player.y = nextY;

        // Check Win
        if (player.x === end.x && player.y === end.y) {
            gameOver(true);
        }
    }
    draw();
}

function handleCollision() {
    lives--;
    updateUI();

    // Shake effect
    canvas.style.transform = 'translateX(5px)';
    setTimeout(() => canvas.style.transform = 'translateX(-5px)', 50);
    setTimeout(() => canvas.style.transform = 'translateX(0)', 100);

    if (lives < 0) {
        gameOver(false);
    }
}

function updateUI() {
    // Update Lives
    const container = document.getElementById('lives-display');
    container.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('i');
        heart.className = `fas fa-heart ${i < lives ? '' : 'lost'}`;
        container.appendChild(heart);
    }

    // Update Level
    const levels = ['Easy', 'Medium', 'Hard'];
    document.getElementById('level-display').innerText = levels[currentDifficulty - 1];

    // Update Buttons
    document.querySelectorAll('.btn-sm').forEach((btn, idx) => {
        if (idx + 1 === currentDifficulty) btn.classList.add('active');
        else btn.classList.remove('active');
    });
}

function gameOver(win) {
    gameRunning = false;
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('overlay-title');
    const msg = document.getElementById('overlay-message');

    overlay.classList.remove('hidden');

    if (win) {
        title.innerText = 'You Won!';
        title.style.color = COLOR_END;
        msg.innerText = 'Great job escaping the maze.';
    } else {
        title.innerText = 'Game Over';
        title.style.color = '#ef4444';
        msg.innerText = 'You hit too many walls.';
    }
}

function setDifficulty(diff) {
    initGame(diff);
}

function resetGame() {
    initGame(currentDifficulty);
}

// Input Handling
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            move(0, -1);
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            move(0, 1);
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            move(-1, 0);
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            move(1, 0);
            break;
    }
});

// Start Game
initGame(1);
