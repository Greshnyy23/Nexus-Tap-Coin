let currency = 0;
let earningsPerClick = 1;
let earningsPerSecond = 0;
let startTime = Date.now();
let maxCPS = 0;
let lastClickTime = Date.now();
let clicksThisSecond = 0;
let lastSecond = Math.floor(Date.now() / 1000);
let totalClicks = 0;
let lastLogin = localStorage.getItem('lastLogin');
const today = new Date().toDateString();

const achievements = {
    100: "Новичок: 100 кликов!",
    500: "Профи: 500 кликов!",
    1000: "Мастер: 1000 кликов!"
};

const upgrades = [
    { name: 'Увеличение кликов +1', price: 10, owned: 0, max: 10, type: 'click', effect: 1 },
    { name: 'Увеличение кликов +2', price: 30, owned: 0, max: 5, type: 'click', effect: 2 },
    { name: 'Ускоритель', price: 100, owned: 0, max: 5, type: 'passive', effect: 1 }
];

function loadData() {
    const savedData = JSON.parse(localStorage.getItem('gameData')) || {};
    currency = savedData.currency || 0;
    earningsPerClick = savedData.earningsPerClick || 1;
    upgrades.forEach((upg, i) => upg.owned = savedData.upgrades?.[i]?.owned || 0);
    maxCPS = savedData.maxCPS || 0;
    totalClicks = savedData.totalClicks || 0;
    lastLogin = savedData.lastLogin || null;
    startTime = savedData.startTime || Date.now();
    updateUI();
}

function saveData() {
  localStorage.setItem('gameData', JSON.stringify({
    currency,
    earningsPerClick,
    upgrades,
    maxCPS,
    totalClicks,
    lastLogin,
    startTime
  }));
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    saveData();
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

function updateUpgradesUI() {
    const container = document.getElementById('upgradesList');
    container.innerHTML = upgrades.map((upg, i) => `
        <div class="upgrade">
            <h3>${upg.name}</h3>
            <p>Цена: ${upg.price}</p>
            <p>Owned: ${upg.owned}/${upg.max}</p>
            ${upg.effect ? `<p>Заработок: +${upg.effect}</p>` : ''}
            <div class="upgrade-progress">
                <div class="progress-bar" style="width: ${Math.min(100, (upg.owned / upg.max) * 100)}%;"></div>
            </div>
            <button class="upgrade-button" onclick="buyUpgrade(${i})" ${currency < upg.price || upg.owned >= upg.max ? 'disabled' : ''}>Купить</button>
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
        updateUI();
        saveData();
    } else {
        alert('Недостаточно валюты или достигнут лимит покупок');
    }
}

function addEarningsPerSecond() {
    currency += earningsPerSecond;
    updateUI();
    saveData();
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

function checkDailyReward() {
  if (lastLogin !== today) {
    currency += 50;
    showNotification("🎁 Ежедневная награда: +50 монет!");
    localStorage.setItem('lastLogin', today);
    updateUI();
    saveData();
  }
}

function updateUI() {
    document.getElementById('currency').textContent = currency;
    document.getElementById('earningsPerClick').textContent = earningsPerClick;
    document.getElementById('earningsPerSecond').textContent = earningsPerSecond;
    updateUpgradesUI();
    updateStats();
    updateAchievementsUI();
    updateDailyReward();
}

function updateDailyReward() {
  const dailyReward = document.getElementById('dailyReward');
  // Здесь реализуйте логику отображения вашей ежедневной награды
  if (lastLogin !== today) {
    dailyReward.innerHTML = `<p>Вы получили ежедневную награду: 50 монет!</p>`;
    localStorage.setItem('lastLogin', today);
  } else {
    dailyReward.innerHTML = ``
  }
}

setInterval(addEarningsPerSecond, 1000);
checkDailyReward();
loadData();
updateUI();
