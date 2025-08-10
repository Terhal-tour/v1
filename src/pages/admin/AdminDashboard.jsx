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
  ResponsiveContainer,
} from "recharts";
import "../../css/admin-theme.css";

const AdminDashboard = () => {
  const token = sessionStorage.getItem("jwt");

  const [overview, setOverview] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [topLikedPlaces, setTopLikedPlaces] = useState([]);
  const [reviewsAnalysis, setReviewsAnalysis] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [overviewRes, nationalitiesRes, topRatedRes, reviewsRes] =
          await Promise.all([
            axios.get("https://backend-mu-ten-26.vercel.app/admin/stats/overview", config),
            axios.get("https://backend-mu-ten-26.vercel.app/admin/stats/nationalities", config),
            axios.get("https://backend-mu-ten-26.vercel.app/admin/stats/top-rated", config),
            axios.get("https://backend-mu-ten-26.vercel.app/admin/stats/reviews-analysis", config),
          ]);

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

  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#F43F5E"];

  const renderBarChart = (data, xKey, yKey, color) => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barCategoryGap={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey={xKey} stroke="#6b7280" />
        <YAxis stroke="#6b7280" />
        <Tooltip contentStyle={{ background: "#ffffff" }} />
        <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <div className="p-4 md:p-6 min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 text-gray-900 rounded-xl">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Travelers", value: overview.travelersCount },
          { label: "Top Liked Places", value: topLikedPlaces.length },
          { label: "Nationalities Count", value: nationalities.length },
        ].map((item, index) => (
          <div
            key={index}
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition text-center"
          >
            <h3 className="text-sm text-gray-500">{item.label}</h3>
            <p className="text-3xl font-bold mt-2">{item.value || 0}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">Users by Nationality</h3>
          {nationalities.length > 0
            ? renderBarChart(nationalities, "_id", "count", "#6366F1")
            : <p className="text-gray-500">No nationality data available</p>}
        </div>

        <div className="p-4 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-lg mb-4">Top Rated Places</h3>
          {topLikedPlaces.length > 0
            ? renderBarChart(
                topLikedPlaces.map((item) => ({
                  name: item.place?.name || "Unknown",
                  count: item.count,
                })),
                "name",
                "count",
                "#22C55E"
              )
            : <p className="text-gray-500">No top rated places data available</p>}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="font-bold text-lg mb-4 text-center">Reviews Analysis</h3>
        {reviewsAnalysis.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={reviewsAnalysis.map((item) => ({
                  name: item._id || "No Status",
                  value: item.count,
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {reviewsAnalysis.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: "#ffffff" }} />
              <Legend wrapperStyle={{ color: "#6b7280" }} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center">No reviews analysis data available</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
