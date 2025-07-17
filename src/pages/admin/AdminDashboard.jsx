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
  // Get JWT token from sessionStorage (TODO: replace with secure method in production)
  const token = sessionStorage.getItem("jwt") || "YOUR_DEFAULT_TOKEN";

  // Define state variables
  const [overview, setOverview] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [topLikedPlaces, setTopLikedPlaces] = useState([]);
  const [reviewsAnalysis, setReviewsAnalysis] = useState([]);

  // Fetch all dashboard data on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch all API data in parallel
        const [overviewRes, nationalitiesRes, topRatedRes, reviewsRes] =
          await Promise.all([
            axios.get("https://terhal-backend-6jk2.vercel.app/admin/stats/overview", config),
            axios.get("https://terhal-backend-6jk2.vercel.app/admin/stats/nationalities", config),
            axios.get("https://terhal-backend-6jk2.vercel.app/admin/stats/top-rated", config),
            axios.get("https://terhal-backend-6jk2.vercel.app/admin/stats/reviews-analysis", config),
          ]);

        // Set state with received data
        setOverview(overviewRes.data);
        setNationalities(nationalitiesRes.data.nationalities || []);
        setTopLikedPlaces(overviewRes.data.topLikedPlaces || []);
        setReviewsAnalysis(reviewsRes.data.statusStats || []);
      } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
      }
    };

    fetchDashboardStats();
  }, [token]);

  // Color palette for Pie chart
  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#F43F5E"];

  // Utility function to render a BarChart
  const renderBarChart = (data, xKey, yKey, color) => (
    <BarChart width={600} height={350} data={data} barCategoryGap={20}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
      <XAxis dataKey={xKey} stroke="#6b7280" />
      <YAxis stroke="#6b7280" />
      <Tooltip contentStyle={{ background: "#ffffff" }} />
      <Bar dataKey={yKey} fill={color} radius={[8, 8, 0, 0]} />
    </BarChart>
  );

  return (
    <div className="grid gap-6 p-6 bg-white min-h-screen text-gray-900 rounded-xl">
      {/* Dashboard summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Travelers", value: overview.travelersCount },
          { label: "Online Users", value: overview.onlineUsersCount },
          { label: "Top Liked Places", value: topLikedPlaces.length },
          { label: "Nationalities Count", value: nationalities.length },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-sm text-gray-500">{item.label}</h3>
            <p className="text-2xl font-bold">{item.value || 0}</p>
          </div>
        ))}
      </div>

      {/* Bar chart - Users by Nationality */}
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Users by Nationality</h3>
        {nationalities.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {renderBarChart(nationalities, "_id", "count", "#6366F1")}
          </div>
        ) : (
          <p className="text-gray-500">No nationality data available</p>
        )}
      </div>

      {/* Bar chart - Top Rated Places */}
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Top Rated Places</h3>
        {topLikedPlaces.length > 0 ? (
          <div className="w-full overflow-x-auto">
            {renderBarChart(
              topLikedPlaces.map((item) => ({
                name: item.place?.name || "Unknown",
                count: item.count,
              })),
              "name",
              "count",
              "#22C55E"
            )}
          </div>
        ) : (
          <p className="text-gray-500">No top rated places data available</p>
        )}
      </div>

      {/* Pie chart - Reviews Analysis */}
      <div className="p-6 bg-gray-50 rounded-lg shadow-md">
        <h3 className="font-bold text-lg mb-4">Reviews Analysis</h3>
        {reviewsAnalysis.length > 0 ? (
          <div className="w-full overflow-x-auto">
            <PieChart width={450} height={350}>
              <Pie
                data={reviewsAnalysis.map((item) => ({
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
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
