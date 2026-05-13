import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice";
import { useGetCartQuery } from "../services/cart";
import CartCard from "./CartCard";
import { useNavigate } from "react-router-dom";

function CartDrawer({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cart } = useGetCartQuery();
  // const user = false;
  const totalAmount = cart?.items?.reduce(
    (total, item) => total + item.quantity * item.priceAtAddedTime,
    0,
  );
  const user = useSelector((state) => state.auth.user);
  return (
    <div>
      {/* Backdrop */}

      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-600 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />
      {/* Drawer */}
      <div
        // role="dialog"
        // aria-modal="true"
        className={`fixed top-0 right-0 h-screen w-full max-w-xs bg-white z-50
          flex flex-col  border-l border-zinc-200 transition-transform duration-[1000ms] ]
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-300 shrink-0">
          <p className="uppercase font-semibold">Shopping Cart</p>
          <button className="text-2xl" onClick={onClose}>
            x
          </button>
        </div>
        {/* Body */}
        {user ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {cart?.items && (
                <ul>
                  {cart?.items.map((item) => (
                    <li key={`${item.product._id}-${item.size}`}>
                      <CartCard item={item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Footer */}
            <div className="shadow-gray-950 shadow-2xl p-3 border-t-gray-950">
              <div className="flex justify-between mb-3">
                <span className="text-sm font-normal uppercase">
                  Subtotal :
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-normal">{`RS. ${totalAmount}`}</span>
                  <span className="text-[8.2px] font-normal tracking-wide">
                    tax and shipping included
                  </span>
                </div>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="uppercase bg-gray-950 rounded-lg text-xs w-full p-2 font-semibold text-gray-50 tracking-widest"
              >
                Confirm order
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
            <p className="text-sm text-zinc-500 mb-4">
              Please login to access your cart
            </p>

            <button
              onClick={() => dispatch(openAuth())}
              className="bg-gray-900 text-white text-xs uppercase tracking-wider px-6 py-2 rounded-md hover:bg-black transition"
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
