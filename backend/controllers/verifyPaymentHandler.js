import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

async function verifyPaymentHandler(req, res) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  try {
    validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      process.env.RZP_KEY_SECRET,
    );
    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid signature" });
  }
}

export default verifyPaymentHandler;
