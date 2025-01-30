const gameState = {
    gold: 0,
    gps: 0,
    clickPower: 1,
    level: 1,
    experience: 0,
    achievements: [],
    upgrades: {
        miner: { price: 10, gps: 1, count: 0 },
        proMiner: { price: 50, gps: 5, count: 0 },
        clickUpgrade: { price: 20, power: 1, count: 0 },
        boost: { price: 100, multiplier: 2, duration: 30000, active: false }
    }
};

// Обновление интерфейса
function updateUI() {
    document.getElementById('gold').textContent = gameState.gold.toFixed(1);
    document.getElementById('gps').textContent = gameState.gps.toFixed(1);
    document.getElementById('clickPower').textContent = gameState.clickPower;
    document.getElementById('minerPrice').textContent = gameState.upgrades.miner.price.toFixed(1);
    document.getElementById('proMinerPrice').textContent = gameState.upgrades.proMiner.price.toFixed(1);
    document.getElementById('clickUpgradePrice').textContent = gameState.upgrades.clickUpgrade.price.toFixed(1);
    document.getElementById('boostPrice').textContent = gameState.upgrades.boost.price.toFixed(1);
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('experience').textContent = gameState.experience;

    // Обновляем доступность кнопок
    document.getElementById('buyMinerButton').disabled = gameState.gold < gameState.upgrades.miner.price;
    document.getElementById('buyProMinerButton').disabled = gameState.gold < gameState.upgrades.proMiner.price;
    document.getElementById('buyClickUpgradeButton').disabled = gameState.gold < gameState.upgrades.clickUpgrade.price;
    document.getElementById('buyBoostButton').disabled = gameState.gold < gameState.upgrades.boost.price;

    updateAchievements();
}

// Функция клика
document.getElementById('clickButton').addEventListener('click', () => {
    gameState.gold += gameState.clickPower;
    gameState.experience += 1; // Получаем опыт за клик
    checkAchievements('firstClick');
    updateUI();
});

// Функция покупки шахтера
document.getElementById('buyMinerButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.upgrades.miner.price) {
        gameState.gold -= gameState.upgrades.miner.price;
        gameState.upgrades.miner.count++;
        gameState.gps += gameState.upgrades.miner.gps;

        // Увеличиваем цену на шахтера
        gameState.upgrades.miner.price *= 1.15;
        checkAchievements('buyMiner');
        updateUI();
    }
});

// Функция покупки профессионального шахтера
document.getElementById('buyProMinerButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.upgrades.proMiner.price) {
        gameState.gold -= gameState.upgrades.proMiner.price;
        gameState.upgrades.proMiner.count++;
        gameState.gps += gameState.upgrades.proMiner.gps;

        // Увеличиваем цену на профессионального шахтера
        gameState.upgrades.proMiner.price *= 1.15;
        checkAchievements('buyProMiner');
        updateUI();
    }
});

// Функция покупки улучшения клика
document.getElementById('buyClickUpgradeButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.upgrades.clickUpgrade.price) {
        gameState.gold -= gameState.upgrades.clickUpgrade.price;
        gameState.clickPower += gameState.upgrades.clickUpgrade.power;

        // Увеличиваем цену улучшения клика
        gameState.upgrades.clickUpgrade.price *= 1.15;
        checkAchievements('buyClickUpgrade');
        updateUI();
    }
});

// Функция покупки буста
document.getElementById('buyBoostButton').addEventListener('click', () => {
    if (gameState.gold >= gameState.upgrades.boost.price) {
        gameState.gold -= gameState.upgrades.boost.price;
        applyBoost(gameState.upgrades.boost.multiplier, gameState.upgrades.boost.duration);
        updateUI();
    }
});

// Интервал обновления золота
setInterval(() => {
    gameState.gold += gameState.gps;
    updateUI();
}, 1000);

// Проверка достижений
function checkAchievements(achievement) {
    if (achievement === 'firstClick' && !gameState.achievements.includes('firstClick')) {
        gameState.achievements.push('firstClick');
        alert('Достижение разблокировано: Первый клик!');
    }
    if (achievement === 'buyMiner' && !gameState.achievements.includes('buyMiner')) {
        gameState.achievements.push('buyMiner');
        alert('Достижение разблокировано: Куплен шахтер!');
    }
    if (achievement === 'buyProMiner' && !gameState.achievements.includes('buyProMiner')) {
        gameState.achievements.push('buyProMiner');
        alert('Достижение разблокировано: Куплен профессиональный шахтер!');
    }
    if (achievement === 'buyClickUpgrade' && !gameState.achievements.includes('buyClickUpgrade')) {
        gameState.achievements.push('buyClickUpgrade');
        alert('Достижение разблокировано: Улучшена мощность клика!');
    }
}

// Обновление списка достижений
function updateAchievements() {
    const achievementList = document.getElementById('achievementList');
    achievementList.innerHTML = ''; // Очистить список достижений
    gameState.achievements.forEach(ach => {
        const li = document.createElement('li');
        li.textContent = ach.replace(/([A-Z])/g, ' $1').trim(); // Форматирование названия
        achievementList.appendChild(li);
    });
}

// Применение буста
function applyBoost(multiplier, duration) {
    gameState.gps *= multiplier; // Увеличиваем добычу золота в секунду
    setTimeout(() => {
        gameState.gps /= multiplier; // Возвращаем обратно после истечения времени
    }, duration);
}

// Загрузка состояния из Local Storage
function loadGame() {
    const savedGame = JSON.parse(localStorage.getItem('idleMinerGame'));
    if (savedGame) {
        Object.assign(gameState, savedGame);
        updateUI();
    }
}

// Сохранение состояния в Local Storage
function saveGame() {
    localStorage.setItem('idleMinerGame', JSON.stringify(gameState));
}

// Сохранение состояния игры при выходе
window.addEventListener('beforeunload', saveGame);

// Начальное обновление интерфейса
loadGame();
updateUI();