import Cart from "../models/cart.schema.js";

async function updateCartItemHandler(req, res) {
  const userId = req.user._id;
  const { change, productId, size } = req.body;
  const cart = await Cart.findOneAndUpdate(
    { user: userId, "items.product": productId, "items.size": size },
    {
      $inc: {
        "items.$.quantity": change,
      },
    },
    { returnDocument: "after" },
  );
  res.json(cart);
}

export default updateCartItemHandler;
