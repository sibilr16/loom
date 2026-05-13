import { useState } from "react";
import { useAddProductMutation } from "../services/product";

function AddProduct({ onClose }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [preview, setPreview] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [productSize, setProductSize] = useState();
  const [productCount, setProductCount] = useState(0);
  const [variants, setVariants] = useState([]);
  const [category, setCategory] = useState("shirts");
  const [addProduct] = useAddProductMutation();

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const handleVariant = (e) => {
    e.preventDefault();

    if (!productSize || productCount <= 0) return;

    setVariants((prev) => [
      ...prev,
      { size: productSize, count: productCount },
    ]);

    setProductCount(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("thumbnail", thumbnail);
    gallery.forEach((file) => formData.append("gallery", file));
    formData.append("productName", productName);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("variants", JSON.stringify(variants));
    await addProduct(formData);
  };

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0];
    setThumbnail(selectedFile);

    // Create preview URL
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };
  const handleGalleryChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setGallery(selectedFiles);

    const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white border border-gray-300 rounded-md w-[600px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 p-6 text-xs tracking-wide"
        >
          <div className="flex justify-between items-center border-b border-gray-300 pb-2">
            <h1 className="font-semibold text-gray-800">Add Product</h1>
            <button
              type="button"
              onClick={() => onClose()}
              className="text-gray-700 hover:text-black cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-6 items-center">
            <div className="flex flex-col gap-2">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="h-16 w-16 object-cover border rounded"
                />
              )}

              <input
                className="border border-gray-300 px-2 py-1 rounded-md"
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
              />
            </div>

            <div className="flex flex-col gap-2 ">
              <div className="flex gap-2">
                {previews &&
                  previews.map((preview, i) => (
                    <img
                      key={i}
                      src={preview}
                      alt="Preview"
                      className="h-16 w-16 object-cover border rounded"
                    />
                  ))}
              </div>
              <input
                onChange={handleGalleryChange}
                accept="image/*"
                className="border border-gray-300 px-2 py-1 rounded-md"
                type="file"
                multiple
              />
            </div>
          </div>

          <input
            type="text"
            className="border border-gray-300 px-3 py-2 rounded-md"
            name="productName"
            value={productName}
            placeholder="Product Name"
            onChange={(e) => setProductName(e.target.value)}
          />

          <div className="flex gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              name="category"
              className="border border-gray-300 px-3 py-2 rounded-md"
            >
              <option value="shirts">Shirts</option>
              <option value="jeans">Jeans</option>
            </select>

            <input
              className="border border-gray-300 px-3 py-2 rounded-md"
              type="number"
              placeholder="Price"
              value={price}
              name="price"
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 px-3 py-2 rounded-md"
            placeholder="Description"
          />

          <div className="border border-gray-300 rounded-md p-3 flex  gap-10">
            <div>
              <ul className="flex gap-2 mb-3">
                {sizes.map((size) => (
                  <li
                    key={size}
                    className="border border-gray-400 w-7 h-7 flex items-center justify-center cursor-pointer rounded"
                    onClick={(e) => setProductSize(e.target.outerText)}
                  >
                    {size}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setProductCount((c) => c - 1)}
                  className="border border-gray-400 px-2 rounded"
                >
                  -
                </button>

                <p>{productCount}</p>

                <button
                  type="button"
                  onClick={() => setProductCount((c) => c + 1)}
                  className="border border-gray-400 px-2 rounded"
                >
                  +
                </button>

                <button
                  type="button"
                  onClick={handleVariant}
                  className="border border-gray-400 px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              {variants.map((variant, index) => (
                <p
                  key={index}
                  className="text-gray-700 border p-1 border-gray-400 rounded-md"
                >
                  {variant.size} - {variant.count}
                </p>
              ))}
            </div>
          </div>

          <button
            className="bg-gray-900 text-gray-50 px-4 py-2 rounded-md font-semibold"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProduct;
