import { Link, useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../services/product";
import { useState } from "react";
import Carousel from "../components/Carousel";
import Loader from "../components/Loader";
import { PackageX } from "lucide-react";

const categories = ["all", "shirts", "jeans"];

function Products() {
  const [params] = useSearchParams();
  const categoryFromURL = params.get("category");
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromURL || "all",
  );
  const { data: products = [], isLoading } = useGetProductsQuery();

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  return (
    <div>
      <Carousel />

      {isLoading ? (
        <div className="flex justify-center py-32">
          <Loader size="xl" />
        </div>
      ) : (
        <div className="px-4 md:px-8 max-w-7xl mx-auto pb-16">
          {/* Category tabs */}
          <div className="flex items-center justify-center gap-2 md:gap-3 mt-8 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`uppercase tracking-widest text-xs font-semibold px-5 py-2 rounded-full border transition-all duration-200 cursor-pointer
                  ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-900 hover:text-gray-900"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <PackageX size={32} className="text-gray-300" />
              <p className="text-sm text-gray-500">
                No products found in {selectedCategory}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
              {filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.category}/${product._id}`}
                  key={product._id}
                  className="group flex flex-col"
                >
                  {/* Image */}
                  <div className="w-full aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-2">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={`https://loom-h6m8.onrender.com/uploads/${product.thumbnail}`}
                      alt={product.productName}
                    />
                  </div>

                  {/* Info */}
                  <div className="px-0.5">
                    <p className="text-xs font-semibold text-gray-900 truncate leading-snug">
                      {product.productName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      ₹{product.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
