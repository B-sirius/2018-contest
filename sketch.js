const grid =
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
const size = 4;
let w, h;
let isSlided = false;

function setup() {
    createCanvas(400, 400);

    w = width / size;
    h = height / size;

    addNumber();
    addNumber();
}

function draw() {
    background(255);
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
    noFill();
    strokeWeight(2);
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            rect(i * w, j * h, w, h);
            if (grid[i][j] !== 0) {
                textAlign(CENTER, CENTER);
                textSize(64);
                stroke(0);
                text(grid[i][j], i * w + w / 2, j * h + h / 2);
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
                break;
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
                break;
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
                break;
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
                break;
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
}