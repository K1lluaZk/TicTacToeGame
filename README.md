<p align="center">
<h1 align="center">Tic Tac Toe (Console Version)</h1>
<p align="center">A minimalist terminal-based implementation of the classic game using Python.</p>
</p>

<p align="center"> <img src="https://img.shields.io/badge/Python-3.x-blue?style=flat-square&logo=python&logoColor=white" alt="Python Version"> <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License"> </p>

---

## About the Project

This project is a lightweight, console-based Tic Tac Toe game developed to demonstrate fundamental programming principles. It focuses on clean code structure, efficient control flow, and robust user input validation within a 3x3 grid environment.

## Features

* **Human vs. CPU:** Interactive gameplay against an automated opponent.
* **CPU Logic:** The computer selects moves based on available valid positions using randomized selection.
* **Input Validation:** Ensures user moves are within the correct numeric range and prevents overwriting occupied cells.
* **Game State Management:** Automatic detection of win conditions and draw scenarios.
* **Text-Based Interface:** Clean and intuitive grid rendering directly in the terminal.

## Technologies Used

* **Python 3**: Core logic and runtime environment.
* **Random Module**: Utilized for CPU move generation.

## How to Run

1. **Clone the repository:**
```bash
git clone https://github.com/username/tic-tac-toe-console.git

```


2. **Navigate to the directory:**
```bash
cd tic-tac-toe-console

```


3. **Run the application:**
```bash
python main.py

```



## Project Structure

The source code follows a functional programming approach with a clear separation of concerns:

* `main.py`: Main entry point containing the game loop.
* `render_board()`: Manages the visual representation of the grid.
* `handle_input()`: Manages user interaction and data sanitization.
* `check_win()`: Evaluates the board against predefined winning combinations.
* `check_draw()`: Monitors board capacity to identify tie games.
* `cpu_move()`: Implements the logic for the automated player (X).

## Author

* **Mario** - [GitHub Profile](https://github.com/K1lluaZk)

## License

This project is licensed under the MIT License.
