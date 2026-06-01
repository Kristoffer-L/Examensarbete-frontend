import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/(main)/home/page";
import GamePage from "./pages/(main)/chess/[matchId]/page";
import SignInPage from "./pages/(auth)/sign-in/page";
import SignUpPage from "./pages/(auth)/sign-up/page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App;
