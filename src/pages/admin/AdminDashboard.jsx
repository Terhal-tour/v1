import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../../css/admin-theme.css";

const AdminDashboard = () => {
  sessionStorage.setItem(
    "jwt",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NmNiNGI5Y2IxYzM4ZmEyOTcxNmQ4ZSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1MjU4MTY4MiwiZXhwIjoxNzUzMTg2NDgyfQ.X4vdhaEDuNb6xc2LDOTFl1o5tbBUCbK7Q2KnbZlXhvA"
  );
  const token = sessionStorage.getItem("jwt");

  const [overview, setOverview] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [topLikedPlaces, setTopLikedPlaces] = useState([]);
  const [reviewsAnalysis, setReviewsAnalysis] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [overviewRes, natRes, , reviewsRes] = await Promise.all([
          axios.get("http://localhost:3000/admin/stats/overview", config),
          axios.get("http://localhost:3000/admin/stats/nationalities", config),
          axios.get("http://localhost:3000/admin/stats/top-rated", config),
          axios.get("http://localhost:3000/admin/stats/reviews-analysis", config),
        ]);

        setOverview(overviewRes.data);
        setNationalities(Array.isArray(natRes.data.nationalities) ? natRes.data.nationalities : []);
        setTopLikedPlaces(Array.isArray(overviewRes.data.topLikedPlaces) ? overviewRes.data.topLikedPlaces : []);
        setReviewsAnalysis(Array.isArray(reviewsRes.data.statusStats) ? reviewsRes.data.statusStats : []);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };
    fetchStats();
  }, [token]);

  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#F43F5E"];

  return (
    <div className="grid gap-6 p-6 bg-white min-h-screen text-gray-900 rounded-xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Users</h3>
          <p className="text-2xl font-bold">{overview.usersCount || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Places</h3>
          <p className="text-2xl font-bold">{overview.placesCount || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Events</h3>
          <p className="text-2xl font-bold">{overview.eventsCount || 0}</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-500">Total Categories</h3>
          <p className="text-2xl font-bold">{overview.categoriesCount || 0}</p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Users by Nationality</h3>
        {Array.isArray(nationalities) && nationalities.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <BarChart width={600} height={350} data={nationalities} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="_id" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: "#ffffff" }} />
              <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        ) : (
          <p className="text-gray-500">No nationality data available</p>
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Top Rated Places</h3>
        {Array.isArray(topLikedPlaces) && topLikedPlaces.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <BarChart width={600} height={350} data={topLikedPlaces.map(item => ({
              name: item.place?.name || "Unknown",
              count: item.count,
            }))} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: "#ffffff" }} />
              <Bar dataKey="count" fill="#22C55E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        ) : (
          <p className="text-gray-500">No top rated places data available</p>
        )}
      </div>

      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Reviews Analysis</h3>
        {Array.isArray(reviewsAnalysis) && reviewsAnalysis.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <PieChart width={450} height={350}>
              <Pie
                data={reviewsAnalysis.map(item => ({
                  name: item._id || "No Status",
                  value: item.count,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label
              >
                {reviewsAnalysis.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#ffffff" }} />
              <Legend wrapperStyle={{ color: "#6b7280" }} />
            </PieChart>
          </div>
        ) : (
          <p className="text-gray-500">No reviews analysis data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
