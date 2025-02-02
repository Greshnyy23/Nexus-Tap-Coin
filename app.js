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
        document.getElementById('restartCoinGameButton').addEventListener('click', () => this.startCoinCollector());
        document.getElementById('restart2048Button').addEventListener('click', () => this.start2048());
        document.getElementById('restartTicTacToeButton').addEventListener('click', () => this.startTicTacToe());
        document.getElementById('resetProgress').addEventListener('click', () => this.openConfirmationModal());
        this.setupTabSwitching();
        this.setupMinigameTabs();
        document.getElementById('themeButton').addEventListener('click', () => this.toggleTheme());
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

    setupMinigameTabs() {
        const minigameButtons = document.querySelectorAll('.minigame-tab');
        const minigameContents = document.querySelectorAll('.tab-content[id^="coinCollector"], .tab-content[id^="game2048"], .tab-content[id^="ticTacToe"]');

        minigameButtons.forEach(button => {
            button.addEventListener('click', () => {
                const minigameName = button.getAttribute('data-minigame');
                minigameContents.forEach(mc => mc.style.display = 'none');
                document.getElementById(minigameName).style.display = 'block';
                minigameButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }

    // Охота на монеты
    startCoinCollector() {
        this.setupCoinCollector();
        this.initCoinCollectorGame();
    }

    setupCoinCollector() {
        this.score = 0;
        document.getElementById('coinScore').textContent = `Счет: ${this.score}`;
        document.getElementById('coinGameArea').innerHTML = '';
        document.getElementById('restartCoinGameButton').style.display = 'none';
    }

    initCoinCollectorGame() {
        this.createCoin();
        this.coinInterval = setInterval(() => this.createCoin(), 2000);
    }

    createCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        coin.style.top = Math.random() * (200 - 30) + 'px';
        coin.style.left = Math.random() * (200 - 30) + 'px';

        coin.addEventListener('click', () => {
            this.score++;
            document.getElementById('coinScore').textContent = `Счет: ${this.score}`;
            coin.remove();
        });

        document.getElementById('coinGameArea').appendChild(coin);
    }

    // Игра 2048
    start2048() {
        this.setup2048();
        this.init2048Game();
    }

    setup2048() {
        this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
        this.score = 0;
        this.addTile();
        this.addTile();
        this.update2048Board();
        document.getElementById('restart2048Button').style.display = 'none';
    }

    init2048Game() {
        document.removeEventListener('keydown', this.keydownHandler); // Отменяем старый обработчик
        this.keydownHandler = (event) => {
            if (event.key === 'ArrowUp') this.move2048('up');
            else if (event.key === 'ArrowDown') this.move2048('down');
            else if (event.key === 'ArrowLeft') this.move2048('left');
            else if (event.key === 'ArrowRight') this.move2048('right');
        };
        document.addEventListener('keydown', this.keydownHandler);
    }

    addTile() {
        const emptyTiles = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) emptyTiles.push([r, c]);
            }
        }
        const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    move2048(direction) {
        // Реализуйте логику перемещения и объединения плиток
        this.addTile(); // Добавляем новую плитку после движения
        this.update2048Board();
    }

    update2048Board() {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        this.board.forEach(row => {
            row.forEach(value => {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.textContent = value !== 0 ? value : '';
                tile.style.backgroundColor = value !== 0 ? `hsl(${Math.log2(value) * 30}, 100%, 50%)` : '#eee';
                boardElement.appendChild(tile);
            });
        });
        document.getElementById('gameScore').textContent = `Счет: ${this.score}`;
    }

    // Крестики-нолики
    startTicTacToe() {
        this.setupTicTacToe();
        this.initTicTacToeGame();
    }

    setupTicTacToe() {
        this.ticTacToeBoard = Array(3).fill(null).map(() => Array(3).fill(null));
        this.currentPlayer = 'X';
        this.updateTicTacToeBoard();
        document.getElementById('restartTicTacToeButton').style.display = 'none';
    }

    initTicTacToeGame() {
        // No additional initialization needed
    }

    updateTicTacToeBoard() {
        const boardElement = document.getElementById('ticTacToeBoard');
        boardElement.innerHTML = '';
        this.ticTacToeBoard.forEach((row, i) => {
            row.forEach((cell, j) => {
                const cellElement = document.createElement('div');
                cellElement.className = 'ticTacToeCell';
                cellElement.textContent = cell;
                cellElement.addEventListener('click', () => this.makeMove(i, j));
                boardElement.appendChild(cellElement);
            });
        });
        document.getElementById('ticTacToeStatus').textContent = `Текущий игрок: ${this.currentPlayer}`;
    }

    makeMove(i, j) {
        if (this.ticTacToeBoard[i][j] === null) {
            this.ticTacToeBoard[i][j] = this.currentPlayer;
            if (this.checkTicTacToeWinner()) {
                alert(`Игрок ${this.currentPlayer} выиграл!`);
                document.getElementById('restartTicTacToeButton').style.display = 'block';
            } else {
                this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
                this.updateTicTacToeBoard();
            }
        }
    }

    checkTicTacToeWinner() {
        const winningCombinations = [
            [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
        ];

        return winningCombinations.some(combination => {
            const [[a,b],[c,d],[e,f]] = combination;
            return this.ticTacToeBoard[a][b] && this.ticTacToeBoard[a][b] === this.ticTacToeBoard[c][d] && this.ticTacToeBoard[a][b] === this.ticTacToeBoard[e][f];
        });
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

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const currentTheme = document.body.classList.contains('light-theme') ? '🌙' : '🌞';
        document.getElementById('themeButton').textContent = currentTheme;
    }
}

// Инициализация игры
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();

    // Закрытие модального окна
    document.querySelector('.close-modal').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('cancelReset').addEventListener('click', () => game.closeConfirmationModal());
    document.getElementById('confirmReset').addEventListener('click', () => game.confirmReset());
});
