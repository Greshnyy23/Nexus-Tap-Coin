let currency = 0;
let earningsPerClick = 1;
let earningsPerSecond = 0;
let totalClicks = 0;
let totalTimePlayed = 0; // Общее время игры в секундах
let maxCPS = 0;
let lastClickTime = Date.now();
let clicksThisSecond = 0;
const upgrades = [
    { name: 'Увеличение кликов +1', price: 10, owned: 0, max: 10, type: 'click', effect: 1 },
    { name: 'Увеличение кликов +2', price: 30, owned: 0, max: 5, type: 'click', effect: 2 },
    { name: 'Автоматический кликер', price: 50, owned: 0, max: 5, type: 'passive', effect: 1 }
];
const achievements = {
    100: "Новичок: 100 кликов!",
    500: "Профи: 500 кликов!",
    1000: "Мастер: 1000 кликов!"
};

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('gameData')) || {};
    currency = savedData.currency || 0;
    earningsPerClick = savedData.earningsPerClick || 1;
    upgrades.forEach((upg, i) => upg.owned = savedData.upgrades?.[i]?.owned || 0);
    maxCPS = savedData.maxCPS || 0;
    totalClicks = savedData.totalClicks || 0;
    totalTimePlayed = savedData.totalTimePlayed || 0;
    updateUI();
}

function saveData() {
    localStorage.setItem('gameData', JSON.stringify({
        currency,
        earningsPerClick,
        upgrades: upgrades.map(upgrade => ({ owned: upgrade.owned })),
        maxCPS,
        totalClicks,
        totalTimePlayed
    }));
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function earnCurrency() {
    currency += earningsPerClick;
    totalClicks++;
    const currentTime = Date.now();
    const timeSinceLastClick = currentTime - lastClickTime;
    
    if (timeSinceLastClick <= 1000) {
        clicksThisSecond++;
    } else {
        clicksThisSecond = 1;
    }
    lastClickTime = currentTime;
    maxCPS = Math.max(maxCPS, clicksThisSecond);
    updateUI();
    showNotification(`+${earningsPerClick} валюты!`);
    saveData();
    checkAchievements();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

function updateStats() {
    totalTimePlayed = Math.floor((Date.now() - startTime) / 1000); 
    const playTimeHours = Math.floor(totalTimePlayed / 3600);
    const playTimeMinutes = Math.floor((totalTimePlayed % 3600) / 60);
    const playTimeSeconds = totalTimePlayed % 60;

    document.getElementById('playTime').textContent = `${playTimeHours}ч ${playTimeMinutes}м ${playTimeSeconds}с`;
    document.getElementById('totalEarned').textContent = currency;
    document.getElementById('maxCPS').textContent = maxCPS;
    document.getElementById('earningsPerSecond').textContent = earningsPerSecond; 
}

function updateUpgradesUI() {
    const container = document.getElementById('upgradesList');
    container.innerHTML = upgrades.map((upg, i) => `
        <div class="upgrade">
            <h3>${upg.name}</h3>
            <p>Цена: ${upg.price}</p>
            <p>Куплено: ${upg.owned}/${upg.max}</p>
            ${upg.effect ? `<p>Заработок: +${upg.effect}</p>` : ''}
            <div class="upgrade-progress">
                <div class="progress-bar" style="width: ${(upg.owned / upg.max) * 100}%;"></div>
            </div>
            <button class="upgrade-button" onclick="buyUpgrade(${i})" 
                ${currency < upg.price || upg.owned >= upg.max ? 'disabled' : ''}>Купить</button>
        </div>
    `).join('');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            entry.target.classList.toggle('visible', entry.isIntersecting);
        });
    });
    document.querySelectorAll('.upgrade').forEach(upgrade => observer.observe(upgrade));
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (currency >= upgrade.price && upgrade.owned < upgrade.max) {
        currency -= upgrade.price;
        upgrade.owned++;
        if (upgrade.type === 'passive') {
            earningsPerSecond += upgrade.effect; 
        } else if (upgrade.type === 'click') {
            earningsPerClick += upgrade.effect; 
        }
        saveData();
        updateUI();
        showNotification(`Куплено: ${upgrade.name}`);
    } else {
        alert('Недостаточно валюты или достигнут лимит покупок');
    }
}

function addEarningsPerSecond() {
    currency += earningsPerSecond; 
    saveData();
    updateUI();
}

function checkAchievements() {
    Object.keys(achievements).forEach(threshold => {
        if (totalClicks >= parseInt(threshold) && !localStorage.getItem(`achievement-${threshold}`)) {
            showNotification(`🏆 ${achievements[threshold]}`);
            localStorage.setItem(`achievement-${threshold}`, true); 
            updateAchievementsUI();
        }
    });
}

function updateAchievementsUI() {
    const achievementsList = document.getElementById('achievements-list');
    achievementsList.innerHTML = Object.keys(achievements).map(threshold => {
        const completed = localStorage.getItem(`achievement-${threshold}`);
        return `<div class="achievement">${achievements[threshold]} ${completed ? '✅' : ''}</div>`;
    }).join('');
}

// Запуск функции addEarningsPerSecond каждую секунду
setInterval(addEarningsPerSecond, 1000);

// Инициализация
loadData();
updateStats();
updateUpgradesUI();