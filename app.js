class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');

        this.money = 0;
        this.clickMultiplier = 1;
        this.autoClickerActive = false;

        this.achievements = [];

        this.init();
    }

    init() {
        this.loadGame();
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        document.getElementById('startMinigameButton').addEventListener('click', () => this.startMinigame());
        document.getElementById('restartMinigameButton').addEventListener('click', () => this.restartMinigame());
        document.getElementById('resetProgress').addEventListener('click', () => this.resetProgress());
        
        this.setupTabSwitching();

        setInterval(() => {
            this.saveGame();
        }, 10000); // Save every 10 seconds
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.achievements = JSON.parse(localStorage.getItem('achievements')) || [];
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    addMoney(amount) {
        this.money += amount;
        this.$moneyDisplay.textContent = `${this.money}`;
        this.checkForAchievements();
    }

    checkForAchievements() {
        // Определение достижений
        if (this.money >= 100 && !this.achievements.includes("Собрано 100 монет")) {
            this.achievements.push("Собрано 100 монет");
            this.showAchievement("Собрано 100 монет");
        }
        // Добавьте больше достижений по необходимости
        this.saveGame();
    }

    showAchievement(message) {
        const achievementList = document.getElementById('achievementList');
        const achievementItem = document.createElement('div');
        achievementItem.className = 'achievement';
        achievementItem.textContent = message;
        achievementList.appendChild(achievementItem);
    }

    setupTabSwitching() {
        const tabButtons = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                tabContents.forEach(tc => tc.classList.remove('active'));
                document.getElementById(tabName).classList.add('active');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    startMinigame() {
        this.isMinigameActive = true;
        this.minigameScore = 0;
        this.spawnFallingObject();
        this.updateMinigameScore();
        document.getElementById('minigameArea').style.display = 'block';
        document.getElementById('restartMinigameButton').style.display = 'none';
    }

    spawnFallingObject() {
        const fallingObject = document.getElementById('fallingObject');
        fallingObject.style.left = Math.random() * (200 - 30) + 'px'; // Положение в рамках игрового круга
        fallingObject.style.top = '0px';
        fallingObject.style.display = 'block';

        let fallInterval = setInterval(() => {
            let currentTop = parseInt(fallingObject.style.top);
            if (currentTop >= 180) { // Если объект достиг основания
                clearInterval(fallInterval);
                fallingObject.style.display = 'none';
                this.endMinigame();
            } else {
                fallingObject.style.top = (currentTop + 5) + 'px';
            }
        }, 100);

        // Слушаем клик по падающему объекту
        fallingObject.addEventListener('click', () => {
            this.minigameScore++;
            this.updateMinigameScore();
            fallingObject.style.display = 'none'; // скрыть объект
            this.spawnFallingObject(); // спавнить новый объект
        });
    }

    updateMinigameScore() {
        document.getElementById('minigameScore').textContent = `Счет: ${this.minigameScore}`;
    }

    endMinigame() {
        this.isMinigameActive = false;
        document.getElementById('fallingObject').style.display = 'none';
        document.getElementById('finalScore').textContent = `Ваш финальный счет: ${this.minigameScore}`;
        document.getElementById('minigameEnd').style.display = 'block';
    }

    restartMinigame() {
        this.startMinigame();
        document.getElementById('minigameEnd').style.display = 'none';
    }

    resetProgress() {
        if (confirm('Вы уверены, что хотите сбросить прогресс?')) {
            this.money = 0;
            this.achievements = []; // Сброс достижений
            this.saveGame();
            this.$moneyDisplay.textContent = `${this.money}`;
            document.getElementById('achievementList').innerHTML = ''; // Очистка списка достижений
            this.showNotification('Прогресс сброшен!', 'success');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.getElementById('notifications').appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
