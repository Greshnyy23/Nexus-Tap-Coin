let currency = 0;
let earningsPerClick = 1;
let playTime = 0;
let totalEarned = 0;
let maxCPS = 0;

const currencyDisplay = document.getElementById("currency");
const earningsPerClickDisplay = document.getElementById("earningsPerClick");
const playTimeDisplay = document.getElementById("playTime");
const totalEarnedDisplay = document.getElementById("totalEarned");
const maxCPSDisplay = document.getElementById("maxCPS");

const notification = document.getElementById("notification");

function earnCurrency() {
    currency += earningsPerClick;
    totalEarned += earningsPerClick;
    currencyDisplay.textContent = currency;
    totalEarnedDisplay.textContent = totalEarned;
    showNotification(`Вы заработали ${earningsPerClick} валюты!`);
}

function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Старт таймера игры
setInterval(() => {
    playTime++;
    playTimeDisplay.textContent = `${Math.floor(playTime / 60)}ч ${playTime % 60}м`;
}, 60000); // Обновляем каждую минуту

// Моделируем улучшения
function createUpgrade(name, cost, effect) {
    const upgradeItem = document.createElement('div');
    upgradeItem.classList.add('upgrade-item');
    upgradeItem.innerHTML = `${name} (Цена: ${cost} валюты)`;

    upgradeItem.onclick = () => {
        if (currency >= cost) {
            currency -= cost;
            earningsPerClick += effect;
            earningsPerClickDisplay.textContent = earningsPerClick;
            currencyDisplay.textContent = currency;
            showNotification(`${name} улучшено!`);
        } else {
            showNotification(`Недостаточно валюты для улучшения ${name}`);
        }
    };

    return upgradeItem;
}

// Добавление улучшений
function loadUpgrades() {
    const upgradesList = document.getElementById("upgradesList");
    upgradesList.appendChild(createUpgrade('Ускорение кликов', 100, 1));
    upgradesList.appendChild(createUpgrade('Мощность кликов', 250, 2));
}

loadUpgrades();

// Мониторинг максимального CPS
setInterval(() => {
    const cps = earningsPerClick / 1; // Примерная скорость кликов за секунду
    maxCPS = Math.max(maxCPS, cps);
    maxCPSDisplay.textContent = maxCPS.toFixed(2);
}, 1000);