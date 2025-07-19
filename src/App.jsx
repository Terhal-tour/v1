/* eslint-disable no-unused-vars */
import { Routes, Route, useLocation, Router } from "react-router-dom";

import Assestant from "./components/Assestant";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import RecommendationReviews from "./components/RecomendatioReviews";
import Places from "./pages/Places";
import PlaceInfo from "./pages/PlaceInfo";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import SignUp from "./components/SignUp";
import Login from "./components/login";
import VerifyEmail from "./components/VerifyEmail";
import ForgetPassword from "./components/ForgetPassword";
import AdminCrudPlaces from "./pages/admin/AdminCrudPlaces";
import ResetPassword from "./components/ResetPassword";
import AdminCategories from "./components/AdminCategories";
import CategoryForm from "./components/CategoryForm";
import NoNavFoter from "./layouts/NoNavFoter";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCrudEvents from "./pages/admin/AdminCrudEvents";
import SupportUsButton from "./components/SupportUsButton";
import PaymentSuccess from "./pages/PaymentSuccess";
import AddNewPlace from "./pages/admin/AddNewPlace";
import EditPlace from "./pages/admin/EditPlace";
import Settings from "./pages/Settings";
import Profile from "./components/Profile";
import AdminLogin from "./components/AdminLogin"

function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        {/* [TODO CREATE LAYOUT TO REMOVE NAV , FOOTER EROM THE ASSISTANT PAGE ] */}
        <Route path="/" element={<NoNavFoter />}>
          <Route path="assistant" element={<Assestant />} />
          <Route path="review" element={<RecommendationReviews />} />
        </Route>
        {/* User layout routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="places" element={<Places />} />
          <Route path="places/:_id" element={<PlaceInfo />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="forget-password" element={<ForgetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="settings" element={<Settings />} />
             <Route path="profile" element={<Profile/>}/>
            <Route path="adminLogin" element={<AdminLogin/>}/>
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin layout routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="places" element={<AdminCrudPlaces />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="categories/:id" element={<CategoryForm />} />
          <Route path="events" element={<AdminCrudEvents />} />
          <Route path="addNewPlace"  element={<AddNewPlace/>}/>
          <Route path="/admin/editPlace/:id" element={<EditPlace />} />
          {/* Add more admin routes here */}
        </Route>

        {/* payment */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
      </Routes>
      <SupportUsButton />
      
    </>
  );
}

export default App;
