import { useState } from "react";
import { useAddProductMutation } from "../services/product";
import { X, ImagePlus, Plus, Minus, Trash2 } from "lucide-react";

function AddProduct({ onClose, initialData = null }) {
  const isEditing = !!initialData;

  const [thumbnail, setThumbnail] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [productName, setProductName] = useState(
    initialData?.productName ?? "",
  );
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [price, setPrice] = useState(initialData?.price ?? "");
  const [preview, setPreview] = useState(
    initialData?.thumbnail
      ? `https://loom-h6m8.onrender.com/uploads/${initialData.thumbnail}`
      : null,
  );
  const [previews, setPreviews] = useState(
    initialData?.gallery?.map(
      (img) => `https://loom-h6m8.onrender.com/uploads/${img}`,
    ) ?? [],
  );
  const [productSize, setProductSize] = useState(null);
  const [productCount, setProductCount] = useState(1);
  const [variants, setVariants] = useState(initialData?.variants ?? []);
  const [category, setCategory] = useState(initialData?.category ?? "shirts");

  const [addProduct] = useAddProductMutation();
  // const [updateProduct] = useUpdateProductMutation();

  const sizes = ["S", "M", "L", "XL", "2XL"];

  const handleVariant = (e) => {
    e.preventDefault();
    if (!productSize || productCount <= 0) return;
    const exists = variants.findIndex((v) => v.size === productSize);
    if (exists !== -1) {
      setVariants((prev) =>
        prev.map((v, i) =>
          i === exists ? { ...v, count: v.count + productCount } : v,
        ),
      );
    } else {
      setVariants((prev) => [
        ...prev,
        { size: productSize, count: productCount },
      ]);
    }
    setProductCount(1);
    setProductSize(null);
  };

  const removeVariant = (index) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (thumbnail) formData.append("thumbnail", thumbnail);
    gallery.forEach((file) => formData.append("gallery", file));
    formData.append("productName", productName);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("variants", JSON.stringify(variants));
    if (isEditing) {
      await updateProduct({ id: initialData._id, body: formData });
    } else {
      await addProduct(formData);
    }
    onClose();
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnail(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGallery(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const inputClass =
    "w-full border border-gray-200 bg-gray-50 px-3 py-2.5 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">
              {isEditing ? "Edit Product" : "New Product"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditing
                ? "Update product details"
                : "Fill in product details below"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-5 py-4">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            id="product-form"
          >
            {/* Images */}
            <div className="flex gap-3">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <p className="text-xs font-medium text-gray-500 mb-1.5">
                  Thumbnail
                </p>
                <label className="relative block w-20 h-20 cursor-pointer group">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Thumbnail"
                      className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 bg-gray-50 group-hover:border-gray-400 transition-colors">
                      <ImagePlus size={16} className="text-gray-300" />
                      <span className="text-[10px] text-gray-300">Upload</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>
              </div>

              {/* Gallery */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-500 mb-1.5">
                  Gallery
                </p>
                <div className="flex gap-2 flex-wrap mb-2">
                  {previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt=""
                      className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                    />
                  ))}
                  <label className="w-14 h-14 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50 shrink-0">
                    <Plus size={14} className="text-gray-300" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Product name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Product Name
              </label>
              <input
                type="text"
                className={inputClass}
                value={productName}
                placeholder="e.g. Classic Oxford Shirt"
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            {/* Category + Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="shirts">Shirts</option>
                  <option value="jeans">Jeans</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Price (₹)
                </label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClass} resize-none h-20`}
                placeholder="Describe the product..."
              />
            </div>

            {/* Variants */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-2">
                Variants
              </label>
              <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                {/* Size picker */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setProductSize(size)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer
                        ${
                          productSize === size
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Count + Add */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setProductCount((c) => Math.max(1, c - 1))}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-medium text-gray-800 min-w-[2rem] text-center">
                      {productCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductCount((c) => c + 1)}
                      className="px-2.5 py-1.5 text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleVariant}
                    disabled={!productSize}
                    className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    Add size
                  </button>
                </div>

                {/* Added variants */}
                {variants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
                    {variants.map((variant, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1"
                      >
                        <span className="text-xs font-medium text-gray-700">
                          {variant.size}
                        </span>
                        <span className="text-xs text-gray-400">
                          ×{variant.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariant(i)}
                          className="text-gray-300 hover:text-red-400 transition-colors ml-0.5 cursor-pointer"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="product-form"
            className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 transition-colors cursor-pointer"
          >
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
