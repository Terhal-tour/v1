// src/components/admin/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-white min-h-screen p-6 shadow-md border-r border-gray-200">
      <h2 className="text-xl font-extrabold mb-6 text-indigo-600">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg shadow-sm"
              : "text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/places"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg shadow-sm"
              : "text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          }
        >
          Manage Places
        </NavLink>
        <NavLink
          to="/admin/events"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg shadow-sm"
              : "text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          }
        >
          Manage Events
        </NavLink>
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg shadow-sm"
              : "text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          }
        >
          Manage Categories
        </NavLink>
        <NavLink
          to="/admin/manageAdmins"
          className={({ isActive }) =>
            isActive
              ? "font-bold text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg shadow-sm"
              : "text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-lg"
          }
        >
          Manage Admins
        </NavLink>
      </nav>
    </aside>
  );
};

export default AdminSidebar;