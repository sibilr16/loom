import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import Cart from "../models/cart.schema.js";
import Order from "../models/order.schema.js";

async function verifyPaymentHandler(req, res) {
  // const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
  //   req.body;
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    cartItems,
    totalAmount,
  } = req.body;

  try {
    validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RZP_KEY_SECRET,
    );
    // Create order in DB
    const order = await Order.create({
      user: req.user._id,
      items: cartItems.map((item) => ({
        product: item.product._id,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalAmount,
      status: "confirmed",
      paymentStatus: "paid",
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
    });

    // Clear cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } },
    );
    return res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
}

export default verifyPaymentHandler;
