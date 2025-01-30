let gold = 0;
let goldPerSecond = 0;
let clickPower = 1;
let level = 1;
let experience = 0;
let isBoostActive = false;

const goldElement = document.getElementById('gold');
const gpsElement = document.getElementById('gps');
const clickPowerElement = document.getElementById('clickPower');
const levelElement = document.getElementById('level');
const experienceElement = document.getElementById('experience');

const clickButton = document.getElementById('clickButton');
const buyMinerButton = document.getElementById('buyMinerButton');
const buyProMinerButton = document.getElementById('buyProMinerButton');
const buyClickUpgradeButton = document.getElementById('buyClickUpgradeButton');
const buyBoostButton = document.getElementById('buyBoostButton');
const achievementList = document.getElementById('achievementList');

// Обновление статистики
function updateStats() {
    goldElement.textContent = gold;
    gpsElement.textContent = goldPerSecond;
    clickPowerElement.textContent = clickPower;
    levelElement.textContent = level;
    experienceElement.textContent = experience;
}

// Проверка уровня
function checkLevelUp() {
    if (experience >= level * 10) {
        level++;
        experience = 0;
        alert(`Вы достигли уровня ${level}!`);
        checkAchievements();
    }
}

// Проверка достижений
function checkAchievements() {
    const achievements = [
        { condition: level >= 5, text: "Достигнут 5 уровень!" },
        { condition: gold >= 1000, text: "Добыто 1000 золота!" },
        { condition: goldPerSecond >= 10, text: "10 золота в секунду!" },
    ];

    achievements.forEach(achievement => {
        if (achievement.condition && !achievementList.querySelector(`li:contains("${achievement.text}")`)) {
            const li = document.createElement('li');
            li.textContent = achievement.text;
            achievementList.appendChild(li);
        }
    });
}

// Клик по кнопке добычи золота
clickButton.addEventListener('click', () => {
    gold += clickPower * (isBoostActive ? 2 : 1);
    experience += clickPower;
    updateStats();
    checkLevelUp();
});

// Покупка шахтера
buyMinerButton.addEventListener('click', () => {
    const minerPrice = parseInt(document.getElementById('minerPrice').textContent);
    if (gold >= minerPrice) {
        gold -= minerPrice;
        goldPerSecond += 1;
        updateStats();
    } else {
        alert('Недостаточно золота!');
    }
});

// Покупка профессионального шахтера
buyProMinerButton.addEventListener('click', () => {
    const proMinerPrice = parseInt(document.getElementById('proMinerPrice').textContent);
    if (gold >= proMinerPrice) {
        gold -= proMinerPrice;
        goldPerSecond += 5;
        updateStats();
    } else {
        alert('Недостаточно золота!');
    }
});

// Покупка улучшения клика
buyClickUpgradeButton.addEventListener('click', () => {
    const clickUpgradePrice = parseInt(document.getElementById('clickUpgradePrice').textContent);
    if (gold >= clickUpgradePrice) {
        gold -= clickUpgradePrice;
        clickPower += 1;
        updateStats();
    } else {
        alert('Недостаточно золота!');
    }
});

// Покупка буста
buyBoostButton.addEventListener('click', () => {
    const boostPrice = parseInt(document.getElementById('boostPrice').textContent);
    if (gold >= boostPrice) {
        gold -= boostPrice;
        isBoostActive = true;
        setTimeout(() => {
            isBoostActive = false;
            alert('Буст добычи закончился!');
        }, 30000);
        updateStats();
    } else {
        alert('Недостаточно золота!');
    }
});

// Автоматическая добыча золота
setInterval(() => {
    gold += goldPerSecond * (isBoostActive ? 2 : 1);
    updateStats();
}, 1000);