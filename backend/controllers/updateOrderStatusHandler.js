import Order from "../models/order.schema.js";

async function updateOrderStatusHandler(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export default updateOrderStatusHandler;
