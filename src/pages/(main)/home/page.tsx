import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateChessModal from "../../../components/CreateChessModal/CreateChessModal";

function HomePage() {
  const navigate = useNavigate();

  const [matches, setMatches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      } catch (error) {
        console.error("Error fetching matches for user:", error);
      }
    }

    fetchMatchesByUserId();
  }, [navigate]);

  return (
    <div>
      <h1>Home Page</h1>

      <CreateChessModal />
      <h2>My Matches</h2>
      {matches.map((match: any) => (
        <div
          key={match._id}
          className="border p-2 my-2 cursor-pointer"
          onClick={() => navigate(`/chess/${match._id}`)}
        >
          <p>Match ID: {match._id}</p>
          <p>Status: {match.status}</p>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
