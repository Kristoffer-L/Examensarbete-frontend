import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/(main)/home/page";
import GamePage from "./pages/(main)/chess/page";
import SignInPage from "./pages/(auth)/sign-in/page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
      </Routes>
    </>
  );
}

export default App;
