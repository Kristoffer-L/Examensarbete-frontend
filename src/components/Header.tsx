import { Link } from "react-router-dom";
import "../App.css";

function Header() {
  return (
    <header>
      <nav className="navigation">
        <Link className="navigation-link" to="/">
          Home
        </Link>
        <Link className="navigation-link" to="/game">
          Chess
        </Link>
        <Link className="navigation-link" to="/sign-in">
          Sign In
        </Link>
      </nav>
    </header>
  );
}

export default Header;
