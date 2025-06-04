import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateSpace from "./pages/CreateSpace";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateSpace />} />
        <Route path="/space/:uid" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
