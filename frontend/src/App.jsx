import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload";
import Chat from "./pages/Chat";
import Report from "./pages/Report";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/report" element={<Report />} />
      </Routes>
    </BrowserRouter>
  );
}