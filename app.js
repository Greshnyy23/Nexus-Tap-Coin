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
const $coin = document.getElementById('coin');
const $minigameScore = document.getElementById('minigameScore');
const $themeToggle = document.getElementById('themeToggle');

const $confirmModal = document.getElementById('confirmModal');
const $modalMessage = document.getElementById('modalMessage');
const $confirmYes = document.getElementById('confirmYes');
const $confirmNo = document.getElementById('confirmNo');
const $closeModal = document.getElementById('closeModal');

let money = 0;
let level = 1;
let autoClickerActive = false;
let coinMultiplierActive = false;
let currentLanguage = 'ru';
let autoClickerInterval;
let coinMultiplierTimer;
let prestigeLevel = 0;
let minigameScore = 0;

const upgrades = {
    doubleCoins: { level: 1, cost: 50, baseCost: 50 },
    levelUp: { level: 1, cost: 100, baseCost: 100 },
    autoClicker: { level: 0, cost: 200, baseCost: 200 },
    coinMultiplier: { level: 1, cost: 300, baseCost: 300 }
};

// Обновление интерфейса для улучшений
function updateUpgradeInterface() {
    document.getElementById('doubleCoinsLevel').textContent = upgrades.doubleCoins.level;
    document.getElementById('doubleCoinsCost').textContent = Math.round(upgrades.doubleCoins.cost);

    document.getElementById('levelUpLevel').textContent = upgrades.levelUp.level;
    document.getElementById('levelUpCost').textContent = Math.round(upgrades.levelUp.cost);

    document.getElementById('autoClickerLevel').textContent = upgrades.autoClicker.level;
    document.getElementById('autoClickerCost').textContent = Math.round(upgrades.autoClicker.cost);

    document.getElementById('coinMultiplierLevel').textContent = upgrades.coinMultiplier.level;
    document.getElementById('coinMultiplierCost').textContent = Math.round(upgrades.coinMultiplier.cost);
}

// Функция для изменения стоимости улучшения
function increaseUpgradeCost(upgrade) {
    return Math.round(upgrade.baseCost * Math.pow(1.15, upgrade.level)); // Увеличение на 15% за уровень
}

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
    updateUpgradeInterface();

    document.querySelector('.tab-button.active').click();
    particlesJS.load('particles-js', 'particles.json');
}

function setMoney(newMoney) {
    money = newMoney;
    localStorage.setItem('money', money);
    $money.textContent = `Монеты: ${money}`;
    checkAchievements();
}

function setLevel(newLevel) {
    level = newLevel;
    localStorage.setItem('level', level);
    $levelDisplay.textContent = `Уровень: ${level}`;
}

function getMoney() {
    return Number(localStorage.getItem('money')) || 0;
}

function getLevel() {
    return Number(localStorage.getItem('level')) || 1;
}

// Логика клика по кругу
$circle.addEventListener('click', (event) => {
    const wave = document.createElement('div');
    wave.className = 'click-wave';
    const rect = $circle.getBoundingClientRect();
    wave.style.left = `${event.clientX - rect.left - 100}px`;
    wave.style.top = `${event.clientY - rect.top - 100}px`;
    $circle.appendChild(wave);
    setTimeout(() => wave.remove(), 500);

    // Учет монеты в счете и в балансе
    addMoney(calculateCoinsPerClick());
});

// Функция для расчета монет за клик
function calculateCoinsPerClick() {
    let coinsPerClick = 1 + level; // Базовая монета + уровень игрока
    if (upgrades.doubleCoins.level > 0) {
        coinsPerClick *= 2; // Удвоение монет, если улучшение куплено
    }
    return coinsPerClick;
}

// Добавление монет
function addMoney(amount) {
    setMoney(money + amount);
}

// Улучшения
$upgradeButton.addEventListener('click', () => {
    if (money >= upgrades.doubleCoins.cost) {
        money -= upgrades.doubleCoins.cost;
        upgrades.doubleCoins.level++;
        upgrades.doubleCoins.cost = increaseUpgradeCost(upgrades.doubleCoins);
        setMoney(money);
        updateUpgradeInterface();
        showNotification('Улучшение "Двойные монеты" куплено!', 'success');
    } else {
        showNotification('Недостаточно монет для улучшения!', 'error');
    }
});

$levelUpButton.addEventListener('click', () => {
    if (money >= upgrades.levelUp.cost) {
        money -= upgrades.levelUp.cost;
        level++;
        upgrades.levelUp.cost = increaseUpgradeCost(upgrades.levelUp);
        setMoney(money);
        setLevel(level);
        updateUpgradeInterface();
        showNotification('Уровень повышен!', 'success');
    } else {
        showNotification('Недостаточно монет для повышения уровня!', 'error');
    }
});

$autoClickerButton.addEventListener('click', () => {
    if (money >= upgrades.autoClicker.cost && !autoClickerActive) {
        money -= upgrades.autoClicker.cost;
        upgrades.autoClicker.level++;
        upgrades.autoClicker.cost = increaseUpgradeCost(upgrades.autoClicker);
        setMoney(money);
        autoClickerActive = true;
        autoClickerInterval = setInterval(() => {
            addMoney(calculateCoinsPerClick());
        }, 1000);
        updateUpgradeInterface();
        showNotification('Авто-кликер активирован!', 'success');
    } else {
        showNotification('Недостаточно монет для улучшения или авто-кликер уже активен!', 'error');
    }
});

