import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSpace from "./pages/CreateSpace";
import Space from "./pages/Space";
// import MigrateData from "./pages/MigrateData";  <Route path="/migrate" element={<MigrateData />} />

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSpace />} />
        <Route path="/space/:spaceId" element={<Space />} />

      </Routes>
    </Router>
  );
}

export default App;
