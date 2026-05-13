import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      enum: ["S", "M", "L", "XL", "2XL"],
    },
    count: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    productName: String,
    category: String,
    description: String,
    price: Number,
    gallery: [
      {
        type: String,
      },
    ],
    thumbnail: String,
    variants: [variantSchema],
  },
  { timestamps: true },
);
const Product = mongoose.model("Product", productSchema);

export default Product;
