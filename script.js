let currency = 0; // Начальное количество валюты
let earningsPerClick = 1; // Сколько валюты зарабатывается за один клик
let earningsPerSecond = 0; // Пассивный доход
let startTime = Date.now(); // Время начала игры
let maxCPS = 0; // Максимальные клики в секунду
let lastClickTime = Date.now(); // Время последнего клика
let clicksThisSecond = 0; // Кол-во кликов за текущую секунду
let totalClicks = 0; // Общее количество кликов
let lastLogin = localStorage.getItem('lastLogin'); // Дата последнего входа в систему
const today = new Date().toDateString(); // Текущая дата для проверки ежедневной награды

const achievements = {
    100: "Новичок: 100 кликов!",
    500: "Профи: 500 кликов!",
    1000: "Мастер: 1000 кликов!"
};

const upgrades = [
    { name: 'Увеличение кликов +1', price: 10, owned: 0, max: 10, type: 'click', effect: 1 },
    { name: 'Увеличение кликов +2', price: 30, owned: 0, max: 5, type: 'click', effect: 2 },
    { name: 'Автоматический кликер', price: 50, owned: 0, max: 5, type: 'passive', effect: 1 }
];

// Загрузка данных из localStorage
function loadData() {
    const savedData = JSON.parse(localStorage.getItem('gameData')) || {};
    currency = savedData.currency || 0;
    earningsPerClick = savedData.earningsPerClick || 1;
    upgrades.forEach((upg, i) => {
        upg.owned = savedData.upgrades?.[i]?.owned || 0;
    });
    maxCPS = savedData.maxCPS || 0;
    totalClicks = savedData.totalClicks || 0;
    lastLogin = savedData.lastLogin || null;
    startTime = savedData.startTime || Date.now();
    updateUI();
}

// Сохранение данных в localStorage
function saveData() {
    localStorage.setItem('gameData', JSON.stringify({
        currency,
        earningsPerClick,
        upgrades: upgrades.map(upgrade => ({ owned: upgrade.owned })),
        maxCPS,
        totalClicks,
        lastLogin,
        startTime
    }));
}

// Показ страницы
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// Заработок валюты
function earnCurrency() {
    currency += earningsPerClick;
    totalClicks++;

    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick <= 1000) {
        clicksThisSecond++;
    } else {
        clicksThisSecond = 1; // обнуление для новой секунды
    }

    lastClickTime = currentTime; // обновляем время последнего клика
    maxCPS = Math.max(maxCPS, clicksThisSecond); // обновляем максимальное количество кликов в секунду

    updateUI();
    showNotification(`+${earningsPerClick} валюты!`);
    saveData();
    checkAchievements(); // Проверка на достижения
}

// Проверка на достижения
function checkAchievements() {
    Object.keys(achievements).forEach(threshold => {
        if (totalClicks >= parseInt(threshold) && !localStorage.getItem(`achievement-${threshold}`)) {
            showNotification(`🏆 ${achievements[threshold]}`);
            localStorage.setItem(`achievement-${threshold}`, true); // Сохраняем достижение
            updateAchievementsUI(); // Обновляем интерфейс достижений
        }
    });
}

// Уведомление
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

// Обновление статистики
function updateStats() {
    const playTimeSeconds = Math.floor((Date.now() - startTime) / 1000);
    const playTimeMinutes = Math.floor(playTimeSeconds / 60);
    const playTimeHours = Math.floor(playTimeMinutes / 60);
    const playTimeSecondsRemainder = playTimeSeconds % 60;
    const playTimeMinutesRemainder = playTimeMinutes % 60;

    document.getElementById('playTime').textContent = `${playTimeHours}ч ${playTimeMinutesRemainder}м ${playTimeSecondsRemainder}с`;
    document.getElementById('totalEarned').textContent = currency;
    document.getElementById('maxCPS').textContent = maxCPS;
    document.getElementById('earningsPerSecond').textContent = earningsPerSecond; 
}

// Обновление интерфейса улучшений
function updateUpgradesUI() {
    const container = document.getElementById('upgradesList');
    container.innerHTML = upgrades.map((upg, i) => `
        <div class="upgrade">
            <h3>${upg.name}</h3>
            <p>💵 Цена: ${upg.price}</p>
            <p>Куплено: ${upg.owned}/${upg.max}</p>
            ${upg.effect ? `<p>↑ Заработок за клик: +${upg.effect}</p>` : ''}
            <div class="upgrade-progress">
                <div class="progress-bar" style="width: ${(upg.owned / upg.max) * 100}%;"></div>
            </div>
            <button class="upgrade-button" onclick="buyUpgrade(${i})" ${currency < upg.price || upg.owned >= upg.max ? 'disabled' : ''}>Купить</button>
        </div>
    `).join('');

    // Анимация появления
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    });

    document.querySelectorAll('.upgrade').forEach(upgrade => observer.observe(upgrade));
}

// Покупка улучшений
function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (currency >= upgrade.price && upgrade.owned < upgrade.max) {
        currency -= upgrade.price;
        upgrade.owned++;

        if (upgrade.type === 'passive') {
            earningsPerSecond += upgrade.effect; // Увеличение пассивного дохода
        } else if (upgrade.type === 'click') {
            earningsPerClick += upgrade.effect; // Увеличение дохода за клик
        }

        updateUI(); // Обновление интерфейса
        saveData(); // Сохранение данных
    } else {
        alert('Недостаточно валюты или достигнут лимит покупок');
    }
}

// Добавление заработка в секунду
function addEarningsPerSecond() {
    currency += earningsPerSecond; 
    updateUI(); // Обновление интерфейса
    saveData(); // Сохранение данных
}

// Обновление достижений
function updateAchievementsUI() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = Object.keys(achievements).map(threshold => {
        const completed = localStorage.getItem(`achievement-${threshold}`);
        return `<div class="achievement">${achievements[threshold]} ${completed ? '✅' : ''}</div>`;
    }).join('');
}

// Инициализация
loadData(); // Загрузка данных
updateUI(); // Обновление интерфейса

// Запуск функции добавления валюты в секунду каждую секунду
setInterval(addEarningsPerSecond, 1000);