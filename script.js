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
let gameOver = false;
let winner = null;

// HELPER FUNCTIONS
const isEmpty = (row, column) => boardSetup[row][column] === "";
const isPawn = (piece) => piece.toLowerCase() === "p";
const isRook = (piece) => piece.toLowerCase() === "r";
const isBishop = (piece) => piece.toLowerCase() === "b";
const isKing = (piece) => piece.toLowerCase() === "k";
const isQueen = (piece) => piece.toLowerCase() === "q";
const isKnight = (piece) => piece.toLowerCase() === "n";
const isSameColor = (piece1, piece2) => {
    // Both pieces must be non-empty
    if (piece1 === "" || piece2 === "") return false;

    return (isUpper(piece1) && isUpper(piece2)) || (isLower(piece1) && isLower(piece2));
}
const isUpper = (char) => char === char.toUpperCase();
const isLower = (char) => char === char.toLowerCase();
const isWhite = (piece) => piece === piece.toUpperCase();

function checkIfPathClear(fromRow, fromCol, toRow, toCol) {
  // Determine the direction of movement
  const rowStep = toRow > fromRow ? 1 : toRow < fromRow ? -1 : 0;
  const colStep = toCol > fromCol ? 1 : toCol < fromCol ? -1 : 0;

  let currentRow = fromRow + rowStep;
  let currentCol = fromCol + colStep;

  // Check each square along the path
  while (currentRow !== toRow || currentCol !== toCol) {
    if (!isEmpty(currentRow, currentCol)) {
      return false; // Path is blocked
    }

    currentRow += rowStep;
    currentCol += colStep;
  }

  return true; // Path is clear
}

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
  if (!checkIfPathClear(fromRow, fromCol, toRow, toCol)) {
    return false; // Path is blocked
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
  if (!checkIfPathClear(fromRow, fromCol, toRow, toCol)) {
    return false; // Path is blocked
  }

  // Check destination square
  const target = boardSetup[toRow][toCol];

  if (target !== "" && isSameColor(piece, target)) {
    return false; // Cannot capture own piece
  }

  return true; // Valid move
}

function canKingMove(fromRow, fromCol, toRow, toCol) {
  // Check if piece selected is a king
  const piece = boardSetup[fromRow][fromCol];

  if (!isKing(piece)) return false;

  // Check if the move is within one square by comparing the absolute differences
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (rowDiff <= 1 && colDiff <= 1) {
    // Check destination square
    const target = boardSetup[toRow][toCol];

    if (target !== "" && isSameColor(piece, target)) {
      return false; // Cannot capture own piece
    }

    return true; // Valid move
  }

  return false; // Invalid move
}

function canQueenMove(fromRow, fromCol, toRow, toCol) {
  // Check if piece selected is a queen
  const piece = boardSetup[fromRow][fromCol];

  if (!isQueen(piece)) return false;

  // Check if moving horizontally, vertically, or diagonally
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (fromRow !== toRow && fromCol !== toCol && rowDiff !== colDiff) {
    return false; // Not moving in straight line or diagonally
  }

  // Check if path is clear
  if (!checkIfPathClear(fromRow, fromCol, toRow, toCol)) {
    return false; // Path is blocked
  }

  // Check destination square
  const target = boardSetup[toRow][toCol];

  if (target !== "" && isSameColor(piece, target)) {
    return false; // Cannot capture own piece
  }
  
  return true; // Valid move
}

function canKnightMove(fromRow, fromCol, toRow, toCol) {
  // Check if piece selected is a knight
  const piece = boardSetup[fromRow][fromCol];

  if (!isKnight(piece)) return false;

  // Check if the move follows the "L" shape pattern
  // A knight moves two squares in one direction and one square perpendicular
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  if (
    (rowDiff === 2 && colDiff === 1) ||
    (rowDiff === 1 && colDiff === 2)
  ) {
    // Check destination square
    const target = boardSetup[toRow][toCol];

    if (target !== "" && isSameColor(piece, target)) {
      return false; // Cannot capture own piece
    }

    return true; // Valid move
  }

  return false; // Invalid move
}

