import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  //   sessionStorage.setItem(
  //     "jwt",
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmNiNGI5Y2IxYzM4ZmEyOTcxNmQ4ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjU4MTY4MiwiZXhwIjoxNzUzMTg2NDgyfQ.X4vdhaEDuNb6xc2LDOTFl1o5tbBUCbK7Q2KnbZlXhvA"
  //   );
  const token = sessionStorage.getItem("jwt");

  const handleDeleteCategory = async (categoryId) => {
    try {
      //confirmation message
      const confirmation = confirm(
        "are you sure you want to delete this category?"
      );
      if (confirmation) {
        const res = await axios.delete(
          `https://backend-mu-ten-26.vercel.app/categories/${categoryId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res);

        // Remove deleted category from state
        setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));

        // Show success toast
        toast.success("Category deleted successfully");
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(
        error.response?.data?.message || "Failed to delete category "
      );
    }
  };

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://backend-mu-ten-26.vercel.app/categories", {
          headers: {
            Authorization: token,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Something went wrong");
        }

        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
      }
    };

    fetchCategories();
  }, []);

  console.log(categories);
  console.log(error);

  return (
    <>
      {categories.message ? (
        <Error />
      ) : (
        <main className="flex-grow p-6 lg:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
          <div className="mx-auto max-w-7xl">
            {/* Header Section */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  Manage Categories
                </h2>
                <p className="text-gray-600">Create, edit, and organize your categories</p>
              </div>
              <NavLink
                to={"create"}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                    fillRule="evenodd"
                  />
                </svg>
                Create Category
              </NavLink>
            </div>

            {/* Table Container */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-xl border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-max text-left text-sm">
                  {/* Table Header */}
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4" scope="col">
                        <input
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                          type="checkbox"
                        />
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider" scope="col">
                        Category Title
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider" scope="col">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-100">
                    {categories.map((category) => (
                      <tr
                        key={category._id}
                        className="bg-white hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4">
                          <input
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 transition-all"
                            type="checkbox"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <a className="font-medium text-gray-900 hover:text-blue-600 hover:underline transition-colors duration-200">
                            {category.title}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {/* Edit Button */}
                            <NavLink
                              to={category._id}
                              className="group p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 transition-all duration-200 hover:scale-110"
                              title="Edit Category"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                              </svg>
                            </NavLink>

                            {/* Delete Button */}
                            <button
                              className="group p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 transition-all duration-200 hover:scale-110"
                              onClick={() => handleDeleteCategory(category._id)}
                              title="Delete Category"
                            >
                              <svg
                                className="h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  clipRule="evenodd"
                                  d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                                  fillRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
