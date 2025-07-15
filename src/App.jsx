import { Routes, Route } from "react-router-dom";

import { Routes, Route, useLocation } from "react-router-dom";
import Assestant from "./components/Assestant";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import RecommendationReviews from "./components/RecomendatioReviews";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import AdminCrudPlaces from "./pages/admin/AdminCrudPlaces";



function App() {
  const location = useLocation();

  const isAssistantRoute = location.pathname === "/assistant";

  return (
    <>
      {!isAssistantRoute && <Navbar />}

      <Routes>
      {/* user layout routes */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="assistant" element={<Assestant />} />
        <Route path="places" element={<Places />} />
        <Route path="places/:_id" element={<PlaceInfo />} />
        <Route path="review" element={<RecommendationReviews />} />
        {/* Route without navbar/footer */}
        <Route path="/assistant" element={<Assestant />} />

        {/* Routes with navbar/footer */}
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:_id" element={<PlaceInfo />} />
        <Route path="/review" element={<RecommendationReviews />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ADMIN layout routes */}
      <Route
        path="/admin"
        element={
          // <RequireAdmin>
            <AdminLayout />
          // </RequireAdmin>
        }
      >
        <Route path="/admin/places" element={<AdminCrudPlaces/>} />
        {/* More admin pages */}
      </Route>
    </Routes>
      </Routes>

      {!isAssistantRoute && <Footer />}
    </>
  );
}

export default App;
