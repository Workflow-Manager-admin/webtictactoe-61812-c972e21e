import React, { useState } from "react";

// PUBLIC_INTERFACE
/**
 * MainContainer component for WebTicTacToe.
 * Implements the 3x3 board, player move logic, and game status.
 */
const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#2196F3",
  bg: "#fff",
  text: "#232323",
};

const initialBoard = Array(9).fill(null);

function calculateWinner(squares) {
  // PUBLIC_INTERFACE
  /** Checks if the game has a winner */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6], // diags
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * Main TicTacToe container that manages board, turn, and status.
   */
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    /**
     * Handles click on board cell: 
     * - Updates board with "X" or "O" if empty and not already won
     */
    if (board[idx] || winner) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /**
     * Resets the game to initial state.
     */
    setBoard(initialBoard);
    setXIsNext(true);
  }

  let status;
  if (winner) {
    status = (
      <span style={{ color: COLORS.primary, fontWeight: "bold" }}>
        Winner: {winner}
      </span>
    );
  } else if (isDraw) {
    status = (
      <span style={{ color: COLORS.accent, fontWeight: "bold" }}>
        It's a draw!
      </span>
    );
  } else {
    status = (
      <span>
        Next Turn:{" "}
        <span style={{
          color: xIsNext ? COLORS.primary : COLORS.secondary,
          fontWeight: "bold",
        }}>
          {xIsNext ? "X" : "O"}
        </span>
      </span>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: "80px",
      }}
    >
      <h2 style={{ margin: "8px 0 24px 0", letterSpacing: 1 }}>
        Tic Tac Toe
      </h2>
      <div style={{
        marginBottom: "18px",
        fontSize: "1.2rem",
        letterSpacing: 0.5,
        textAlign: "center",
      }}>
        {status}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 64px)",
          gridTemplateRows: "repeat(3, 64px)",
          gap: "8px",
          background: COLORS.accent + "18",
          padding: "20px",
          borderRadius: "1rem",
          boxShadow: "0 4px 18px rgba(33,150,243,0.08)",
          marginBottom: "24px",
        }}
        aria-label="Tic Tac Toe Board"
      >
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx)}
            aria-label={`Cell ${idx + 1} (currently ${cell || "empty"})`}
            style={{
              background: "#fff",
              border: `2.5px solid ${
                cell === "X"
                  ? COLORS.primary
                  : cell === "O"
                  ? COLORS.secondary
                  : COLORS.accent + "60"
              }`,
              color:
                cell === "X"
                  ? COLORS.primary
                  : cell === "O"
                  ? COLORS.secondary
                  : COLORS.accent,
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "32px",
              width: "64px",
              height: "64px",
              cursor: cell || winner ? "default" : "pointer",
              boxShadow:
                cell || winner
                  ? "none"
                  : "0 1.5px 10px 0 rgba(33,150,243,0.17)",
              transition: "background .12s, box-shadow .15s",
              outline: "none",
              userSelect: "none",
            }}
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
      <button
        onClick={handleReset}
        style={{
          background: COLORS.accent,
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          padding: "10px 26px",
          fontSize: "1rem",
          fontWeight: 500,
          letterSpacing: 0.2,
          marginTop: "12px",
          cursor: "pointer",
          transition: "background 0.15s",
        }}
      >
        Restart Game
      </button>
      <p style={{ fontSize: "1rem", color: "#69696999", marginTop: "38px" }}>
        <span style={{ color: COLORS.primary, fontWeight: "bold" }}>X</span> = Player 1 &nbsp;
        <span style={{ color: COLORS.secondary, fontWeight: "bold" }}>O</span> = Player 2
      </p>
    </div>
  );
}

export default MainContainer;
