import { useGetDashboardStatsQuery } from "../../services/user.js";
import { useGetProductsQuery } from "../../services/product.js";
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className={`p-2 rounded-lg ${color.bg}`}>
          <Icon size={14} className={color.text} />
        </div>
      </div>
      {loading ? (
        <div className="h-7 w-20 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStatsQuery();
  const { data: products = [] } = useGetProductsQuery();

  const lowStockItems = products.filter((p) => {
    const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
    return total > 0 && total < 10;
  });

  const outOfStockItems = products.filter((p) => {
    const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
    return total === 0;
  });

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-sm font-semibold text-gray-900">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers ?? "—"}
          sub="Registered customers"
          color={{ bg: "bg-blue-50", text: "text-blue-500" }}
          loading={isLoading}
        />
        <StatCard
          icon={Package}
          label="Total Products"
          value={stats?.totalProducts ?? "—"}
          sub={`${outOfStockItems.length} out of stock`}
          color={{ bg: "bg-violet-50", text: "text-violet-500" }}
          loading={isLoading}
        />
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders ?? "—"}
          sub="All time orders"
          color={{ bg: "bg-amber-50", text: "text-amber-500" }}
          loading={false}
        />
        <StatCard
          icon={IndianRupee}
          label="Total Revenue"
          value={
            stats?.totalRevenue
              ? `₹${stats.totalRevenue.toLocaleString("en-IN")}`
              : "—"
          }
          sub="From paid orders only"
          color={{ bg: "bg-emerald-50", text: "text-emerald-500" }}
          loading={isLoading}
        />
      </div>

      {/* Alerts + Recent products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stock alerts — takes 1 col */}
        <div className="bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-800">Stock Alerts</p>
            <AlertTriangle size={13} className="text-amber-400" />
          </div>

          <div className="flex flex-col divide-y divide-gray-50 flex-1">
            {/* Out of stock */}
            {outOfStockItems.length === 0 && lowStockItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <TrendingUp size={20} className="text-emerald-400" />
                <p className="text-xs text-gray-400">All products in stock</p>
              </div>
            ) : (
              <>
                {outOfStockItems.map((p) => (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 px-4 py-2.5"
                  >
                    <img
                      src={`https://loom-h6m8.onrender.com/uploads/${p.thumbnail}`}
                      alt={p.productName}
                      className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {p.productName}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-red-500 font-medium mt-0.5">
                        <XCircle size={9} /> Out of stock
                      </span>
                    </div>
                  </div>
                ))}
                {lowStockItems.map((p) => {
                  const total = p.variants.reduce(
                    (sum, v) => sum + (v.count || 0),
                    0,
                  );
                  return (
                    <div
                      key={p._id}
                      className="flex items-center gap-3 px-4 py-2.5"
                    >
                      <img
                        src={`https://loom-h6m8.onrender.com/uploads/${p.thumbnail}`}
                        alt={p.productName}
                        className="w-8 h-8 rounded-lg object-cover border border-gray-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">
                          {p.productName}
                        </p>
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-500 font-medium mt-0.5">
                          <AlertTriangle size={9} /> Low stock · {total} left
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              View all products <ArrowRight size={11} />
            </Link>
          </div>
        </div>

        {/* Recent products — takes 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-800">
              Recently Added
            </p>
            <Package size={13} className="text-gray-400" />
          </div>

          <div className="flex flex-col divide-y divide-gray-50 flex-1">
            {recentProducts.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <p className="text-xs text-gray-400">No products yet</p>
              </div>
            ) : (
              recentProducts.map((p) => {
                const total = p.variants.reduce(
                  (sum, v) => sum + (v.count || 0),
                  0,
                );
                return (
                  <div
                    key={p._id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <img
                      src={`https://loom-h6m8.onrender.com/uploads/${p.thumbnail}`}
                      alt={p.productName}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {p.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 capitalize">
                        {p.category}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-gray-900">
                        ₹{p.price}
                      </p>
                      <span
                        className={`text-[10px] font-medium ${
                          total === 0
                            ? "text-red-500"
                            : total < 10
                              ? "text-amber-500"
                              : "text-emerald-500"
                        }`}
                      >
                        {total === 0 ? "Out of stock" : `${total} in stock`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="px-4 py-3 border-t border-gray-100">
            <Link
              to="/admin/products"
              className="flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
            >
              View all products <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
