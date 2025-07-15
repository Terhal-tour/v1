import React, { useEffect, useState } from "react";
import "./../../css/categories.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  sessionStorage.setItem(
    "jwt",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmNiNGI5Y2IxYzM4ZmEyOTcxNmQ4ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjU4MTY4MiwiZXhwIjoxNzUzMTg2NDgyfQ.X4vdhaEDuNb6xc2LDOTFl1o5tbBUCbK7Q2KnbZlXhvA"
  );
  const token = sessionStorage.getItem("jwt");

  const handleDeleteCategory = async (categoryId) => {
    try {
      //confirmation message
      const confirmation = confirm(
        "are you sure you want to delete this category?"
      );
      if (confirmation) {
        const res = await axios.delete(
          `http://localhost:3000/categories/${categoryId}`,
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
        const res = await fetch("http://localhost:3000/categories", {
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
        <main className="flex-grow p-6 lg:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-4xl font-bold text-[var(--text-primary)]">
                Manage Categories
              </h2>
              <NavLink
                to={"create"}
                className="btn-primary flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-sm transition-all"
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

            <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
              <table className="w-full min-w-max text-left text-sm text-[var(--text-secondary)]">
                <thead className="border-b border-[var(--border-color)] bg-gray-50 text-xs uppercase text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-6 py-3" scope="col">
                      <input
                        className="h-4 w-4 rounded border-gray-300 text-[var(--ancient-red)] focus:ring-[var(--ancient-red)]"
                        type="checkbox"
                      />
                    </th>
                    <th className="px-6 py-3" scope="col">
                      Category Title
                    </th>

                    <th className="px-6 py-3" scope="col">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category._id}
                      className="border-b border-[var(--border-color)] bg-white hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          className="h-4 w-4 rounded border-gray-300 text-[var(--ancient-red)] focus:ring-[var(--ancient-red)]"
                          type="checkbox"
                        />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-[var(--text-primary)]">
                        <a className="hover:underline">{category.title}</a>
                      </td>

                      <td className="flex items-center gap-2 px-6 py-4">
                        <NavLink
                          to={category._id}
                          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="blue"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                          </svg>
                        </NavLink>

                        <button
                          className="text-[var(--text-secondary)] hover:text-[var(--cancelled-red)]"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="red"
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}
    </>
  );
}
