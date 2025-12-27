import random

PLAYER = 'O'
CPU = 'X'


# Mostrar tablero
def showboard(board):
    print(f"""
     {board[0]} | {board[1]} | {board[2]}
    ---+---+---
     {board[3]} | {board[4]} | {board[5]}
    ---+---+---
     {board[6]} | {board[7]} | {board[8]}
    """)


# Combinaciones ganadoras
def wincombos():
    return [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),
        (0, 3, 6), (1, 4, 7), (2, 5, 8),
        (0, 4, 8), (2, 4, 6)
    ]


# Verificar ganador
def checkwin(board, symbol):
    for a, b, c in wincombos():
        if board[a] == board[b] == board[c] == symbol:
            return True
    return False


# Verificar empate
def boardfull(board):
    return all(isinstance(cell, str) for cell in board)


# Obtener posiciones libres
def freepositions(board):
    return [i for i, cell in enumerate(board) if isinstance(cell, int)]


# Movimiento de la máquina
def cpumove(board):
    return random.choice(freepositions(board))


# Solicitar movimiento del jugador
def askplayermove(board):
    while True:
        try:
            move = int(input("Elige tu movimiento (1-9): ")) - 1
            if move not in range(9):
                print("Posición inválida.")
                continue
            if isinstance(board[move], str):
                print("Esa casilla ya está ocupada.")
                continue
            return move
        except ValueError:
            print("Debes ingresar un número válido.")


# Turno del jugador
def playerturn(board):
    move = askplayermove(board)
    board[move] = PLAYER


# Turno de la máquina
def cputurn(board):
    move = cpumove(board)
    board[move] = CPU
    print(f"La máquina juega en la posición {move + 1}")


# Verificar estado del juego
def checkgame(board, symbol, winmsg):
    if checkwin(board, symbol):
        print(winmsg)
        return True
    if boardfull(board):
        print("Empate. Nadie gana, nadie pierde.")
        return True
    return False


# Juego principal
def playgame():
    board = [1, 2, 3, 4, 5, 6, 7, 8, 9]

    print("Bienvenido al Tic Tac Toe")
    print("Tú juegas con 'O' y la máquina con 'X'\n")

    board[4] = CPU  # La máquina toma el centro, porque puede
    showboard(board)

    while True:
        playerturn(board)
        showboard(board)
        if checkgame(board, PLAYER, "Has ganado. Bien hecho."):
            break

        cputurn(board)
        showboard(board)

        if checkgame(board, CPU, "La máquina gana. Sin emociones."):
            break


playgame()
