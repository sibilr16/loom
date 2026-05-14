import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/product";
import { useState } from "react";
import { useAddToCartMutation } from "../services/cart";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice";
import BreadCrumb from "../components/BreadCrumb.jsx";

function ProductDetails() {
  const [selectedSize, setSelectedSize] = useState(null);
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQuery(id);
  const [addToCart] = useAddToCartMutation();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  console.log(user);
  const sizes = ["S", "M", "L", "XL", "2XL"];

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      dispatch(openAuth());
    }

    const cartData = {
      size: selectedSize,
      productId: product._id,
      priceAtAddedTime: product.price,
      quantity: 1,
    };

    const response = await addToCart(cartData).unwrap();
    toast.success("Added to cart");
    console.log(response);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading....</p>
      ) : (
        <div>
          {product && (
            <div>
              <BreadCrumb product={product} />
              <div className="flex flex-col md:flex-row md:gap-4  p-4 max-w-5xl mx-auto ">
                {/* Left side */}
                <div className="max-w-lg mb-4 ">
                  {/* Thumbnail */}
                  <div className="  mb-3 overflow-hidden rounded-md">
                    <img
                      src={`https://loom-eight-theta.vercel.app/uploads/${product.thumbnail}`}
                      alt=""
                    />
                  </div>
                  {/* Gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {product.gallery.map((img) => (
                      <div key={img}>
                        <img
                          src={`https://loom-eight-theta.vercel.app/uploads/${img}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Right Side */}
                <div className="max-w-lg w-full">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <h1 className="text-gray-900 uppercase">
                        {product.productName}
                      </h1>
                      <p className="text-gray-600 text-sm mb-4">
                        <span className="text-sm">Category: </span>
                        {product.category}
                      </p>
                    </div>
                    <div>
                      <p>{`RS: ${product.price}`}</p>
                    </div>
                  </div>
                  {/* Size */}
                  <div className="bg-gray-200 p-2 mb-3 rounded-lg">
                    <p className="text-gray-800 text-sm mb-2">Choose Size</p>
                    <ul className="flex cursor-pointer mb-2 gap-2 justify-between text-gray-900 text-sm text-center">
                      {sizes.map((size) => (
                        <li
                          onClick={() => setSelectedSize(size)}
                          key={size}
                          className={` ${selectedSize === size ? "bg-gray-950  text-gray-50" : "bg-white"}  border w-full  rounded-sm`}
                        >
                          {size}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={`w-full cursor-pointer ${selectedSize ? "bg-gray-950" : "bg-gray-600 text-white"}  text-gray-50 text-sm py-2 rounded-sm`}
                      type="button"
                      onClick={handleAddToCart}
                    >
                      {selectedSize ? "Add to cart" : "Choose Size"}
                    </button>
                  </div>
                  <h2 className="text-lg mb-2 text-gray-800">Description</h2>
                  <p className="text-sm text-gray-800">{product.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
