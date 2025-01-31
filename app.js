const $circle = document.querySelector('#circle');
const $money = document.querySelector('#money');
const $levelDisplay = document.getElementById('levelDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $autoClickerButton = document.getElementById('autoClickerButton');
const $coinMultiplierButton = document.getElementById('coinMultiplierButton');
const $achievementList = document.getElementById('achievementList');
const $resetButton = document.getElementById('resetButton');
const $prestigeButton = document.getElementById('prestigeButton');
const languageSelect = document.getElementById('languageSelect');
const $frogButton = document.getElementById('frogButton');
const $snakeButton = document.getElementById('snakeButton');
const $lizardButton = document.getElementById('lizardButton');
const $superClickerButton = document.getElementById('superClickerButton');
const $coin = document.getElementById('coin');
const $minigameScore = document.getElementById('minigameScore');

let money = 0;
let level = 1;
let upgradeActive = false;
let autoClickerActive = false;
let coinMultiplierActive = false;
let currentLanguage = 'ru';
let autoClickerInterval;
let coinMultiplierTimer;
let prestigeLevel = 0;
let currentCharacter = 'frog';
let minigameScore = 0;

const upgrades = {
    doubleCoins: { level: 1, cost: 50 },
    levelUp: { level: 1, cost: 100 },
    autoClicker: { level: 1, cost: 200 },
    coinMultiplier: { level: 1, cost: 300 }
};

const localization = {
    ru: {
        money: "Монеты",
        level: "Уровень",
        upgrades: "Улучшения",
        achievements: "Достижения",
        settings: "Настройки",
        doubleCoins: "Двойные монеты (50 монет)",
        levelUp: "Уровень выше (100 монет)",
        autoClicker: "Авто-кликер (200 монет)",
        coinMultiplier: "Множитель монет (300 монет)",
        resetProgress: "Сбросить прогресс",
        language: "Язык",
        newbie: "Новичок",
        experienced: "Опытный",
        master: "Мастер",
        autoClickerAchievement: "Автокликер",
        multiplierAchievement: "Множитель"
    },
    en: {
        money: "Coins",
        level: "Level",
        upgrades: "Upgrades",
        achievements: "Achievements",
        settings: "Settings",
        doubleCoins: "Double coins (50 coins)",
        levelUp: "Level up (100 coins)",
        autoClicker: "Auto-clicker (200 coins)",
        coinMultiplier: "Coin multiplier (300 coins)",
        resetProgress: "Reset progress",
        language: "Language",
        newbie: "Newbie",
        experienced: "Experienced",
        master: "Master",
        autoClickerAchievement: "Auto-clicker",
        multiplierAchievement: "Multiplier"
    }
};

// Инициализация
function start() {
    money = getMoney();
    level = getLevel();
    currentLanguage = localStorage.getItem('language') || 'ru';

    setMoney(money);
    setLevel(level);
    checkAchievements();
    updateTexts();
    languageSelect.value = currentLanguage;

    // Показываем первую вкладку по умолчанию
    document.querySelector('.tab-button.active').click();
}

// Функции для работы с монетами и уровнем
function setMoney(newMoney) {
    money = newMoney;
    localStorage.setItem('money', money);
    $money.textContent = `${localization[currentLanguage].money}: ${money}`;
    checkAchievements();
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `${localization[currentLanguage].level}: ${level}`;
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

    // Воспроизведение звука клика
    document.getElementById('clickSound').play();

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
    if (money >= upgrades.doubleCoins.cost) {
        money -= upgrades.doubleCoins.cost;
        upgrades.doubleCoins.level++;
        upgrades.doubleCoins.cost *= 2; // Увеличиваем стоимость
        setMoney(money);
        updateUpgradeButtons();
        document.getElementById('upgradeSound').play();
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$levelUpButton.addEventListener('click', () => {
    if (money >= upgrades.levelUp.cost) {
        money -= upgrades.levelUp.cost;
        upgrades.levelUp.level++;
        upgrades.levelUp.cost *= 2; // Увеличиваем стоимость
        setMoney(money);
        setLevel(level + 1);
        updateUpgradeButtons();
        document.getElementById('upgradeSound').play();
    } else {
        alert('Недостаточно монет для улучшения!');
    }
});

$autoClickerButton.addEventListener('click', () => {
    if (money >= upgrades.autoClicker.cost && !autoClickerActive) {
        money -= upgrades.autoClicker.cost;
        upgrades.autoClicker.level++;
        upgrades.autoClicker.cost *= 2; // Увеличиваем стоимость
        setMoney(money);
        autoClickerActive = true;
        autoClickerInterval = setInterval(() => {
            addMoney(1);
        }, 1000); // Авто-клик каждую секунду
        updateUpgradeButtons();
        document.getElementById('upgradeSound').play();
    } else {
        alert('Недостаточно монет для улучшения или авто-кликер уже активен!');
    }
});

$coinMultiplierButton.addEventListener('click', () => {
    if (money >= upgrades.coinMultiplier.cost && !coinMultiplierActive) {
        money -= upgrades.coinMultiplier.cost;
        upgrades.coinMultiplier.level++;
        upgrades.coinMultiplier.cost *= 2; // Увеличиваем стоимость
        setMoney(money);
        coinMultiplierActive = true;
        document.getElementById('upgradeSound').play();

        let timeLeft = 10;
        coinMultiplierTimer = setInterval(() => {
            timeLeft--;
            if (timeLeft <= 0) {
                clearInterval(coinMultiplierTimer);
                coinMultiplierActive = false;
                alert('Множитель монет закончился!');
            }
        }, 1000);
        updateUpgradeButtons();
    } else {
        alert('Недостаточно монет для улучшения или множитель уже активен!');
    }
});

// Достижения
function checkAchievements() {
    const achievements = [
        { name: localization[currentLanguage].newbie, condition: () => money >= 100 },
        { name: localization[currentLanguage].experienced, condition: () => money >= 500 },
        { name: localization[currentLanguage].master, condition: () => money >= 1000 },
        { name: localization[currentLanguage].autoClickerAchievement, condition: () => autoClickerActive },
        { name: localization[currentLanguage].multiplierAchievement, condition: () => coinMultiplierActive }
    ];

    $achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        if (achievement.condition()) {
            const achievementItem = document.createElement('div');
            achievementItem.textContent = achievement.name;
            $achievementList.appendChild(achievementItem);
            document.getElementById('achievementSound').play();
        }
    });
}

// Смена языка
languageSelect.addEventListener('change', (event) => {
    const selectedLanguage = event.target.value;
    changeLanguage(selectedLanguage);
});

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateTexts();
}

