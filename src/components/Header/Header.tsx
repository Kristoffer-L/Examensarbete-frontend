import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header() {
  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  async function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in");
    }
    try {
      const response = await fetch(`http://localhost:3000/users/me`, {
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

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/sign-in");
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
