import Product from "../models/product.schema.js";
import Cart from "../models/cart.schema.js";

async function addToCartHandler(req, res) {
  const { size, productId, quantity } = req.body;

  const product = await Product.findById(req.body.productId);
  const availableVariant = product.variants.find(
    (variant) => variant.size === size && variant.count > 0,
  );
  if (!availableVariant) return res.json({ message: "Out of stock" });

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId && item.size === size,
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      size,
      quantity,
      priceAtAddedTime: product.price,
    });
  }
  cart.totalAmount = cart.items.reduce(
    (acc, item) => acc + item.quantity * item.priceAtAddedTime,
    0,
  );

  const updatedCart = await cart.save();

  res.status(200).json({
    message: "Cart updated",
    cart: updatedCart,
  });
}

export default addToCartHandler;
