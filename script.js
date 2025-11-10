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

let isWhiteTurn = true;

function getPieceAt(row, col) {
  selectedPiece = { row, col };
  highlightSquare(row, col);
}

function handleClickSquare(row, col) {
  const piece = boardSetup[row][col];

  if (!selectedPiece) {
    if (piece === "") return; // No piece to select

    // Validate selection
    if (isWhiteTurn && piece === piece.toUpperCase()) {
      getPieceAt(row, col);
    } else if (!isWhiteTurn && piece === piece.toLowerCase()) {
      getPieceAt(row, col);
    } else {
      console.log("Not your turn yet bro!");

      return; // Invalid piece selection
    }
  } else {
    // Move piece
    const from = selectedPiece;
    const movingPiece = boardSetup[from.row][from.col];

    boardSetup[row][col] = movingPiece;
    boardSetup[from.row][from.col] = "";

    isWhiteTurn = !isWhiteTurn;
    console.log(isWhiteTurn ? "White's turn" : "Black's turn");

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
