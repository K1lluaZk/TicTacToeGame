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
// 3 Variables de estado
let boardState = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "O"; 
let gameActive = true;
let playerName = "";
let leaderboard = [];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]           
];

// Funciones de firebase

async function obtenerLeaderboardGlobal() {
    try {
        const snapshot = await db.collection('leaderboard')
            .orderBy('wins', 'desc')
            .limit(5)
            .get();
        
        leaderboard = snapshot.docs.map(doc => doc.data());
        actualizarLeaderboardUI();
    } catch (error) {
        console.error("Error leyendo Firebase:", error);
    }
}

// Nueva función para ver TODOS los ganadores en el Modal
async function obtenerLeaderboardCompleto() {
    const tableBody = document.getElementById('full-ranking-body');
    if(!tableBody) return;
    
    tableBody.innerHTML = '<tr><td colspan="3">Cargando ranking...</td></tr>';
    
    try {
        const snapshot = await db.collection('leaderboard')
            .orderBy('wins', 'desc')
            .get(); 
        
        tableBody.innerHTML = "";
        snapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${data.name}</td>
                    <td>${data.wins}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error cargando ranking completo:", error);
    }
}

async function registrarVictoriaGlobal() {
    const userRef = db.collection('leaderboard').doc(playerName.toLowerCase());
    try {
        const doc = await userRef.get();
        if (doc.exists) {
            await userRef.update({
                wins: firebase.firestore.FieldValue.increment(1)
            });
        } else {
            await userRef.set({
                name: playerName,
                wins: 1
            });
        }
        obtenerLeaderboardGlobal();
    } catch (error) {
        console.error("Error guardando en Firebase:", error);
    }
}

// Logica del juego

function startGame() {
    const input = document.querySelector('#player-name');
    if (input.value.trim() === "") return alert("Por favor, ingresa tu nombre");
    
    playerName = input.value.trim();
    document.querySelector('#display-name').innerText = `${playerName} (Jugador O)`;
    document.querySelector('#setup-section').style.display = "none";
    document.querySelector('#game-section').style.display = "block";
    document.querySelector('#status').innerHTML = `Tu turno: <span>${playerName} (O)</span>`;
    
    obtenerLeaderboardGlobal();
}

function handleCellClick(e) {
    const cell = e.target;
    const index = parseInt(cell.getAttribute('data-index'));

    if (boardState[index] !== "" || !gameActive || currentPlayer !== "O") return;

    ejecutarMovimiento(index, cell);

    if (gameActive) {
        currentPlayer = "X";
        document.querySelector('#status').innerHTML = `La CPU está pensando...`;
        setTimeout(cpuTurn, 600);
    }
}

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
            registrarVictoriaGlobal(); 
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
    currentPlayer = "O";
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

function actualizarLeaderboardUI() {
    const list = document.querySelector('#leaderboard-list');
    if(!list) return;
    list.innerHTML = leaderboard.map((u, i) => `
        <li>
            <span>${i + 1}. ${u.name}</span>
            <strong>${u.wins} victorias</strong>
        </li>
    `).join('');
}

function backToSetup() {
    restartGame();
    document.querySelector('#player-name').value = "";
    document.querySelector('#setup-section').style.display = "block";
    document.querySelector('#game-section').style.display = "none";
    obtenerLeaderboardGlobal();
}

// Logica del modal de ranking completo
const modal = document.getElementById("ranking-modal");
const viewMoreBtn = document.getElementById("view-full-ranking");
const closeModal = document.querySelector(".close-modal");

if(viewMoreBtn) {
    viewMoreBtn.onclick = () => {
        modal.style.display = "block";
        obtenerLeaderboardCompleto();
    };
}
if(closeModal) closeModal.onclick = () => modal.style.display = "none";
window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };

const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Leer la preferencia guardada al cargar
if (localStorage.getItem('theme') === 'light') {
    body.classList.add('light-mode');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Guardar la preferencia
    if (body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
});

// Events
document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('#reset-btn').addEventListener('click', restartGame);
document.querySelector('#start-game-btn').addEventListener('click', startGame);
document.querySelector('#back-to-setup-btn').addEventListener('click', backToSetup);

// Carga inicial
obtenerLeaderboardGlobal();