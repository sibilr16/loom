import Product from "../models/product.schema.js";

async function getProductById(req, res) {
  const id = req.params.id;
  const product = await Product.findById(id);
  res.json(product);

  console.log(id);
}

export default getProductById;
