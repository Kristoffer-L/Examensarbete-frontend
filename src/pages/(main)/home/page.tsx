import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateChessModal from "../../../components/CreateChessModal/CreateChessModal";

function HomePage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    async function fetchMatchesByUserId() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/sign-in");
          return;
        }

        const response = await fetch(`http://localhost:3000/users/matches`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();

        console.log("matches for user", data);
        setMatches(data.matches);
      } catch (error) {
        console.error("Error fetching matches for user:", error);
      }
    }

    fetchMatchesByUserId();
  }, [navigate]);

  return (
    <div>
      <h1 className="text-white text-3xl text-center font-bold mb-4">
        Home Page
      </h1>
      <div className="flex items-center gap-4">
        <h2 className="text-white">My Chess Matches</h2>
        <CreateChessModal />
      </div>
      <div className="flex flex-wrap gap-2 mx-4">
        {matches.map((match: any) => {
          const fen = match.fen;

          const parts = fen.split(" ");
          const turn = parts[1];
          return (
            <div
              key={match._id}
              className="flex flex-[1_1_calc(50%-10px)] md:flex-[1_1_calc(33.3%-10px)] md:max-w-[33%] flex-col h-60 border border-white my-2 p-2 rounded-3xl cursor-pointer"
              onClick={() => navigate(`/chess/${match._id}`)}
            >
              <img
                src={`chess.jpg`}
                alt="Chess"
                className="h-[50%] w-full object-top object-cover rounded-3xl "
              />
              <hr className="border-white my-2"></hr>
              <p className="text-white text-center">
                Current Turn: <br></br> {turn === "w" ? "White" : "Black"}
              </p>
              <div className="flex justify-between mt-auto">
                <p className="text-white px-2">
                  White Player: <br></br> {match.whitePlayer.name}
                </p>
                <p className="text-white px-2">
                  Black Player: <br></br> {match.blackPlayer.name}
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
