import Cart from "../models/cart.schema.js";

async function deleteCartItemHandler(req, res) {
  const userId = req.user._id;
  const { productId, size } = req.body;

  const cart = await Cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        items: {
          product: productId,
          size: size,
        },
      },
    },
    { returnDocument: "after" },
  );
  res.json(cart);
}

export default deleteCartItemHandler;
