// Инициализация игры
let money = 0;
let clickPower = 1;
let autoClickLevel = 0;
let criticalChance = 5;
let multiplier = 1;
let minigameScore = 0;

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

// Элементы интерфейса
const elements = {
    money: document.getElementById('money'),
    clickPowerValue: document.getElementById('clickPowerValue'),
    clickPowerCost: document.getElementById('clickPowerCost'),
    autoClickLevel: document.getElementById('autoClickLevel'),
    autoClickCost: document.getElementById('autoClickCost'),
    criticalChance: document.getElementById('criticalChance'),
    criticalCost: document.getElementById('criticalCost'),
    minigameScore: document.getElementById('minigameScore')
};

// Инициализация частиц
particlesJS('particles-js', {
    particles: {
        number: { value: 80 },
        color: { value: '#00ffaa' },
        opacity: { value: 0.5 },
        size: { value: 3 },
        move: { enable: true, speed: 2 }
    }
});

// Основные функции
function updateDisplay() {
    elements.money.textContent = money;
    elements.clickPowerValue.textContent = clickPower;
    elements.clickPowerCost.textContent = upgrades.clickPower.cost;
    elements.autoClickLevel.textContent = autoClickLevel;
    elements.autoClickCost.textContent = upgrades.autoClick.cost;
    elements.criticalChance.textContent = `${criticalChance}%`;
    elements.criticalCost.textContent = upgrades.critical.cost;
}

function addMoney(amount) {
    const isCritical = Math.random() < criticalChance / 100;
    const finalAmount = isCritical ? amount * 2 : amount;
    money += finalAmount;
    
    showNotification(isCritical ? `Критический удар! +${finalAmount}` : `+${finalAmount}`, 
                    isCritical ? 'critical' : 'success');
    updateDisplay();
    checkAchievements();
}

// Обработчики событий
document.getElementById('clickArea').addEventListener('click', () => {
    addMoney(clickPower * multiplier);
    animateClick();
});

document.getElementById('buyClickPower').addEventListener('click', () => {
    if (money >= upgrades.clickPower.cost) {
        money -= upgrades.clickPower.cost;
        clickPower++;
        upgrades.clickPower.cost = Math.floor(upgrades.clickPower.baseCost * 1.15);
        updateDisplay();
    }
});

// Система достижений
function checkAchievements() {
    achievements.forEach(ach => {
        if (!ach.unlocked) {
            if ((ach.id === 1 && money >= ach.goal) ||
                (ach.id === 2 && autoClickLevel >= ach.goal) ||
                (ach.id === 3 && criticalChance >= ach.goal)) {
                unlockAchievement(ach);
            }
        }
    });
}

function unlockAchievement(achievement) {
    achievement.unlocked = true;
    showNotification(`Достижение: ${achievement.name}`, 'achievement');
    renderAchievements();
}

// Мини-игра
let fallingObjectInterval;
document.querySelector('[data-tab="minigame"]').addEventListener('click', startMinigame);

function startMinigame() {
    minigameScore = 0;
    elements.minigameScore.textContent = 'Счет: 0';
    
    fallingObjectInterval = setInterval(() => {
        const object = document.createElement('div');
        object.className = 'falling-object';
        object.style.left = `${Math.random() * 90}%`;
        document.getElementById('minigameArea').appendChild(object);
        
        setTimeout(() => {
            object.remove();
        }, 2000);
    }, 1000);
}

// Сохранение и загрузка
function saveGame() {
    localStorage.setItem('save', JSON.stringify({
        money,
        clickPower,
        autoClickLevel,
        criticalChance,
        upgrades,
        achievements
    }));
}

function loadGame() {
    const save = JSON.parse(localStorage.getItem('save'));
    if (save) {
        money = save.money;
        clickPower = save.clickPower;
        autoClickLevel = save.autoClickLevel;
        criticalChance = save.criticalChance;
        upgrades = save.upgrades;
        achievements = save.achievements;
        updateDisplay();
    }
}

// Запуск игры
window.addEventListener('load', () => {
    loadGame();
    setInterval(saveGame, 30000);
    updateDisplay();
});