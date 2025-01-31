let score = 0;
let baseClickPower = 1;
let autoClickers = 0;
let multipliers = { critical: 1, timeBoost: 1, goldenClick: 1 };

const upgrades = [
    { name: 'Усиленный клик', price: 50, power: 1, type: 'click', owned: 0, max: 20 },
    { name: 'Автокликер', price: 100, power: 1, type: 'auto', owned: 0, max: 50 },
    { name: 'Критический удар (10%)', price: 500, power: 0.1, type: 'critical', owned: 0, max: 5 },
    { name: 'Золотой клик', price: 1000, power: 5, type: 'golden', owned: 0, max: 1 },
    { name: 'Ускорение времени', price: 2000, power: 2, type: 'boost', duration: 30, owned: 0, max: 3 },
    { name: 'Множитель x2', price: 5000, power: 2, type: 'multiplier', owned: 0, max: 1 },
    { name: 'Цепная реакция', price: 10000, power: 0.5, type: 'chain', owned: 0, max: 5 }
];

function calculateTotalClickPower() {
    let total = baseClickPower;
    total += upgrades.filter(u => u.type === 'click').reduce((sum, u) => sum + (u.power * u.owned), 0);
    const multiplier = upgrades.filter(u => u.type === 'multiplier').reduce((sum, u) => sum * (u.power ** u.owned), 1);
    const criticalMultiplier = 1 + upgrades.filter(u => u.type === 'critical').reduce((sum, u) => sum + (u.power * u.owned), 0);
    const chainMultiplier = 1 + upgrades.filter(u => u.type === 'chain').reduce((sum, u) => sum + (u.power * u.owned), 0);
    return total * multiplier * chainMultiplier * criticalMultiplier * multipliers.timeBoost * multipliers.goldenClick;
}

function buyUpgrade(index) {
    const upgrade = upgrades[index];
    if (score >= upgrade.price && upgrade.owned < upgrade.max) {
        score -= upgrade.price;
        upgrade.owned++;
        switch(upgrade.type) {
            case 'auto':
                autoClickers += upgrade.power;
                break;
            case 'boost':
                activateBoost(upgrade);
                break;
            case 'golden':
                setupGoldenClick();
                break;
        }
        upgrade.price = Math.floor(upgrade.price * 1.5);
        saveGame();
        updateUI();
        return true;
    }
    return false;
}

document.getElementById('clickButton').addEventListener('click', (e) => {
    let clickValue = calculateTotalClickPower();
    const criticalChance = upgrades.filter(u => u.type === 'critical').reduce((sum, u) => sum + (u.power * u.owned), 0);
    if (Math.random() < criticalChance) {
        clickValue *= 2;
        showCriticalEffect(e);
    }
    score += clickValue;
    updateUI();
    saveGame();
    showClickEffect(e, clickValue);
});

function showClickEffect(event, value) {
    const effect = document.createElement('div');
    effect.className = 'floating-text';
    effect.textContent = `+${Math.floor(value)}`;
    effect.style.left = `${event.clientX}px`;
    effect.style.top = `${event.clientY}px`;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

function showCriticalEffect(event) {
    const effect = document.createElement('div');
    effect.className = 'floating-text critical-text';
    effect.textContent = 'CRITICAL!';
    effect.style.left = `${event.clientX}px`;
    effect.style.top = `${event.clientY}px`;
    document.body.appendChild(effect);
    setTimeout(() => effect.remove(), 1500);
}

function activateBoost(upgrade) {
    // Логика активации улучшения времени
}

function setupGoldenClick() {
    // Логика настройки золотого клика
}

function saveGame() {
    const data = {
        score,
        baseClickPower,
        autoClickers,
        multipliers,
        upgrades: upgrades.map(upgrade => ({
            owned: upgrade.owned,
            price: upgrade.price
        }))
    };
    localStorage.setItem('clickerSave', JSON.stringify(data));
}

function loadGame() {
    const saved = localStorage.getItem('clickerSave');
    if (saved) {
        const data = JSON.parse(saved);
        score = data.score || 0;
        baseClickPower = data.baseClickPower || 1;
        autoClickers = data.autoClickers || 0;
        multipliers = data.multipliers || { critical: 1, timeBoost: 1, goldenClick: 1 };
        upgrades.forEach((upgrade, index) => {
            if (data.upgrades && data.upgrades[index]) {
                upgrade.owned = data.upgrades[index].owned || 0;
                upgrade.price = data.upgrades[index].price || upgrade.price;
            }
        });
    }
    updateUI();
}

function updateUI() {
    document.getElementById('score').textContent = Math.floor(score);
    document.getElementById('clickPower').textContent = `Сила клика: ${calculateTotalClickPower()}`;
    document.getElementById('autoClickers').textContent = `Автокликеры: ${autoClickers}`;

    const upgradesDiv = document.getElementById('upgrades');
    upgradesDiv.innerHTML = upgrades.map((upgrade, index) => `
        <div class="upgrade">
            <div>
                <h3>${upgrade.name}</h3>
                <p>${getUpgradeDescription(upgrade)}</p>
                <p>Цена: ${Math.floor(upgrade.price)}</p>
                <p>Куплено: ${upgrade.owned}/${upgrade.max}</p>
            </div>
            <button onclick="buyUpgrade(${index})" ${score < upgrade.price || upgrade.owned >= upgrade.max ? 'disabled' : ''}>
                Купить
            </button>
        </div>
    `).join('');
}

function getUpgradeDescription(upgrade) {
    switch (upgrade.type) {
        case 'critical': return `Шанс: +${upgrade.power * 100}%`;
        case 'golden': return `Множитель: x${upgrade.power}`;
        case 'boost': return `Длительность: ${upgrade.duration}с`;
        default: return `Сила: +${upgrade.power}`;
    }
}

function init() {
    loadGame();
    updateUI();
}

init();