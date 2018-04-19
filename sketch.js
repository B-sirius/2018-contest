const size = 4;
const initialCount = 4;
let grid = [];
const margin = 10;
let w, h;
let isSlided = false;

function setup() {
    createCanvas(400, 400);

    // 计算格子宽高
    w = (width - (size + 1) * margin) / size;
    h = (height - (size + 1) * margin) / size;

    // 初始化
    newGame();
}

function draw() {
    background(11, 179, 165);
    drawGrid();
}

function addNumber() {
    const options = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 0)
                options.push({ x: i, y: j });
        }
    }

    let spot = options[floor(random(options.length))];
    grid[spot.x][spot.y] = random() > 0.5 ? 2 : 4;
}

function drawGrid() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            fill(22, 199, 184);
            noStroke();
            rect(i * w + (i + 1) * margin, j * h + (j + 1) * margin, w, h, 5);
            if (grid[i][j] !== 0) {
                textAlign(CENTER, CENTER);
                textSize(48);
                fill(255);
                text(grid[i][j], i * w + (i + 1) * margin + w / 2, j * h + (j + 1) * margin + h / 2);
            }
        }
    }
}

// 下划
function slideDown() {
    for (let i = 0; i < size; i++) {
        let arr = grid[i].filter(val => val);
        let zeroParts = Array.from({ length: size - arr.length }).fill(0);
        grid[i] = zeroParts.concat(arr);
    }
}
function combineDown() {
    for (let i = 0; i < size; i++) {
        for (let j = size - 1; j >= 1; j--) {
            if (grid[i][j] && grid[i][j] === grid[i][j - 1]) {
                grid[i][j] *= 2;
                grid[i][j - 1] = 0;
            }
        }
    }
}
function operateDown() {
    let originGridStr = grid.toString();
    slideDown();
    combineDown();
    slideDown();
    if (originGridStr !== grid.toString()) isSlided = true;
}

// 上划
function slideUp() {
    for (let i = 0; i < size; i++) {
        let arr = grid[i].filter(val => val);
        let zeroParts = Array.from({ length: size - arr.length }).fill(0);
        grid[i] = arr.concat(zeroParts);
    }
}
function combineUp() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            if (grid[i][j] && grid[i][j] === grid[i][j + 1]) {
                grid[i][j] *= 2;
                grid[i][j + 1] = 0;
            }
        }
    }
}
function operateUp() {
    let originGridStr = grid.toString();
    slideUp();
    combineUp();
    slideUp();
    if (originGridStr !== grid.toString()) isSlided = true;
}

// 右划
function slideRight() {
    for (let col = 0; col < size; col++) {
        let lastRowIndex = size - 1;
        for (let row = size - 1; row >= 0; row--) {
            if (grid[row][col]) {
                let val = grid[row][col];
                grid[row][col] = 0;
                grid[lastRowIndex][col] = val;
                lastRowIndex--;
            }
        }
    }
}
function combineRight() {
    for (let col = 0; col < size; col++) {
        for (let row = size - 1; row >= 1; row--) {
            if (grid[row][col] && grid[row][col] === grid[row - 1][col]) {
                grid[row][col] *= 2;
                grid[row - 1][col] = 0;
            }
        }
    }
}
function operateRight() {
    let originGridStr = grid.toString();
    slideRight();
    combineRight();
    slideRight();
    if (originGridStr !== grid.toString()) isSlided = true;
}

// 左划
function slideLeft() {
    for (let col = 0; col < size; col++) {
        let firstRowIndex = 0;
        for (let row = 0; row < size; row++) {
            if (grid[row][col]) {
                let val = grid[row][col];
                grid[row][col] = 0;
                grid[firstRowIndex][col] = val;
                firstRowIndex++;
            }
        }
    }
}
function combineLeft() {
    for (let col = 0; col < size; col++) {
        for (let row = 0; row < size - 1; row++) {
            if (grid[row][col] && grid[row][col] === grid[row + 1][col]) {
                grid[row][col] *= 2;
                grid[row + 1][col] = 0;
            }
        }
    }
}
function operateLeft() {
    let originGridStr = grid.toString();
    slideLeft();
    combineLeft();
    slideLeft();
    if (originGridStr !== grid.toString()) isSlided = true;
}

function keyPressed() {
    if (keyCode === DOWN_ARROW) {
        operateDown();
    }
    else if (keyCode === UP_ARROW) {
        operateUp();
    }
    else if (keyCode === LEFT_ARROW) {
        operateLeft();
    }
    else if (keyCode === RIGHT_ARROW) {
        operateRight();
    }

    if (isSlided) addNumber();
    // 将滑动标记重置
    isSlided = false;

    if (isWon()) {
        alert('holys*it u made it!');
        newGame();
    }

    if (isGameover()) {
        alert('die!');
        newGame();
    }
}

function isGameover() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 0) return false;
            if (i !== size - 1 && grid[i][j] === grid[i + 1][j]) return false;
            if (j !== size - 1 && grid[i][j] === grid[i][j + 1]) return false;
        }
    }

    return true;
}

function isWon() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 2048) return true;
        }
    }
    return false;
}

function newGame() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!grid[i]) grid[i] = [];            
            grid[i][j] = 0;
        }
    }
    for (i = 0; i < initialCount; i++) {
        addNumber();
    }
}