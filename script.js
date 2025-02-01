class Game {
    constructor() {
        this.$circle = document.querySelector('#circle');
        this.$moneyDisplay = document.getElementById('money');
        this.$clickSpeedButton = document.getElementById('clickSpeedButton');
        this.$autoClickButton = document.getElementById('autoClickButton');

        this.money = 100;
        this.clickMultiplier = 1;
        this.autoClickerActive = false;

        this.upgrades = {
            clickSpeed: { cost: 50, baseCost: 50 },
            autoClick: { cost: 100, baseCost: 100 }
        };

        this.cards = [];
        this.minigameScore = 0;
        this.isMinigameActive = false;

        this.init();
    }

    init() {
        this.loadGame();
        this.updateUpgradeInterface();
        this.initCards();
        this.renderCards();

        this.$circle.addEventListener('click', () => this.addMoney(this.clickMultiplier));
        this.$clickSpeedButton.addEventListener('click', () => this.buyUpgrade('clickSpeed'));
        this.$autoClickButton.addEventListener('click', () => this.buyUpgrade('autoClick'));

        document.getElementById('startMinigameButton').addEventListener('click', () => this.startMinigame());
        document.getElementById('restartMinigameButton').addEventListener('click', () => this.restartMinigame());
        document.getElementById('resetProgress').addEventListener('click', () => this.resetProgress());
        
        this.setupTabSwitching();

        setInterval(() => {
            this.saveGame();
            this.collectCardIncome(); // Сбор дохода от карточек
        }, 10000); // Save every 10 seconds
    }

    loadGame() {
        this.money = Number(localStorage.getItem('money')) || 0;
        this.upgrades = {
            clickSpeed: { cost: Number(localStorage.getItem('clickSpeedCost')) || 50, baseCost: 50 },
            autoClick: { cost: Number(localStorage.getItem('autoClickCost')) || 100, baseCost: 100 }
        };
        this.cards = JSON.parse(localStorage.getItem('cards')) || [];
    }

    saveGame() {
        localStorage.setItem('money', this.money);
        localStorage.setItem('clickSpeedCost', this.upgrades.clickSpeed.cost);
        localStorage.setItem('autoClickCost', this.upgrades.autoClick.cost);
        localStorage.setItem('cards', JSON.stringify(this.cards));
    }

    addMoney(amount) {
        this.money += amount;
        this.$moneyDisplay.textContent = `${this.money}`;
    }

    updateUpgradeInterface() {
        document.getElementById('clickSpeedCost').textContent = this.upgrades.clickSpeed.cost;
        document.getElementById('autoClickCost').textContent = this.upgrades.autoClick.cost;
    }

    buyUpgrade(upgradeType) {
        const upgrade = this.upgrades[upgradeType];
        if (this.money >= upgrade.cost) {
            this.money -= upgrade.cost;
            this.$moneyDisplay.textContent = `${this.money}`;

            if (upgradeType === 'clickSpeed') {
                this.clickMultiplier++;
            } else if (upgradeType === 'autoClick') {
                this.autoClickerActive = true;
                this.startAutoClicker();
            }

            upgrade.cost = Math.round(upgrade.baseCost * 1.15);
            this.updateUpgradeInterface();
            this.showNotification(`${upgradeType} куплено!`, 'success');
        } else {
            this.showNotification('Недостаточно монет!', 'error');
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

    initCards() {
        const incomes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // Разные доходы в час
        for (let i = 0; i < 10; i++) {
            this.cards.push({
                id: i,
                name: `Карточка ${i + 1}`,
                hourlyIncome: incomes[i],
                level: 1,
                cost: 100 * (i + 1) // Стоимость улучшения зависит от номера карточки
            });
        }
    }

    renderCards() {
        const cardList = document.getElementById('cardList');
        cardList.innerHTML = ''; // Сбросить текущие карточки
        this.cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <h3>${card.name}</h3>
                <p>Часовой доход: ${card.hourlyIncome} монет</p>
                <p>Стоимость улучшения: ${card.cost} монет</p>
                <button class="upgrade-button" data-id="${card.id}">Улучшить</button>
            `;
            cardList.appendChild(cardElement);
        });
        
        // Добаваем обработчики событий для кнопок улучшения
        document.querySelectorAll('.upgrade-button').forEach(button => {
            button.addEventListener('click', () => this.upgradeCard(Number(button.dataset.id)));
        });
    }

    upgradeCard(cardId) {
        const card = this.cards[cardId];
        if (this.money >= card.cost) {
            this.money -= card.cost;
            card.level++;
            card.hourlyIncome += 10; // Увеличивает доход на 10 за уровень
            card.cost = Math.round(card.cost * 1.15); // Увеличивает стоимость улучшения
            this.$moneyDisplay.textContent = `${this.money}`;
            this.showNotification(`${card.name} улучшена до уровня ${card.level}!`, 'success');
            this.renderCards(); // Обновляем карточки
        } else {
            this.showNotification('Недостаточно монет для улучшения!', 'error');
        }
    }

    collectCardIncome() {
        let totalIncome = this.cards.reduce((sum, card) => sum + card.hourlyIncome * card.level, 0);
        this.addMoney(totalIncome);
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
            this.clickMultiplier = 1; // Обнуление множителя
            this.upgrades = {
                clickSpeed: { cost: 50, baseCost: 50 },
                autoClick: { cost: 100, baseCost: 100 }
            };
            this.cards = []; // Сброс карточек
            this.initCards(); // Инициализация новых карточек
            this.saveGame();
            this.updateUpgradeInterface();
            this.renderCards(); // Отображение обновленных карточек
            this.$moneyDisplay.textContent = `${this.money}`;
            document.getElementById('achievementList').innerHTML = ''; // Очистка списка достижений
            this.showNotification('Прогресс сброшен!', 'success');
        }
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});
