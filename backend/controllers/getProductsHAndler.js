import Product from "../models/product.schema.js";

async function getProductsHAndler(req, res) {
  const result = await Product.find({});
  res && res.json(result);
}

export default getProductsHAndler;
