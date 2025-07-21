// src/components/admin/AdminNavbar.jsx
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  // التحقق من تسجيل الدخول
  const token = sessionStorage.getItem("jwt");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    sessionStorage.removeItem("jwt");
    navigate("/adminLogin");
  };

  return (
    <header className="bg-white p-4 flex justify-between items-center shadow-md border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-indigo-600 text-white flex items-center justify-center rounded-full font-bold">A</div>
        <h1 className="text-lg font-bold text-indigo-600">Admin Dashboard</h1>
      </div>
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <>
            <span className="text-gray-600">Welcome, Admin</span>
            <button
              onClick={handleLogout}
              className="cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200 ease-in-out"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
