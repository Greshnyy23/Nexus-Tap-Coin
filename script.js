let resources = 0;
let level = 1;
let upgradeCost = 0;
let miningRate = 1; // Количество ресурсов за клик
let autoMineInterval;

// Загружаем данные из localStorage
function loadGame() {
    const savedResources = localStorage.getItem('resources');
    const savedLevel = localStorage.getItem('level');
    const savedUpgradeCost = localStorage.getItem('upgradeCost');
    const savedMiningRate = localStorage.getItem('miningRate');

    if (savedResources) resources = parseInt(savedResources);
    if (savedLevel) level = parseInt(savedLevel);
    if (savedUpgradeCost) upgradeCost = parseInt(savedUpgradeCost);
    if (savedMiningRate) miningRate = parseInt(savedMiningRate);

    updateResourceCount();
    document.getElementById('level').innerText = level;
    document.getElementById('upgradeButton').innerText = `Улучшить (${upgradeCost})`;
}

// Сохраняем данные в localStorage
function saveGame() {
    localStorage.setItem('resources', resources);
    localStorage.setItem('level', level);
    localStorage.setItem('upgradeCost', upgradeCost);
    localStorage.setItem('miningRate', miningRate);
}

document.getElementById('mineButton').addEventListener('click', () => {
    resources += miningRate;
    updateResourceCount();
    checkAchievements();
    saveGame();
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
        saveGame();
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
        saveGame();
    }, 2000); // Каждые 2 секунд
}

// Очищаем интервал при выгрузке страницы
window.addEventListener('beforeunload', () => {
    saveGame();
    clearInterval(autoMineInterval);
});

// Функция для переключения между вкладками
function openTab(evt, tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabName).style.display = 'block';
    evt.currentTarget.classList.add('active');
}

// Открыть вкладку "Добыча" по умолчанию при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadGame();
    openTab(event, 'mineTab');
});

// Автообновление интерфейса каждую секунду
setInterval(() => {
    updateResourceCount();
}, 100);
