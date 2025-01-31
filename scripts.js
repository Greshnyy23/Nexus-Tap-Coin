let currency = 0; // Начальное количество валюты
let earningsPerClick = 1; // Сколько валюты зарабатывается за один клик
const upgrades = [
    { name: 'Увеличение кликов +1', price: 10, owned: 0, max: 10, type: 'click', effect: 1 },
    { name: 'Увеличение кликов +2', price: 30, owned: 0, max: 5, type: 'click', effect: 2 },
    { name: 'Автоматический кликер', price: 50, owned: 0, max: 2, type: 'auto' }
];

function loadData() {
    const savedCurrency = localStorage.getItem('currency');
    const savedEarningsPerClick = localStorage.getItem('earningsPerClick');
    const savedUpgrades = JSON.parse(localStorage.getItem('upgrades'));

    if (savedCurrency !== null) {
        currency = parseInt(savedCurrency);
    }
    if (savedEarningsPerClick !== null) {
        earningsPerClick = parseInt(savedEarningsPerClick);
    }
    if (savedUpgrades) {
        upgrades.forEach((upgrade, index) => {
            if (savedUpgrades[index]) {
                upgrade.owned = savedUpgrades[index].owned;
            }
        });
    }
}

function saveData() {
    localStorage.setItem('currency', currency);
    localStorage.setItem('earningsPerClick', earningsPerClick);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    saveData(); // Сохраняем данные при смене страницы
}

function earnCurrency() {
    currency += earningsPerClick;
    document.getElementById('currency').textContent = currency;
    showNotification(`+${earningsPerClick} валюты!`); // Показываем уведомление
    saveData(); // Сохраняем данные после изменения валюты
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    // Убираем уведомление через 2 секунды
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

function updateStats() {
    document.getElementById('playTime').textContent = `${Math.floor(0 / 60)}ч ${0 % 60}м`; // Замените на вашу логику
    document.getElementById('totalEarned').textContent = currency; // Замените на вашу логику
    document.getElementById('maxCPS').textContent = 0; // Замените на вашу логику
}

function updateUpgradesUI() {
    const container = document.getElementById('upgradesList');
    container.innerHTML = upgrades.map((upg, i) => `
        <div class="upgrade">
            <h3>${upg.name}</h3>
            <p>💵 Цена: ${upg.price}</p>
            <p>📦 Куплено: ${upg.owned}/${upg.max}</p>
            ${upg.effect ? `<p>↑ Заработок за клик: +${upg.effect}</p>` : ''}
            <button class="upgrade-button" onclick="buyUpgrade(${i})" 
                    ${currency < upg.price || upg.owned >= upg.max ? 'disabled' : ''}>
                🛒 Купить
            </button>
        </div>
    `).join('');
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (currency >= upgrade.price && upgrade.owned < upgrade.max) {
        currency -= upgrade.price;
        upgrade.owned++;
        if (upgrade.effect) {
            earningsPerClick += upgrade.effect;
            document.getElementById('earningsPerClick').textContent = earningsPerClick;
        }
        document.getElementById('currency').textContent = currency;
        updateUpgradesUI();
        showNotification(`Куплено: ${upgrade.name}`);
        saveData();
    } else {
        alert('Недостаточно валюты или достигнут лимит покупок');
    }
}

// Инициализация интерфейса
loadData(); // Загружаем данные при старте
updateStats(); // Обновляем статистику
updateUpgradesUI(); // Обновляем интерфейс улучшений