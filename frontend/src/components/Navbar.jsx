import { useState } from "react";
import { BsCart3, BsPerson } from "react-icons/bs";
import CartDrawer from "./CartDrawer";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useDispatch, useSelector } from "react-redux";
import { openAuth } from "../features/uiSlice";

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  // const user = false;
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (!user) {
      dispatch(openAuth());
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="flex shadow-2xl justify-between px-20 border border-l-0 border-r-0 border-t-0 border-b-gray-400 p-3 ">
      <Link to="/" className="font-bold text-2xl text-gray-800">
        LOOM
      </Link>
      <ul className="flex justify-center items-center gap-4">
        <li>
          {/* <button className="cursor-pointer" onClick={() => setAuthOpen(true)}> */}
          <button className="cursor-pointer" onClick={handleProfileClick}>
            <BsPerson size={25} />
          </button>
        </li>
        <li>
          <button className="cursor-pointer" onClick={() => setCartOpen(true)}>
            <BsCart3 size={25} />
          </button>
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
