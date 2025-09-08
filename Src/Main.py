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
    