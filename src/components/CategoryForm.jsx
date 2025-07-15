import { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "./Spinner";


const CategoryForm = () => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = id !== "create";
  const token = sessionStorage.getItem("jwt");
  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/categories/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTitle(res.data.title);
        })
        .catch((err) => {
          console.error("Failed to fetch category", err);
        })
        .finally(() => setLoading(false));
    } else {
      setTitle(""); // reset in create mode
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:3000/categories/${id}`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Category updated!");
      } else {
        await axios.post(
          `http://localhost:3000/categories`,
          { title },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // update the categories
        toast.success("Category created!");
        //navigate
      }

      //navigate to /admin
      navigate("/admin/categories")
    } catch (err) {
      console.error("Save error", err);
      toast.error("Failed to save category");
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-amber-800">
        <Spinner />
      </div>
    );

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 sm:p-6">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg w-full border-4 border-amber-600"
        
      >
        <h2 className="text-3xl font-bold text-center text-blue-900 font-serif tracking-wide">
          {isEdit ? "Edit Category" : "Create New Category"}
        </h2>

        <div>
          <label className="block mb-2 text-lg text-amber-800 font-medium">Title </label>
          <input
            className="w-full border-2 border-turquoise-600 px-4 py-3 rounded-lg bg-amber-50/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-turquoise-400 placeholder:text-blue-500 transition-all duration-300"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter  title"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="px-8 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-300 font-serif text-lg shadow-lg hover:shadow-xl"
          >
            {isEdit ? "Update " : "Create "}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-8 py-3 bg-turquoise-600 text-amber-600 rounded-lg hover:bg-turquoise-700 transition-colors duration-300 font-serif text-lg shadow-lg hover:shadow-xl"
          >
            Return 
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
