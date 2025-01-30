// Данные игрока
const player = {
    health: 100,
    attack: 10,
    defense: 5,
    inventory: []
};

// Данные врага
const enemy = {
    health: 50,
    attack: 8,
    defense: 3
};

// Элементы интерфейса
const playerHealthElement = document.getElementById('player-health');
const enemyHealthElement = document.getElementById('enemy-health');
const playerHealthBar = document.getElementById('player-health-bar');
const enemyHealthBar = document.getElementById('enemy-health-bar');
const logElement = document.getElementById('log');
const playerImg = document.getElementById('player-img');
const enemyImg = document.getElementById('enemy-img');

// Звуковые эффекты
const attackSound = document.getElementById('attack-sound');
const defendSound = document.getElementById('defend-sound');
const victorySound = document.getElementById('victory-sound');
const defeatSound = document.getElementById('defeat-sound');

// Обновление статуса игры
function updateStatus() {
    playerHealthElement.textContent = player.health;
    enemyHealthElement.textContent = enemy.health;
    playerHealthBar.style.width = `${player.health}%`;
    enemyHealthBar.style.width = `${enemy.health}%`;
}

// Логирование событий
function addLog(message) {
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logElement.appendChild(logEntry);
    logElement.scrollTop = logElement.scrollHeight; // Автопрокрутка
}

// Атака игрока
function attack() {
    const damage = Math.max(0, player.attack - enemy.defense);
    enemy.health -= damage;
    addLog(`Вы атаковали врага и нанесли ${damage} урона!`);
    updateStatus();

    // Анимация и звук атаки
    enemyImg.classList.add('shake');
    attackSound.play();
    setTimeout(() => enemyImg.classList.remove('shake'), 500);

    if (enemy.health <= 0) {
        addLog("Вы победили врага!");
        victorySound.play();
        resetEnemy();
    } else {
        enemyAttack();
    }
}

// Атака врага
function enemyAttack() {
    const damage = Math.max(0, enemy.attack - player.defense);
    player.health -= damage;
    addLog(`Враг атаковал вас и нанес ${damage} урона!`);
    updateStatus();

    // Анимация и звук атаки
    playerImg.classList.add('shake');
    attackSound.play();
    setTimeout(() => playerImg.classList.remove('shake'), 500);

    if (player.health <= 0) {
        addLog("Вы проиграли!");
        defeatSound.play();
    }
}

// Защита игрока
function defend() {
    player.health += player.defense;
    addLog(`Вы защитились и восстановили ${player.defense} здоровья.`);
    updateStatus();

    // Анимация и звук защиты
    playerImg.classList.add('blink');
    defendSound.play();
    setTimeout(() => playerImg.classList.remove('blink'), 500);

    enemyAttack();
}

// Показать инвентарь
function showInventory() {
    const items = player.inventory.length > 0 ? player.inventory.join(", ") : "пусто";
    addLog(`Ваш инвентарь: ${items}`);
}

// Сброс врага
function resetEnemy() {
    enemy.health = 50;
    updateStatus();
}

// Назначение обработчиков кнопок
document.getElementById('attack-btn').addEventListener('click', attack);
document.getElementById('defend-btn').addEventListener('click', defend);
document.getElementById('inventory-btn').addEventListener('click', showInventory);

// Инициализация игры
updateStatus();
addLog("Игра началась! Выберите действие.");