function isCheckmate(isWhite) {
  // Iterate through all pieces of the given color
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = boardSetup[row][col];

      if (piece === "") continue; // Empty square

      // Check only pieces of the specified color
      if (isWhite && isUpper(piece) || !isWhite && isLower(piece)) {
        // Try all possible moves for this piece
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (row === toRow && col === toCol) continue; // Same square

            let canMove = false;

            if (isPawn(piece)) {
              canMove = canPawnMove(row, col, toRow, toCol);
            } else if (isRook(piece)) {
              canMove = canRookMove(row, col, toRow, toCol);
            } else if (isBishop(piece)) {
              canMove = canBishopMove(row, col, toRow, toCol);
            } else if (isQueen(piece)) {
              canMove = canQueenMove(row, col, toRow, toCol);
            } else if (isKing(piece)) {
              canMove = canKingMove(row, col, toRow, toCol);
            } else if (isKnight(piece)) {
              canMove = canKnightMove(row, col, toRow, toCol);
            }

            if (canMove) {
              // Simulate the move
              const originalTarget = boardSetup[toRow][toCol];
              boardSetup[toRow][toCol] = piece;
              boardSetup[row][col] = "";

              // Check if king is still in check
              const inCheck = isKingInCheck(isWhite);

              // Revert the move
              boardSetup[row][col] = piece;
              boardSetup[toRow][toCol] = originalTarget;

              if (!inCheck) {
                return false; // Found a valid move to escape check
              }
            }
          }
        }
      }
    }
  }

  return true; // No valid moves found, checkmate
}

function isKingInCheck(isWhite) {
  // Find the king's position
  const kingPiece = isWhite ? "K" : "k";
  let kingPosition = null;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (boardSetup[row][col] === kingPiece) {
        kingPosition = { row, col };

        break;
      }
    }
  }

  if (!kingPosition) {
    console.log("King not found on the board!");

    return false; // King not found
  }

  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = boardSetup[row][col];

      if (piece === "") continue; // Empty square

      // Check only opponent pieces
      if (isWhite && isLower(piece) || !isWhite && isUpper(piece)) {
        let canAttack = false;

        if (isPawn(piece)) {
          canAttack = canPawnMove(row, col, kingPosition.row, kingPosition.col);
        } else if (isRook(piece)) {
          canAttack = canRookMove(row, col, kingPosition.row, kingPosition.col);
        } else if (isBishop(piece)) {
          canAttack = canBishopMove(row, col, kingPosition.row, kingPosition.col);
        } else if (isQueen(piece)) {
          canAttack = canQueenMove(row, col, kingPosition.row, kingPosition.col);
        } else if (isKing(piece)) {
          canAttack = canKingMove(row, col, kingPosition.row, kingPosition.col);
        } else if (isKnight(piece)) {
          canAttack = canKnightMove(row, col, kingPosition.row, kingPosition.col);
        }

        if (canAttack) {
          return true; // King is in check
        }
      }
    }
  }
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
    // Validate move if king
    else if (isKing(movingPiece)) {
      if (!canKingMove(from.row, from.col, row, col)) {
          console.log("Invalid king move");
          return; // Invalid king move
      }
    }
    // Validate move if queen
    else if (isQueen(movingPiece)) {
      if (!canQueenMove(from.row, from.col, row, col)) {
          console.log("Invalid queen move");
          return; // Invalid queen move
      }
    } else if (isKnight(movingPiece)) {
      if (!canKnightMove(from.row, from.col, row, col)) {
          console.log("Invalid knight move");
          return; // Invalid knight move
      }
    }

    // Check if move puts own king in check
    const originalTarget = boardSetup[row][col];
    boardSetup[row][col] = movingPiece;
    boardSetup[from.row][from.col] = "";

    if (isKingInCheck(isWhiteTurn)) {
      // Revert move
      boardSetup[from.row][from.col] = movingPiece;
      boardSetup[row][col] = originalTarget;

      console.log("Move would put own king in check!");

      return; // Invalid move
    }

    if (isCheckmate(!isWhiteTurn)) {
      gameOver = true;
      winner = isWhiteTurn ? "White" : "Black";
      console.log(`Checkmate! ${winner} wins!`);
    }

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
