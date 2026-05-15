import { Link } from "react-router-dom";
import { RiAddLine, RiDeleteBinLine, RiSubtractLine } from "react-icons/ri";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";
import {
  useDeleteCartItemMutation,
  useUpdateCartItemMutation,
} from "../services/cart";
import toast from "react-hot-toast";

function CartCard({ item }) {
  // console.log(item);
  const [itemCount, setItemCount] = useState(item.quantity);
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const handleDelete = (e) => {
    e.preventDefault();

    const cartItem = {
      productId: item.product._id,
      size: item.size,
    };
    deleteCartItem(cartItem);
    toast.success("Item removed");
  };

  const handleItemCountIncrease = async (e) => {
    e.preventDefault();
    setItemCount((count) => count + 1);
    const updatedCart = await updateCartItem({
      productId: item.product._id,
      size: item.size,
      change: 1,
    });
    console.log(updatedCart);
  };
  const handleItemCountDecrease = async (e) => {
    e.preventDefault();
    setItemCount((count) => count - 1);
    const updatedCart = await updateCartItem({
      productId: item.product._id,
      size: item.size,
      change: -1,
    });
    console.log(updatedCart);
  };

  //   return <div>{item.product.productName}</div>;
  return (
    <div className="flex gap-2 p-2 border border-x-0 border-t-0 border-b-gray-300">
      <div className="h-28 w-20 mb-3 overflow-hidden">
        <img
          className="w-full h-full object-cover "
          src={`https://loom-h6m8.onrender.com/uploads/${item.product.thumbnail}`}
          alt=""
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-xs">{item.product.productName}</p>
          <button onClick={handleDelete} className="cursor-pointer">
            <RiDeleteBinLine />
          </button>
        </div>
        <p className="text-xs border inline px-1">{item.size}</p>
        <p className="text-xs mt-1 mb-5">{`RS.${item.product.price}`}</p>
        <div className="flex justify-between ">
          <div className="border py-1 px-3 rounded-lg inline-flex gap-2 text-xs">
            <button
              disabled={itemCount === 1}
              // onClick={() => setItemCount((c) => c - 1)}
              onClick={handleItemCountDecrease}
              className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <RiSubtractLine />
            </button>
            <p>{itemCount}</p>
            <button
              disabled={itemCount === 5}
              className="cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              // onClick={() => setItemCount((c) => c + 1)}
              onClick={handleItemCountIncrease}
            >
              <RiAddLine />
            </button>
          </div>
          <Link className="flex items-center gap-1">
            <CiEdit />
            <p className="text-xs lowercase">Edit Order</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartCard;
