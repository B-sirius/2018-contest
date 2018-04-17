const grid =
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
const size = 4;
let w, h;

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

function slide(row) {
    let arr = row.filter(i => i);
    let zeroParts = Array.from({length: size - arr.length}).fill(0);
    return zeroParts.concat(arr);
}