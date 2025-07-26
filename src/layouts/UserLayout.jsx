import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import SupportUsButton from "../components/SupportUsButton";
import Assestant from "../components/Assestant";
export default function UserLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <SupportUsButton />
      <Assestant/>
      <Footer />
    </>
  );
}
