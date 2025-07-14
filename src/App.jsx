import Assestant from "./components/Assestant";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { Routes, Route } from "react-router-dom";
import RecommendationReviews from "./components/RecomendatioReviews";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes here as needed */}
        <Route path="/assistant" element={<Assestant />} />
        <Route path="/places"  element={<Places/>} />
        <Route path="/places/:_id"  element={<PlaceInfo/>} />
        <Route path="/review" element={<RecommendationReviews />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
