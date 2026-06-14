import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useParams } from "react-router-dom";
import socket from "../../../../socket/socket";
import { API_URL } from "../../../../config";
import GameOverModalScreen from "../../../../components/GameOverScreenModal/GameOverScreenModal.tsx";
import type { Match } from "../../../../types/matches.ts";
import type ChessMove from "../../../../types/chessMove.ts";

function GamePage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [game, setGame] = useState(new Chess());
  const [data, setData] = useState<Match | null>(null);
  const [color, setColor] = useState<"white" | "black">("white");
  const isGameOver = game.isGameOver();
  const gameResult = isGameOver
    ? {
        type: game.isCheckmate()
          ? ("checkmate" as const)
          : game.isDraw()
            ? ("draw" as const)
            : ("stalemate" as const),
        winnerId: game.isCheckmate()
          ? game.turn() === "w"
            ? data?.black?._id
            : data?.white?._id
          : undefined,
      }
    : null;

  useEffect(() => {
    async function fetchMatch() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/chess/${matchId}`, {
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
          data.chessMatch.white._id === data.user._id ? "white" : "black";

        setColor(playerColor);
        setGame(new Chess(data.chessMatch.fen));
      } catch (error: unknown) {
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

    const handleMove = (move: ChessMove) => {
      setGame((prev) => {
        const gameCopy = new Chess(prev.fen());

        const result = gameCopy.move({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
        });

        if (!result) return prev;

        updateStatus(gameCopy);
        return new Chess(gameCopy.fen());
      });
    };

    const handleGameOver = (payload: any) => {
      console.log("Game over event received from server", payload);
    };

    socket.on("move", handleMove);
    socket.on("game-over", handleGameOver);

    return () => {
      socket.off("move", handleMove);
      socket.off("game-over", handleGameOver);
    };
  }, [matchId, data]);

  function updateStatus(gameCopy: Chess) {
    if (!data || !matchId) return;
    if (data.winner) return;
    if (gameCopy.isCheckmate()) {
      const loser = gameCopy.turn();
      const winnerColor = loser === "w" ? "black" : "white";
      const winnerId =
        winnerColor === "white" ? data.white._id : data.black._id;
      socket.emit("game-over", {
        gameId: matchId,
        type: "checkmate",
        winnerId,
      });
    } else if (gameCopy.isStalemate()) {
      socket.emit("game-over", { gameId: matchId, type: "stalemate" });
    } else if (gameCopy.isDraw()) {
      socket.emit("game-over", { gameId: matchId, type: "draw" });
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

    if (game.isGameOver()) return false;

    if (
      (color === "white" && game.turn() !== "w") ||
      (color === "black" && game.turn() !== "b")
    ) {
      return false;
    }

    const gameCopy = new Chess(game.fen());

    try {
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (!move) return false;

      updateStatus(gameCopy);
      setGame(new Chess(gameCopy.fen()));

      socket.emit("move", {
        gameId: matchId,
        move,
      });

      saveMove(gameCopy);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function saveMove(gameCopy: Chess) {
    try {
      if (!data) return;
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/chess/${matchId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fen: gameCopy.fen(),
          status: gameCopy.isGameOver() ? "finished" : "active",
          finishedAt: gameCopy.isGameOver() ? new Date() : null,
          result: gameCopy.isCheckmate()
            ? gameCopy.turn() === "w"
              ? "black"
              : "white"
            : gameCopy.isDraw()
              ? "draw"
              : null,
          winner: gameCopy.isCheckmate()
            ? gameCopy.turn() === "w"
              ? data.black._id
              : data.white._id
            : null,
        }),
      });
    } catch (error) {
      console.error("Failed to update match:", error);
    }
  }

  return (
    <>
      <section className="main">
        <div className="flex justify-center my-4 gap-4">
          <div className="bg-white h-20 w-60 rounded-3xl py-2.5 px-1">
            <p>White:</p> <div>{data?.white?.name}</div>
          </div>
          <div className="flex h-20 bg-white rounded-3xl py-2.5 px-1">
            <p className="text-center px-5">
              Turn: <br /> {game.turn() === color[0] ? "you" : "opponent"}
            </p>
          </div>
          <div className="bg-white h-20 w-60 rounded-3xl py-2.5 px-1">
            <p>Black:</p> <div>{data?.black?.name}</div>
          </div>
        </div>
        <div className=" w-[90%] md:w-100 xl:w-150 m-auto">
          <Chessboard
            options={{
              boardOrientation: color,
              position: game.fen(),
              onPieceDrop,
            }}
          />
          {isGameOver && (
            <GameOverModalScreen gameResult={gameResult} data={data} />
          )}
        </div>
      </section>
    </>
  );
}

export default GamePage;
