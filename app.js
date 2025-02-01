const $circle = document.querySelector('#circle');
const $money = document.getElementById('money');
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
const $themeToggle = document.getElementById('themeToggle');
const $clickableArea = document.getElementById('clickable-area'); // Новая переменная для кликабельной зоны

let money = 0;
let level = 1;
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
        language: "Язык"
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
        language: "Language"
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

    // Инициализация частиц
    particlesJS.load('particles-js', 'particles.json');
}

// Установка и обновление значений
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
$clickableArea.addEventListener('click', function (event) {
    // Эффект волн
    const wave = document.createElement('div');
    wave.className = 'click-wave';
    const rect = $clickableArea.getBoundingClientRect();
    wave.style.left = `${event.clientX - rect.left - 100}px`;
    wave.style.top = `${event.clientY - rect.top - 100}px`;
    $clickableArea.appendChild(wave);
    setTimeout(() => wave.remove(), 500);

    // Добавление монет
    addMoney(upgradeActive ? 2 : 1);

    // Звук клика
    document.getElementById('clickSound').play();
});

// Добавление монет
function addMoney(amount) {
    amount = coinMultiplierActive ? amount * 2 : amount;
    setMoney(money + amount); // Установка новой суммы монет
    animateCoins(amount); // Анимация монет
}

// Анимация добавления монет
function animateCoins(amount) {
    for (let i = 0; i < amount; i++) {
        const coin = document.createElement('div');
        coin.className = 'coin-animation';
        coin.style.left = `${Math.random() * 100}%`;
        coin.style.top = `${Math.random() * 100}%`;
        $clickableArea.appendChild(coin);
        setTimeout(() => {
            coin.remove();
        }, 1000);
    }
}

// Улучшения
function handleUpgrade(button, upgradeType) {
    if (money >= upgrades[upgradeType].cost) {
        money -= upgrades[upgradeType].cost;
        upgrades[upgradeType].level++;
        upgrades[upgradeType].cost *= 2;
        setMoney(money);
        updateUpgradeButtons();
        document.getElementById('upgradeSound').play();
        showNotification(`Улучшение "${localization[currentLanguage][upgradeType]}" куплено!`, 'success');
    } else {
        showNotification('Недостаточно монет для улучшения!', 'error');
    }
}

$upgradeButton.addEventListener('click', () => handleUpgrade($upgradeButton, 'doubleCoins'));
$levelUpButton.addEventListener('click', () => handleUpgrade($levelUpButton, 'levelUp'));
$autoClickerButton.addEventListener('click', () => handleUpgrade($autoClickerButton, 'autoClicker'));
$coinMultiplierButton.addEventListener('click', () => handleUpgrade($coinMultiplierButton, 'coinMultiplier'));

// Проверка достижений
function checkAchievements() {
    const achievements = {
        newbie: () => money >= 100,
        experienced: () => money >= 500,
        master: () => money >= 1000,
        autoClicker: () => autoClickerActive,
        multiplier: () => coinMultiplierActive
    };

    $achievementList.innerHTML = '';
    for (const [key, condition] of Object.entries(achievements)) {
        if (condition()) {
            const achievementItem = document.createElement('div');
            achievementItem.textContent = localization[currentLanguage][key];
            $achievementList.appendChild(achievementItem);
            document.getElementById('achievementSound').play();
        }
    }
}

// Смена языка
languageSelect.addEventListener('change', (event) => {
    changeLanguage(event.target.value);
});

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updateTexts();
}

function updateTexts() {
    const texts = localization[currentLanguage];
    $money.textContent = `${texts.money}: ${money}`;
    $levelDisplay.textContent = `${texts.level}: ${level}`;
    document.querySelector('#upgrades h3').textContent = texts.upgrades;
    document.querySelector('#achievements h3').textContent = texts.achievements;
    document.querySelector('#settings h3').textContent = texts.settings;
    $upgradeButton.textContent = texts.doubleCoins;
    $levelUpButton.textContent = texts.levelUp;
    $autoClickerButton.textContent = texts.autoClicker;
    $coinMultiplierButton.textContent = texts.coinMultiplier;
    $resetButton.textContent = texts.resetProgress;
    document.querySelector('label[for="languageSelect"]').textContent = texts.language;
}

// Сброс прогресса
$resetButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
        localStorage.clear();
        money = 0;
        level = 1;
        autoClickerActive = false;
        coinMultiplierActive = false;
        clearInterval(autoClickerInterval);
        clearInterval(coinMultiplierTimer);
        setMoney(money);
        setLevel(level);
        checkAchievements();
        updateTexts();
        showNotification('Прогресс сброшен!', 'info');
    }
});

// Престиж
$prestigeButton.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите престижнуться?')) {
        prestigeLevel++;
        localStorage.clear();
        money = 0;
        level = 1;
        autoClickerActive = false;
        coinMultiplierActive = false;
        clearInterval(autoClickerInterval);
        clearInterval(coinMultiplierTimer);
        setMoney(money);
        setLevel(level);
        checkAchievements();
        updateTexts();
        showNotification(`Престиж ${prestigeLevel} активирован! Вы получили бонусы.`, 'success');
    }
});

// Работа с персонажами
[$frogButton, $snakeButton, $lizardButton].forEach((button, index) => {
    button.addEventListener('click', () => {
        const characters = ['Лягушка', 'Змея', 'Ящерица'];
        currentCharacter = characters[index];
        showNotification(`Выбран персонаж: ${currentCharacter}`, 'success');
    });
});

// Крафт
$superClickerButton.addEventListener('click', () => {
    if (upgrades.doubleCoins.level > 0 && upgrades.autoClicker.level > 0) {
        showNotification('Супер-кликер создан!', 'success');
    } else {
        showNotification('Недостаточно улучшений для крафта!', 'error');
    }
});

// Мини-игра
$coin.addEventListener('click', () => {
    minigameScore++;
    $minigameScore.textContent = `Счет: ${minigameScore}`;
    $coin.style.top = '-30px';
    $coin.style.left = `${Math.random() * 90}%`;
    showNotification('Монета поймана! +1 к счету', 'success');
});

// Переключение темы
$themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    $themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
    showNotification(`Тема изменена на ${document.body.classList.contains('light-theme') ? 'светлую' : 'темную'}!`, 'info');
});

// Уведомления
function showNotification(message, type = 'info') {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;

    if (type === 'error') {
        notification.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
    } else if (type === 'success') {
        notification.style.backgroundColor = 'rgba(0, 255, 0, 0.8)';
    }

    notificationContainer.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Переключение вкладок
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');

        // Скрыть все вкладки
        tabContents.forEach(content => content.style.display = 'none');

        // Показать выбранную вкладку
        document.getElementById(tabName).style.display = 'block';

        // Убрать активный класс у всех кнопок
        tabButtons.forEach(btn => btn.classList.remove('active'));

        // Добавить активный класс к текущей кнопке
        button.classList.add('active');
    });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', start);