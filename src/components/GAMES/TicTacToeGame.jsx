import React, { useState } from "react";
import s from "./TictacToeGame.module.css";

const TURNS = {
  X: "❌",
  O: "⭕",
};

const PLAYER = ["alone", "multi"];

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const WinnerModal = ({ winner, resetGame }) => {
  if (winner === null) return null;

  const winnerText = winner === false ? "Empate" : "Ganó:";

  return (
    <section className={s.winner}>
      <div className={s.text}>
        <h2>{winnerText}</h2>

        <header className={s.win}>
          {winner ? <Square>{winner}</Square> : <Square>😔</Square>}
        </header>

        <footer>
          <button onClick={resetGame}>Empezar de nuevo</button>
        </footer>
      </div>
    </section>
  );
};

const Square = ({ children, updateBoard, isSelected, index }) => {
  const handleClick = () => {
    updateBoard(index);
  };

  return (
    <div
      className={`${s.square} ${isSelected ? s.isSelected : ""}`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

const TicTacToeGame = () => {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });
  const [winner, setWinner] = useState(null);

  const [player, setPlayer] = useState(PLAYER[0]);

  const playerAlone = () => {
    const iaIndex = Math.floor(Math.random() * 10);
  };

  const checkWinnerFrom = (boardToCheck) => {
    for (const combo of WINNER_COMBOS) {
      const [a, b, c] = combo;
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a];
      }
    }
    return null;
  };

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  const saveGameToStorage = ({ board, turn }) => {
    window.localStorage.setItem("board", JSON.stringify(board));
    window.localStorage.setItem("turn", turn);
  };

  const resetGameStorage = () => {
    window.localStorage.removeItem("board");
    window.localStorage.removeItem("turn");
  };
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    resetGameStorage();
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    const newTurn = turn == TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
    });

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      setWinner(newWinner);
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
    }
  };

  return (
    <div className={s.body}>
      <div className={s.board}>
        <h2>Tic Tac Toe</h2>
        {/* <section>
          <button onClick={setPlayer(PLAYER[1])}>Jugar de a 2</button>
          <button onClick={setPlayer(PLAYER[0])}>Jugar Solo</button>
        </section> */}

        <section className={s.game}>
          {board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>
            );
          })}
        </section>
        <section className={s.turn}>
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        <button onClick={resetGame}>Reset del juego</button>
        <WinnerModal resetGame={resetGame} winner={winner} />
      </div>
    </div>
  );
};
export { TicTacToeGame };
