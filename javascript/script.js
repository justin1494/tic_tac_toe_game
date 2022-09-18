const X_CLASS = "x";
const CIRCLE_CLASS = "circle";
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cellElements = document.querySelectorAll(".board__playground__square");
const xTurnSign = document.querySelector(".x-turn");
const circleTurnSign = document.querySelector(".circle-turn");
const restartBtn = document.querySelector(".board__settings__reset__btn");
const quitBtn = document.querySelector(".winning-message__buttons--quit");
const winningMessage = document.querySelector(".winning-message-background");
const winningMessageTitle = document.querySelector(".winning-message__title");
const winningMessageInfoX = document.querySelector(".winning-message__info--x");
const winningMessageInfoCircle = document.querySelector(
  ".winning-message__info--circle"
);
const winningMessageInfoTie = document.querySelector(
  ".winning-message__info--tie"
);
const nextRound = document.querySelector(".winning-message__buttons--next");
const winScore = document.querySelector(".score-you");
const tieScore = document.querySelector(".score-ties");
const cpuScore = document.querySelector(".score-cpu");

// variables

// if true it is circle turn if false it is x turn
let circleTurn = false;
let winPoints = 0;
let tiePoints = 0;
let cpuPoints = 0;

// --------------

const placeMark = (cell, currentClass) => {
  cell.classList.add(currentClass);
};

const swapTurns = () => {
  circleTurn = !circleTurn;
};

const changeTurnSign = () => {
  if (circleTurn) {
    circleTurnSign.classList.remove("nonvisible");
    xTurnSign.classList.add("nonvisible");
  } else {
    circleTurnSign.classList.add("nonvisible");
    xTurnSign.classList.remove("nonvisible");
  }
};

const restartGame = () => {
  cellElements.forEach((cell) => {
    cell.classList.remove("x");
    cell.classList.remove("circle");
    startGame();
  });
};

// checks every combination if cells contain the same class
const checkWin = (currentClass) => {
  return WINNING_COMBINATIONS.some((combination) => {
    return combination.every((index) => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
};

const isDraw = () => {
  return [...cellElements].every((cell) => {
    return (
      cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
    );
  });
};

const scoreCount = () => {
  winScore.textContent = winPoints;
  tieScore.textContent = tiePoints;
  cpuScore.textContent = cpuPoints;
};

const getRandom = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1));
};

const cpuMove = (currentClass) => {
  let randomIndex = getRandom(0, 8);

  if (
    cellElements[randomIndex].classList.contains(`${X_CLASS}`) ||
    cellElements[randomIndex].classList.contains(`${CIRCLE_CLASS}`)
  ) {
    cpuMove(currentClass);
    // tu dodać else if (jeśli nie ma gdzie postawić to jest remis.)
  } else {
    setTimeout(() => {
      cellElements[randomIndex].classList.add(currentClass);
      cellElements[randomIndex].style.pointerEvents = "none";
      if (checkWin(currentClass) && currentClass === "circle") {
        winningMessage.classList.remove("nonvisible");
        winningMessageInfoCircle.classList.remove("nonvisible");
        winningMessageTitle.children[0].textContent = "CPU";
        return cpuPoints++;
      } else if (checkWin(currentClass) && currentClass === "x") {
        winningMessage.classList.remove("nonvisible");
        winningMessageInfoX.classList.remove("nonvisible");
        return winPoints++;
      } else if (isDraw()) {
        winningMessage.classList.remove("nonvisible");
        winningMessageInfoTie.classList.remove("nonvisible");
        winningMessageTitle.children[0].textContent = "NOONE";
        return tiePoints++;
      }
    }, 200);
  }
};

const handleClick = (e) => {
  const cell = e.target;

  const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS;
  placeMark(cell, currentClass);

  // cpuMove(!circleTurn ? CIRCLE_CLASS : X_CLASS);

  if (checkWin(currentClass) && currentClass === "circle") {
    winningMessage.classList.remove("nonvisible");
    winningMessageInfoCircle.classList.remove("nonvisible");
    winningMessageTitle.children[0].textContent = "CPU";
    return cpuPoints++;
  } else if (checkWin(currentClass) && currentClass === "x") {
    winningMessage.classList.remove("nonvisible");
    winningMessageInfoX.classList.remove("nonvisible");
    return winPoints++;
  } else if (isDraw()) {
    winningMessage.classList.remove("nonvisible");
    winningMessageInfoTie.classList.remove("nonvisible");
    winningMessageTitle.children[0].textContent = "NOONE";
    return tiePoints++;
  }

  changeTurnSign();
  cpuMove(!circleTurn ? CIRCLE_CLASS : X_CLASS);
};

const startGame = () => {
  cellElements.forEach((cell) => {
    cell.style.pointerEvents = "visible";
  });
  scoreCount();
  cellElements.forEach((cell) => {
    cell.addEventListener("click", handleClick, { once: true });
    //   {once: true} - powoduje, że na każdym elemencie, czyli cell można kiknąc tylko i wyłącznie raz!
  });
  winningMessage.classList.add("nonvisible");
  winningMessageInfoCircle.classList.add("nonvisible");
  winningMessageInfoX.classList.add("nonvisible");
  winningMessageInfoTie.classList.add("nonvisible");
};
startGame();

restartBtn.addEventListener("click", restartGame);
nextRound.addEventListener("click", restartGame);
quitBtn.addEventListener("click", () => {
  restartGame();
  winPoints = 0;
  tiePoints = 0;
  cpuPoints = 0;
  scoreCount();
});
