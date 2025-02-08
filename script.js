let resources = 0;
let level = 1;
let upgradeCost = 0;
let miningRate = 1; // Количество ресурсов за клик
let autoMineInterval;

document.getElementById('mineButton').addEventListener('click', () => {
    resources += miningRate;
    updateResourceCount();
    checkAchievements();
});

document.getElementById('upgradeButton').addEventListener('click', () => {
    if (resources >= upgradeCost) {
        resources -= upgradeCost;
        miningRate++;
        level++;
        upgradeCost = Math.ceil(level * 10); // Обновление стоимости улучшения
        document.getElementById('upgradeButton').innerText = `Улучшить (${upgradeCost})`;
        updateResourceCount();
        document.getElementById('level').innerText = level;

        // Начнем автоматическую добычу после улучшения
        if (!autoMineInterval) {
            startAutoMine();
        }
    } else {
        alert('Недостаточно ресурсов для улучшения!');
    }
});

function updateResourceCount() {
    document.getElementById('resourceCount').innerText = resources;
}

function checkAchievements() {
    const achievementList = document.getElementById('achievementList');
    if (resources === 10) {
        achievementList.innerText = "Достигнуто: 10 ресурсов";
    } else if (resources === 50) {
        achievementList.innerText = "Достигнуто: 50 ресурсов";
    } else if (resources === 100) {
        achievementList.innerText = "Достигнуто: 100 ресурсов";
    }
}

function startAutoMine() {
    autoMineInterval = setInterval(() => {
        resources += miningRate;
        updateResourceCount();
        checkAchievements();
    }, 5000); // Каждые 5 секунд
}

// Очищаем интервал при выгрузке страницы
window.addEventListener('beforeunload', () => {
    clearInterval(autoMineInterval);
});
