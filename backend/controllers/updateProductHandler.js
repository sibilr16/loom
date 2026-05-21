import Product from "../models/product.schema";

const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, price, description, variants } = req.body;

    const updatedFields = {
      productName,
      category,
      price,
      description,
      variants: JSON.parse(variants),
    };

    // Only update images if new ones were uploaded
    if (req.files?.thumbnail) {
      updatedFields.thumbnail = req.files.thumbnail[0].filename;
    }
    if (req.files?.gallery) {
      updatedFields.gallery = req.files.gallery.map((f) => f.filename);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true }, // returns the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export default updateProductHandler;
