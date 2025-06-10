import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import CreateSpace from "./pages/CreateSpace";
import Space from "./pages/Space";
// import MigrateData from "./pages/MigrateData";  <Route path="/migrate" element={<MigrateData />} />

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateSpace />} />
          <Route path="/space/:spaceId" element={<Space />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
