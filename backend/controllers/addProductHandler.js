import Product from "../models/product.schema.js";

async function addProductHandler(req, res) {
  const variants = JSON.parse(req.body.variants);
  const { productName, category, price, description } = req.body;
  const { thumbnail, gallery } = req.files;
  console.log(variants);

  const product = new Product({
    productName: productName,
    category: category,
    price: price,
    description: description,
    thumbnail: thumbnail[0].filename,
    gallery: gallery.map((gallery) => gallery.filename),
    variants: variants,
  });
  await product.save();
}

export default addProductHandler;
