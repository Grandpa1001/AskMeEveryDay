import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSpace from "./pages/CreateSpace";
import Space from "./pages/Space";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSpace />} />
        <Route path="/space/:uid" element={<Space />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
