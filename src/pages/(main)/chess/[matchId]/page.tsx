import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";
import socket from "../../../../socket/socket";

function GamePage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [game, setGame] = useState(new Chess());
  const [data, setData] = useState<any>(null);
  const [color, setColor] = useState<"white" | "black">("white");
  const [status, setStatus] = useState<string>("playing");

  useEffect(() => {
    async function fetchMatch() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:3000/chess/${matchId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log("match data", data);

        setData(data.chessMatch);
        const playerColor =
          data.chessMatch.whitePlayer._id === data.user._id ? "white" : "black";

        setColor(playerColor);
        setGame(new Chess(data.chessMatch.fen));
      } catch (error) {
        console.error("Error fetching match:", error);
      }
    }

    fetchMatch();
  }, [matchId]);

  useEffect(() => {
    if (!matchId) return;

    console.log("joining room:", matchId);

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("join-game", matchId);

    const handleMove = (move: any) => {
      setGame((prev) => {
        const gameCopy = new Chess(prev.fen());

        const result = gameCopy.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });

        if (!result) return prev;

        updateStatus(gameCopy);
        return gameCopy;
      });
    };

    socket.on("move", handleMove);

    return () => {
      socket.off("move", handleMove);
    };
  }, [matchId]);

  function updateStatus(gameCopy: Chess) {
    if (gameCopy.isCheckmate()) {
      const loser = gameCopy.turn() === "w" ? "White" : "Black";
      const winner = loser === "White" ? "Black" : "White";
      setStatus(`Checkmate! You ${winner === "White" ? "win" : "lost"}`);
    } else if (gameCopy.isStalemate()) {
      setStatus("stalemate");
    } else if (gameCopy.isDraw()) {
      setStatus("Draw");
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

    if (
      (color === "white" && game.turn() !== "w") ||
      (color === "black" && game.turn() !== "b")
    ) {
      return false;
    }

    const gameCopy = new Chess(game.fen());

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) return false;

    setGame(gameCopy);
    updateStatus(gameCopy);

    socket.emit("move", {
      gameId: matchId,
      move,
    });

    saveMove(gameCopy);
    return true;
  }

  async function saveMove(gameCopy: Chess) {
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

  return (
    <>
      <section className="main">
        <div className="flex justify-between mx-4">
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "yellow" : "gray" }}
          >
            <p>White:</p>
            <div>{data?.whitePlayer?.name}</div>
          </div>
          <div className="flex bg-white rounded-3xl my-5">
            <h2 className="m-auto px-4 md:my-5 md:mx-auto">{status}</h2>
          </div>
          <div
            className="bg-white h-20 w-60 border-2 border-solid border-gray-500 rounded-3xl py-2.5 px-1 m-4"
            style={{ borderColor: game.turn() === "w" ? "gray" : "yellow" }}
          >
            <p>Black:</p>
            <div>{data?.blackPlayer?.name}</div>
          </div>
        </div>
        <div className="mx-4 md:w-[50%] md:m-auto">
          <Chessboard
            options={{
              boardOrientation: color,
              position: game.fen(),
              onPieceDrop,
            }}
          />
        </div>
      </section>
    </>
  );
}

export default GamePage;
