import type { Match } from "../../types/matches";
import { useNavigate } from "react-router-dom";
type Props = {
  gameResult: {
    type: "checkmate" | "stalemate" | "draw";
    winnerId?: string;
  } | null;
  data: Match | null;
};

export default function GameOverModalScreen({ gameResult, data }: Props) {
  const navigate = useNavigate();
  if (!data) return null;
  if (!gameResult) return null;

  const winnerName =
    gameResult.type === "checkmate"
      ? gameResult.winnerId === data.white._id
        ? data.white.name
        : data.black.name
      : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-[#007500] w-full max-w-xl p-10 rounded-xl m-auto">
        {gameResult.type === "checkmate" && (
          <>
            <h2 className="text-white text-4xl font-bold">Checkmate</h2>
            <p className="text-white">Winner: {winnerName}</p>
          </>
        )}

        {gameResult.type === "draw" && (
          <h2 className="text-white text-xl font-bold">Draw</h2>
        )}

        {gameResult.type === "stalemate" && (
          <h2 className="text-white text-xl font-bold">Stalemate</h2>
        )}
        <button
          onClick={() => navigate(`/`)}
          className="my-4 px-4 py-2 bg-[#009700] text-white rounded-xl border border-white"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
