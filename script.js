let resources = 0;
let level = 1;
let upgradeCost = 0;
let miningRate = 1; // Количество ресурсов за клик
let autoMineInterval;
let autoMineRate = 0;  // Ресурсы, получаемые автоматически
let clickMultiplier = 1; // Множитель для клика
let magnetActive = false;
let magnetDuration = 0; // Время активации магнита в секундах
let autoMineCost = 100; // Стоимость автодобычи
let multiplierCost = 200; // Стоимость множителя
let magnetCost = 500; // Стоимость магнита

// Загружаем данные из localStorage
function loadGame() {
    const savedResources = localStorage.getItem('resources');
    const savedLevel = localStorage.getItem('level');
    const savedUpgradeCost = localStorage.getItem('upgradeCost');
    const savedMiningRate = localStorage.getItem('miningRate');
    const savedAutoMineRate = localStorage.getItem('autoMineRate');
    const savedClickMultiplier = localStorage.getItem('clickMultiplier');
    
    if (savedResources) resources = parseInt(savedResources);
    if (savedLevel) level = parseInt(savedLevel);
    if (savedUpgradeCost) upgradeCost = parseInt(savedUpgradeCost);
    if (savedMiningRate) miningRate = parseInt(savedMiningRate);
    if (savedAutoMineRate) autoMineRate = parseInt(savedAutoMineRate);
    if (savedClickMultiplier) clickMultiplier = parseFloat(savedClickMultiplier);

    updateResourceCount();
    document.getElementById('level').innerText = level;
    document.getElementById('upgradeButton').innerText = `Улучшить (${upgradeCost})`;
    document.getElementById('autoMineButton').innerText = `Автовыработка (${autoMineCost})`;
    document.getElementById('multiplierButton').innerText = `Увеличить клик (${multiplierCost})`;
    document.getElementById('magnetButton').innerText = `Магнит (${magnetCost})`;
}

// Сохраняем данные в localStorage
function saveGame() {
    localStorage.setItem('resources', resources);
    localStorage.setItem('level', level);
    localStorage.setItem('upgradeCost', upgradeCost);
    localStorage.setItem('miningRate', miningRate);
    localStorage.setItem('autoMineRate', autoMineRate);
    localStorage.setItem('clickMultiplier', clickMultiplier);
}

document.getElementById('mineButton').addEventListener('click', () => {
    resources += miningRate * clickMultiplier;
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

// Автовыработка
document.getElementById('autoMineButton').addEventListener('click', () => {
    if (resources >= autoMineCost) {
        resources -= autoMineCost;
        autoMineRate += 1; // Увеличиваем скорость автодобычи
        autoMineCost = Math.ceil(autoMineCost * 1.5); // Увеличиваем цену
        document.getElementById('autoMineButton').innerText = `Автовыработка (${autoMineCost})`;
        updateResourceCount();
        saveGame();
        
        // Запускаем автодобычу, если она ещё не запущена
        if (!autoMineInterval) {
            startAutoMine();
        }
    } else {
        alert('Недостаточно ресурсов для автодобычи!');
    }
});

// Увеличение клика
document.getElementById('multiplierButton').addEventListener('click', () => {
    if (resources >= multiplierCost) {
        resources -= multiplierCost;
        clickMultiplier++;
        multiplierCost = Math.ceil(multiplierCost * 1.5); // Увеличиваем цену
        document.getElementById('multiplierButton').innerText = `Увеличить клик (${multiplierCost})`;
        updateResourceCount();
        saveGame();
    } else {
        alert('Недостаточно ресурсов для увеличения клика!');
    }
});

// Магнит
document.getElementById('magnetButton').addEventListener('click', () => {
    if (resources >= magnetCost) {
        resources -= magnetCost;
        magnetActive = true;
        magnetDuration = 10; // Активируем магнит на 10 секунд
        document.getElementById('magnetButton').style.display = 'none'; // Скрыть кнопку
        updateResourceCount();
        saveGame();

        // Сброс активности магнита через 10 секунд
        setTimeout(() => {
            magnetActive = false;
            document.getElementById('magnetButton').style.display = 'inline-block'; // Показать кнопку назад
        }, magnetDuration * 1000);
    } else {
        alert('Недостаточно ресурсов для магнита!');
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
        resources += autoMineRate;
        updateResourceCount();
        checkAchievements();
        saveGame();
    }, 2500); // Каждые 2.5 секунд
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
