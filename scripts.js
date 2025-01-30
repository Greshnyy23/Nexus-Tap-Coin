let gameState = {
    gold: 0,
    gps: 0,
    clickPower: 1,
    level: 1,
    experience: 0,
    updates: {
        miner: { price: 10, gps: 1, count: 0 },
        proMiner: { price: 50, gps: 5, count: 0 },
        clickUpgrade: { price: 20, power: 1, count: 0 },
        boost: { price: 100, multiplier: 2, duration: 30000, active: false }
    },
    achievements: []
};

// Функция для обновления интерфейса
function updateUI() {
    document.getElementById('gold').textContent = gameState.gold.toFixed(1);
    document.getElementById('gps').textContent = gameState.gps.toFixed(1);
    document.getElementById('clickPower').textContent = gameState.clickPower;
    document.getElementById('experience').textContent = gameState.experience;
    document.getElementById('level').textContent = gameState.level;

    // Обновить цены
    document.getElementById('minerPrice').textContent = gameState.updates.miner.price.toFixed(1);
    document.getElementById('proMinerPrice').textContent = gameState.updates.proMiner.price.toFixed(1);
    document.getElementById('clickUpgradePrice').textContent = gameState.updates.clickUpgrade.price.toFixed(1);
    document.getElementById('boostPrice').textContent = gameState.updates.boost.price.toFixed(1);
    
    // Обновление кнопок
    document.getElementById('buyMinerButton').disabled = gameState.gold < gameState.updates.miner.price;
    document.getElementById('buyProMinerButton').disabled = gameState.gold < gameState.updates.proMiner.price;
    document.getElementById('buyClickUpgradeButton').disabled = gameState.gold < gameState.updates.clickUpgrade.price;
    document.getElementById('buyBoostButton').disabled = gameState.gold < gameState.updates.boost.price;

    updateAchievements();
}

// Функция клика
document.getElementById('clickButton').addEventListener('click', () => {
    gameState.gold += gameState.clickPower;
    gameState.experience += 1; // Добавляем опыт за клик
    updateUI();
});

// Функция покупки шахтера
document.getElementById('buyMinerButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.updates.miner.price) {
        gameState.gold -= gameState.updates.miner.price;
        gameState.updates.miner.count++;
        gameState.gps += gameState.updates.miner.gps;
        gameState.updates.miner.price *= 1.15; // Увеличиваем цену шахтера
        updateUI();
    }
});

// Функция покупки профессионального шахтера
document.getElementById('buyProMinerButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.updates.proMiner.price) {
        gameState.gold -= gameState.updates.proMiner.price;
        gameState.updates.proMiner.count++;
        gameState.gps += gameState.updates.proMiner.gps;
        gameState.updates.proMiner.price *= 1.15; // Увеличиваем цену профессионального шахтера
        updateUI();
    }
});

// Функция покупки улучшения клика
document.getElementById('buyClickUpgradeButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.updates.clickUpgrade.price) {
        gameState.gold -= gameState.updates.clickUpgrade.price;
        gameState.clickPower += gameState.updates.clickUpgrade.power; // Увеличиваем мощность клика
        gameState.updates.clickUpgrade.price *= 1.15; // Увеличиваем цену улучшения
        updateUI();
    }
});

// Функция покупки буста
document.getElementById('buyBoostButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.updates.boost.price) {
        gameState.gold -= gameState.updates.boost.price;
        applyBoost(gameState.updates.boost.multiplier, gameState.updates.boost.duration);
        updateUI();
    }
});

// Интервал обновления золота
setInterval(() => {
    gameState.gold += gameState.gps;
    updateUI();
}, 1000);

// Применение буста
function applyBoost(multiplier, duration) {
    gameState.gps *= multiplier; // Увеличиваем добычу золота в секунду
    setTimeout(() => {
        gameState.gps /= multiplier; // Возвращаем обратно после истечения времени
    }, duration);
}

// Обновление достижений
function updateAchievements() {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = ''; // Очистка списка достижений
    gameState.achievements.forEach(ach => {
        const li = document.createElement('li');
        li.textContent = ach;
        achievementList.appendChild(li);
    });
}

// Начальное обновление интерфейса
updateUI();