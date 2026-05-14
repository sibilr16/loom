import { Link, useSearchParams } from "react-router-dom";
import { useGetProductsQuery } from "../services/product";
import { useState } from "react";
import Carousel from "../components/Carousel";

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
        <p>Loading...</p>
      ) : (
        <div className="h-screen p-5 max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex my-8 items-center justify-center gap-5">
            {categories.map((category) => (
              <button
                className={`uppercase ${selectedCategory === category ? "bg-gray-800 text-gray-50" : ""}  tracking-wide hover:bg-gray-900 transition-all duration-200 hover:text-gray-50 bg-gray-50 border text-sm cursor-pointer px-4 font-semibold rounded-lg py-1 border-gray-800`}
                key={category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* <div>
            {products &&
              products.map((product) => <div>{product.category}</div>)}
          </div> */}
          {/* <h1 className="font-bold text-2xl text-gray-800">Products</h1> */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {" "}
            {products &&
              filteredProducts.map((product) => (
                <Link
                  to={`/product/${product.category}/${product._id}`}
                  className="flex flex-col items-center justify-center"
                  key={product._id}
                >
                  <div className="h-80 w-56 mb-3 overflow-hidden rounded-md">
                    <img
                      className="w-full h-full object-cover"
                      src={`https://loom-h6m8.onrender.com/uploads/${product.thumbnail}`}
                      alt={product.productName}
                    />
                  </div>
                  <h1 className="font-semibold md:self-start pl-1 text-lg text-gray-900">
                    {product.productName}
                  </h1>

                  <p className="md:self-start pl-1">{`RS. ${product.price} `}</p>
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
