const boardSize = 4;
let board = [];
let score = 0;

window.onload = () => {
  createBoard();
  initGame();
  document.addEventListener("keydown", handleKeyPress);
};

function createBoard() {
  const boardContainer = document.getElementById("board");
  for (let i = 0; i < boardSize * boardSize; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = "tile-" + i;
    boardContainer.appendChild(tile);
  }
}

function initGame() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  addRandomTile();
  addRandomTile();
  updateBoard();
}

function addRandomTile() {
  let emptyTiles = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) {
        emptyTiles.push({ r, c });
      }
    }
  }

  if (emptyTiles.length === 0) return;

  let { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      let value = board[r][c];
      let tile = document.getElementById("tile-" + (r * boardSize + c));
      tile.textContent = value === 0 ? "" : value;
      tile.style.backgroundColor = getTileColor(value);
      if (value === 2048) {
        document.getElementById("status").textContent = "🎉 You Win!";
      }
    }
  }

  document.getElementById("score").textContent = score;

  // Check for game over
  if (isGameOver()) {
    document.getElementById("status").textContent = "💀 Game Over!";
  }
}


function getTileColor(value) {
  const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e"
  };
  return colors[value] || "#3c3a32";
}

function slide(row) {
  let arr = row.filter(val => val !== 0);
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val !== 0);
  while (arr.length < boardSize) arr.push(0);
  return arr;
}

function moveLeft() {
  let moved = false;
  for (let r = 0; r < boardSize; r++) {
    let original = [...board[r]];
    board[r] = slide(board[r]);
    if (original.toString() !== board[r].toString()) moved = true;
  }
  return moved;
}

function moveRight() {
  let moved = false;
  for (let r = 0; r < boardSize; r++) {
    let original = [...board[r]];
    board[r] = slide(board[r].reverse()).reverse();
    if (original.toString() !== board[r].toString()) moved = true;
  }
  return moved;
}

function moveUp() {
  let moved = false;
  for (let c = 0; c < boardSize; c++) {
    let col = [];
    for (let r = 0; r < boardSize; r++) col.push(board[r][c]);
    let original = [...col];
    col = slide(col);
    for (let r = 0; r < boardSize; r++) board[r][c] = col[r];
    if (original.toString() !== col.toString()) moved = true;
  }
  return moved;
}

function moveDown() {
  let moved = false;
  for (let c = 0; c < boardSize; c++) {
    let col = [];
    for (let r = 0; r < boardSize; r++) col.push(board[r][c]);
    let original = [...col];
    col = slide(col.reverse()).reverse();
    for (let r = 0; r < boardSize; r++) board[r][c] = col[r];
    if (original.toString() !== col.toString()) moved = true;
  }
  return moved;
}

function handleKeyPress(e) {
  console.log("Key pressed:", e.key);
  let moved = false;
  switch (e.key) {
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function handleMove(direction) {
  let moved = false;
  switch (direction) {
    case "left":
      moved = moveLeft();
      break;
    case "right":
      moved = moveRight();
      break;
    case "up":
      moved = moveUp();
      break;
    case "down":
      moved = moveDown();
      break;
  }
  if (moved) {
    addRandomTile();
    updateBoard();
  }
}

function resetGame() {
  score = 0;
  document.getElementById("status").textContent = "";
  initGame();
}

function isGameOver() {
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) return false;
      if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
      if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
    }
  }
  return true;
}