$coinMultiplierButton.addEventListener('click', () => {
    if (money >= upgrades.coinMultiplier.cost && !coinMultiplierActive) {
        money -= upgrades.coinMultiplier.cost;
        upgrades.coinMultiplier.level++;
        upgrades.coinMultiplier.cost = increaseUpgradeCost(upgrades.coinMultiplier);
        setMoney(money);
        coinMultiplierActive = true;
        showNotification('Множитель монет активирован!', 'success');

        // Время для действия множителя
        coinMultiplierTimer = setTimeout(() => {
            coinMultiplierActive = false;
            showNotification('Множитель монет закончился!', 'info');
        }, 10000);
        updateUpgradeInterface();
    } else {
        showNotification('Недостаточно монет для улучшения или множитель уже активен!', 'error');
    }
});

// Проверка достижений
function checkAchievements() {
    const achievements = [
        { name: 'Новичок', condition: () => money >= 100 },
        { name: 'Опытный', condition: () => money >= 500 },
        { name: 'Мастер', condition: () => money >= 1000 },
        { name: 'Авто-кликер', condition: () => autoClickerActive },
        { name: 'Множитель', condition: () => coinMultiplierActive }
    ];

    $achievementList.innerHTML = '';
    achievements.forEach(achievement => {
        if (achievement.condition()) {
            const achievementItem = document.createElement('div');
            achievementItem.textContent = achievement.name;
            $achievementList.appendChild(achievementItem);
        }
    });
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
    $money.textContent = `Монеты: ${money}`;
    $levelDisplay.textContent = `Уровень: ${level}`;
    document.querySelector('#upgrades h3').textContent = 'Улучшения:';
    document.querySelector('#achievements h3').textContent = 'Достижения:';
    document.querySelector('#settings h3').textContent = 'Настройки:';
    $upgradeButton.textContent = 'Купить';
    $levelUpButton.textContent = 'Купить';
    $autoClickerButton.textContent = 'Купить';
    $coinMultiplierButton.textContent = 'Купить';
    $resetButton.textContent = 'Сбросить прогресс';
    document.querySelector('label[for="languageSelect"]').textContent = 'Язык:';
}

// Сброс прогресса
$resetButton.addEventListener('click', () => {
    showConfirmModal('Сбросить прогресс?', 'Вы уверены, что хотите сбросить прогресс?');
});

// Престиж
$prestigeButton.addEventListener('click', () => {
    showConfirmModal('Престиж', 'Вы уверены, что хотите престижнуться?');
});

// Открывает модальное окно подтверждения
function showConfirmModal(title, message) {
    $confirmModal.style.display = 'block';
    $modalMessage.textContent = message;

    $confirmYes.onclick = function () {
        if (title === 'Сбросить прогресс?') {
            // Сброс прогресса
            localStorage.clear();
            money = 0;
            level = 1;
            autoClickerActive = false;
            coinMultiplierActive = false;
            clearInterval(autoClickerInterval);
            clearTimeout(coinMultiplierTimer);
            setMoney(money);
            setLevel(level);
            checkAchievements();
            updateTexts();
            showNotification('Прогресс сброшен!', 'info');
        } else if (title === 'Престиж') {
            // Реализация механики престижа
            prestigeLevel++;
            money = Math.floor(money * 0.1); // Игрок получает 10% от своих текущих денег как бонус
            level = 1; // Сбрасываем уровень
            upgrades.doubleCoins.level = 1; // Сбрасываем улучшения
            upgrades.autoClicker.level = 0;
            upgrades.coinMultiplier.level = 1;
            upgrades.levelUp.level = 1;

            localStorage.clear();
            setMoney(money);
            setLevel(level);
            checkAchievements();
            updateTexts();
            showNotification(`Престиж ${prestigeLevel} активирован! Вы получили бонус: ${money} монет!`, 'success');
        }

        $confirmModal.style.display = 'none'; // Закрытие модала
    };

    $confirmNo.onclick = function () {
        $confirmModal.style.display = 'none'; // Закрытие модала
    };
}

// Закрытие модального окна
$closeModal.onclick = function () {
    $confirmModal.style.display = 'none'; // Закрытие модала
};

// Мини-игра
$coin.addEventListener('click', () => {
    addMoney(1); // Добавление монеты к общему количеству
    minigameScore++;
    $minigameScore.textContent = `Счет: ${minigameScore}`;
    // Перемещение монеты в случайное место
    $coin.style.top = `${Math.random() * 150}px`;
    $coin.style.left = `${Math.random() * 90}%`;
    showNotification('Монета поймана! +1 к счету', 'success');
});

// Переключение темы
$themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    $themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
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
    }, 4000); // Удаляем уведомление через 4 секунды
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

// Инициализация на загрузке страницы
document.addEventListener('DOMContentLoaded', start);