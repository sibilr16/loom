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
  useDeleteProductMutation,
  useGetProductsQuery,
  // useDeleteProductMutation,
} from "../../services/product";
import AddProduct from "../../components/AddProduct";
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  ChevronsUpDown,
} from "lucide-react";

function ProductTable() {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [globalFilter, setGlobalFilter] = useState("");

  const { data: products = [] } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const handleEdit = (product) => setEditProduct(product);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
  };

  const formattedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      totalStock: product.variants.reduce(
        (total, variant) => total + (variant.count || 0),
        0,
      ),
    }));
  }, [products]);

  const StockBadge = ({ stock }) => (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        stock === 0
          ? "bg-red-50 text-red-600 ring-1 ring-red-200"
          : stock < 10
            ? "bg-amber-50 text-amber-600 ring-1 ring-amber-200"
            : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
      }`}
    >
      {stock === 0 ? "Out of stock" : stock < 10 ? `Low · ${stock}` : stock}
    </span>
  );

  const columns = [
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) => (
        <img
          src={`https://loom-h6m8.onrender.com/uploads/${row.original.thumbnail}`}
          alt={row.original.productName}
          className="w-10 h-10 object-cover rounded-lg ring-1 ring-gray-100"
        />
      ),
    },
    {
      accessorKey: "productName",
      header: "Product",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-gray-900 text-xs leading-snug">
            {row.original.productName}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 capitalize">
            {row.original.category}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => (
        <span className="font-medium text-gray-800 text-xs">₹{getValue()}</span>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      // hidden on mobile via table wrapper — shown in productName cell
      cell: ({ getValue }) => (
        <span className="capitalize text-xs text-gray-600">{getValue()}</span>
      ),
    },
    {
      accessorKey: "totalStock",
      header: "Stock",
      cell: ({ getValue }) => <StockBadge stock={getValue()} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedProduct(row.original)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
            title="View"
          >
            <Eye size={13} />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
            title="Edit"
          >
            <Pencil size={13} />
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
    data: formattedProducts,
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
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search products..."
            className="pl-8 pr-4 py-2 text-xs border border-gray-200 rounded-lg bg-white w-full sm:w-64 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
        <button
          onClick={() => setOpenModal(true)}
          className="flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-700 transition-colors cursor-pointer font-medium rounded-lg text-xs text-white px-4 py-2"
        >
          <Plus size={13} />
          Add Product
        </button>
      </div>

      {/* Table — horizontally scrollable on mobile */}
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
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    No products found
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
                formattedProducts.length,
              )}
            </span>
            {" of "}
            <span className="font-medium text-gray-600">
              {formattedProducts.length}
            </span>
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

      {/* Add / Edit modal */}
      {(openModal || editProduct) && (
        <AddProduct
          onClose={() => {
            setOpenModal(false);
            setEditProduct(null);
          }}
          initialData={editProduct ?? null}
        />
      )}

      {/* Product detail drawer */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <h2 className="font-semibold text-sm text-gray-900">
                Product Detail
              </h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Thumbnail with padding so it doesn't bleed */}
              <div className="p-5 pb-3">
                <img
                  src={`https://loom-h6m8.onrender.com/uploads/${selectedProduct.thumbnail}`}
                  alt={selectedProduct.productName}
                  className="w-full h-48 object-cover rounded-xl border border-gray-100"
                />
              </div>

              {/* Gallery strip */}
              {selectedProduct.gallery?.length > 0 && (
                <div className="flex gap-2 px-5 pb-3 overflow-x-auto">
                  {selectedProduct.gallery.map((img, i) => (
                    <img
                      key={i}
                      src={`https://loom-h6m8.onrender.com/uploads/${img}`}
                      alt=""
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200 shrink-0"
                    />
                  ))}
                </div>
              )}

              <div className="px-5 pb-5 flex flex-col gap-4">
                {/* Name + category */}
                <div>
                  <p className="font-semibold text-sm text-gray-900 leading-snug">
                    {selectedProduct.productName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 capitalize">
                    {selectedProduct.category}
                  </p>
                </div>

                <div className="h-px bg-gray-100" />

                {/* Price + Stock — inline, matches table row style */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">Price</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ₹{selectedProduct.price}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Stock</p>
                    <StockBadge stock={selectedProduct.totalStock} />
                  </div>
                </div>

                {/* Description */}
                {selectedProduct.description && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <p className="text-xs text-gray-400 mb-1.5">
                        Description
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {selectedProduct.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Variants */}
                {selectedProduct.variants?.length > 0 && (
                  <>
                    <div className="h-px bg-gray-100" />
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Variants</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.variants.map((variant, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
                          >
                            <span className="text-xs font-medium text-gray-800">
                              {variant.size ?? variant.name ?? `#${i + 1}`}
                            </span>
                            <span className="text-xs text-gray-300">·</span>
                            <span className="text-xs text-gray-400">
                              Qty {variant.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer — matches toolbar button style */}
            <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-2">
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  handleEdit(selectedProduct);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-gray-200 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(selectedProduct._id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-red-50 text-xs font-medium text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductTable;
