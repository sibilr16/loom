import User from "../models/auth.schema.js";
import Product from "../models/product.schema.js";

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();

    const products = await Product.find();
    const lowStockProducts = products.filter((p) => {
      const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
      return total > 0 && total < 10;
    });
    const outOfStockProducts = products.filter((p) => {
      const total = p.variants.reduce((sum, v) => sum + (v.count || 0), 0);
      return total === 0;
    });

    res.status(200).json({
      totalUsers,
      totalProducts,
      totalOrders: 0, // placeholder
      totalRevenue: 0, // placeholder
      lowStock: lowStockProducts.length,
      outOfStock: outOfStockProducts.length,
      recentProducts: products
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default getDashboardStats;
