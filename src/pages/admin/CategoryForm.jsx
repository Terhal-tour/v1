import { useEffect, useState } from "react";
import axios from "axios"; 
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold text-center text-amber-800">
        {isEdit ? "Edit Category" : "Create Category"}
      </h2>

      <div>
        <label className="block mb-1 text-amber-700">Title</label>
        <input
          className="w-full border px-4 py-2 rounded bg-amber-50"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
        >
          {isEdit ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm;
