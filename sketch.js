const size = 4;
const initialCount = 4;
const durationFrame = 0.5 * 60;
let gridMap = [];
let numGridHashMap = {};
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

function addNumGrid() {
    const options = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMap[i][j] === 0)
                options.push({ x: i, y: j });
        }
    }

    let pos = options[floor(random(options.length))];
    let val = random() > 0.5 ? 2 : 4;
    gridMap[pos.x][pos.y] = val;

    let numGrid = new NumGrid(val, pos.x, pos.y);
    numGridHashMap[`${pos.x}-${pos.y}`] = numGrid;
}

function drawGrid() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            fill(22, 199, 184);
            noStroke();
            rect(i * w + (i + 1) * margin, j * h + (j + 1) * margin, w, h, 5);
        }
    }
    drawNumGrid();
}

// 下划
function slideDown() {
    for (let row = 0; row < size; row++) {
        let endIndex = size - 1;
        for (let col = size - 1; col >= 0; col--) {
            if (gridMap[row][col] !== 0) {
                if (col !== endIndex) {
                    gridMap[row][endIndex] = gridMap[row][col];
                    gridMap[row][col] = 0;
                    // 记录target
                    const item = numGridHashMap[`${row}-${col}`];
                    numGridHashMap[`${row}-${endIndex}`] = item;
                    numGridHashMap[`${row}-${col}`] = null;
                    if (Object.prototype.toString.call(item) === '[object Array]') {
                        for (let numGrid of item) {
                            numGrid.targetPos.y = endIndex;
                        }
                    }
                    else {
                        item.targetPos.y = endIndex;
                    }
                }
                endIndex--;
            }
        }
    }
}
function combineDown() {
    for (let row = 0; row < size; row++) {
        for (let col = size - 1; col >= 1; col--) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row][col - 1]) {
                const numGrid1 = numGridHashMap[`${row}-${col - 1}`];
                numGridHashMap[`${row}-${col - 1}`] = null;
                numGrid1.targetPos.y++;
                // 合并时，两个子块暂时合并为数组
                const numGrid2 = numGridHashMap[`${row}-${col}`];
                numGridHashMap[`${row}-${col}`] = [numGrid1, numGrid2];

                gridMap[row][col - 1] = 0;
                gridMap[row][col] *= 2;
                gridMap[row][col - 1] = 0;
            }
        }
    }
}
function operateDown() {
    let originGridStr = gridMap.toString();
    slideDown();
    combineDown();
    slideDown();
    if (originGridStr !== gridMap.toString()) isSlided = true;
    handleNumGrid();
}

// 上划
function slideUp() {
    for (let i = 0; i < size; i++) {
        let arr = gridMap[i].filter(val => val);
        let zeroParts = Array.from({ length: size - arr.length }).fill(0);
        gridMap[i] = arr.concat(zeroParts);
    }
}
function combineUp() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            if (gridMap[i][j] && gridMap[i][j] === gridMap[i][j + 1]) {
                gridMap[i][j] *= 2;
                gridMap[i][j + 1] = 0;
            }
        }
    }
}
function operateUp() {
    let originGridStr = gridMap.toString();
    slideUp();
    combineUp();
    slideUp();
    if (originGridStr !== gridMap.toString()) isSlided = true;
}

// 右划
function slideRight() {
    for (let col = 0; col < size; col++) {
        let lastRowIndex = size - 1;
        for (let row = size - 1; row >= 0; row--) {
            if (gridMap[row][col]) {
                let val = gridMap[row][col];
                gridMap[row][col] = 0;
                gridMap[lastRowIndex][col] = val;
                lastRowIndex--;
            }
        }
    }
}
function combineRight() {
    for (let col = 0; col < size; col++) {
        for (let row = size - 1; row >= 1; row--) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row - 1][col]) {
                gridMap[row][col] *= 2;
                gridMap[row - 1][col] = 0;
            }
        }
    }
}
function operateRight() {
    let originGridStr = gridMap.toString();
    slideRight();
    combineRight();
    slideRight();
    if (originGridStr !== gridMap.toString()) isSlided = true;
}

