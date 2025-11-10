let selectedPiece = null;
let boardSetup = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

function handleClickSquare(row, col) {
  const piece = boardSetup[row][col];

  if (!selectedPiece) {
    if (piece === "") return; // No piece to select
    selectedPiece = { row, col };
    highlightSquare(row, col);
  } else {
    // Move piece
    const from = selectedPiece;
    boardSetup[row][col] = boardSetup[from.row][from.col];
    boardSetup[from.row][from.col] = "";
    selectedPiece = null;
    createBoard();
  }
}

function highlightSquare(row, col) {
  const squares = document.querySelectorAll(".square");
  squares.forEach((square) => square.classList.remove("selected"));
  const index = row * 8 + col;
  squares[index].classList.add("selected");
}

function createBoard() {
  const board = document.getElementById("board");

  // Clear existing board
  board.innerHTML = "";

  // Create 64 squares for the chess board
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square");
      square.classList.add((row + col) % 2 === 0 ? "light" : "dark");
      square.classList.add(boardSetup[row][col] === "" ? "empty" : "pointer");
      square.textContent = boardSetup[row][col];
      square.dataset.row = row;
      square.dataset.col = col;

      square.addEventListener("click", () => handleClickSquare(row, col));
      board.appendChild(square);
    }
  }
}

function main() {
  createBoard();
}

main();
