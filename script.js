//секция создания констант

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const canvasContainer = document.getElementById('canvasContainer');

const playground = new Image();
playground.src = 'Assets/playground.png';

const food = new Image();
food.src = 'Assets/carrot.png';

const box = 32;
const playgroundMargin = {
    left_right_bottom: 1,
    top: 3
}
const playgroundSize = {width: 17, height: 15};

let score = 0;

let dir = '';

const snake = [];

snake[0] = {
    x: 9 * box,
    y: 10 * box
};

let objfood = {
    x: Math.floor(Math.random()*17 + 1) * box,
    y: Math.floor(Math.random()*15 + 3) * box
};
//секция событий
//////////////////////////////////////////

const gameRestart = () => {
    snake.length = 1;
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    objfood = {
        x: Math.floor(Math.random()*17 + 1) * box,
        y: Math.floor(Math.random()*15 + 3) * box
    };
    scoreReset();
    dir = '';
}

const gamePause = () => {
    
}
//обновление счета
const scoreRefresh = (score) => {
    document.getElementById('scoreHeader').innerHTML = score;
};

const scoreReset = () => {
    score = 0;
    scoreRefresh(score);
}

const scoreUp = () => {
    score += 1;
    scoreRefresh(score);
}

//секция глобальных функций
//////////////////////////////////////////

const direction = (e) => { // <- Задаем функцию 
    if (e.keyCode == 37 && dir != 'right') {
        dir = 'left';
    }
    else if (e.keyCode == 38 && dir != 'down') {
        dir = 'up';
    }
    else if (e.keyCode == 39 && dir != 'left') {
        dir = 'right';
    }
    else if (e.keyCode == 40 && dir != 'up') {
        dir = 'down';
    }
}

const drawGraphics = () => { //<- функция рисующая картинку
    context.clearRect(0, 0, canvasWidth, canvasHeight);

    //отрисовка змеи
    for (let i = 0; i < snake.length; i++) {
        context.fillStyle = i == 0 ? 'rgb(10, 100, 10)' : 'rgb(10, 130, 10)';
        context.fillRect(snake[i].x, snake[i].y, box, box);
    }

    context.drawImage(food, objfood.x, objfood.y);

    //отрисовка игрового счетчика в верхнем левом углу

    if (snake[0].x == objfood.x && snake[0].y == objfood.y) {
        snake.push({x: -2, y: -2});
        scoreUp();
        objfood = {
            x: Math.floor((Math.random() * 17 + 1)) * box,
            y: Math.floor((Math.random() * 15 + 3)) * box
        };
    }

    for (let i = 1; i < snake.length; i += 1) {
        if ((snake[0].x === snake[i].x) && (snake[0].y === snake[i].y)) {
            gameRestart();
        }
    }

    //если длина змейки > 1, то координаты звена змейки переносятся на следующее звено
    for (let i = snake.length - 1; i > 0; i -= 1) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    //в зависимости от переменной, меняется направление движения змейки
    if (dir == 'left') snake[0].x -= box;
    if (dir == 'right') snake[0].x += box;
    if (dir == 'up') snake[0].y -= box;
    if (dir == 'down') snake[0].y += box;

    //выход за пределы поля телепортирует змейку в противоположную грань
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x <= box) {
            snake[i].x += playgroundSize.width * box;
        }
        if (snake[i].x > playgroundSize.width * box) {
            snake[i].x -= playgroundSize.width * box;
        }
        if (snake[i].y < playgroundMargin.top * box) {
            snake[i].y += playgroundSize.height * box;
        }
        if (snake[i].y >= (playgroundSize.height + playgroundMargin.top) * box) {
            snake[i].y -= playgroundSize.height * box;
        }
    }
}

//секция стартовых событий, обработчика и таймера
//////////////////////////////////////////////////////////////////////

canvasContainer.style.background = "url('Assets/playground.png')"; //<- подгружаем фоновое изображение через стили CSS

document.addEventListener('keydown', direction); // <- обработчик событий

let game = setInterval(drawGraphics, 75);