let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "O"; // Tú empiezas siendo O
let gameActive = true;
let playerName = "";

// Cargar Leaderboard
let leaderboard = JSON.parse(localStorage.getItem('tttLeaderboard')) || [];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];

//  Inicio del juego
function startGame() {
    const input = document.querySelector('#player-name');
    if (input.value.trim() === "") return alert("Por favor, ingresa tu nombre");
    
    playerName = input.value.trim();
    
    document.querySelector('#display-name').innerText = `${playerName} (Jugador O)`;
    document.querySelector('#setup-section').style.display = "none";
    document.querySelector('#game-section').style.display = "block";
    actualizarLeaderboardUI();
}

// MAanejo de turnos
function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    
    if (boardState[index] !== "" || !gameActive || currentPlayer !== "O") return;

    ejecutarMovimiento(index, cell);

    
    if (gameActive) {
        currentPlayer = "X";
        const statusContainer = document.querySelector('#status');
        statusContainer.innerHTML = `La CPU está pensando...`;
        
        
        setTimeout(cpuTurn, 600);
    }
}

//  Logiga de CPU   
function cpuTurn() {
    if (!gameActive) return;


    const availableIndices = boardState
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (availableIndices.length > 0) {
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        const cell = document.querySelector(`.cell[data-index="${randomIndex}"]`);
        
        ejecutarMovimiento(randomIndex, cell);

        if (gameActive) {
            currentPlayer = "O";
            document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
        }
    }
}


function ejecutarMovimiento(index, cell) {
    boardState[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    checkResult();
}

//  Verificacin de resultados
function checkResult() {
    let roundWon = false;

    for (let condition of winningConditions) {
        let [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true;
            break;
        }
    }

    const statusContainer = document.querySelector('#status');

    if (roundWon) {
        gameActive = false;
        if (currentPlayer === "O") {
            statusContainer.innerText = `¡Victoria! 🎉 Ganaste, ${playerName}`;
            registrarVictoria(); // Solo sumas puntos si tú (O) ganas
        } else {
            statusContainer.innerText = `¡Derrota! 🤖 La CPU ha ganado`;
        }
        finalizarJuego();
        return;
    }

    if (!boardState.includes("")) {
        statusContainer.innerText = "¡Es un empate! 🤝";
        gameActive = false;
        finalizarJuego();
        return;
    }
}

function finalizarJuego() {
    const board = document.querySelector('#board');
    board.style.pointerEvents = "none";
    board.style.opacity = "0.7";
}

function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "O"; // Reinicias tú
    gameActive = true;
    
    const board = document.querySelector('#board');
    board.style.pointerEvents = "auto";
    board.style.opacity = "1";

    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o');
    });

    document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
}

//  Leaderboard
function registrarVictoria() {
    let user = leaderboard.find(u => u.name.toLowerCase() === playerName.toLowerCase());
    
    if (user) {
        user.wins++;
    } else {
        leaderboard.push({ name: playerName, wins: 1 });
    }

    leaderboard.sort((a, b) => b.wins - a.wins);
    leaderboard = leaderboard.slice(0, 5);

    localStorage.setItem('tttLeaderboard', JSON.stringify(leaderboard));
    actualizarLeaderboardUI();
}

function actualizarLeaderboardUI() {
    const list = document.querySelector('#leaderboard-list');
    list.innerHTML = leaderboard.map(u => `
        <li>
            <span>${u.name}</span>
            <strong>${u.wins} victorias</strong>
        </li>
    `).join('');
}


// Events
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-btn').addEventListener('click', restartGame);
document.querySelector('#start-game-btn').addEventListener('click', startGame);