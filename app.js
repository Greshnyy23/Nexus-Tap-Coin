const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $levelDisplay = document.getElementById('levelDisplay');
const $moneyDisplay = document.getElementById('moneyDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $timerDisplay = document.getElementById('timer');
const $achievementList = document.getElementById('achievementList');

let score = 0;
let level = 1;
let money = 0; // Внутриигровая валюта
let upgradeActive = false;

// Переключение между персонажами
function selectCharacter(character) {
    if (character === 'frog') {
        $circle.setAttribute('src', './assets/frog.png');
    } else if (character === 'lizzard') {
        $circle.setAttribute('src', './assets/lizzard.png');
    }
}

// Сохранение данных
function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function setHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('highscore', score);
        $highScore.textContent = score;
    }
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function getHighScore() {
    return Number(localStorage.getItem('highscore')) || 0;
}

// Увеличиваем очки
function addOne() {
    setScore(score + (upgradeActive ? 2 : 1));
    money += 1; // Каждое нажатие добавляет 1 монету
    $moneyDisplay.textContent = `Монеты: ${money}`;
}

function upgrade() {
    if (money >= 50) {
        upgradeActive = true;
        money -= 50;
        $moneyDisplay.textContent = `Монеты: ${money}`;
        alert('Двойные очки активированы!');
        setTimeout(() => {
            upgradeActive = false;
            alert('Двойные очки закончились!');
        }, 10000); // Действие длится 10 секунд
    } else {
        alert('Недостаточно монет для улучшения!');
    }
}

function levelUp() {
    if (money >= 100) {
        money -= 100;
        level++;
        $levelDisplay.textContent = `Уровень: ${level}`;
        $moneyDisplay.textContent = `Монеты: ${money}`;
        alert('Уровень повышен!');
    } else {
        alert('Недостаточно монет для повышения уровня!');
    }
}

// Обработчики событий для кнопок выбора персонажа
document.getElementById('frogButton').addEventListener('click', () => selectCharacter('frog'));
document.getElementById('lizzardButton').addEventListener('click', () => selectCharacter('lizzard'));

$circle.addEventListener('click', (event) => {
    // Логика клика по предмету
});

// Инициализация
setScore(0); // Сброс счётчика
setHighScore(getHighScore()); // Установка рекорда