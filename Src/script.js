
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X"; 
let gameActive = true;

const statusDisplay = document.querySelector('#status span');
const cells = document.querySelectorAll('.cell');

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];


function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    
    
    if (boardState[clickedCellIndex] !== "" || !gameActive) {
        return; 
    }

    updateCell(clickedCell, clickedCellIndex);
    checkResult();
}

function updateCell(cell, index) {
    boardState[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
}

function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.parentElement.innerText = `¡Victoria para ${currentPlayer}!`;
        gameActive = false;
        return;
    }

    if (!boardState.includes("")) {
        statusDisplay.parentElement.innerText = "¡Empate!";
        gameActive = false;
        return;
    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerText = currentPlayer;
}

function restartGame() {
    
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;


    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });

    const board = document.querySelector('#board');
    board.style.opacity = "1";
    board.style.pointerEvents = "auto";

    
    const statusContainer = document.querySelector('#status');
    statusContainer.innerHTML = `Turno de: <span id="current-player-display">X</span>`;
}


function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    const statusContainer = document.querySelector('#status');

    if (roundWon) {
        statusContainer.innerText = `¡Victoria para ${currentPlayer}!`;
        gameActive = false;
        return;
    }

    if (!boardState.includes("")) {
        statusContainer.innerText = "¡Empate!";
        gameActive = false;
        return;
    }


    currentPlayer = currentPlayer === "X" ? "O" : "X";
    

    const currentPlayerSpan = document.querySelector('#status span');
    if (currentPlayerSpan) {
        currentPlayerSpan.innerText = currentPlayer;
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-btn').addEventListener('click', restartGame);