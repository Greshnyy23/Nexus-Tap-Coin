document.addEventListener("DOMContentLoaded", () => {
    // Получаем ссылку на все кнопки навигации
    const $toMain = document.getElementById('toMain');
    const $toImprovements = document.getElementById('toImprovements');
    const $toStatistics = document.getElementById('toStatistics');

    // Проверяем, есть ли кнопки на текущей странице и добавляем обработчики событий
    if ($toMain) {
        $toMain.addEventListener('click', () => {
            window.location.href = 'index.html'; // Переход на главную страницу
        });
    }

    if ($toImprovements) {
        $toImprovements.addEventListener('click', () => {
            window.location.href = 'improvements.html'; // Переход на страницу улучшений
        });
    }

    if ($toStatistics) {
        $toStatistics.addEventListener('click', () => {
            window.location.href = 'statistics.html'; // Переход на страницу статистики
        });
    }

    // Основные игровые элементы
    if (document.getElementById('circle')) {
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
        let money = 0;
        let upgradeActive = false;

        function start() {
            setScore(0);
            setHighScore(getHighScore());
            setImage();
        }

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

        function addOne() {
            setScore(score + (upgradeActive ? 2 : 1));
            money += 1; // Каждое нажатие добавляет 1 монету
            $moneyDisplay.textContent = `Монеты: ${money}`;
        }

        function upgrade() {
            // Логика активации улучшений
        }

        function levelUp() {
            // Логика повышения уровня
        }

        $circle.addEventListener('click', (event) => {
            // Логика кликает по кружку
        });

        start();
    }
});