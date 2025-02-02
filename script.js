class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');

        this.money = 0;
        this.clickMultiplier = 1;
        this.autoClickerActive = false;
        this.minigameScore = 0;
        this.isMinigameActive = false;
        this.achievements = [];

        this.init();
    }

    init() {
        this.loadGame();
        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        document.getElementById('startMinigameButton').addEventListener('click', () => this.startMinigame());
        document.getElementById('restartMinigameButton').addEventListener('click', () => this.restartMinigame());
        document.getElementById('resetProgress').addEventListener('click', () => this.openConfirmationModal());

        this.setupTabSwitching();

        // Ежесекундное обновление интерфейса
        setInterval(() => {
            this.saveGame();
            this.updateInterface();
        }, 1000); // Auto-update every second
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
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
        this.checkForAchievements();
    }

    checkForAchievements() {
        if (this.money >= 100 && !this.achievements.includes("Собрано 100 звёздных очков")) {
            this.achievements.push("Собрано 100 звёздных очков");
            this.showAchievement("Собрано 100 звёздных очков");
        }
        if (this.money >= 500 && !this.achievements.includes("Собрано 500 звёздных очков")) {
            this.achievements.push("Собрано 500 звёздных очков");
            this.showAchievement("Собрано 500 звёздных очков");
        }
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
        fallingObject.style.left = Math.random() * (200 - 30) + 'px';
        fallingObject.style.top = '0px';
        fallingObject.style.display = 'block';

        let fallInterval = setInterval(() => {
            let currentTop = parseInt(fallingObject.style.top);
            if (currentTop >= 180) {
                clearInterval(fallInterval);
                fallingObject.style.display = 'none';
                this.endMinigame();
            } else {
                fallingObject.style.top = (currentTop + 5) + 'px';
            }
        }, 100);

        fallingObject.addEventListener('click', () => {
            this.minigameScore++;
            this.updateMinigameScore();
            fallingObject.style.display = 'none';
            this.spawnFallingObject();
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

    openConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'flex';
    }

    closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'none';
    }

    confirmReset() {
        this.money = 0;
        this.achievements = [];
        this.saveGame();
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
        document.getElementById('achievementList').innerHTML = '';
        this.showNotification('Прогресс сброшен!', 'success');
        this.closeConfirmationModal();
    }

    updateInterface() {
        this.$moneyDisplay.textContent = `${this.money} Звёздных очков`;
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

// Инициализация модального окна
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // Закрытие модального окна
    document.querySelector('.close-modal').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('cancelReset').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('confirmReset').addEventListener('click', () => game.confirmReset());
});
