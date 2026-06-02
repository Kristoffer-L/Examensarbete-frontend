import { Link } from "react-router-dom";
import "../App.css";

function Header() {
  return (
    <header>
      <nav className="flex items-center gap-4 bg-[#007500] w-[75%] h-20 my-4 mx-auto rounded-2xl p-4">
        <Link
          className="text-white text-2xl no-underline hover:underline"
          to="/"
        >
          Home
        </Link>
        <Link
          className="text-white text-2xl no-underline hover:underline"
          to="/game"
        >
          Chess
        </Link>
        <Link
          className="ml-auto text-white text-2xl no-underline hover:underline"
          to="/sign-in"
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}

export default Header;
