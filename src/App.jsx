import { Routes, Route, useLocation } from "react-router-dom";
import Assestant from "./components/Assestant";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import RecommendationReviews from "./components/RecomendatioReviews";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";

function App() {
  const location = useLocation();

  const isAssistantRoute = location.pathname === "/assistant";

  return (
    <>
      {!isAssistantRoute && <Navbar />}

      <Routes>
        {/* Route without navbar/footer */}
        <Route path="/assistant" element={<Assestant />} />

        {/* Routes with navbar/footer */}
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:_id" element={<PlaceInfo />} />
        <Route path="/review" element={<RecommendationReviews />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {!isAssistantRoute && <Footer />}
    </>
  );
}

export default App;
