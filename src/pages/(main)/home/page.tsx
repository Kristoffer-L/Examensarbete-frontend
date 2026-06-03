import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateChessModal from "../../../components/CreateChessModal/CreateChessModal";

function HomePage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchMatchesByUserId() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/sign-in");
          return;
        }

        const response = await fetch(`http://localhost:3000/users/me`, {
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
        setUser(data.user);
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
        <h2 className="text-white">My Matches</h2>
        <CreateChessModal />
      </div>
      <div className="mx-4">
        {matches.map((match: any) => {
          return (
            <div
              key={match._id}
              className="w-[33%] h-40 border border-white p-2 my-2 rounded-3xl cursor-pointer"
              onClick={() => navigate(`/chess/${match._id}`)}
            >
              <p className="text-white">Match ID: {match._id}</p>
              <p className="text-white">Status: {match.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HomePage;
