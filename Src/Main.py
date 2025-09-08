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
