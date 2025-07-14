import { BrowserRouter, Route, Routes } from "react-router-dom";
import Assestant from "./components/Assestant";
import Home from "./components/Home";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<Assestant />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:_id" element={<PlaceInfo/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
