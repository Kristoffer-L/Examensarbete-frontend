import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/(main)/home/page";
import GamePage from "./pages/(main)/chess/page";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </>
  );
}

export default App;
