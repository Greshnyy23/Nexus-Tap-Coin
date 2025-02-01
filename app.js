const elements = {
    money: document.getElementById('money'),
    clickPowerValue: document.getElementById('clickPowerValue'),
    clickPowerCost: document.getElementById('clickPowerCost'),
    autoClickLevel: document.getElementById('autoClickLevel'),
    autoClickCost: document.getElementById('autoClickCost'),
    criticalChance: document.getElementById('criticalChance'),
    criticalCost: document.getElementById('criticalCost'),
    achievementList: document.getElementById('achievementList'),
    minigameScore: document.getElementById('minigameScore')
};

let money = 0;
let clickPower = 1;
let autoClickLevel = 0;
let criticalChance = 5;
let multiplier = 1;
let minigameScore = 0;
let autoClickInterval;

const upgrades = {
    clickPower: { cost: 50, baseCost: 50 },
    autoClick: { cost: 100, baseCost: 100 },
    critical: { cost: 200, baseCost: 200 }
};

let achievements = [
    { id: 1, name: 'Первые шаги', desc: 'Заработайте 100 монет', goal: 100, unlocked: false },
    { id: 2, name: 'Автоматизация', desc: 'Купите авто-кликер', goal: 1, unlocked: false },
    { id: 3, name: 'Критик', desc: 'Достигните 20% шанса крита', goal: 20, unlocked: false }
];

function init() {
    loadGame();
    setupEventListeners();
    renderAchievements();
    updateDisplay();
    startAutoClicker();
    particlesJS.load('particles-js', 'particles.json');
}

function setupEventListeners() {
    document.getElementById('clickArea').addEventListener('click', handleClick);
    document.getElementById('buyClickPower').addEventListener('click', buyClickPower);
    document.getElementById('buyAutoClick').addEventListener('click', buyAutoClick);
    document.getElementById('buyCritical').addEventListener('click', buyCritical);
    
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    document.getElementById('resetProgress').addEventListener('click', resetProgress);
    document.getElementById('minigameArea').addEventListener('click', handleMinigameClick);
    document.getElementById('themeButton').addEventListener('click', toggleTheme);
}

function handleClick(event) {
    let amount = clickPower * multiplier;
    if (Math.random() * 100 < criticalChance) amount *= 2;
    addMoney(amount);
    createClickEffect(event);
}

function addMoney(amount) {
    money += Math.floor(amount);
    updateDisplay();
    checkAchievements();
    saveGame();
}

function buyClickPower() {
    if (money >= upgrades.clickPower.cost) {
        money -= upgrades.clickPower.cost;
        clickPower++;
        upgrades.clickPower.cost = Math.floor(upgrades.clickPower.baseCost * Math.pow(1.15, clickPower));
        updateDisplay();
        checkAchievements();
        saveGame();
    }
}

function buyAutoClick() {
    if (money >= upgrades.autoClick.cost) {
        money -= upgrades.autoClick.cost;
        autoClickLevel++;
        upgrades.autoClick.cost = Math.floor(upgrades.autoClick.baseCost * Math.pow(1.15, autoClickLevel));
        startAutoClicker();
        updateDisplay();
        checkAchievements();
        saveGame();
    }
}

function buyCritical() {
    if (money >= upgrades.critical.cost) {
        money -= upgrades.critical.cost;
        criticalChance += 5;
        upgrades.critical.cost = Math.floor(upgrades.critical.baseCost * Math.pow(1.15, criticalChance / 5));
        updateDisplay();
        checkAchievements();
        saveGame();
    }
}

function startAutoClicker() {
    if (autoClickInterval) clearInterval(autoClickInterval);
    if (autoClickLevel > 0) {
        autoClickInterval = setInterval(() => {
            addMoney(clickPower * autoClickLevel);
        }, 1000);
    }
}

function renderAchievements() {
    elements.achievementList.innerHTML = achievements.map(ach => `
        <div class="achievement ${ach.unlocked ? 'unlocked' : 'locked'}">
            <h4>${ach.name}</h4>
            <p>${ach.desc}</p>
            <progress value="${ach.unlocked ? ach.goal : getAchievementProgress(ach)}" max="${ach.goal}"></progress>
        </div>
    `).join('');
}

function getAchievementProgress(achievement) {
    switch(achievement.id) {
        case 1: return Math.min(money, achievement.goal);
        case 2: return autoClickLevel;
        case 3: return criticalChance;
        default: return 0;
    }
}

function checkAchievements() {
    achievements.forEach(ach => {
        if (!ach.unlocked && getAchievementProgress(ach) >= ach.goal) {
            ach.unlocked = true;
            showNotification(`Достижение разблокировано: ${ach.name}`);
        }
    });
    renderAchievements();
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.getElementById('notifications').appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
}

function resetProgress() {
    if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
        localStorage.removeItem('gameSave');
        location.reload();
    }
}

function createClickEffect(event) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${event.offsetX - 15}px`;
    effect.style.top = `${event.offsetY - 15}px`;
    document.getElementById('clickArea').appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function saveGame() {
    const saveData = {
        money,
        clickPower,
        autoClickLevel,
        criticalChance,
        upgrades,
        achievements
    };
    localStorage.setItem('gameSave', JSON.stringify(saveData));
}

function loadGame() {
    const saveData = JSON.parse(localStorage.getItem('gameSave'));
    if (saveData) {
        money = saveData.money || 0;
        clickPower = saveData.clickPower || 1;
        autoClickLevel = saveData.autoClickLevel || 0;
        criticalChance = saveData.criticalChance || 5;
        upgrades.clickPower.cost = saveData.upgrades?.clickPower?.cost || 50;
        upgrades.autoClick.cost = saveData.upgrades?.autoClick?.cost || 100;
        upgrades.critical.cost = saveData.upgrades?.critical?.cost || 200;
        achievements = saveData.achievements || achievements;
    }
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    document.getElementById('themeButton').textContent = 
        document.body.classList.contains('light-theme') ? '☀️' : '🌙';
}

// Инициализация игры
window.addEventListener('load', init);