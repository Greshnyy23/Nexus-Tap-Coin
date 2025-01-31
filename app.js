const $circle = document.querySelector('#circle');
const $money = document.querySelector('#money');
const $levelDisplay = document.getElementById('levelDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $autoClickerButton = document.getElementById('autoClickerButton');
const $coinMultiplierButton = document.getElementById('coinMultiplierButton');
const $achievementList = document.getElementById('achievementList');
const $resetButton = document.getElementById('resetButton');

let money = 0;
let level = 1;
let upgradeActive = false;
let autoClickerActive = false;
let coinMultiplierActive = false;
const achievements = [
    { name: 'Новичок', condition: () => money >= 100 },
    { name: 'Опытный', condition: () => money >= 500 },
    { name: 'Мастер', condition: () => money >= 1000 },
    { name: 'Автокликер', condition: () => autoClickerActive },
    { name: 'Множитель', condition: () => coinMultiplierActive }
];
const unlockedAchievements = new Set();

// Инициализация
function start() {
    money = getMoney();
    level = getLevel();

    setMoney(money);
    setLevel(level);
    updateProgress();
    checkAchievements();
}

// Функции для работы с монетами и уровнем
function setMoney(newMoney) {
    money = newMoney;
    localStorage.setItem('money', money);
    $money.textContent = money;
    checkAchievements();
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `Уровень: ${level}`;
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

    setTimeout(() => plusOne.remove(), 2000);
});

// Добавление монет
function addMoney(amount) {
    if (coinMultiplierActive) {
        amount *= 2; // Удваиваем монеты, если множитель активен
    }
    setMoney(money + amount);
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
    } else {
        alert('Недостаточно монет для повышения уровня!');
    }
});

$autoClickerButton.addEventListener('click', () => {
    if (money >= 200) {
        money -= 200;
        updateMoneyDisplay();
        autoClickerActive = true;
        setInterval(() => {
            if (autoClickerActive) {
                addMoney(1);
            }
        }, 1000); // Авто-клик каждую секунду
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$coinMultiplierButton.addEventListener('click', () => {
    if (money >= 300) {
        money -= 300;
        updateMoneyDisplay();
        coinMultiplierActive = true;
        setTimeout(() => {
            coinMultiplierActive = false;
            alert('Множитель монет закончился!');
        }, 10000); // Действует 10 секунд
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

// Достижения
function checkAchievements() {
    achievements.forEach(achievement => {
        if (achievement.condition() && !unlockedAchievements.has(achievement.name)) {
            unlockedAchievements.add(achievement.name);
            const achievementItem = document.createElement('div');
            achievementItem.textContent = achievement.name;
            $achievementList.appendChild(achievementItem);
        }
    });
}

// Сброс прогресса
$resetButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
        localStorage.clear();
        location.reload();
    }
});

// Инициализация
start();