const LEVEL_WIDTH = 1600;
const CANVAS_HEIGHT = 400;
const MAX_LIVES = 5;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const groundY = CANVAS_HEIGHT - 60;
const messageDiv = document.getElementById('game-message');

// --- Palette dégradée par niveau ---
const PALETTES = [
    // Niveau 1 : clair, contraste
    {
        bg: ["#E7EBFA", "#C6D2FF", "#AEC2FA", "#D8E5FF"],
        solid: "#C6D2FF",
        floating: "#D8E5FF",
        door: "#AEC2FA",
        doorLine: "#8CA1E7",
        walker: "#AEC2FA",
        jumper: "#8CA1E7"
    },
    // Niveau 2 : clair, contraste
    {
        bg: ["#D0D7F3", "#A6B9F5", "#91A6E7", "#BCC9FA"],
        solid: "#A6B9F5",
        floating: "#BCC9FA",
        door: "#91A6E7",
        doorLine: "#7C92D8",
        walker: "#91A6E7",
        jumper: "#A6B9F5"
    },
    // Niveau 3 : intermédiaire
    {
        bg: ["#7C92D8", "#6C81C7", "#849AE5", "#A3B8F8"],
        solid: "#7C92D8",
        floating: "#849AE5",
        door: "#7C92D8",
        doorLine: "#849AE5",
        walker: "#849AE5",
        jumper: "#A3B8F8"
    },
    // Niveau 4 : sombre
    {
        bg: ["#50589C", "#636CCB", "#6E8CFB", "#86A1E7"],
        solid: "#50589C",
        floating: "#636CCB",
        door: "#50589C",
        doorLine: "#636CCB",
        walker: "#636CCB",
        jumper: "#86A1E7"
    },
    // Niveau 5 : palette finale
    {
        bg: ["#3C467B", "#50589C", "#636CCB", "#6E8CFB"],
        solid: "#50589C",
        floating: "#636CCB",
        door: "#3C467B",
        doorLine: "#636CCB",
        walker: "#3C467B",
        jumper: "#6E8CFB"
    }
];

