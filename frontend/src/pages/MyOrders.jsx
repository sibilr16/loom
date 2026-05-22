import { useGetMyOrdersQuery } from "../services/payment.js";
import { Package, ChevronRight } from "lucide-react";
import { useState } from "react";

const statusColors = {
  pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
  shipped: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-500 ring-1 ring-red-200",
};

function MyOrders() {
  const { data: orders = [], isLoading } = useGetMyOrdersQuery();
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
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-4">
      <div>
        <h1 className="font-semibold text-gray-900">My Orders</h1>
        <p className="text-xs text-gray-400 mt-0.5">{orders.length} orders</p>
      </div>

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          {/* Order header — clickable to expand */}
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

          {/* Expanded items */}
          {expanded === order._id && (
            <div className="border-t border-gray-100">
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

              {/* Order total row */}
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
