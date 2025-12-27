import tkinter as tk
from tkinter import messagebox
import random

# Control: Human is O, CPU is X

board = [" " for _ in range(9)]
current_player = "O"  
buttons = []

def check_win(player):
    
    win_combinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ]
    for combo in win_combinations:
        if board[combo[0]] == board[combo[1]] == board[combo[2]] == player:
            return True
    return False

def check_draw():
    
    return " " not in board

def reset_game():

    global board, current_player
    board = [" " for _ in range(9)]
    current_player = "O"
    for button in buttons:
        button.config(text="", state="normal")

def end_game(message):
    
    messagebox.showinfo("Tic Tac Toe", message)
    reset_game()

def cpu_move():
    
    global current_player
    empty_cells = [i for i, val in enumerate(board) if val == " "]
    
    if empty_cells:
        index = random.choice(empty_cells)
        board[index] = "X"
        buttons[index].config(text="X", state="disabled", disabledforeground="red")
        
        if check_win("X"):
            end_game("CPU (X) wins!")
        elif check_draw():
            end_game("It's a draw!")
        else:
            current_player = "O"

def player_click(index):
    
    global current_player
    
    if board[index] == " " and current_player == "O":
        # Player Move
        board[index] = "O"
        buttons[index].config(text="O", state="disabled", disabledforeground="blue")
        
        if check_win("O"):
            end_game("You (O) win!")
            return
        
        if check_draw():
            end_game("It's a draw!")
            return
        
        # Switch to CPU
        current_player = "X"
        # Delay CPU move slightly for better UX
        root.after(500, cpu_move)

# Main Window Setup
root = tk.Tk()
root.title("Tic Tac Toe - Python GUI")
root.resizable(False, False)

for i in range(9):
    btn = tk.Button(
        root, 
        text="", 
        font=("Arial", 20, "bold"), 
        width=5, 
        height=2, 
        command=lambda i=i: player_click(i)
    )
    btn.grid(row=i // 3, column=i % 3, sticky="nsew")
    buttons.append(btn)

# Button Reset
reset_btn = tk.Button(root, text="Reset Game", command=reset_game)
reset_btn.grid(row=3, column=0, columnspan=3, sticky="nsew")

if __name__ == "__main__":
    root.mainloop()