import { BrowserRouter, Route, Routes } from "react-router-dom";
import Assestant from "./components/Assestant";
import Home from "./components/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assestant" element={<Assestant />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
