import Order from "../models/order.schema.js";

async function getAllOrdersHandler(req, res) {
  try {
    const orders = await Order.find()
      .populate("user", "username email phoneNumber")
      .populate("items.product", "productName thumbnail price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default getAllOrdersHandler;
