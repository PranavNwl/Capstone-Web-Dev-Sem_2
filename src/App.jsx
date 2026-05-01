import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MindMapProvider } from "./context/MindMapContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import Saved from "./pages/Saved";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <MindMapProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:mapId" element={<Editor />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MindMapProvider>
  );
}

export default App;
