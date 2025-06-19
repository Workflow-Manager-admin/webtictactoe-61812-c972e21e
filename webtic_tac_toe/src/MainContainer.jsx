import React, { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * MainContainer component for the WebTicTacToe App.
 * Supports both Human vs Human and Human vs AI modes.
 * Implements the 3x3 board, player move logic, simple AI, and game status.
 * Uses the color palette and light theme as specified.
 */
const COLORS = {
  primary: "#4CAF50",
  secondary: "#FFC107",
  accent: "#2196F3",
  bg: "#fff",
  text: "#232323"
};

const initialBoard = Array(9).fill(null);

/**
 * PUBLIC_INTERFACE
 * Checks if the game has a winner.
 */
function calculateWinner(squares) {
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
/**
 * Chooses a valid random move for the AI (O) and returns the move's index, or null if no moves available.
 */
function chooseAIMove(board) {
  const emptyIndices = board
    .map((cell, idx) => (cell === null ? idx : null))
    .filter(idx => idx !== null);
  if (emptyIndices.length === 0) return null;
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

// PUBLIC_INTERFACE
function MainContainer() {
  /**
   * Main TicTacToe container that manages board, turn, and status, and AI logic.
   */

  // Game board state and turn
  const [board, setBoard] = useState(initialBoard);
  const [xIsNext, setXIsNext] = useState(true);
  // Game mode: "HUMAN" (Human vs Human) or "AI" (Human vs AI)
  const [mode, setMode] = useState("HUMAN"); // "HUMAN" or "AI"

  // For auto-round reset on mode change
  useEffect(() => {
    setBoard(initialBoard);
    setXIsNext(true);
  }, [mode]);

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every((cell) => cell);

  // Handles a player (human) move, only if cell is empty, game not over, and (if AI mode, not AI's turn)
  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (board[idx] || winner) return;
    // In AI mode: player's turn is always X. O moves by AI
    if (mode === "AI" && !xIsNext) return;
    const nextBoard = board.slice();
    nextBoard[idx] = xIsNext ? "X" : "O";
    setBoard(nextBoard);
    setXIsNext((prev) => !prev);
  }

  // AI makes a move whenever O's turn and in "AI" mode
  useEffect(() => {
    if (
      mode === "AI" &&
      !xIsNext &&
      !winner &&
      !isDraw
    ) {
      // Give a short delay for UX (simulate thinking)
      const aiTimer = setTimeout(() => {
        const aiIdx = chooseAIMove(board);
        if (aiIdx !== null) {
          const nextBoard = board.slice();
          nextBoard[aiIdx] = "O";
          setBoard(nextBoard);
          setXIsNext(true);
        }
      }, 400);
      return () => clearTimeout(aiTimer);
    }
  }, [mode, board, xIsNext, winner, isDraw]);

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(initialBoard);
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function handleModeChange(e) {
    setMode(e.target.value);
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
        {mode === "AI" && !xIsNext ? (
          <span style={{ color: COLORS.secondary, marginLeft: 8 }}>
            (AI thinking...)
          </span>
        ) : null}
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
      <h2 style={{ margin: "8px 0 18px 0", letterSpacing: 1 }}>
        Tic Tac Toe
      </h2>
      <div style={{
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
        gap: "18px",
      }}>
        <label htmlFor="mode-select" style={{ color: "#444", fontSize: "1rem" }}>
          Mode:&nbsp;
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={handleModeChange}
          style={{
            padding: "7px 16px",
            borderRadius: "6px",
            border: `1.5px solid ${COLORS.accent}90`,
            background: "#fafafa",
            color: COLORS.accent,
            fontWeight: 500,
            fontSize: "1rem",
            outline: "none",
            cursor: "pointer",
            appearance: "auto",
            transition: "border .15s",
          }}
          disabled={false}
        >
          <option value="HUMAN">2 Players</option>
          <option value="AI">Human vs AI</option>
        </select>
      </div>
      <div style={{
        marginBottom: "18px",
        fontSize: "1.2rem",
        letterSpacing: 0.5,
        textAlign: "center",
        minHeight: "32px",
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
              cursor:
                cell || winner || (mode === "AI" && !xIsNext)
                  ? "default"
                  : "pointer",
              boxShadow:
                cell || winner
                  ? "none"
                  : "0 1.5px 10px 0 rgba(33,150,243,0.17)",
              transition: "background .12s, box-shadow .15s",
              outline: "none",
              userSelect: "none",
            }}
            disabled={
              !!cell ||
              !!winner ||
              (mode === "AI" && !xIsNext)
            }
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
        <span style={{ color: COLORS.secondary, fontWeight: "bold" }}>O</span> = {mode === "AI" ? "AI" : "Player 2"}
      </p>
    </div>
  );
}

export default MainContainer;
