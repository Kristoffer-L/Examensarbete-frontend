import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Chess } from "chess.js";
import { API_URL } from "../../config";
import type { Users, User } from "../../types/users";

function CreateChessModal() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [chess] = useState(new Chess());

  const [users, setUsers] = useState<Users>([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/users/other-users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

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

      const response = await fetch(`${API_URL}/chess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fen: chess.fen(),
          black: selectedUser,
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
        className="text-white font-bold border border-white px-2 rounded-3xl"
      >
        +
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1">
          <div className="bg-[#007500] w-full max-w-md rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-white text-2xl mb-4">Create Match</h2>
              <p
                onClick={() => setIsOpen(false)}
                className="text-white cursor-pointer mb-4"
              >
                X
              </p>
            </div>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="text-white"
            >
              <option value="" className="text-black">
                Select a user
              </option>
              {users.map((user: User) => (
                <option key={user._id} value={user._id} className="text-black">
                  {user.name}
                </option>
              ))}
            </select>
            <button
              onClick={createMatch}
              disabled={!selectedUser}
              className="text-white font-bold py-2 px-4 rounded"
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
