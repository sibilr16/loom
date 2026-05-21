import { useMemo, useState } from "react";
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
  Trash2,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../services/user.js";

function UserTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [], isLoading } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await deleteUser(id);
  };

  const ProfileBadge = ({ completed }) => (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
        completed
          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
          : "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
      }`}
    >
      {completed ? <CheckCircle size={10} /> : <XCircle size={10} />}
      {completed ? "Complete" : "Incomplete"}
    </span>
  );

  const columns = [
    {
      accessorKey: "username",
      header: "User",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium shrink-0">
            {row.original.username?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-xs leading-snug">
              {row.original.username ?? "—"}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {row.original.email ?? "No email"}
            </p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-600">{getValue() ?? "—"}</span>
      ),
    },
    {
      accessorKey: "isProfileCompleted",
      header: "Profile",
      cell: ({ getValue }) => <ProfileBadge completed={getValue()} />,
    },
    {
      accessorKey: "addresses",
      header: "Addresses",
      cell: ({ getValue }) => (
        <span className="text-xs text-gray-600">
          {getValue()?.length ?? 0} saved
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
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
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedUser(row.original)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            title="View"
          >
            <User size={13} />
          </button>
          <button
            onClick={() => handleDelete(row.original._id)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: users,
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
          <h1 className="text-sm font-semibold text-gray-900">Users</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {users.length} total users
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
            placeholder="Search users..."
            className="pl-8 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white w-full sm:w-64 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
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
                // Skeleton rows
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
                    No users found
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
                users.length,
              )}
            </span>
            {" of "}
            <span className="font-medium text-gray-600">{users.length}</span>
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

      {/* User detail drawer */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedUser(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-semibold text-sm text-gray-900">
                User Detail
              </h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5 flex-1">
              {/* Avatar + name */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center text-xl font-semibold shrink-0">
                  {selectedUser.username?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    {selectedUser.username ?? "—"}
                  </p>
                  <ProfileBadge completed={selectedUser.isProfileCompleted} />
                </div>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Contact info */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <Mail size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="text-xs font-medium text-gray-800 mt-0.5">
                      {selectedUser.email ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <Phone size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-xs font-medium text-gray-800 mt-0.5">
                      {selectedUser.phoneNumber ?? "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                    <User size={13} className="text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Joined</p>
                    <p className="text-xs font-medium text-gray-800 mt-0.5">
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              {selectedUser.addresses?.length > 0 && (
                <>
                  <div className="h-px bg-gray-100" />
                  <div>
                    <p className="text-xs text-gray-400 mb-2">
                      Saved Addresses ({selectedUser.addresses.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {selectedUser.addresses.map((addr, i) => (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-xl p-3 bg-gray-50"
                        >
                          <div className="flex items-start gap-2">
                            <MapPin
                              size={12}
                              className="text-gray-400 mt-0.5 shrink-0"
                            />
                            <div>
                              <p className="text-xs font-medium text-gray-800">
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                {[
                                  addr.address,
                                  addr.apartment,
                                  addr.city,
                                  addr.state,
                                  addr.pinCode,
                                  addr.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-50 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 size={12} /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserTable;
