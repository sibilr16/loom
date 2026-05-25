import { useGetMyOrdersQuery } from "../services/payment.js";
import { Package, ChevronRight, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const statusColors = {
  pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
  shipped: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-500 ring-1 ring-red-200",
};

const statusSteps = ["confirmed", "shipped", "delivered"];

function MyOrders() {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery(undefined, {
    refetchOnFocus: true, // refetch when user comes back to tab
    refetchOnReconnect: true, // refetch when internet reconnects
  });
  const [expanded, setExpanded] = useState(null);

  if (isLoading)
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 flex flex-col gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
        ))}
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 flex flex-col items-center gap-3 text-center">
        <Package size={32} className="text-gray-300" />
        <p className="font-medium text-gray-700">No orders yet</p>
        <p className="text-sm text-gray-400">
          Your orders will appear here after purchase
        </p>
        <Link
          to="/"
          className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl hover:bg-gray-700 transition-colors"
        >
          <ShoppingBag size={13} />
          Start Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-gray-900">My Orders</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>
      </div>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Order header */}
          <button
            onClick={() =>
              setExpanded(expanded === order._id ? null : order._id)
            }
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-start gap-1">
              <span className="text-xs font-semibold text-gray-800">
                #{order._id.slice(-6).toUpperCase()}
              </span>
              <span className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusColors[order.status]}`}
              >
                {order.status}
              </span>
              <span className="text-xs font-bold text-gray-900">
                ₹{order.totalAmount}
              </span>
              <ChevronRight
                size={14}
                className={`text-gray-400 transition-transform duration-200 ${
                  expanded === order._id ? "rotate-90" : ""
                }`}
              />
            </div>
          </button>

          {/* Expanded */}
          {expanded === order._id && (
            <div className="border-t border-gray-100">
              {/* Progress tracker — only for non-cancelled orders */}
              {order.status !== "cancelled" && order.status !== "pending" && (
                <div className="px-4 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute left-0 right-0 top-3 h-0.5 bg-gray-100 mx-6" />
                    <div
                      className="absolute left-0 top-3 h-0.5 bg-gray-900 mx-6 transition-all duration-500"
                      style={{
                        width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%`,
                      }}
                    />
                    {statusSteps.map((step) => {
                      const isCompleted =
                        statusSteps.indexOf(order.status) >=
                        statusSteps.indexOf(step);
                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center gap-1 z-10"
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                              isCompleted
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {isCompleted ? "✓" : ""}
                          </div>
                          <span
                            className={`text-[10px] capitalize ${
                              isCompleted
                                ? "text-gray-800 font-medium"
                                : "text-gray-400"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="divide-y divide-gray-50">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3">
                    <img
                      src={`https://loom-h6m8.onrender.com/uploads/${item.product?.thumbnail}`}
                      alt={item.product?.productName}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">
                        {item.product?.productName}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-900 shrink-0">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-xs font-bold text-gray-900">
                  ₹{order.totalAmount}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
