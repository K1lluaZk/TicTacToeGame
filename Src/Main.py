# Tic Tac Toe en Python     
# Este es un simple juego de Tic Tac Toe (Tres en raya) en Python.

import random

# Mostrar tablero
def mostrar_tablero(tablero):
    print(f"""
     {tablero[0]} | {tablero[1]} | {tablero[2]}
    ---+---+---
     {tablero[3]} | {tablero[4]} | {tablero[5]}
    ---+---+---
     {tablero[6]} | {tablero[7]} | {tablero[8]}
    """)
    
# Revisar si hay ganador
def verificar_ganador(tablero, simbolo):
    combinaciones = [
        (0, 1, 2), (3, 4, 5), (6, 7, 8),  # filas
        (0, 3, 6), (1, 4, 7), (2, 5, 8),  # columnas
        (0, 4, 8), (2, 4, 6)              # diagonales
    ]
    for a, b, c in combinaciones:
        if tablero[a] == tablero[b] == tablero[c] == simbolo:
            return True
    return False

# Revisar si hay empate
def tablero_lleno(tablero):
    return all(isinstance(x, str) for x in tablero)

# Movimiento de la máquina
def movimiento_maquina(tablero):
    opciones = [i for i, x in enumerate(tablero) if isinstance(x, int)]
    return random.choice(opciones)

# Programa principal
def tic_tac_toe():
    tablero = [1,2,3,4,5,6,7,8,9]

    print("Bienvenido al Tic Tac Toe")
    print("Tú eres 'O' y la máquina es 'X'.\n")
    mostrar_tablero(tablero)

    # Primer movimiento de la máquina en el centro
    tablero[4] = 'X'
    mostrar_tablero(tablero)
    
    while True:
        # Turno del usuario
        while True:
            try:
                jugada = int(input("Elige tu movimiento (1-9): "))
                if jugada < 1 or jugada > 9:
                    print("Número inválido. Intenta de nuevo.")
                    continue
                if isinstance(tablero[jugada-1], str):
                    print("Ese cuadro ya está ocupado. Intenta otro.")
                    continue
                tablero[jugada-1] = 'O'
                break
            except ValueError:
                print("Debes ingresar un número válido.")

        mostrar_tablero(tablero)

        # Verificar si gana el usuario
        if verificar_ganador(tablero, 'O'):
            print("¡Felicidades! Has ganado.")
            break
        if tablero_lleno(tablero):
            print("Es un empate.")
            break
        
               # Turno de la máquina
        jugada_maquina = movimiento_maquina(tablero)
        tablero[jugada_maquina] = 'X'
        print(f"La máquina juega en la posición {jugada_maquina+1}:")
        mostrar_tablero(tablero)

        # Verificar si gana la máquina
        if verificar_ganador(tablero, 'X'):
            print("La máquina gana. Intenta otra vez.")
            break
        if tablero_lleno(tablero):
            print("Es un empate.")
            break

# Ejecutar el juego
tic_tac_toe()
