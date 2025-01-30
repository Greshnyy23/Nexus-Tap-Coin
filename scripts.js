const gameboard = document.getElementById("gameboard");
let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", makeMove);
        gameboard.appendChild(cell);
    }
}

function makeMove(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (board[index] === "") {
        board[index] = currentPlayer;
        cell.textContent = currentPlayer;
        checkWinner();
        currentPlayer = currentPlayer === "X" ? "O" : "X";
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            alert(`Переміг гравець ${board[a]}!`);
            resetBoard();
            return;
        }
    }

    if (board.every(cell => cell !== "")) {
        alert("Нічия!");
        resetBoard();
    }
}

function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.textContent = "");
}

createBoard();
