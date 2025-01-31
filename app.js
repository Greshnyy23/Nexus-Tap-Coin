document.addEventListener("DOMContentLoaded", () => {
    const $circle = document.querySelector('#circle');
    const $score = document.querySelector('#score');
    const $highScore = document.getElementById('highscore');
    const $levelDisplay = document.getElementById('levelDisplay');
    const $moneyDisplay = document.getElementById('moneyDisplay');
    const $upgradeButton = document.getElementById('upgradeButton');
    const $levelUpButton = document.getElementById('levelUpButton');
    const $timerDisplay = document.getElementById('timer');

    let score = 0;
    let level = 1;
    let money = 0; // Игровая валюта
    let upgradeActive = false;

    // Инициализация
    function initialize() {
        score = getScore();
        level = getLevel();
        money = getMoney();

        setScore(score);
        setHighScore(getHighScore());
        setLevel(level);
        updateMoneyDisplay();
        setImage();
    }

    // Сохранение данных
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

    function setLevel(newLevel) {
        level = newLevel;
        localStorage.setItem('level', level);
        $levelDisplay.textContent = `Уровень: ${level}`;
    }

    function getScore() {
        return Number(localStorage.getItem('score')) || 0;
    }

    function getHighScore() {
        return Number(localStorage.getItem('highscore')) || 0;
    }

    function getLevel() {
        return Number(localStorage.getItem('level')) || 1;
    }

    function getMoney() {
        return Number(localStorage.getItem('money')) || 0;
    }

    // Обновление валюты (монет)
    function updateMoneyDisplay() {
        $moneyDisplay.textContent = `Монеты: ${money}`;
    }

    // Добавление очков и валюты
    function addOne() {
        setScore(score + (upgradeActive ? 2 : 1)); // Учитывает активные улучшения для очков
        money += 1; // Каждое нажатие добавляет 1 монету
        updateMoneyDisplay(); // Обновляем отображение
    }

    function upgrade() {
        if (money >= 50) {
            upgradeActive = true;
            money -= 50;
            updateMoneyDisplay();
            alert('Двойные очки активированы!');

            setTimeout(() => {
                upgradeActive = false;
                alert('Двойные очки закончились!');
            }, 10000); // Действие длится 10 секунд
        } else {
            alert('Недостаточно монет для улучшения!');
        }
    }

    function levelUp() {
        if (money >= 100) {
            money -= 100;
            setLevel(level + 1);
            updateMoneyDisplay();
            alert('Уровень повышен!');
        } else {
            alert('Недостаточно монет для повышения уровня!');
        }
    }

    // Переключение персонажа
    function selectCharacter(character) {
        if (character === 'frog') {
            $circle.setAttribute('src', './assets/frog.png');
        } else if (character === 'lizzard') {
            $circle.setAttribute('src', './assets/lizzard.png');
        }
    }

    // Обработчики событий для кнопок выбора персонажей
    const frogButton = document.getElementById('frogButton');
    const lizzardButton = document.getElementById('lizzardButton');
    if (frogButton) {
        frogButton.addEventListener('click', () => selectCharacter('frog'));
    }
    if (lizzardButton) {
        lizzardButton.addEventListener('click', () => selectCharacter('lizzard'));
    }

    // Основная логика клика
    if ($circle) {
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
    }

    // Навигация
    const toImprovements = document.getElementById('toImprovements');
    const toStatistics = document.getElementById('toStatistics');
    const toMain = document.getElementById('toMain');

    if (toImprovements) {
        toImprovements.addEventListener('click', () => {
            navigateTo('improvements.html');
        });
    }

    if (toStatistics) {
        toStatistics.addEventListener('click', () => {
            navigateTo('statistics.html');
        });
    }

    if (toMain) {
        toMain.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }

    // Переключение страниц
    function navigateTo(page) {
        localStorage.setItem('score', score); // Сохраняем текущий счет при переходе
        localStorage.setItem('money', money); // Сохраняем текущую валюту
        localStorage.setItem('level', level); // Сохраняем текущий уровень
        window.location.href = page; // Переход на выбранную страницу
    }

    // Инициализация
    initialize(); 
});