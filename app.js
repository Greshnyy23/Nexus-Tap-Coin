document.addEventListener("DOMContentLoaded", () => {
    // Получаем элементы
    const $circle = document.querySelector('#circle');
    const $score = document.querySelector('#score');
    const $highScore = document.getElementById('highscore');
    const $levelDisplay = document.getElementById('levelDisplay');
    const $moneyDisplay = document.getElementById('moneyDisplay');
    const $upgradeButton = document.getElementById('upgradeButton');
    const $levelUpButton = document.getElementById('levelUpButton');

    let score = 0;
    let level = 1;
    let money = 0; // Игровая валюта
    let upgradeActive = false;

    // Переключение между страницами
    function navigateTo(page) {
        window.location.href = page;
    }

    // Инициализация
    function start() {
        setScore(0);
        setHighScore(getHighScore());
        setImage();
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

    function getScore() {
        return Number(localStorage.getItem('score')) || 0;
    }

    function getHighScore() {
        return Number(localStorage.getItem('highscore')) || 0;
    }

    // Обновление валюты (монет)
    function addCurrency(amount) {
        money += amount; // Увеличиваем валюту
        $moneyDisplay.textContent = `Монеты: ${money}`; // Обновляем отображение
    }

    // Добавление очков и валюты
    function addOne() {
        const pointsToAdd = upgradeActive ? 2 : 1; // Учитывает активные улучшения для очков
        setScore(score + pointsToAdd);
        addCurrency(1); // Каждое нажатие добавляет 1 монету
    }

    function upgrade() {
        if (money >= 50) {
            upgradeActive = true;
            money -= 50;
            $moneyDisplay.textContent = `Монеты: ${money}`;
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
            level++;
            $levelDisplay.textContent = `Уровень: ${level}`;
            $moneyDisplay.textContent = `Монеты: ${money}`;
            alert('Уровень повышен!');
        } else {
            alert('Недостаточно монет для повышения уровня!');
        }
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

            addOne(); // Добавление очка и валюты

            setTimeout(() => {
                plusOne.remove();
            }, 2000);
        });
    }

    // Навигация
    document.getElementById('toImprovements')?.addEventListener('click', () => {
        navigateTo('improvements.html');
    });

    document.getElementById('toStatistics')?.addEventListener('click', () => {
        navigateTo('statistics.html');
    });

    document.getElementById('toMain')?.addEventListener('click', () => {
        navigateTo('index.html');
    });

    // Инициализация
    start();
});