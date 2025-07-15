import { Routes, Route, useLocation, Router } from "react-router-dom";

import Assestant from "./components/Assestant";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import RecommendationReviews from "./components/RecomendatioReviews";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import AdminCrudPlaces from "./pages/admin/AdminCrudPlaces";

// 👇 تأكد أنك مستورد Navbar و Footer
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  const location = useLocation();
  const isAssistantRoute = location.pathname === "/assistant";

  return (
    <>
        <Routes>
          {/* User layout routes */}
          {/* [TODO CREATE LAYOUT TO REMOVE NAV , FOOTER EROM THE ASSISTANT PAGE ] */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="assistant" element={<Assestant />} />
            <Route path="places" element={<Places />} />
            <Route path="places/:_id" element={<PlaceInfo />} />
            <Route path="review" element={<RecommendationReviews />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin layout routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="places" element={<AdminCrudPlaces />} />
            {/* Add more admin routes here */}
          </Route>
        </Routes>
    </>
  );
}

export default App;
