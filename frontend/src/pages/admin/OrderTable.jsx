import { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../services/payment.js";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  X,
  Package,
} from "lucide-react";

const statusColors = {
  pending: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  confirmed: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
  shipped: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  cancelled: "bg-red-50 text-red-500 ring-1 ring-red-200",
};

const allStatuses = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

function OrderTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders = [], isLoading } = useGetAllOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (id, status) => {
    await updateOrderStatus({ id, status });
    if (selectedOrder?._id === id) {
      setSelectedOrder((prev) => ({ ...prev, status }));
    }
  };

  const columns = [
    {
      accessorKey: "_id",
      header: "Order ID",
      cell: ({ getValue }) => (
        <span className="text-xs font-mono text-gray-600">
          #{getValue().slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      accessorKey: "user",
      header: "Customer",
      cell: ({ getValue }) => (
        <div>
          <p className="text-xs font-medium text-gray-900">
            {getValue()?.username ?? "—"}
          </p>
          <p className="text-xs text-gray-400">{getValue()?.email ?? ""}</p>
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="text-xs font-semibold text-gray-900">
          ₹{getValue()}
        </span>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ getValue }) => (
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
            getValue() === "paid"
              ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
              : getValue() === "failed"
                ? "bg-red-50 text-red-500 ring-1 ring-red-200"
                : "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
          }`}
        >
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <select
          value={row.original.status}
          onChange={(e) => handleStatusChange(row.original._id, e.target.value)}
          className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer capitalize focus:outline-none focus:ring-1 focus:ring-gray-300 ${statusColors[row.original.status]}`}
        >
          {allStatuses.map((s) => (
            <option
              key={s}
              value={s}
              className="bg-white text-gray-800 capitalize"
            >
              {s}
            </option>
          ))}
        </select>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-500">
          {new Date(getValue()).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <button
          onClick={() => setSelectedOrder(row.original)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
          title="View"
        >
          <Package size={13} />
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    initialState: { pagination: { pageSize: 10 } },
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {orders.length} total orders
          </p>
        </div>
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search orders..."
            className="pl-8 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white w-full sm:w-64 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="border-b border-gray-100 bg-gray-50"
                >
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 cursor-pointer select-none whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getCanSort() && (
                          <ChevronsUpDown size={11} className="text-gray-300" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50/60 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell ??
                            cell.column.columnDef.accessorKey,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-600">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
            </span>
            {" – "}
            <span className="font-medium text-gray-600">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                orders.length,
              )}
            </span>
            {" of "}
            <span className="font-medium text-gray-600">{orders.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft size={13} />
            </button>
            <span className="px-3 py-1 text-xs font-medium text-gray-600">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* Order detail drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-semibold text-sm text-gray-900">
                  #{selectedOrder._id.slice(-6).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 flex-1">
              {/* Customer */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Customer</p>
                <div className="flex items-center gap-3 border border-gray-100 rounded-xl p-3 bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold shrink-0">
                    {selectedOrder.user?.username?.charAt(0)?.toUpperCase() ??
                      "?"}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      {selectedOrder.user?.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedOrder.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Status controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Order Status</p>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleStatusChange(selectedOrder._id, e.target.value)
                    }
                    className={`w-full text-xs font-medium px-2 py-1.5 rounded-lg border-0 cursor-pointer capitalize focus:outline-none focus:ring-1 focus:ring-gray-300 ${statusColors[selectedOrder.status]}`}
                  >
                    {allStatuses.map((s) => (
                      <option
                        key={s}
                        value={s}
                        className="bg-white text-gray-800 capitalize"
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">Payment</p>
                  <span
                    className={`inline-flex items-center text-xs font-medium px-2 py-1.5 rounded-lg capitalize ${
                      selectedOrder.paymentStatus === "paid"
                        ? "bg-emerald-50 text-emerald-600"
                        : selectedOrder.paymentStatus === "failed"
                          ? "bg-red-50 text-red-500"
                          : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 mb-2">
                  Items ({selectedOrder.items.length})
                </p>
                <div className="flex flex-col gap-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <img
                        src={`https://loom-h6m8.onrender.com/uploads/${item.product?.thumbnail}`}
                        alt={item.product?.productName}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 shrink-0"
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
              </div>

              <div className="h-px bg-gray-100" />

              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Total Amount</span>
                <span className="text-sm font-bold text-gray-900">
                  ₹{selectedOrder.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTable;
