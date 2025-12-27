// 1 Configuración de Firebase 
const firebaseConfig = {
  apiKey: "AIzaSyC3YFL7GHxvj0czxmT6BSzNYK6R40x6_lI",
  authDomain: "tictactoewebapp-3d7cb.firebaseapp.com",
  projectId: "tictactoewebapp-3d7cb",
  storageBucket: "tictactoewebapp-3d7cb.firebasestorage.app",
  messagingSenderId: "449871832242",
  appId: "1:449871832242:web:879124c92b00393e7715ab",
  measurementId: "G-0WLB0SBPHD"
};

// 2 Inicialización 
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 3 Variables de estado
// --- STATE VARIABLES ---
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "O"; 
let isGameActive = true;
let playerName = "";
let leaderboardData = [];

const WINNING_CONDITIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];

// --- FIREBASE FUNCTIONS (Sin cambios) ---

async function fetchGlobalLeaderboard() {
    try {
        const snapshot = await db.collection('leaderboard').orderBy('wins', 'desc').limit(5).get();
        leaderboardData = snapshot.docs.map(doc => doc.data());
        updateLeaderboardUI();
    } catch (error) { console.error("Error reading Firebase:", error); }
}

async function fetchFullLeaderboard() {
    const tableBody = document.getElementById('full-ranking-body');
    if(!tableBody) return;
    tableBody.innerHTML = '<tr><td colspan="3">Cargando ranking...</td></tr>';
    try {
        const snapshot = await db.collection('leaderboard').orderBy('wins', 'desc').get(); 
        tableBody.innerHTML = "";
        snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            const fireEmoji = (data.currentStreak >= 3) ? " 🔥" : "";
            tableBody.innerHTML += `<tr><td>${index + 1}</td><td>${data.name}${fireEmoji}</td><td>${data.wins}</td></tr>`;
        });
    } catch (error) { console.error("Error loading full ranking:", error); }
}

async function registerGlobalVictory() {
    const userRef = db.collection('leaderboard').doc(playerName.toLowerCase());
    try {
        const doc = await userRef.get();
        if (doc.exists) {
            const data = doc.data();
            const newStreak = (data.currentStreak || 0) + 1;
            await userRef.update({
                wins: firebase.firestore.FieldValue.increment(1),
                currentStreak: newStreak
            });
        } else {
            await userRef.set({ name: playerName, wins: 1, currentStreak: 1 });
        }
        fetchGlobalLeaderboard();
    } catch (error) { console.error("Error saving to Firebase:", error); }
}

async function resetStreakInFirebase() {
    if (!playerName) return;
    const userRef = db.collection('leaderboard').doc(playerName.toLowerCase());
    try { await userRef.update({ currentStreak: 0 }); } 
    catch (error) { console.log("Player record not found for streak reset"); }
}

// --- GAME LOGIC ---

function startGame() {
    const input = document.querySelector('#player-name');
    const displayNameElem = document.querySelector('#display-name');
    
    if (input.value.trim() === "") return alert("Por favor, ingresa tu nombre");
    
    playerName = input.value.trim();

    // Verificamos si el elemento existe antes de asignarle texto para evitar el error
    if (displayNameElem) {
        displayNameElem.innerText = `${playerName} (Jugador O)`;
    }

    // Cambiamos de sección
    document.querySelector('#setup-section').style.display = "none";
    document.querySelector('#game-section').style.display = "block";
    
    // Resetear el estado del juego para una nueva partida limpia
    restartGame(); 
    
    document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
    
    fetchGlobalLeaderboard();
}

function handleCellClick(event) {
    const cell = event.target;
    const index = parseInt(cell.getAttribute('data-index'));
    if (boardState[index] !== "" || !isGameActive || currentPlayer !== "O") return;
    executeMove(index, cell);
    if (isGameActive) {
        currentPlayer = "X";
        document.querySelector('#status').innerHTML = `La CPU está pensando...`;
        setTimeout(executeCpuTurn, 600);
    }
}

// MODIFICADO: Dificultad Media con Minimax
function executeCpuTurn() {
    if (!isGameActive) return;

    let move;
    // 60% de probabilidad de hacer la jugada perfecta, 40% aleatoria
    const isSmartMove = Math.random() < 0.6;

    if (isSmartMove) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (boardState[i] === "") {
                boardState[i] = "X";
                let score = minimax(boardState, 0, false);
                boardState[i] = "";
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    } else {
        const availableIndices = boardState.map((val, idx) => val === "" ? idx : null).filter(val => val !== null);
        move = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    }

    if (move !== undefined) {
        const cell = document.querySelector(`.cell[data-index="${move}"]`);
        executeMove(move, cell);
        if (isGameActive) {
            currentPlayer = "O";
            document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
        }
    }
}

