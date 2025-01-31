const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $levelDisplay = document.getElementById('levelDisplay');
const $moneyDisplay = document.getElementById('moneyDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $progressFill = document.getElementById('progressFill');

let score = 0;
let level = 1;
let money = 0; // Игровая валюта
let upgradeActive = false;

// Инициализация
function start() {
    score = getScore();
    level = getLevel();
    money = getMoney();

    setScore(score);
    setHighScore(getHighScore());
    setLevel(level);
    updateMoneyDisplay();
}

// Сохранение данных
function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
    updateProgress(); // Обновление индикатора прогресса
}

function setHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('highscore', score);
        $highScore.textContent = score;
    }
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `Уровень: ${level}`;
}

// Обновление валюты (монет)
function updateMoneyDisplay() {
    $moneyDisplay.textContent = `Монеты: ${money}`;
}

// Обновление прогресса
function updateProgress() {
    const progressPercentage = (score / 100) * 100; // Пример: 100 - максимальный счет
    $progressFill.style.width = `${progressPercentage}%`;
}

// Получение данных из localStorage
function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function getHighScore() {
    return Number(localStorage.getItem('highscore')) || 0;
}

function getLevel() {
    return Number(localStorage.getItem('level')) || 1;
}

function getMoney() {
    return Number(localStorage.getItem('money')) || 0;
}

// Добавление очков и валюты
function addOne() {
    setScore(score + (upgradeActive ? 2 : 1)); // Учитывает активные улучшения для очков
    money += 1; // Каждое нажатие добавляет 1 монету
    updateMoneyDisplay(); // Обновляем отображение
}

// Улучшения
$upgradeButton.addEventListener('click', () => {
    if (money >= 50) {
        upgradeActive = true;
        money -= 50; // Вычитаем стоимость улучшения
        updateMoneyDisplay();
        
        setTimeout(() => {
            upgradeActive = false; // Прекращение действия улучшения
            alert('Двойные очки закончились!');
        }, 10000); // Действие длится 10 секунд
        
        alert('Двойные очки активированы!');
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$levelUpButton.addEventListener('click', () => {
    if (money >= 100) {
        money -= 100; // Вычитаем стоимость повышения уровня
        setLevel(level + 1);
        updateMoneyDisplay();
        alert('Уровень повышен!');
    } else {
        alert('Недостаточно монет для повышения уровня!');
    }
});

// Логика клика по кружку
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

    addOne(); // Добавление очка и валюты

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

// Инициализация
start();