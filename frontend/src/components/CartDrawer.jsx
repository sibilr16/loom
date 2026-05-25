import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice.js";
import { useGetCartQuery } from "../services/cart.js";
import CartCard from "./CartCard.jsx";
import { useNavigate } from "react-router-dom";
import { X, ShoppingCart } from "lucide-react";

function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const { data: cart } = useGetCartQuery(undefined, { skip: !user });
  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(openAuth());
    onClose();
  };

  const handleConfirmOrder = (e) => {
    e.preventDefault();
    navigate("/checkout");
    onClose();
  };

  const totalAmount = cart?.items?.reduce(
    (total, item) =>
      total +
      item.quantity * (item.priceAtAddedTime ?? item.product?.price ?? 0),
    0,
  );
  return (
    <div>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-xs bg-white z-50
          flex flex-col border-l border-gray-200 transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={15} className="text-gray-700" />
            <p className="uppercase text-xs font-semibold tracking-wider text-gray-800">
              Cart
              {cart?.items?.length > 0 && (
                <span className="ml-1.5 text-gray-400 font-normal">
                  ({cart.items.length})
                </span>
              )}
            </p>
          </div>
          <button
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        {user ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {cart?.items?.length > 0 ? (
                <ul className="divide-y divide-gray-50">
                  {cart.items.map((item) => (
                    <li key={`${item.product._id}-${item.size}`}>
                      <CartCard item={item} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col h-full items-center justify-center text-center px-6 gap-3">
                  <ShoppingCart size={32} className="text-gray-200" />
                  <p className="text-sm text-gray-400">Your cart is empty</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart?.items?.length > 0 && (
              <div className="p-4 border-t border-gray-200 shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-medium uppercase text-gray-600 tracking-wide">
                    Subtotal
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{totalAmount}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      Tax and shipping included
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleConfirmOrder}
                  className="uppercase cursor-pointer bg-gray-900 hover:bg-gray-700 transition-colors rounded-lg text-xs w-full py-2.5 font-semibold text-white tracking-widest"
                >
                  Confirm Order
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-6 gap-3">
            <ShoppingCart size={32} className="text-gray-200" />
            <p className="text-sm text-gray-500">
              Please login to access your cart
            </p>
            <button
              onClick={handleLogin}
              className="bg-gray-900 text-white text-xs tracking-wider cursor-pointer px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
