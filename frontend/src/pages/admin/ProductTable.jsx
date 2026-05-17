import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetProductsQuery } from "../../services/product";
import AddProduct from "../../components/AddProduct";

function ProductTable() {
  const [openModal, setOpenModal] = useState(false);
  const { data: products = [] } = useGetProductsQuery();
  const formattedProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      totalStock: product.variants.reduce(
        (total, variant) => total + (variant.count || 0),
        0,
      ),
    }));
  }, [products]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = [
    {
      accessorKey: "thumbnail",
      header: "Image",
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <img
            src={`https://loom-h6m8.onrender.com/uploads/${row.original.thumbnail}`}
            alt={row.original.productName}
            className="w-12 h-12 object-cover rounded"
          />
        </div>
      ),
    },
    {
      accessorKey: "productName",
      header: "Product",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `₹${getValue()}`,
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "totalStock",
      header: "Stock",
      cell: ({ getValue }) => {
        const stock = getValue();
        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              stock === 0
                ? "bg-red-600 text-gray-50"
                : stock < 10
                  ? "bg-yellow-600 text-gray-50"
                  : "bg-green-600 text-gray-50"
            }`}
          >
            {stock}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: formattedProducts,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col">
      <div className="flex mb-4 justify-between items-center ">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search products..."
          className="border px-3 py-2 text-xs max-w-xs rounded-md"
        />
        <button
          onClick={() => setOpenModal(true)}
          className="bg-gray-900 cursor-pointer font-semibold tracking-wide rounded-md text-xs text-gray-50 px-8 py-2"
        >
          Add Product
        </button>
        {openModal && <AddProduct onClose={() => setOpenModal(false)} />}
      </div>
      <table className="w-full border border-gray-500">
        <thead className="bg-gray-900 text-gray-50 rounded-2xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="border border-gray-500 p-2 text-xs cursor-pointer"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="border text-xs tracking-wide border-gray-300  p-2"
                >
                  {flexRender(
                    cell.column.columnDef.cell ??
                      cell.column.columnDef.accessorKey,
                    cell.getContext(),
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex self-end mr-2 items-center gap-2 mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="border rounded-md px-2 py-1  text-xs"
        >
          Prev
        </button>
        <span className="text-xs">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="border rounded-md px-2 py-1 text-xs"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ProductTable;