// 左划
function slideLeft() {
    for (let col = 0; col < size; col++) {
        let firstRowIndex = 0;
        for (let row = 0; row < size; row++) {
            if (gridMap[row][col]) {
                let val = gridMap[row][col];
                gridMap[row][col] = 0;
                gridMap[firstRowIndex][col] = val;
                firstRowIndex++;
            }
        }
    }
}
function combineLeft() {
    for (let col = 0; col < size; col++) {
        for (let row = 0; row < size - 1; row++) {
            if (gridMap[row][col] && gridMap[row][col] === gridMap[row + 1][col]) {
                gridMap[row][col] *= 2;
                gridMap[row + 1][col] = 0;
            }
        }
    }
}
function operateLeft() {
    let originGridStr = gridMap.toString();
    slideLeft();
    combineLeft();
    slideLeft();
    if (originGridStr !== gridMap.toString()) isSlided = true;
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
            if (gridMap[i][j] === 0) return false;
            if (i !== size - 1 && gridMap[i][j] === gridMap[i + 1][j]) return false;
            if (j !== size - 1 && gridMap[i][j] === gridMap[i][j + 1]) return false;
        }
    }

    return true;
}

function isWon() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (gridMap[i][j] === 2048) return true;
        }
    }
    return false;
}

function newGame() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!gridMap[i]) gridMap[i] = [];
            gridMap[i][j] = 0;
        }
    }
    for (i = 0; i < initialCount; i++) {
        addNumGrid();
    }
}

class NumGrid {
    constructor(val, x = null, y = null) {
        this.val = val;
        this.pos = {
            x: x,
            y: y,
        };
        this.targetPos = {
            x: x,
            y: y,
        };
    }
}

function drawNumGrid() {
    let drawList = [];
    for (let key of Object.keys(numGridHashMap)) {
        if (numGridHashMap[key] !== null) {
            if (Object.prototype.toString.call(numGridHashMap[key]) === '[object Array]') {
                drawList = drawList.concat(numGridHashMap[key]);
            }
            else {
                drawList.push(numGridHashMap[key]);
            }
        }
    }

    for (let item of drawList) {
        const x = item.pos.x;
        const y = item.pos.y;
        const val = item.val;

        fill(34, 245, 227);
        noStroke();
        rect(x * w + (x + 1) * margin, y * h + (y + 1) * margin, w, h, 5);

        textAlign(CENTER, CENTER);
        textSize(48);
        fill(0);
        text(val, x * w + (x + 1) * margin + w / 2, y * h + (y + 1) * margin + h / 2);
    }
}

function handleNumGrid() {
    let moveList = [];
    let numGridToCombine = [];
    for (let key of Object.keys(numGridHashMap)) {
        if (numGridHashMap[key] !== null) {
            if (Object.prototype.toString.call(numGridHashMap[key]) === '[object Array]') {
                moveList = moveList.concat(numGridHashMap[key]);
                numGridToCombine.push(numGridHashMap[key]);
            }
            else {
                moveList.push(numGridHashMap[key]);
            }
        }
    }

    let animationCount = 0;
    function isAnimationDone() {
        return animationCount === moveList.length;
    }

    for (let item of moveList) {
        const startX = item.pos.x;
        const endX = item.targetPos.x;
        const startY = item.pos.y;
        const endY = item.targetPos.y;

        const changedX = endX - startX;
        const changedY = endY - startY;
        let currFrame = 0;

        function animate() {
            item.pos.x = easeIn(currFrame, startX, changedX, durationFrame);
            item.pos.y = easeIn(currFrame, startY, changedY, durationFrame);
            if (currFrame < durationFrame) {
                currFrame++;
                requestAnimationFrame(animate);
            }
            else {
                item.pos.x = endX;
                item.pos.y = endY;
                animationCount++;

                // 所用滑动动画结束
                if (isAnimationDone()) {
                    // 组合一样的数
                    combineNumGrid();
                    // 若滑动，增加一个数
                    if (isSlided) addNumGrid();
                    // 将滑动标记重置
                    isSlided = false;
                }

            }
        }

        animate();
    }

    function combineNumGrid() {
        for (let numCombines of numGridToCombine) {
            let newNumGrid;
            let val = numCombines[0].val * 2;
            let x = numCombines[0].pos.x;
            let y = numCombines[0].pos.y;
            newNumGrid = new NumGrid(val, x, y);
            numGridHashMap[`${newNumGrid.pos.x}-${newNumGrid.pos.y}`] = newNumGrid;
        }

    }
}

function easeIn(t, b, c, d) {
    return c * (t /= d) * t + b;
};