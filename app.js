const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $levelDisplay = document.getElementById('levelDisplay');
const $moneyDisplay = document.getElementById('moneyDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $timerDisplay = document.getElementById('timer');
const $achievementList = document.getElementById('achievementList');

let score = 0;
let level = 1;
let money = 0; // Внутриигровая валюта
let upgradeActive = false;

// Переключение между страницами
function navigateTo(page) {
    window.location.href = page;
}

// Сохранение данных
function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    if ($score) $score.textContent = score;
}

function setHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('highscore', score);
        if ($highScore) $highScore.textContent = score;
    }
}

function getHighScore() {
    return Number(localStorage.getItem('highscore')) || 0;
}

// Навигация
document.getElementById('toImprovements').addEventListener('click', () => {
    navigateTo('improvements.html');
});

document.getElementById('toStatistics').addEventListener('click', () => {
    navigateTo('statistics.html');
});

document.getElementById('toMain').addEventListener('click', () => {
    navigateTo('index.html');
});

// Основной игровой код
if ($circle) {
    $circle.addEventListener('click', (event) => {
        // Игровая логика чата идет сюда...
    });

    function addOne() {
        setScore(score + (upgradeActive ? 2 : 1));
        money += 1; // Каждое нажатие добавляет 1 монету
        if ($moneyDisplay) $moneyDisplay.textContent = `Монеты: ${money}`;
    }
}

// Инициализация
if (document.getElementById('score')) setScore(0);
if ($highScore) $highScore.textContent = getHighScore();