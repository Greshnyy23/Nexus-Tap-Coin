const $circle = document.querySelector('#circle');
const $money = document.getElementById('money');
const $levelDisplay = document.getElementById('levelDisplay');
const $clickSpeedButton = document.getElementById('clickSpeedButton');
const $autoClickButton = document.getElementById('autoClickButton');
const $multiplierButton = document.getElementById('multiplierButton');

let money = 0;
let level = 1;
let autoClickerActive = false;
let clickMultiplier = 1;
let autoClickerInterval;
let lastSaveTime = Date.now(); // Время последнего сохранения
let onlineTime = 0; // Время, проведенное в игре, в секундах
let offlineTime = 0; // Время, прошедшее в оффлайне, в миллисекундах

const upgrades = {
    clickSpeed: { cost: 50, baseCost: 50 },
    autoClick: { cost: 100, baseCost: 100 },
    multiplier: { cost: 150, baseCost: 150 }
};

// Сохранение текущего времени игры (для оффлайн сбора валюты)
function saveGame() {
    localStorage.setItem('money', money);
    localStorage.setItem('lastSaveTime', lastSaveTime);
    localStorage.setItem('offlineTime', offlineTime);
}

// Загрузка сохраненных данных
function loadGame() {
    money = Number(localStorage.getItem('money')) || 0;
    lastSaveTime = Number(localStorage.getItem('lastSaveTime')) || Date.now();
    offlineTime = Number(localStorage.getItem('offlineTime')) || 0;

    // Процесс получения монет за время, проведенное в игре
    const currentTime = Date.now();
    onlineTime += Math.floor((currentTime - lastSaveTime) / 1000); // Время в секундах

    // Получение монет за время, проведенное в игре
    money += onlineTime * 5;
    setMoney(money);

    // Получение монет за время, проведенное в оффлайне
    const offlineSeconds = Math.floor(offlineTime / 1000);
    money += Math.floor(offlineSeconds / 5); // 1 монета за каждые 5 секунд оффлайна
    setMoney(money);
}

// Обновление интерфейса для улучшений
function updateUpgradeInterface() {
    document.getElementById('clickSpeedCost').textContent = upgrades.clickSpeed.cost;
    document.getElementById('autoClickCost').textContent = upgrades.autoClick.cost;
    document.getElementById('multiplierCost').textContent = upgrades.multiplier.cost;
}

// Функция для изменения стоимости улучшений
function increaseUpgradeCost(upgrade) {
    return Math.round(upgrade.baseCost * 1.15);
}

// Инициализация
function start() {
    loadGame(); // Загрузка сохраненных данных
    updateUpgradeInterface(); // Обновление интерфейса улучшений
    setInterval(() => {
        lastSaveTime = Date.now(); // Обновление времени последнего сохранения
        offlineTime += 1000; // Увеличиваем время оффлайна на 1 секунду
        saveGame(); // Сохранение данных каждую секунду
    }, 1000);
}

// Установка денег
function setMoney(newMoney) {
    money = newMoney;
    localStorage.setItem('money', money);
    $money.textContent = `Монеты: ${money}`;
}

// Увеличение монет за клик
$circle.addEventListener('click', (event) => {
    addMoney(clickMultiplier);
});

// Добавление монет
function addMoney(amount) {
    setMoney(money + amount);
}

// Улучшения
$clickSpeedButton.addEventListener('click', () => {
    if (checkResources(upgrades.clickSpeed.cost)) {
        clickMultiplier++;
        upgrades.clickSpeed.cost = increaseUpgradeCost(upgrades.clickSpeed); // Увеличение цены
        updateUpgradeInterface();
        showNotification('Увеличение скорости клика приобретено!', 'success');
    } else {
        showNotification('Недостаточно монет для улучшения!', 'error');
    }
});

// Проверка ресурсов
function checkResources(cost) {
    return money >= cost;
}

// Увеличение авто-клика
$autoClickButton.addEventListener('click', () => {
    if (checkResources(upgrades.autoClick.cost) && !autoClickerActive) {
        autoClickerActive = true;
        autoClickerInterval = setInterval(() => {
            addMoney(1); // Получение монет автоматически
        }, 1000);
        upgrades.autoClick.cost = increaseUpgradeCost(upgrades.autoClick);
        updateUpgradeInterface();
        showNotification('Авто-кликер активирован!', 'success');
    } else {
        showNotification('Недостаточно монет для улучшения или авто-кликер уже активен!', 'error');
    }
});

// Увеличение множителя
$multiplierButton.addEventListener('click', () => {
    if (checkResources(upgrades.multiplier.cost)) {
        clickMultiplier *= 2; // Увеличение множителя
        upgrades.multiplier.cost = increaseUpgradeCost(upgrades.multiplier);
        updateUpgradeInterface();
        showNotification('Увеличение множителя приобретено!', 'success');
    } else {
        showNotification('Недостаточно монет для улучшения!', 'error');
    }
});

// Функция для переключения вкладок
const tabButtons = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        const content = document.getElementById(tabName);
        
        // Сворачивает и разворачивает вкладки
        if (content.style.display === 'none' || content.style.display === '') {
            tabContents.forEach(tc => tc.style.display = 'none');
            content.style.display = 'block';
        } else {
            content.style.display = 'none';
        }

        // Убираем активный класс у всех кнопок
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс к текущей кнопке
        button.classList.toggle('active');
    });
});

// Инициализация на загрузке страницы
document.addEventListener('DOMContentLoaded', start);