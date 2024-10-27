//     Xác định các phần tử HTML
let board = document.getElementById('game_board');
let instructionText = document.getElementById('instruction_text');
let logo = document.getElementById('logo');
let score = document.getElementById('score');
let highScoreText = document.getElementById('highScore');


//     Xác định các biến trò chơi
let gridSize = 20;
let snake = [{x: 10, y: 10}]; //Ran se xuat phat tai diem cos toa do 10, 10 (o chinh giua cua khung)
let food = generateFood();
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;


//    Vẽ bản đồ trò chơi, con rắn, thức ăn
function draw() {
    board.innerHTML = ''; //Khi draw, game s reset
    drawSnake();
    drawFood();
    updateScore();
}

//     Vẽ con rắn
function drawSnake() {
    snake.forEach((segment) => {
        let snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
}

//     Tạo một con rắn hoặc khối thức ăn/div
function createGameElement(tag, className) {
    let element = document.createElement(tag);
    element.className = className;
    return element;
}

//     Đặt vị trí của con rắn hoặc thức ăn
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}



//     Vẽ đồ ăn
function drawFood() {
    if (gameStarted) {
        let foodElement = createGameElement('div', 'food');
        setPosition(foodElement, food);
        board.appendChild(foodElement);
    }
}

//     Tạo ra thức ăn
function generateFood() {
    let x = Math.floor(Math.random() * gridSize) + 1;
    let y = Math.floor(Math.random() * gridSize) + 1;
    return {x, y};
}

//     Di chuyển con rắn
function move() {
    let head = {...snake[0]};
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval); //Clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollisions();
            draw();
        }, gameSpeedDelay);
    } else {
        snake.pop();
    }
}


//     Chức năng bắt đầu trò chơi
function startGame() {
    gameStarted = true;                         //Theo dõi một trò chơi đang chạy
    instructionText.style.display = 'none';     //ẩn phần tử có id="instructionText" bằng cách thay đổi thuộc tính CSS display của nó thành none.
    logo.style.display = 'none';                // ẩn phần tử có id="logo" bằng cách thay đổi thuộc tính CSS display của nó thành none.
    gameInterval = setInterval(() => {
        move();
        checkCollisions();
        draw();
    }, gameSpeedDelay);
}

//      Lắng nghe sự kiện nhấn phím
function handleKeyPress(evt) {
    if (
        (!gameStarted && evt.code === 'Space') ||
        (!gameStarted && evt.key === '')
    ) {
        startGame();
    } else {
        switch (evt.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Tăng tốc của rắn
function increaseSpeed() {
    // console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    }  else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    }    else if (gameSpeedDelay > 20) {
        gameSpeedDelay -= 1;
    }
}

// Kiểm tra va chạm
function checkCollisions() {
    let head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1  || head.y > gridSize) {
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

// Bắt đầu lại game
function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10, y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

// Cập nhật điểm
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

//  Dừng trò chơi
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

//  Cập nhật điểm cao nhất
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}
