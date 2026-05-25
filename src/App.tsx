import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import "./App.css";

function App() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<string>("playing");

  function updateStatus(gameCopy: Chess) {
    if (gameCopy.isCheckmate()) {
      const loser = gameCopy.turn() === "w" ? "White" : "Black";
      const winner = loser === "White" ? "Black" : "White";
      setStatus(`Checkmate! You ${winner === "White" ? "win" : "lost"}`);
    } else if (gameCopy.isStalemate()) {
      setStatus("stalemate");
    } else if (gameCopy.isDraw()) {
      setStatus("Draw 🤝");
    } else {
      setStatus("playing");
    }
  }

  function onPieceDrop({
    sourceSquare,
    targetSquare,
  }: {
    sourceSquare: string | null;
    targetSquare: string | null;
  }): boolean {
    if (!sourceSquare || !targetSquare) return false;

    const gameCopy = new Chess(game.fen());

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    setGame(gameCopy);
    updateStatus(gameCopy);

    return true;
  }

  function resetGame() {
    setGame(new Chess());
    setStatus("playing");
  }

  return (
    <>
      <section className="header"></section>
      <section className="main">
        <div className="profile-container">
          <div
            className="player-user-card"
            style={{ borderColor: game.turn() === "w" ? "yellow" : "gray" }}
          >
            <p>User:</p>
            <div>Name 1</div>
          </div>
          <div
            className="player-opponent-card"
            style={{ borderColor: game.turn() === "w" ? "gray" : "yellow" }}
          >
            <p>Opponent:</p>
            <div>Name 2</div>
          </div>
        </div>
        <div className="status-container">
          <h1>{status}</h1>
        </div>
        <div className="chess-board">
          <Chessboard
            options={{
              position: game.fen(),
              onPieceDrop,
            }}
          />
        </div>
        <button onClick={resetGame}>Reset</button>
      </section>
    </>
  );
}

export default App;
