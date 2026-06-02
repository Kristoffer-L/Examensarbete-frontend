import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";

function CreateChessModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chess] = useState(new Chess());

  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3000/users/other-users",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  async function createMatch() {
    console.log("selectedUser", selectedUser);
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/chess", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fen: chess.fen(),
          blackPlayer: selectedUser,
        }),
      });

      const data = await response.json();

      navigate(`/chess/${data._id}`);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <button
        onClick={() => {
          setIsOpen(true);
        }}
      >
        Create Match
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl mb-4">Create Match</h2>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={createMatch}
              disabled={!selectedUser}
              className="font-bold py-2 px-4 rounded"
            >
              Create Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateChessModal;