// --- Niveaux ---
const levels = [
    // Niveau 1
    {
        platforms: [
            {x: 0, y: groundY, w: 220, h: 60},
            {x: 420, y: groundY, w: 200, h: 60},
            {x: 700, y: groundY, w: 200, h: 60},
            {x: 950, y: groundY, w: 180, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1430, y: groundY, w: 170, h: 60},
            {x: 220, y: groundY - 70, w: 100, h: 20},
            {x: 500, y: groundY - 60, w: 160, h: 20},
            {x: 770, y: groundY - 120, w: 60, h: 20},
            {x: 1000, y: groundY - 70, w: 130, h: 20},
            {x: 1350, y: groundY - 90, w: 110, h: 20},
        ],
        enemies: [
            {type: "walker", x: 600, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "jumper", x: 850, y: groundY - 44, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1300, y: groundY - 44, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 80, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 1
    },
    // Niveau 2
    {
        platforms: [
            {x: 0, y: groundY, w: 320, h: 60},
            {x: 580, y: groundY, w: 180, h: 60},
            {x: 900, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 140, h: 60},
            {x: 1400, y: groundY, w: 200, h: 60},
            {x: 350, y: groundY - 70, w: 80, h: 20},
            {x: 700, y: groundY - 110, w: 120, h: 20},
            {x: 1050, y: groundY - 100, w: 60, h: 20},
            {x: 1250, y: groundY - 140, w: 100, h: 20},
        ],
        enemies: [
            {type: "walker", x: 650, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 920, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 1280, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 740, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 60, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 2
    },
    // Niveau 3
    {
        platforms: [
            {x: 0, y: groundY, w: 170, h: 60},
            {x: 300, y: groundY, w: 250, h: 60},
            {x: 650, y: groundY, w: 180, h: 60},
            {x: 900, y: groundY, w: 140, h: 60},
            {x: 1100, y: groundY, w: 340, h: 60},
            {x: 1450, y: groundY, w: 150, h: 60},
            {x: 220, y: groundY - 90, w: 100, h: 20},
            {x: 800, y: groundY - 120, w: 140, h: 20},
            {x: 1250, y: groundY - 80, w: 70, h: 20},
        ],
        enemies: [
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 1200, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 1400, y: groundY - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 800, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 7, jumpInterval: 78, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 3
    },
    // Niveau 4
    {
        platforms: [
            {x: 0, y: groundY, w: 180, h: 60},
            {x: 370, y: groundY, w: 170, h: 60},
            {x: 600, y: groundY, w: 250, h: 60},
            {x: 900, y: groundY, w: 190, h: 60},
            {x: 1200, y: groundY, w: 260, h: 60},
            {x: 1500, y: groundY, w: 100, h: 60},
            {x: 230, y: groundY - 80, w: 80, h: 20},
            {x: 700, y: groundY - 130, w: 140, h: 20},
            {x: 1250, y: groundY - 100, w: 120, h: 20},
        ],
        enemies: [
            {type: "walker", x: 650, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "walker", x: 950, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "jumper", x: 720, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 72, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1240, y: groundY - 100 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 64, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 4
    },
    // Niveau 5
    {
        platforms: [
            {x: 0, y: groundY, w: 150, h: 60},
            {x: 350, y: groundY, w: 220, h: 60},
            {x: 650, y: groundY, w: 180, h: 60},
            {x: 900, y: groundY, w: 170, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1430, y: groundY, w: 170, h: 60},
            {x: 200, y: groundY - 80, w: 120, h: 20},
            {x: 550, y: groundY - 100, w: 110, h: 20},
            {x: 900, y: groundY - 110, w: 90, h: 20},
            {x: 1300, y: groundY - 80, w: 60, h: 20},
        ],
        enemies: [
            {type: "walker", x: 380, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 1250, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 235, y: groundY - 80 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 570, y: groundY - 100 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 74, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    },
    // Niveau 6
    {
        platforms: [
            {x: 0, y: groundY, w: 200, h: 60},
            {x: 400, y: groundY, w: 200, h: 60},
            {x: 800, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1600, y: groundY, w: 200, h: 60},
            {x: 250, y: groundY - 70, w: 100, h: 20},
            {x: 650, y: groundY - 90, w: 120, h: 20},
            {x: 1050, y: groundY - 110, w: 140, h: 20},
            {x: 1450, y: groundY - 130, w: 160, h: 20},
        ],
        enemies: [
            {type: "walker", x: 450, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 700, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1100, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 80, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1500, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},

        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    },
    // Niveau 7
    {
        platforms: [
            {x: 0, y: groundY, w: 200, h: 60},
            {x: 400, y: groundY, w: 200, h: 60},
            {x: 800, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1600, y: groundY, w: 200, h: 60},
            {x: 250, y: groundY - 70, w: 100, h: 20},
            {x: 650, y: groundY - 90, w: 120, h: 20},
            {x: 1050, y: groundY - 110, w: 140, h: 20},
            {x: 1450, y: groundY - 130, w: 160, h: 20},
        ],
        enemies: [
            {type: "walker", x: 450, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 700, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1100, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 80, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1500, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    },
    // Niveau 8
    {
        platforms: [
            {x: 0, y: groundY, w: 200, h: 60},
            {x: 400, y: groundY, w: 200, h: 60},
            {x: 800, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1600, y: groundY, w: 200, h: 60},
            {x: 250, y: groundY - 70, w: 100, h: 20},
            {x: 650, y: groundY - 90, w: 120, h: 20},
            {x: 1050, y: groundY - 110, w: 140, h: 20},
            {x: 1450, y: groundY - 130, w: 160, h: 20},
        ],
        enemies: [
            {type: "walker", x: 450, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 700, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1100, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 80, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1500, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    },
    // Niveau 9
    {
        platforms: [
            {x: 0, y: groundY, w: 200, h: 60},
            {x: 400, y: groundY, w: 200, h: 60},
            {x: 800, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1600, y: groundY, w: 200, h: 60},
            {x: 250, y: groundY - 70, w: 100, h: 20},
            {x: 650, y: groundY - 90, w: 120, h: 20},
            {x: 1050, y: groundY - 110, w: 140, h: 20},
            {x: 1450, y: groundY - 130, w: 160, h: 20},
        ],
        enemies: [
            {type: "walker", x: 450, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},   
            {type: "jumper", x: 700, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1100, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 80, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1500, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    },
    // Niveau 10
    {
        platforms: [
            {x: 0, y: groundY, w: 200, h: 60},
            {x: 400, y: groundY, w: 200, h: 60},
            {x: 800, y: groundY, w: 200, h: 60},
            {x: 1200, y: groundY, w: 200, h: 60},
            {x: 1600, y: groundY, w: 200, h: 60},
            {x: 250, y: groundY - 70, w: 100, h: 20},
            {x: 650, y: groundY - 90, w: 120, h: 20},
            {x: 1050, y: groundY - 110, w: 140, h: 20},
            {x: 1450, y: groundY - 130, w: 160, h: 20},
        ],
        enemies: [
            {type: "walker", x: 450, y: groundY - 24, w: 24, h: 24, dir: 1, stayOnGround: true},
            {type: "walker", x: 850, y: groundY - 24, w: 24, h: 24, dir: -1, stayOnGround: true},
            {type: "jumper", x: 700, y: groundY - 90 - 24, w: 24, h: 24, vy: 0, jumpPower: 9, jumpInterval: 70, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1100, y: groundY - 110 - 24, w: 24, h: 24, vy: 0, jumpPower: 8, jumpInterval: 80, jumpTimer: 0, baseY: 0},
            {type: "jumper", x: 1500, y: groundY - 130 - 24, w: 24, h: 24, vy: 0, jumpPower: 10, jumpInterval: 60, jumpTimer: 0, baseY: 0},
        ],
        door: {x: LEVEL_WIDTH - 60, y: groundY - 90, w: 50, h: 90},
        nextLevel: 0
    }
];

let levelIdx = 0;
let platforms = [];
let enemies = [];
let door = {};
let lives = MAX_LIVES;

const knightStart = { x: 50, y: groundY - 40 };
const knight = {
    x: knightStart.x, y: knightStart.y,
    w: 32, h: 40,
    vx: 0, vy: 0,
    speed: 3.5,
    jumpStrength: 11,
    onGround: true,
    facing: 1,
    animFrame: 0,
    animType: 'idle'
};

let keys = {};
let gameOver = false;
let win = false;
let gameStarted = false;

// --- Niveau navigation UI ---
window.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('level-prev');
    const nextBtn = document.getElementById('level-next');
    const navArrows = document.getElementById('nav-arrows');

    navArrows.style.display = "none";
    let navVisible = false;

    function updateNavArrows() {
        prevBtn.disabled = (levelIdx === 0);
        nextBtn.disabled = (levelIdx === levels.length - 1);
        navArrows.style.display = navVisible ? "inline-flex" : "none";
    }
    if (prevBtn && nextBtn) {
        prevBtn.onclick = () => {
            if (navVisible && levelIdx > 0) {
                loadLevel(levelIdx - 1);
                updateNavArrows();
            }
        };
        nextBtn.onclick = () => {
            if (navVisible && levelIdx < levels.length - 1) {
                loadLevel(levelIdx + 1);
                updateNavArrows();
            }
        };
        updateNavArrows();
    }
    window._updateNavArrows = updateNavArrows;

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === "e") {
            navVisible = true;
            updateNavArrows();
        }
    });
});

function updateLevelHeader() {
    const h1 = document.querySelector('h1');
    if (h1) h1.innerText = "Niveau " + (levelIdx + 1);
    if (window._updateNavArrows) window._updateNavArrows();
}

function setLevelStyle(idx) {
    const palette = PALETTES[idx];
    document.body.style.background = `linear-gradient(120deg, ${palette.bg[0]} 0%, ${palette.bg[1]} 40%, ${palette.bg[2]} 70%, ${palette.bg[3]} 100%)`;
    const instr = document.getElementById('instructions');
    if (instr) instr.style.background = `linear-gradient(90deg, ${palette.bg[1]} 80%, ${palette.bg[2]} 100%)`;
    const homeTitle = document.getElementById('home-title');
    if (homeTitle) homeTitle.style.background = `linear-gradient(90deg,${palette.bg[1]} 70%,${palette.bg[2]} 100%)`;
    const btn = document.querySelector('.home-btn');
    if (btn) btn.style.background = `linear-gradient(90deg, ${palette.bg[1]} 60%, ${palette.bg[2]} 100%)`;
}

function showHomeScreen() {
    const home = document.getElementById('home-overlay');
    setLevelStyle(4);
    home.style.display = 'flex';
    resetGameMsg();
    updateLevelHeader();

    let btn = home.querySelector('.home-btn');
    if (btn) {
        btn.onclick = () => {
            home.style.display = 'none';
            gameStarted = true;
            canvas.focus();
            resetGameMsg();
            lives = MAX_LIVES;
            loadLevel(0);
            updateLevelHeader();
        };
    }
}

document.addEventListener('keydown', e => {
    keys[e.code] = true;
});
document.addEventListener('keyup', e => {
    keys[e.code] = false;
});

function loadLevel(idx) {
    levelIdx = idx;
    const lvl = levels[levelIdx];
    platforms = lvl.platforms.map(p => ({...p}));
    enemies = lvl.enemies.map(e =>
        e.type === "jumper"
        ? {...e, vy: 0, jumpTimer: 0}
        : {...e}
    );
    door = {...lvl.door};
    knight.x = knightStart.x;
    knight.y = knightStart.y;
    knight.vx = 0;
    knight.vy = 0;
    knight.onGround = true;
    knight.facing = 1;
    knight.animFrame = 0;
    knight.animType = 'idle';
    updateLevelHeader();
    setLevelStyle(levelIdx);
}

function rectsCollide(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

function getBaseYForEnemy(enemy) {
    if (enemy.type === "walker" && enemy.stayOnGround) {
        return groundY - enemy.h;
    }
    let baseY = groundY - enemy.h;
    for (let pf of platforms) {
        if (
            enemy.x + enemy.w/2 >= pf.x &&
            enemy.x + enemy.w/2 <= pf.x + pf.w &&
            pf.y < baseY + enemy.h &&
            pf.y > baseY - 100
        ) {
            baseY = pf.y - enemy.h;
        }
    }
    return baseY;
}

function updatePlayer() {
    if (keys['ArrowLeft']) knight.vx = -knight.speed;
    else if (keys['ArrowRight']) knight.vx = knight.speed;
    else knight.vx = 0;

    if (knight.vx > 0) knight.facing = 1;
    else if (knight.vx < 0) knight.facing = -1;

    if ((keys['ArrowUp'] || keys['Space']) && knight.onGround) {
        knight.vy = -knight.jumpStrength;
        knight.onGround = false;
    }

    knight.vy += 0.5;
    knight.x += knight.vx;
    knight.y += knight.vy;

    if (!knight.onGround) {
        knight.animType = "jump";
    } else if (Math.abs(knight.vx) > 0.1) {
        knight.animType = "walk";
    } else {
        knight.animType = "idle";
    }

    let onPlatform = false;
    for (let pf of platforms) {
        if (rectsCollide({...knight, y: knight.y + 2}, pf) && knight.vy >= 0) {
            knight.y = pf.y - knight.h;
            knight.vy = 0;
            onPlatform = true;
        }
    }
    knight.onGround = onPlatform;

    if (knight.x < 0) knight.x = 0;
    if (knight.x + knight.w > LEVEL_WIDTH) knight.x = LEVEL_WIDTH - knight.w;
}

function updateEnemies() {
    for (let e of enemies) {
        if (e.type === "walker") {
            e.x += e.dir * 1.5;
            let baseY = getBaseYForEnemy(e);
            if (e.y < baseY) {
                e.vy = (e.vy || 0) + 0.4;
                e.y += e.vy;
                if (e.y > baseY) {
                    e.y = baseY;
                    e.vy = 0;
                }
            } else {
                e.y = baseY;
                e.vy = 0;
            }
            let onAnyPlatform = false;
            for (let pf of platforms) {
                if (
                    e.x + e.w/2 > pf.x &&
                    e.x + e.w/2 < pf.x + pf.w &&
                    Math.abs(e.y + e.h - pf.y) < 2
                ) {
                    onAnyPlatform = true;
                    if (e.x < pf.x) { e.x = pf.x; e.dir *= -1; }
                    if (e.x + e.w > pf.x + pf.w) { e.x = pf.x + pf.w - e.w; e.dir *= -1; }
                }
            }
            if (!onAnyPlatform) {
                e.dir *= -1;
            }
        } else if (e.type === "jumper") {
            e.baseY = getBaseYForEnemy(e);
            e.jumpTimer++;
            if (e.jumpTimer > e.jumpInterval && Math.abs(e.vy) < 0.1) {
                e.vy = -e.jumpPower;
                e.jumpTimer = 0;
            }
            e.vy += 0.4;
            e.y += e.vy;
            if (e.y > e.baseY) {
                e.y = e.baseY;
                e.vy = 0;
            }
            if (e.x < 0) e.x = 0;
            if (e.x + e.w > LEVEL_WIDTH) e.x = LEVEL_WIDTH - e.w;
        }
    }
}

function isPlayerInHole() {
    if (!knight.onGround && knight.y > CANVAS_HEIGHT) {
        return true;
    }
    let onAnyPlatform = false;
    for (let pf of platforms) {
        if (
            knight.x + knight.w/2 > pf.x &&
            knight.x + knight.w/2 < pf.x + pf.w &&
            Math.abs(knight.y + knight.h - pf.y) < 2
        ) {
            onAnyPlatform = true;
        }
    }
    if (!onAnyPlatform && knight.y + knight.h > groundY) return true;
    return false;
}

function checkCollisions() {
    if (win || gameOver) return;

    // Supprimer les jumpers si on leur saute dessus
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        if (e.type === "jumper") {
            if (
                knight.vy > 0 &&
                knight.x + knight.w > e.x &&
                knight.x < e.x + e.w &&
                knight.y + knight.h > e.y &&
                knight.y + knight.h < e.y + 12
            ) {
                enemies.splice(i, 1);
                knight.vy = -knight.jumpStrength * 0.7;
                return;
            }
        }
    }

    for (let e of enemies) {
        if (rectsCollide(knight, e)) {
            loseLife("Perdu. Tu as été touché par un ennemi.");
            return;
        }
    }
    if (isPlayerInHole()) {
        loseLife("Perdu. Tu es tombé dans un trou.");
        return;
    }
    if (rectsCollide(knight, door)) {
        triggerWin(levelIdx < levels.length - 1
            ? `Bravo ! Niveau ${levelIdx + 1} terminé.`
            : "Bravo ! Jeu terminé !");
        setTimeout(() => {
            loadLevel(levels[levelIdx].nextLevel);
            resetGameMsg();
            win = false;
        }, 1800);
        return;
    }
}

function loseLife(msg) {
    lives--;
    if (lives > 0) {
        setGameMsg(msg, "over");
        setTimeout(() => {
            loadLevel(levelIdx);
            resetGameMsg();
            gameOver = false;
        }, 1200);
    } else {
        setGameMsg("GAME OVER", "over");
        setTimeout(() => {
            lives = MAX_LIVES;
            loadLevel(0);
            resetGameMsg();
            gameOver = false;
        }, 1800);
    }
    gameOver = true;
    win = false;
}

function triggerWin(msg) {
    if (!win) {
        win = true;
        gameOver = false;
        setGameMsg(msg, "win");
    }
}

function setGameMsg(msg, type) {
    messageDiv.innerText = msg;
    messageDiv.className = type ? "win" : "";
    if (type === "win") messageDiv.classList.add("win");
    if (type === "over") messageDiv.classList.add("over");
}

function resetGameMsg() {
    messageDiv.innerText = "";
    messageDiv.className = "";
}

// COEUR(S) EN HAUT À GAUCHE
function drawLives() {
    ctx.save();
    const heartSize = 40; // élargi le cœur
    for (let i = 0; i < lives; i++) {
        drawPixelHeart(18 + i * (heartSize + 10), 18, heartSize, "#222"); // cœurs noirs
    }
    ctx.restore();
}

// Sprite cœur pixelisé façon Minecraft, simplifié (8x7 pixels)
function drawPixelHeart(x, y, size, color) {
    // 1 = pixel plein, 0 = pixel vide
    const pixelMap = [
        [0,1,1,0,0,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,1,1],
        [0,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0]
    ];
    const px = Math.round(size / 8); // taille d'un carré
    ctx.save();
    ctx.translate(x, y);
    for (let row = 0; row < pixelMap.length; row++) {
        for (let col = 0; col < pixelMap[row].length; col++) {
            if (pixelMap[row][col]) {
                ctx.fillStyle = color;
                ctx.fillRect(col * px, row * px, px, px);
            }
        }
    }
    ctx.restore();
}

function drawKnight(x, y, w, h) {
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    ctx.scale(w / 40, h / 40);
    ctx.scale(knight.facing, 1);

    let legOffset = 0;
    if (knight.animType === "walk") {
        knight.animFrame += 0.3;
        if (knight.animFrame > 2) knight.animFrame = 0;
        legOffset = Math.sin(knight.animFrame * Math.PI) * 6;
    } else if (knight.animType === "jump") {
        legOffset = 8;
    } else {
        knight.animFrame = 0;
    }

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -6, 10, 0, Math.PI * 2);
    ctx.strokeStyle = '#383238';
    ctx.stroke();
    ctx.fillStyle = '#383238';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-4, -10, 2, 0, Math.PI * 2);
    ctx.arc(4, -10, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-8, -16); ctx.lineTo(-14, -24);
    ctx.moveTo(8, -16); ctx.lineTo(14, -24);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-4, 4); ctx.lineTo(-4, 18 + legOffset);
    ctx.moveTo(4, 4); ctx.lineTo(4, 18 - legOffset);
    ctx.stroke();

    if (knight.animType === "jump") {
        ctx.beginPath();
        ctx.moveTo(-10, 0); ctx.lineTo(-22, -16);
        ctx.moveTo(10, 0); ctx.lineTo(22, -16);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(-8, 0); ctx.lineTo(-14, 8);
        ctx.moveTo(8, 0); ctx.lineTo(14, 8);
        ctx.stroke();
    }

    ctx.restore();
}

function drawWalker(e) {
    const palette = PALETTES[levelIdx];
    ctx.save();
    ctx.fillStyle = palette.walker;
    ctx.beginPath();
    ctx.arc(e.x + e.w/2, e.y + e.h/2, e.w/2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(e.x + e.w/2 - 5, e.y + e.h/2 - 5, 3, 0, Math.PI * 2);
    ctx.arc(e.x + e.w/2 + 5, e.y + e.h/2 - 5, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawJumper(e) {
    const palette = PALETTES[levelIdx];
    ctx.save();
    ctx.fillStyle = palette.jumper;
    ctx.fillRect(e.x, e.y, e.w, e.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(e.x + 6, e.y + 6, 4, 4);
    ctx.fillRect(e.x + 14, e.y + 6, 4, 4);
    ctx.restore();
}

function drawPlatforms() {
    const palette = PALETTES[levelIdx];
    for (let pf of platforms) {
        ctx.fillStyle = pf.h > 30 ? palette.solid : palette.floating;
        ctx.fillRect(pf.x, pf.y, pf.w, pf.h);
    }
    for (let i = 0; i < platforms.length - 1; i++) {
        let pf = platforms[i];
        let nextPf = platforms[i + 1];
        let holeX = pf.x + pf.w;
        let holeWidth = nextPf.x - (pf.x + pf.w);
        if (holeWidth > 0 && pf.y === groundY && nextPf.y === groundY) {
            ctx.fillStyle = "#fff";
            ctx.fillRect(holeX, groundY, holeWidth, 60);
        }
    }
}

function drawDoor(door) {
    const palette = PALETTES[levelIdx];
    ctx.save();
    ctx.translate(door.x + door.w / 2, door.y + door.h);
    ctx.beginPath();
    ctx.moveTo(-door.w / 2, 0);
    ctx.lineTo(-door.w / 2, -door.h * 0.6);
    ctx.arc(0, -door.h * 0.6, door.w / 2, Math.PI, 0, false);
    ctx.lineTo(door.w / 2, 0);
    ctx.closePath();
    ctx.fillStyle = palette.door;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = palette.doorLine;
    ctx.stroke();
    ctx.restore();
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
        showHomeScreen();
    } else {
        drawPlatforms();
        drawDoor(door);

        drawLives();

        if (!gameOver && !win) {
            updatePlayer();
            updateEnemies();
            checkCollisions();
        }

        for (let e of enemies) {
            if (e.type === "walker") drawWalker(e);
            else if (e.type === "jumper") drawJumper(e);
        }

        drawKnight(knight.x, knight.y, knight.w, knight.h);
    }

    requestAnimationFrame(gameLoop);
}

loadLevel(0);
gameLoop();