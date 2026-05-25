import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/product";
import { useState } from "react";
import { useAddToCartMutation } from "../services/cart";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice";
import BreadCrumb from "../components/BreadCrumb.jsx";
import Loader from "../components/Loader.jsx";

function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!user) {
      dispatch(openAuth());
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    const cartData = {
      size: selectedSize,
      productId: product._id,
      priceAtAddedTime: product.price,
      quantity: 1,
    };

    await addToCart(cartData).unwrap();
    toast.success("Added to cart");
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-32">
        <Loader size="xl" />
      </div>
    );

  if (!product) return null;

  const mainImage = activeImage ?? product.thumbnail;
  const allImages = [product.thumbnail, ...(product.gallery ?? [])];

  const availableSizes =
    product.variants?.filter((v) => v.count > 0).map((v) => v.size) ?? [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <BreadCrumb product={product} />

      <div className="flex flex-col md:flex-row gap-8 mt-4">
        {/* Left — Images */}
        <div className="md:w-1/2 flex flex-col gap-3">
          {/* Main image */}
          <div className="w-full aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={`https://loom-h6m8.onrender.com/uploads/${mainImage}`}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Gallery thumbnails */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square overflow-hidden rounded-lg border-2 transition-colors cursor-pointer ${
                    mainImage === img
                      ? "border-gray-900"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <img
                    src={`https://loom-h6m8.onrender.com/uploads/${img}`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right — Details */}
        <div className="md:w-1/2 flex flex-col gap-5">
          {/* Name + price */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1 capitalize">
              {product.category}
            </p>
            <h1 className="text-xl font-semibold text-gray-900 uppercase tracking-wide">
              {product.productName}
            </h1>
            <p className="text-lg font-bold text-gray-900 mt-2">
              ₹{product.price}
            </p>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Size selector */}
          <div>
            <p className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">
              Select Size
              {selectedSize && (
                <span className="ml-2 text-gray-900 font-bold">
                  {selectedSize}
                </span>
              )}
            </p>
            <div className="flex gap-2 flex-wrap">
              {product.variants?.map((variant) => {
                const outOfStock = variant.count === 0;
                return (
                  <button
                    key={variant.size}
                    onClick={() => !outOfStock && setSelectedSize(variant.size)}
                    disabled={outOfStock}
                    className={`w-12 h-10 rounded-lg text-xs font-medium border transition-all cursor-pointer
                      ${
                        outOfStock
                          ? "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed line-through"
                          : selectedSize === variant.size
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-900"
                      }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`w-full py-3 rounded-xl text-sm font-semibold tracking-wider uppercase transition-colors cursor-pointer
              ${
                selectedSize
                  ? "bg-gray-900 text-white hover:bg-gray-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
          >
            {isAdding
              ? "Adding..."
              : selectedSize
                ? "Add to Cart"
                : "Select a Size"}
          </button>

          <div className="h-px bg-gray-100" />

          {/* Description */}
          {product.description && (
            <div>
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