function updateTexts() {
    const texts = localization[currentLanguage];

    // Обновляем тексты
    document.querySelector('.money').textContent = `${texts.money}: ${money}`;
    document.querySelector('#levelDisplay').textContent = `${texts.level}: ${level}`;
    document.querySelector('#upgrades h3').textContent = texts.upgrades;
    document.querySelector('#achievements h3').textContent = texts.achievements;
    document.querySelector('#settings h3').textContent = texts.settings;
    document.querySelector('#upgradeButton').textContent = texts.doubleCoins;
    document.querySelector('#levelUpButton').textContent = texts.levelUp;
    document.querySelector('#autoClickerButton').textContent = texts.autoClicker;
    document.querySelector('#coinMultiplierButton').textContent = texts.coinMultiplier;
    document.querySelector('#resetButton').textContent = texts.resetProgress;
    document.querySelector('label[for="languageSelect"]').textContent = texts.language;
    document.querySelector('#languageSelect option[value="ru"]').textContent = "Русский";
    document.querySelector('#languageSelect option[value="en"]').textContent = "English";
}

// Сброс прогресса
$resetButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
        localStorage.clear();
        money = 0;
        level = 1;
        upgradeActive = false;
        autoClickerActive = false;
        coinMultiplierActive = false;
        clearInterval(autoClickerInterval);
        clearInterval(coinMultiplierTimer);
        setMoney(money);
        setLevel(level);
        checkAchievements();
        updateTexts();
    }
});

// Престиж
$prestigeButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите престижнуться?')) {
        prestigeLevel++;
        localStorage.clear();
        money = 0;
        level = 1;
        upgradeActive = false;
        autoClickerActive = false;
        coinMultiplierActive = false;
        clearInterval(autoClickerInterval);
        clearInterval(coinMultiplierTimer);
        setMoney(money);
        setLevel(level);
        checkAchievements();
        updateTexts();
        alert(`Престиж ${prestigeLevel} активирован! Вы получили бонусы.`);
    }
});

// Персонажи
$frogButton.addEventListener('click', () => {
    currentCharacter = 'frog';
    alert('Выбран персонаж: Лягушка');
});

$snakeButton.addEventListener('click', () => {
    currentCharacter = 'snake';
    alert('Выбран персонаж: Змея');
});

$lizardButton.addEventListener('click', () => {
    currentCharacter = 'lizard';
    alert('Выбран персонаж: Ящерица');
});

// Крафт
$superClickerButton.addEventListener('click', () => {
    if (upgrades.doubleCoins.level > 0 && upgrades.autoClicker.level > 0) {
        alert('Супер-кликер создан!');
    } else {
        alert('Недостаточно улучшений для крафта!');
    }
});

// Мини-игра
$coin.addEventListener('click', () => {
    minigameScore++;
    $minigameScore.textContent = `Счет: ${minigameScore}`;
    $coin.style.top = '-30px';
    $coin.style.left = `${Math.random() * 90}%`;
});

// Переключение вкладок
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Скрыть все вкладки
        tabContents.forEach(content => {
            content.style.display = 'none';
        });

        // Показать выбранную вкладку
        document.getElementById(tabName).style.display = 'block';

        // Убрать активный класс у всех кнопок
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Добавить активный класс к текущей кнопке
        button.classList.add('active');
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', start);