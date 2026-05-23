import User from "../models/auth.schema.js";
import Order from "../models/order.schema.js";
import Product from "../models/product.schema.js";

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Real revenue — sum of all paid orders
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult[0]?.total ?? 0;

    const products = await Product.find();
    const lowStockProducts = products.filter((p) => {
      const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
      return total > 0 && total < 10;
    });
    const outOfStockProducts = products.filter((p) => {
      const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
      return total === 0;
    });

    const recentProducts = products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      recentProducts,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getDashboardStats;
