import { Chess } from "chess.js";

function HomePage() {
  const chess = new Chess();

  const createMatch = async () => {
    try {
      const response = await fetch("http://localhost:3000/chess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fen: chess.fen(),
          whitePlayer: "6a1d4b47943af3a6749b0057",
          blackPlayer: "6a1d87e4673a8bfa5dea4f26",
          status: "pending",
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <div>
      <h1>Home Page</h1>
      <button onClick={createMatch} className="text-white">
        Create Match
      </button>
    </div>
  );
}

export default HomePage;
