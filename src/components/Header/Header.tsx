import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../../config";

function Header() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIsAuthenticated(response.ok);
      } catch (error) {
        console.error(error);
        setIsAuthenticated(false);
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
