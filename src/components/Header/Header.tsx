import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

function Header() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }
    checkAuth();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };
  return (
    <header>
      <nav className="flex items-center gap-4 bg-[#007500] w-[75%] h-20 my-4 mx-auto rounded-2xl p-4">
        <Link
          className="text-white text-2xl no-underline hover:underline"
          to="/"
        >
          Home
        </Link>
        {IsAuthenticated ? (
          <button
            className="ml-auto text-white text-2xl no-underline hover:underline"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        ) : (
          <Link
            className="ml-auto text-white text-2xl no-underline hover:underline"
            to="/sign-in"
          >
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
