const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $levelDisplay = document.getElementById('levelDisplay');
const $moneyDisplay = document.getElementById('moneyDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $progressFill = document.getElementById('progressFill');
const $achievementList = document.getElementById('achievementList');

let score = 0;
let level = 1;
let money = 0;
let upgradeActive = false;
let achievements = [];

// Звуковые эффекты
const clickSound = new Audio('click.mp3');
const levelUpSound = new Audio('level-up.mp3');

// Инициализация
function start() {
    score = getScore();
    level = getLevel();
    money = getMoney();

    setScore(score);
    setLevel(level);
    updateMoneyDisplay();
    updateProgress();
    showAchievements();
}

// Функции для работы с очками, уровнем и монетами
function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `Уровень: ${level}`;
    levelUpSound.play();
}

function updateMoneyDisplay() {
    $moneyDisplay.textContent = `Монеты: ${money}`;
}

function updateProgress() {
    const progressPercentage = (score / 100) * 100;
    $progressFill.style.width = `${progressPercentage}%`;
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function getLevel() {
    return Number(localStorage.getItem('level')) || 1;
}

function getMoney() {
    return Number(localStorage.getItem('money')) || 0;
}

// Очки и валюта
function addOne() {
    setScore(score + (upgradeActive ? 2 : 1));
    money += 1;
    updateMoneyDisplay();
    clickSound.play();
}

// Улучшения
$upgradeButton.addEventListener('click', () => {
    if (money >= 50) {
        upgradeActive = true;
        money -= 50;
        updateMoneyDisplay();
        $upgradeButton.classList.add('active');
        setTimeout(() => {
            upgradeActive = false;
            $upgradeButton.classList.remove('active');
            alert('Двойные очки закончились!');
        }, 10000);
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$levelUpButton.addEventListener('click', () => {
    if (money >= 100) {
        money -= 100;
        setLevel(level + 1);
        updateMoneyDisplay();
        addAchievement('Уровень повышен!');
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

    addOne();

    setTimeout(() => plusOne.remove(), 2000);
});

// Достижения
function addAchievement(name) {
    if (!achievements.includes(name)) {
        achievements.push(name);
        const achievementItem = document.createElement('div');
        achievementItem.textContent = name;
        $achievementList.appendChild(achievementItem);
    }
}

function showAchievements() {
    if (achievements.length === 0) {
        $achievementList.textContent = 'Нет достижений';
    } else {
        achievements.forEach(achievement => {
            const achievementItem = document.createElement('div');
            achievementItem.textContent = achievement;
            $achievementList.appendChild(achievementItem);
        });
    }
}

// Инициализация
start();