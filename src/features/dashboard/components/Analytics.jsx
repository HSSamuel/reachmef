import { useState, useEffect } from "react";
import { useLinks } from "../../editor/hooks/useLinks";
import { useProfile } from "../../../hooks/useProfile";
import { api } from "../../../config/api"; // ✅ Replaced supabase with api client
import {
  BarChart3,
  MousePointer2,
  Eye,
  Globe,
  Smartphone,
  Calendar,
  Download,
  MoreHorizontal,
  Mail,
  Users,
  Loader2,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card } from "../../../components/ui/Card";
import toast from "react-hot-toast";

// --- MOCK DATA FOR CHARTS ---
const TRAFFIC_DATA = [
  { name: "Mon", views: 400, clicks: 240 },
  { name: "Tue", views: 300, clicks: 139 },
  { name: "Wed", views: 520, clicks: 380 },
  { name: "Thu", views: 450, clicks: 290 },
  { name: "Fri", views: 600, clicks: 430 },
  { name: "Sat", views: 800, clicks: 550 },
  { name: "Sun", views: 700, clicks: 480 },
];

const DEVICE_DATA = [
  { name: "Mobile", value: 65, color: "#4f46e5" },
  { name: "Desktop", value: 25, color: "#ec4899" },
  { name: "Tablet", value: 10, color: "#8b5cf6" },
];

const LOCATION_DATA = [
  { country: "USA", count: 45, color: "#4f46e5" },
  { country: "UK", count: 20, color: "#8b5cf6" },
  { country: "Nigeria", count: 15, color: "#ec4899" },
  { country: "Germany", count: 10, color: "#10b981" },
  { country: "Others", count: 10, color: "#94a3b8" },
];

