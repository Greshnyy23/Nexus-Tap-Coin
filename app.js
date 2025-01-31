const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $levelDisplay = document.getElementById('levelDisplay');
const $upgradeButton = document.getElementById('upgradeButton');
const $levelUpButton = document.getElementById('levelUpButton');
const $timerDisplay = document.getElementById('timer');

let score = 0;
let level = 1;
let upgradeActive = false;
let timer = 10;
let timerInterval;

function start() {
    setScore(getScore());
    setHighScore(getHighScore());
    setImage();
    startTimer();
}

function setScore(newScore) {
    score = newScore;
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function setHighScore(score) {
    const currentHighScore = getHighScore();
    if (score > currentHighScore) {
        localStorage.setItem('highscore', score);
        $highScore.textContent = score;
    }
}

function setImage() {
    if (score >= 50) {
        $circle.setAttribute('src', './assets/lizzard.png');
    }
}

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function getHighScore() {
    return Number(localStorage.getItem('highscore')) || 0;
}

function addOne() {
    setScore(score + (upgradeActive ? 2 : 1));
    setHighScore(getScore());
    setImage();
}

function upgrade() {
    if (getScore() >= 50) {
        upgradeActive = true;
        setScore(getScore() - 50);
        $upgradeButton.disabled = true; // Отключить кнопку
        setTimeout(() => {
            upgradeActive = false;
            $upgradeButton.disabled = false; // Включить кнопку обратно
        }, 10000); // Действие длится 10 секунд
    } else {
        alert('Недостаточно монет для улучшения!');
    }
}

function levelUp() {
    if (getScore() >= 100) {
        setScore(getScore() - 100);
        level++;
        $levelDisplay.textContent = `Уровень: ${level}`;
        $levelUpButton.disabled = true; // Отключить кнопку
        setTimeout(() => {
            $levelUpButton.disabled = false; // Включить кнопку обратно
        }, 10000); // Действие длится 10 секунд
    } else {
        alert('Недостаточно монет для повышения уровня!');
    }
}

$circle.addEventListener('click', (event) => {
    const rect = $circle.getBoundingClientRect();

    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;

    const DEG = 40;
    const tiltX = (offsetY / rect.height) * DEG;
    const tiltY = (offsetX / rect.width) * -DEG;

    $circle.style.setProperty('--tiltX', `${tiltX}deg`);
    $circle.style.setProperty('--tiltY', `${tiltY}deg`);

    setTimeout(() => {
        $circle.style.setProperty('--tiltX', `0deg`);
        $circle.style.setProperty('--tiltY', `0deg`);
    }, 300);

    const plusOne = document.createElement('div');
    plusOne.classList.add('plus-one');
    plusOne.textContent = '+1';
    plusOne.style.left = `${event.clientX - rect.left}px`;
    plusOne.style.top = `${event.clientY - rect.top}px`;

    $circle.parentElement.appendChild(plusOne);

    addOne();

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

// Обработчики событий
$upgradeButton.addEventListener('click', upgrade);
$levelUpButton.addEventListener('click', levelUp);

// Таймер
function startTimer() {
    $timerDisplay.textContent = `Время: ${timer}`;
    timerInterval = setInterval(() => {
        timer--;
        $timerDisplay.textContent = `Время: ${timer}`;
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            alert('Время вышло! Ваш результат: ' + score);
            resetGame(); // Сбросить игру
        }
    }, 1000);
}

function resetGame() {
    setScore(0);
    level = 1;
    $levelDisplay.textContent = `Уровень: ${level}`;
    timer = 10;
    startTimer();
}

// Инициализация
start();