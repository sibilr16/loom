import { useState } from "react";
import { BsCart3, BsPerson } from "react-icons/bs";
import CartDrawer from "./CartDrawer.jsx";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice.js";
import { useGetCartQuery } from "../services/cart.js";
import { Package } from "lucide-react";

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: cartData } = useGetCartQuery(undefined, { skip: !user });
  const cartCount = cartData?.items?.length ?? 0;

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!user) {
      dispatch(openAuth());
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="flex justify-between md:px-20 border-b border-b-gray-200 p-3 sticky top-0 bg-white z-30">
      <Link to="/" className="font-bold text-2xl text-gray-800">
        LOOM
      </Link>
      <ul className="flex justify-center items-center gap-4">
        {user && (
          <li>
            <Link
              to="/orders"
              className="text-gray-800 hover:text-gray-500 transition-colors"
            >
              <Package size={22} />
            </Link>
          </li>
        )}

        {/* Profile */}
        <li>
          <button
            className="cursor-pointer text-gray-800 hover:text-gray-500 transition-colors"
            onClick={handleProfileClick}
          >
            <BsPerson size={25} />
          </button>
        </li>
        <li>
          <button
            className="cursor-pointer text-gray-800 hover:text-gray-500 transition-colors"
            onClick={() => setCartOpen(true)}
          >
            <BsCart3 size={25} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