// NUEVA FUNCIÓN: Algoritmo Minimax
function minimax(board, depth, isMaximizing) {
    let result = checkWinnerSim(board);
    if (result === "X") return 10 - depth;
    if (result === "O") return depth - 10;
    if (!board.includes("")) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// NUEVA FUNCIÓN: Simulador de victoria para la IA
function checkWinnerSim(board) {
    for (let condition of WINNING_CONDITIONS) {
        let [a, b, c] = condition;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
    }
    return null;
}

function executeMove(index, cell) {
    boardState[index] = currentPlayer;
    cell.innerText = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    checkGameResult();
}

function checkGameResult() {
    let roundWon = false;
    let winningLine = [];
    for (let condition of WINNING_CONDITIONS) {
        let [a, b, c] = condition;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            roundWon = true; winningLine = [a, b, c]; break;
        }
    }

    const statusContainer = document.querySelector('#status');
    if (roundWon) {
        isGameActive = false;
        const colorClass = (currentPlayer === "O") ? "winner" : "cpu-winner";
        winningLine.forEach(index => document.querySelector(`.cell[data-index="${index}"]`).classList.add(colorClass));

        if (currentPlayer === "O") {
            statusContainer.innerText = `¡Victoria! 🎉 Ganaste, ${playerName}`;
            registerGlobalVictory(); 
        } else {
            statusContainer.innerText = `¡Derrota! 🤖 La CPU ha ganado`;
            resetStreakInFirebase();
            leaderboardData = leaderboardData.map(user => {
                if (user.name.toLowerCase() === playerName.toLowerCase()) return { ...user, currentStreak: 0 };
                return user;
            });
            updateLeaderboardUI();
        }
        finishGame();
        return;
    }

    if (!boardState.includes("")) {
        statusContainer.innerText = "¡Es un empate! 🤝";
        isGameActive = false;
        finishGame();
        return;
    }
}

function finishGame() {
    const board = document.querySelector('#board');
    board.style.pointerEvents = "none";
    board.style.opacity = "0.7";
}

function restartGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "O";
    isGameActive = true;
    const board = document.querySelector('#board');
    board.style.pointerEvents = "auto";
    board.style.opacity = "1";
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winner', 'cpu-winner');
    });
    document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
}

function updateLeaderboardUI() {
    const list = document.querySelector('#leaderboard-list');
    if(!list) return;
    list.innerHTML = leaderboardData.map((user, index) => {
        const fireEmoji = (user.currentStreak >= 3) ? " 🔥" : "";
        return `<li><span>${index + 1}. ${user.name}${fireEmoji}</span><strong>${user.wins} victorias</strong></li>`;
    }).join('');
}

function backToSetup() {
    // 1. Detener cualquier juego activo
    isGameActive = false;
    
    // 2. Limpiar el tablero visual y lógicamente
    boardState = ["", "", "", "", "", "", "", "", ""];
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('x', 'o', 'winner', 'cpu-winner');
    });

    // 3. Resetear el input del nombre (opcional)
    const input = document.querySelector('#player-name');
    if (input) input.value = "";

    // 4. Cambiar la visibilidad de las secciones
    document.querySelector('#setup-section').style.display = "block";
    document.querySelector('#game-section').style.display = "none";
    
    // 5. Refrescar el ranking
    fetchGlobalLeaderboard();
}
// --- UI COMPONENTS ---
const rankingModal = document.getElementById("ranking-modal");
const viewFullBtn = document.getElementById("view-full-ranking");
const closeModalBtn = document.querySelector(".close-modal");

if(viewFullBtn) { viewFullBtn.onclick = () => { rankingModal.style.display = "block"; fetchFullLeaderboard(); }; }
if(closeModalBtn) closeModalBtn.onclick = () => rankingModal.style.display = "none";
window.onclick = (event) => { if (event.target == rankingModal) rankingModal.style.display = "none"; };

const themeToggleButton = document.getElementById('theme-toggle');
if (localStorage.getItem('selected-theme') === 'light') document.body.classList.add('light-mode');
if(themeToggleButton) {
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        localStorage.setItem('selected-theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
    });
}

// --- EVENT LISTENERS ---
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-btn').addEventListener('click', restartGame);
document.querySelector('#start-game-btn').addEventListener('click', startGame);
document.querySelector('#back-to-setup-btn').addEventListener('click', backToSetup);

fetchGlobalLeaderboard();