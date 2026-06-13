import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateChessModal from "../../../components/CreateChessModal/CreateChessModal";
import { API_URL } from "../../../config";

import type { Match, Matches } from "../../../types/matches";
import type { User } from "../../../types/users";

function HomePage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<Matches>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchMatchesByUserId() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/sign-in");
          return;
        }

        const response = await fetch(`${API_URL}/users/matches`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();

        console.log("matches for user", data);
        setMatches(data.matches);
        setUser(data.user);
      } catch (err: unknown) {
        console.error(err, "Failed to fetch matches");
      }
    }

    fetchMatchesByUserId();
  }, [navigate]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/chess/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete match");
      }
      setMatches((prev) => prev.filter((filter) => filter._id !== id));
    } catch (err: unknown) {
      console.error(err, "Failed to delete matches");
    }
  };

  return (
    <div>
      <h1 className="text-white text-3xl text-center font-bold mb-4">
        Home Page
      </h1>
      <div className="flex items-center gap-4 mx-10 text-2xl">
        <h2 className="text-white">My Chess Matches</h2>
        <CreateChessModal />
      </div>
      <div className="flex flex-wrap gap-2 mx-4">
        {matches.map((match: Match) => {
          if (!user) return null;
          const fen = match.fen;

          const parts = fen.split(" ");
          const turn = parts[1];
          const PlayerTurn =
            (turn === "w" && match.white._id === user._id) ||
            (turn === "b" && match.black._id === user._id);

          const winnerLabel =
            match.winner === user._id
              ? "You"
              : match.winner === match.white._id
                ? match.white.name
                : match.black.name;
          return (
            <div
              key={match._id}
              className="flex flex-[1_1_calc(50%-10px)] md:flex-[1_1_calc(33.3%-10px)] md:max-w-[33%] flex-col h-80 border border-white my-2 p-2 rounded-3xl cursor-pointer"
              onClick={() => navigate(`/chess/${match._id}`)}
            >
              <div className="relative h-[50%] w-full">
                <img
                  src={`chess.jpg`}
                  alt="Chess"
                  className="h-full w-full object-top object-cover rounded-3xl "
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevents card click (navigate)
                    handleDelete(match._id);
                  }}
                  className="absolute top-2 right-2 text-red-500 text-3xl"
                >
                  ✕
                </button>
              </div>
              <hr className="border-white my-2"></hr>
              <p className="text-white text-center">
                {match.winner ? (
                  <>
                    GameOver <br />
                    Winner: <br /> {winnerLabel}
                  </>
                ) : (
                  <>
                    Current Turn: <br /> {PlayerTurn ? "You" : "Opponent"}
                  </>
                )}
              </p>
              <div className="flex justify-between mt-auto">
                <p className="text-white px-2">
                  White: <br></br> {match.white.name}
                </p>
                <p className="text-white px-2">
                  Black: <br></br> {match.black.name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
