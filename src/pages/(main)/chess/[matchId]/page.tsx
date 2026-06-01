import { useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

function GamePage() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState<string>("playing");

  const profiles = { user: { name: "Name 1" }, opponent: { name: "Name 2" } };

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
      <section className="main">
        <div className="flex justify-around">
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "yellow" : "gray" }}
          >
            <p>User:</p>
            <div>{profiles.user.name}</div>
          </div>
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "gray" : "yellow" }}
          >
            <p>Opponent:</p>
            <div>{profiles.opponent.name}</div>
          </div>
        </div>
        <div className="flex h-12 bg-white rounded-3xl my-5 mx-4">
          <h2 className="m-auto md:w-96 md:my-5 md:mx-auto">{status}</h2>
        </div>
        <div className="mx-4 md:w-[50%] md:m-auto">
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

export default GamePage;
