import Cart from "../models/cart.schema.js";

async function getCartHandler(req, res) {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "productName thumbnail price",
  );
  if (!cart) {
    return res.status(200).json({ items: [], totalAmount: 0 });
  }

  res.status(200).json(cart);
}

export default getCartHandler;
