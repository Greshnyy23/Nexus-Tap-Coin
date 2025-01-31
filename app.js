const tg = window.Telegram.WebApp;
tg.ready();

const $circle = document.querySelector('#circle');
const $money = document.querySelector('#money');
const $levelDisplay = document.getElementById('levelDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $progressFill = document.getElementById('progressFill');
const $achievementList = document.getElementById('achievementList');
const $closeButton = document.getElementById('closeButton');

let money = 0;
let level = 1;
let upgradeActive = false;
let achievements = [];

// Звуковые эффекты
const clickSound = new Audio('click.mp3');
const levelUpSound = new Audio('level-up.mp3');

// Инициализация
function start() {
    money = getMoney();
    level = getLevel();

    setMoney(money);
    setLevel(level);
    updateProgress();
    showAchievements();
}

// Функции для работы с монетами и уровнем
function setMoney(newMoney) {
    money = newMoney;
    localStorage.setItem('money', money);
    $money.textContent = money;
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `Уровень: ${level}`;
    levelUpSound.play();
}

function updateProgress() {
    const progressPercentage = (money / 100) * 100;
    $progressFill.style.width = `${progressPercentage}%`;
}

function getMoney() {
    return Number(localStorage.getItem('money')) || 0;
}

function getLevel() {
    return Number(localStorage.getItem('level')) || 1;
}

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

    addMoney(upgradeActive ? 2 : 1);
    clickSound.play();

    setTimeout(() => plusOne.remove(), 2000);
});

// Добавление монет
function addMoney(amount) {
    setMoney(money + amount);
    updateProgress();
}

// Улучшения
$upgradeButton.addEventListener('click', () => {
    if (money >= 50) {
        upgradeActive = true;
        setMoney(money - 50);
        $upgradeButton.classList.add('active');
        setTimeout(() => {
            upgradeActive = false;
            $upgradeButton.classList.remove('active');
            alert('Двойные монеты закончились!');
        }, 10000);
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$levelUpButton.addEventListener('click', () => {
    if (money >= 100) {
        setMoney(money - 100);
        setLevel(level + 1);
        addAchievement('Уровень повышен!');
    } else {
        alert('Недостаточно монет для повышения уровня!');
    }
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

// Закрытие приложения
$closeButton.addEventListener('click', () => {
    tg.close();
});

// Инициализация
start();