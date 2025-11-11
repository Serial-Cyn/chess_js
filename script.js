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
let selectedPiece = null;

// HELPER FUNCTIONS
const isEmpty = (row, column) => boardSetup[row][column] === "";
const isPawn = (piece) => piece.toLowerCase() === "p";
const isRook = (piece) => piece.toLowerCase() === "r";
const isBishop = (piece) => piece.toLowerCase() === "b";
const isSameColor = (piece1, piece2) => {
    // Both pieces must be non-empty
    if (piece1 === "" || piece2 === "") return false;

    return (isUpper(piece1) && isUpper(piece2)) || (isLower(piece1) && isLower(piece2));
}
const isUpper = (char) => char === char.toUpperCase();
const isLower = (char) => char === char.toLowerCase();
const isWhite = (piece) => piece === piece.toUpperCase();

function canPawnMove(fromRow, fromCol, toRow, toCol) {
    const piece = boardSetup[fromRow][fromCol];

    if (!isPawn(piece)) return false; // Not a pawn

    const white = isWhite(piece);
    const direction = white ? -1 : 1; // White moves up, Black moves down
    const startRow = white ? 6 : 1;
    const rowDiff = toRow - fromRow;
    const colDiff = toCol - fromCol;

    // Straight moves
    if (colDiff === 0) {
        // One square forward
        if (rowDiff === direction) {
            if (isEmpty(toRow, toCol)) return true;

            return false; // Blocked
        }

        // Two squares forward from starting position
        if (rowDiff === 2 * direction) {
            if (fromRow === startRow && isEmpty(fromRow + direction, fromCol) && isEmpty(toRow, toCol)) {
                return true;
            }

            return false; // Blocked or not at starting position
        }

        return false; // Invalid straight move
    }

    // Diagonal captures
    if (Math.abs(colDiff) === 1 && rowDiff === direction) {
        const target = boardSetup[toRow][toCol];
        
        if (target !== "" && !isSameColor(piece, target)) {
            return true; // Valid capture
        }

        return false; // No piece to capture
    }

    return false; // Invalid move
}

function canRookMove(fromRow, fromCol, toRow, toCol) {
  // Check if piece selected is a rook
  const piece = boardSetup[fromRow][fromCol];

  if (!isRook(piece)) return false;

  if (fromRow !== toRow && fromCol !== toCol) {
    return false; // Not moving in straight line
  }

  // Check if path is clear
  // Horizontal movement
  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (!isEmpty(fromRow, col)) {
        return false; // Path blocked
      }
    }
  }

  // Vertical movement
  if (fromCol === toCol) {
    const step = fromRow < toRow ? 1 : -1;
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (!isEmpty(row, fromCol)) {
        return false; // Path blocked
      }
    }
  }

  // Check destination square
  const target = boardSetup[toRow][toCol];
  if (target !== "" && isSameColor(piece, target)) {
    return false; // Cannot capture own piece
  }

  return true; // Valid move
}

function canBishopMove(fromRow, fromCol, toRow, toCol) {
  // Check if piece selected is a bishop
  const piece = boardSetup[fromRow][fromCol];

  if (!isBishop(piece)) return false;

  // When moving diagonally, the absolute difference between row and column changes must be equal
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (rowDiff !== colDiff) {
    return false; // Not moving diagonally
  }

  // Check if path is clear
  // Determine the direction of movement
  const rowStep = toRow > fromRow ? 1 : -1;
  const colStep = toCol > fromCol ? 1 : -1;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  // Check each square along the path
  while (currentRow !== toRow && currentCol !== toCol) {
    if (!isEmpty(currentRow, currentCol)) {
      return false; // Path is blocked
    }

    currentRow += rowStep;
    currentCol += colStep;
  }

  // Check destination square
  const target = boardSetup[toRow][toCol];

  if (target !== "" && isSameColor(piece, target)) {
    return false; // Cannot capture own piece
  }

  return true; // Valid move
}

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

    if (from.row === row && from.col === col) {
      selectedPiece = null;
      createBoard();

      return; // Deselect piece
    }

    // Validate move if pawn
    if (isPawn(movingPiece)) {
        // Try to move pawn
        if (!canPawnMove(from.row, from.col, row, col)) {
            console.log("Invalid pawn move");
            return; // Invalid pawn move
        }
    }
    // Validate move if rook
    else if (isRook(movingPiece)) {
        if (!canRookMove(from.row, from.col, row, col)) {
            console.log("Invalid rook move");
            return; // Invalid rook move
        }
    }
    // Validate move if bishop
    else if (isBishop(movingPiece)) {
      if (!canBishopMove(from.row, from.col, row, col)) {
          console.log("Invalid bishop move");
          return; // Invalid bishop move
      }
    }

    // Perform move
    boardSetup[row][col] = movingPiece;
    boardSetup[from.row][from.col] = "";

    // Switch turn
    isWhiteTurn = !isWhiteTurn;
    console.log(isWhiteTurn ? "White's turn" : "Black's turn");

    // Reset selection
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
