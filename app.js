const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $levelDisplay = document.getElementById('levelDisplay');
const $moneyDisplay = document.getElementById('moneyDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $timerDisplay = document.getElementById('timer');

let score = 0;
let level = 1;
let money = 0; // Игровая валюта
let upgradeActive = false;

// Инициализация
function start() {
    setScore(0); // Сброс счета
    setHighScore(getHighScore()); // Установка рекорда
    setImage(); // Установка начального изображения
}

// Установка счета
function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
}

// Установка рекорда
function setHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('highscore', score);
        $highScore.textContent = score;
    }
}

// Получение счета
function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

// Получение рекорда
function getHighScore() {
    return Number(localStorage.getItem('highscore')) || 0;
}

// Добавление очков
function addOne() {
    setScore(score + (upgradeActive ? 2 : 1)); // Учитывает активные улучшения для очков
    money += 1; // Каждое нажатие добавляет 1 монету
    $moneyDisplay.textContent = `Монеты: ${money}`;
}

// Улучшение для двойных очков
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

// Повышение уровня
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

// Переключение персонажа
function selectCharacter(character) {
    if (character === 'frog') {
        $circle.setAttribute('src', './assets/frog.png');
    } else if (character === 'lizzard') {
        $circle.setAttribute('src', './assets/lizzard.png');
    }
}

// Обработчики событий для выбора персонажа
document.getElementById('frogButton').addEventListener('click', () => selectCharacter('frog'));
document.getElementById('lizzardButton').addEventListener('click', () => selectCharacter('lizzard'));

// Основная логика клика
$circle.addEventListener('click', (event) => {
    const rect = $circle.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    const DEG = 40;
    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG;

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
        $circle.style.setProperty('--tiltX', `0deg`);
        $circle.style.setProperty('--tiltY', `0deg`);
    }, 300);

    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one');
    plusOne.textContent = '+1';
    plusOne.style.left = `${event.clientX - rect.left}px`;
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentElement.appendChild(plusOne);

    addOne();

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

// Обработчики событий для кнопок выбора персонажей
document.getElementById('toImprovements').addEventListener('click', () => {
    window.location.href = 'improvements.html'; 
});
document.getElementById('toStatistics').addEventListener('click', () => {
    window.location.href = 'statistics.html'; 
});
document.getElementById('toMain').addEventListener('click', () => {
    window.location.href = 'index.html'; 
});

// Инициализация
start();