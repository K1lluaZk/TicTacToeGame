<p align="center">
<h1 align="center">Tic Tac Toe (Tkinter Version)</h1>
<p align="center">A lightweight graphical desktop implementation of the classic game built with Python.</p>
</p>

<p align="center"> <img src="https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python&logoColor=white" alt="Python Version"> <img src="https://img.shields.io/badge/Library-Tkinter-orange?style=flat-square" alt="Tkinter"> <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"> </p>

---

## About the Project

This project is a GUI-based Tic Tac Toe application developed using the Tkinter framework. It transitions the classic game logic into a windowed environment, focusing on event-driven programming, graphical state management, and interactive user interface design.

## Features

* **Interactive GUI:** Mouse-based gameplay using a 3x3 grid of buttons.
* **Human vs. CPU:** Play as "O" against an automated "X" opponent.
* **Automated Logic:** CPU performs moves based on randomized selection of available grid coordinates.
* **Real-time Feedback:** Integrated message boxes for game results (Win, Loss, or Draw).
* **State Control:** Buttons are dynamically disabled upon selection to prevent invalid moves or overwriting.
* **Reset Functionality:** Quick-restart feature to clear the board and reset the game state.

## Technologies Used

* **Python 3**: Main programming language.
* **Tkinter**: Standard Python library for the Graphical User Interface.
* **Random**: For CPU move generation.

## How to Run

1. **Clone the repository:**
```bash
git clone https://github.com/username/tic-tac-toe-tkinter.git

```


2. **Navigate to the directory:**
```bash
cd tic-tac-toe-tkinter

```


3. **Run the application:**
```bash
python main.py

```



## Project Structure

The application logic is contained within a single-file script for portability:

* `main.py`: Contains the Tkinter root window configuration and game functions.
* `player_click()`: Handles button events and updates the UI state.
* `cpu_move()`: Manages the automated response logic and move validation.
* `check_win()` / `check_draw()`: Evaluates the board array for end-game conditions.
* `reset_game()`: Restores the UI components to their initial state.



## Author

* **Mario** - [GitHub Profile](https://github.com/K1lluaZk)

## License

This project is licensed under the MIT License.

---

## Image

<img width="311" height="338" alt="image" src="https://github.com/user-attachments/assets/fecac5eb-19d0-4948-bdfd-4b3a7876b098" />
