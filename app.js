const $circle = document.querySelector('#circle');
const $score = document.querySelector('#score');
const $highScore = document.getElementById('highscore');
const $upgradeButton = document.getElementById('upgradeButton');

let upgradeCost = 50; // Стоимость улучшения

function start() {
    setScore(getScore());
    setHighScore(getHighScore());
    setImage();
}

function setScore(score) {
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
    if (getScore() >= 50) {
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
    setScore(getScore() + 1);
    setHighScore(getScore());
    setImage();
}

function upgrade() {
    if (getScore() >= upgradeCost) {
        setScore(getScore() - upgradeCost);
        upgradeCost *= 2; // Увеличиваем стоимость улучшения
        $upgradeButton.textContent = `Улучшить (${upgradeCost} монет)`; // Обновляем текст кнопки
    } else {
        alert('Недостаточно монет для улучшения!');
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

// Обработчик события для кнопки улучшения
$upgradeButton.addEventListener('click', upgrade);

start();