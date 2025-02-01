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

const achievements = [
    { id: 1, name: 'Первые шаги', desc: 'Заработайте 100 монет', goal: 100, unlocked: false },
    { id: 2, name: 'Автоматизация', desc: 'Купите авто-кликер', goal: 1, unlocked: false },
    { id: 3, name: 'Критик', desc: 'Достигните 20% шанса крита', goal: 20, unlocked: false }
];

// Инициализация игры
function init() {
    loadGame();
    setupEventListeners();
    renderAchievements();
    updateDisplay();
    startAutoClicker();
}

function setupEventListeners() {
    // Клик по основной кнопке
    document.getElementById('clickArea').addEventListener('click', handleClick);
    
    // Кнопки улучшений
    document.getElementById('buyClickPower').addEventListener('click', buyClickPower);
    document.getElementById('buyAutoClick').addEventListener('click', buyAutoClick);
    document.getElementById('buyCritical').addEventListener('click', buyCritical);
    
    // Вкладки
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });
    
    // Сброс прогресса
    document.getElementById('resetProgress').addEventListener('click', resetProgress);
    
    // Мини-игра
    document.getElementById('minigameArea').addEventListener('click', handleMinigameClick);
}

function handleClick() {
    addMoney(clickPower * multiplier);
    createClickEffect(event);
}

// Система улучшений
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

function startAutoClicker() {
    if (autoClickInterval) clearInterval(autoClickInterval);
    autoClickInterval = setInterval(() => {
        addMoney(clickPower * autoClickLevel);
    }, 1000);
}

// Система достижений
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

// Сохранение/загрузка
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
        money = saveData.money;
        clickPower = saveData.clickPower;
        autoClickLevel = saveData.autoClickLevel;
        criticalChance = saveData.criticalChance;
        upgrades.clickPower.cost = saveData.upgrades.clickPower.cost;
        upgrades.autoClick.cost = saveData.upgrades.autoClick.cost;
        upgrades.critical.cost = saveData.upgrades.critical.cost;
        achievements = saveData.achievements;
    }
}

// Мини-игра
function handleMinigameClick(event) {
    if (event.target.classList.contains('falling-object')) {
        minigameScore++;
        elements.minigameScore.textContent = `Счет: ${minigameScore}`;
        event.target.remove();
    }
}

// Вспомогательные функции
function updateDisplay() {
    elements.money.textContent = money;
    elements.clickPowerValue.textContent = clickPower;
    elements.clickPowerCost.textContent = upgrades.clickPower.cost;
    elements.autoClickLevel.textContent = autoClickLevel;
    elements.autoClickCost.textContent = upgrades.autoClick.cost;
    elements.criticalChance.textContent = `${criticalChance}%`;
    elements.criticalCost.textContent = upgrades.critical.cost;
}

function createClickEffect(event) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.style.left = `${event.offsetX - 15}px`;
    effect.style.top = `${event.offsetY - 15}px`;
    document.getElementById('clickArea').appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

// Запуск игры
window.addEventListener('load', init);