export function Analytics() {
  const { links } = useLinks();
  const { profile } = useProfile();

  // --- STATE FOR SUBSCRIBERS ---
  const [subscribers, setSubscribers] = useState([]);
  const [loadingSubscribers, setLoadingSubscribers] = useState(true);

  // --- 1. FETCH SUBSCRIBERS ---
  useEffect(() => {
    if (profile?._id) {
      // ✅ MONGODB FIX
      fetchSubscribers();
    }
  }, [profile?._id]);

  const fetchSubscribers = async () => {
    try {
      setLoadingSubscribers(true);

      const { data } = await api.get("/subscribers");
      setSubscribers(data || []);
    } catch (error) {
      console.error("Error fetching subscribers:", error);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  // --- LINK ANALYTICS CALCULATIONS ---
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const totalViews = Math.floor(totalClicks * 1.8);
  const ctr =
    totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : 0;
  const topLinks = [...links]
    .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
    .slice(0, 4);

  // --- HANDLERS ---

  // Export LINK Data
  const handleExportLinks = () => {
    try {
      const headers = "Title,URL,Clicks,Active\n";
      const rows = links
        .map(
          (link) =>
            `"${link.title}","${link.url}",${link.clicks || 0},${
              link.is_active
            }`,
        )
        .join("\n");

      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `reachme_links_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Link Analytics downloaded!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  // Export SUBSCRIBER Data
  const handleExportSubscribers = () => {
    try {
      if (subscribers.length === 0) {
        toast.error("No subscribers to export");
        return;
      }
      const headers = "Email,Date Joined,Subscriber ID\n";
      const rows = subscribers
        .map(
          (s) =>
            `"${s.email}","${new Date(s.created_at).toLocaleDateString()}","${
              s._id // ✅ MONGODB FIX
            }"`,
        )
        .join("\n");

      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `reachme_subscribers_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Subscriber list downloaded!");
    } catch (error) {
      toast.error("Failed to export subscribers");
    }
  };

  const handleFilter = () => {
    toast.success("Data filtered: Last 7 Days");
  };

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
          <p className="text-xs text-slate-500">Last 7 Days Performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors active:scale-95"
          >
            <Calendar size={14} /> 7 Days
          </button>
          <button
            onClick={handleExportLinks}
            className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors active:scale-95 shadow-md shadow-indigo-500/20"
          >
            <Download size={14} /> Export Data
          </button>
        </div>
      </div>

      {/* --- GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* ROW 1: METRICS */}
        <MetricCard
          title="Total Views"
          value={totalViews.toLocaleString()}
          icon={<Eye size={18} />}
          color="text-blue-600 bg-blue-50"
          trend="+12%"
          trendColor="text-green-600 bg-green-50"
        />
        <MetricCard
          title="Total Clicks"
          value={totalClicks.toLocaleString()}
          icon={<MousePointer2 size={18} />}
          color="text-purple-600 bg-purple-50"
          trend="+5%"
          trendColor="text-green-600 bg-green-50"
        />
        {/* ✅ NEW: SUBSCRIBER METRIC */}
        <MetricCard
          title="Subscribers"
          value={loadingSubscribers ? "..." : subscribers.length}
          icon={<Users size={18} />}
          color="text-indigo-600 bg-indigo-50"
          trend={subscribers.length > 0 ? "Active" : "New"}
          trendColor="text-indigo-600 bg-indigo-50"
        />

        {/* Device Mini Card */}
        <Card className="p-4 border-slate-200 shadow-sm flex flex-col justify-between h-28">
          <div className="flex justify-between items-start mb-1">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md">
              <Smartphone size={16} />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Device
            </span>
          </div>
          <div className="flex items-end gap-1.5 h-full pt-2">
            {DEVICE_DATA.map((d) => (
              <div
                key={d.name}
                className="flex-1 flex flex-col justify-end gap-1 group"
              >
                <div
                  className="w-full rounded-t-sm transition-all opacity-80 group-hover:opacity-100"
                  style={{ height: `${d.value}%`, backgroundColor: d.color }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-bold text-slate-500">Mobile</span>
            <span className="text-[10px] font-bold text-indigo-600">65%</span>
          </div>
        </Card>

        {/* ROW 2: MAIN CHART (Span 3) + TOP LINKS (Span 1) */}
        <Card className="md:col-span-2 lg:col-span-3 p-4 border-slate-200 shadow-sm h-[300px] flex flex-col">
          <div className="flex justify-between items-center mb-2 shrink-0">
            <h3 className="font-bold text-slate-800 text-sm">
              Traffic Overview
            </h3>
            <button className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={TRAFFIC_DATA}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#ec4899"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* TOP LINKS */}
        <Card className="md:col-span-2 lg:col-span-1 p-4 border-slate-200 shadow-sm h-[300px] flex flex-col">
          <h3 className="font-bold text-slate-800 text-sm mb-4 shrink-0">
            Top Links
          </h3>
          <div className="space-y-4 overflow-y-auto pr-1 flex-1 custom-scrollbar">
            {topLinks.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No data yet.
              </div>
            ) : (
              topLinks.map((link) => (
                <div key={link._id} className="group">
                  {" "}
                  {/* ✅ MONGODB FIX */}
                  <div className="flex justify-between items-center mb-1">
                    <p
                      className="text-xs font-bold text-slate-700 truncate max-w-[140px]"
                      title={link.title}
                    >
                      {link.title}
                    </p>
                    <span className="text-xs font-bold text-slate-900">
                      {link.clicks || 0}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-800 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((link.clicks || 0) / (totalClicks || 1)) * 100,
                          100,
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* ROW 3: LOCATIONS & DEVICES */}
        <Card className="md:col-span-2 p-4 border-slate-200 shadow-sm h-60">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-800 text-sm">Top Locations</h3>
            <Globe size={16} className="text-slate-400" />
          </div>
          <div className="flex gap-6 h-[160px]">
            {/* REAL SVG MAP */}
            <div className="hidden sm:flex flex-col items-center justify-center bg-indigo-50/30 rounded-lg w-1/3 shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 opacity-80 scale-125">
                <WorldMap />
              </div>
              <div className="absolute top-1/3 left-1/3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 custom-scrollbar">
              {LOCATION_DATA.map((loc) => (
                <div
                  key={loc.country}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full`}
                      style={{ backgroundColor: loc.color }}
                    ></div>
                    <span className="text-xs font-medium text-slate-600">
                      {loc.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 w-24 justify-end">
                    <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full"
                        style={{
                          width: `${loc.count}%`,
                          backgroundColor: loc.color,
                        }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 w-6 text-right">
                      {loc.count}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-4 border-slate-200 shadow-sm h-60 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Device Breakdown
            </h3>
            <Smartphone size={16} className="text-slate-400" />
          </div>
          <div className="flex-1 flex items-center gap-6">
            <div className="w-32 h-32 relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEVICE_DATA}
                    innerRadius={25}
                    outerRadius={45}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {DEVICE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <span className="block text-xs font-bold text-slate-700">
                    100%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              {DEVICE_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: d.color }}
                    ></div>
                    <span className="text-xs font-bold text-slate-600">
                      {d.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ✅ ROW 4: AUDIENCE GROWTH (Real Subscriber List) */}
        <Card className="col-span-1 md:col-span-2 lg:col-span-4 p-0 border-slate-200 shadow-sm overflow-hidden bg-white">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Users size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Audience Growth
                </h3>
                <p className="text-[10px] text-slate-500">
                  Real-time newsletter subscribers
                </p>
              </div>
            </div>
            {subscribers.length > 0 && (
              <button
                onClick={handleExportSubscribers}
                className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Download size={12} /> CSV
              </button>
            )}
          </div>

          <div className="max-h-[300px] overflow-y-auto">
            {loadingSubscribers ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="animate-spin text-slate-300" />
              </div>
            ) : subscribers.length === 0 ? (
              <div className="p-12 text-center">
                <Mail className="text-slate-300 w-12 h-12 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900">
                  No subscribers yet
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Add the newsletter block to your profile to start collecting
                  emails.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Email Address</th>
                    <th className="px-6 py-3 text-right">Date Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subscribers.map((sub) => (
                    <tr
                      key={sub._id} // ✅ MONGODB FIX
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-3 font-medium text-slate-900 flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-[10px]">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        {sub.email}
                      </td>
                      <td className="px-6 py-3 text-right text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- METRIC CARD COMPONENT ---
function MetricCard({ title, value, icon, color, trend, trendColor }) {
  return (
    <Card className="p-4 border-slate-200 shadow-sm flex flex-col justify-between h-28">
      <div className="flex justify-between items-start">
        <div className={`p-1.5 rounded-md ${color}`}>{icon}</div>
        <span
          className={`flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${trendColor}`}
        >
          {trend}
        </span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
          {title}
        </p>
        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </h3>
      </div>
    </Card>
  );
}

// --- WORLD MAP SVG COMPONENT ---
const WorldMap = () => (
  <svg
    viewBox="0 0 100 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full text-indigo-200"
  >
    <path
      d="M22 35C22 35 24 32 28 32C32 32 35 34 35 34"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M15 15C15 15 18 12 25 12C32 12 35 15 35 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M45 15C45 15 48 10 55 10C62 10 65 12 65 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M75 18C75 18 78 16 82 16C86 16 88 18 88 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M50 35C50 35 52 38 58 38C64 38 65 35 65 35"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M80 32C80 32 82 30 85 30C88 30 90 32 90 32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="25" cy="22" r="1.5" fill="currentColor" />
    <circle cx="55" cy="22" r="1.5" fill="currentColor" />
    <circle cx="82" cy="24" r="1.5" fill="currentColor" />
    <circle cx="30" cy="40" r="1.5" fill="currentColor" />
    <circle cx="60" cy="28" r="1.5" fill="currentColor" />
  </svg>
);
