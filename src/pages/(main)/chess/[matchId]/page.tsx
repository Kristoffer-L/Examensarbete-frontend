import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";

function GamePage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [game, setGame] = useState(new Chess());
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<string>("playing");

  useEffect(() => {
    async function fetchMatch() {
      try {
        const response = await fetch(`http://localhost:3000/chess/${matchId}`);
        const data = await response.json();
        console.log("match data", data);
        setGame(new Chess(data.fen));
        setData(data);
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    }

    fetchMatch();
  }, [matchId]);

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
    saveMove(gameCopy, move);
    return true;
  }

  async function saveMove(gameCopy: Chess, move: any) {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:3000/chess/${matchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fen: gameCopy.fen(),
          status: gameCopy.isGameOver() ? "finished" : "active",
        }),
      });
    } catch (error) {
      console.error("Failed to update match:", error);
    }
  }

  function resetGame() {
    setGame(new Chess());
    setStatus("playing");
  }

  return (
    <>
      <section className="main">
        <div className="flex justify-between mx-4">
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "yellow" : "gray" }}
          >
            <p>User:</p>
            <div>{data.whitePlayer.name}</div>
          </div>
          <div className="flex bg-white rounded-3xl my-5">
            <h2 className="m-auto px-4 md:my-5 md:mx-auto">{status}</h2>
          </div>
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "gray" : "yellow" }}
          >
            <p>Opponent:</p>
            <div>{data.blackPlayer.name}</div>
          </div>
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
