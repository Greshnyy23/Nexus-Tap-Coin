<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Звездный Кликер</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap">
</head>

<body>
    <div id="particles-js"></div>

    <div class="game-container">
        <div class="header">
            <h1 class="money-counter" id="money">0 Звёздных очков</h1>
        </div>

        <div class="main-circle" id="circle">
            <img src="./assets/star.png" alt="Star" class="star-image">
            <div class="click-effect" id="clickEffect"></div>
        </div>

        <div class="tabs">
            <button class="tab active" data-tab="achievements">🏆</button>
            <button class="tab" data-tab="minigame">🎮</button>
            <button class="tab" data-tab="settings">⚙</button>
        </div>

        <div class="tab-content active" id="achievements">
            <div class="achievement-list" id="achievementList">
                <!-- Достижения будут добавлены через JavaScript -->
            </div>
        </div>

        <div class="tab-content" id="minigame">
            <button id="startMinigameButton" class="btn">Начать мини-игру</button>
            <div class="minigame-area" id="minigameArea" style="display:none;">
                <div class="falling-object" id="fallingObject"></div>
                <div class="score-display" id="minigameScore">Счет: 0</div>
                <div id="minigameEnd" style="display:none;">
                    <p>Ваш финальный счет: <span id="finalScore"></span></p>
                    <button id="restartMinigameButton" class="btn">Начать заново</button>
                </div>
            </div>
        </div>

        <div class="tab-content" id="settings">
            <h2 class="tab-title">Настройки</h2>
            <div class="setting-item">
                <label for="soundToggle">Звуки:</label>
                <input type="checkbox" id="soundToggle" checked>
            </div>
            <button class="danger-button" id="resetProgress">Сбросить прогресс</button>
            <div class="credits">Версия 1.0 · Звездный Кликер</div>
        </div>

        <div id="notifications"></div>
    </div>

    <div id="confirmationModal" class="modal">
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <p>Вы уверены, что хотите сбросить прогресс?</p>
            <button id="confirmReset" class="btn">Да</button>
            <button id="cancelReset" class="btn">Нет</button>
        </div>
    </div>

    <button id="themeButton" class="theme-toggle">🌙</button>

    <script src="script.js"></script>
</body>

</html>
