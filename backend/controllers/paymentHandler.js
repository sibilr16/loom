import { instance } from "../utils/razorpay.js";

async function paymentHandler(req, res) {
  const { amount } = req.body;

  const orderRes = await instance.orders.create({
    amount: amount * 100,
    currency: "INR",
  });

  return res.json({
    order_id: orderRes.id,
    amount: orderRes.amount,
    message: "OrderID Created",
  });
}

export default paymentHandler;
