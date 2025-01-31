let score = 0;
let highScore = 0;
let level = 1;
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const levelDisplay = document.getElementById('level');
const clickButton = document.getElementById('clickButton');
const miniGameButton = document.getElementById('miniGameButton');
const themeButton = document.getElementById('themeButton');
const avatarSelect = document.getElementById('avatarSelect');
const leaderboardDisplay = document.createElement('div');
leaderboardDisplay.className = 'leaderboard';
document.querySelector('.container').appendChild(leaderboardDisplay);
let darkMode = false;
let miniGameActive = false;

clickButton.addEventListener('click', () => {
    score += level; // Очки зависят от уровня
    scoreDisplay.textContent = `Очки: ${score}`;

    // Переход на следующий уровень
    if (score >= level * 10) { // Увеличиваем уровень каждые 10 очков
        level++;
        levelDisplay.textContent = `Уровень: ${level}`;
        alert('Поздравляем! Вы достигли нового уровня!');
    }

    // Случайное событие
    randomEvent();
});

miniGameButton.addEventListener('click', () => {
    if (!miniGameActive) {
        startMiniGame();
    }
});

themeButton.addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
    themeButton.textContent = darkMode ? 'Светлая тема' : 'Темная тема';
});

avatarSelect.addEventListener('change', () => {
    console.log(`Выбран аватар: ${avatarSelect.value}`);
});

function startMiniGame() {
    miniGameActive = true;
    score = 0; // Сбросить очки для мини-игры
    scoreDisplay.textContent = 'Очки: 0';
    levelDisplay.style.display = 'none'; // Скрыть уровень

    // Таймер на 10 секунд
    let timeLeft = 10;
    const miniGameInterval = setInterval(() => {
        if (timeLeft > 0) {
            score++;
            scoreDisplay.textContent = `Очки: ${score}`;
            timeLeft--;
        } else {
            clearInterval(miniGameInterval);
            miniGameActive = false;
            levelDisplay.style.display = 'block';
            addToLeaderboard(`Игрок (${Date.now()})`, score); // Добавляем в таблицу лидеров
            updateLeaderboard();
            alert('Мини-игра окончена!');
        }
    }, 1000);
}

function addToLeaderboard(name, points) {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({ name, points });
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function updateLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.sort((a, b) => b.points - a.points);
    leaderboardDisplay.innerHTML = '<h2>Таблица лидеров</h2>';
    leaderboard.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = `${player.name}: ${player.points} очков`;
        leaderboardDisplay.appendChild(playerDiv);
    });
}

function randomEvent() {
    if (Math.random() < 0.1) { // 10% шанс на событие
        alert('Случайное событие! Плюс 5 очков!');
        score += 5;
    }
}

updateLeaderboard();