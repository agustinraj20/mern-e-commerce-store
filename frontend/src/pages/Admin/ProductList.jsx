import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  // Product state
  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();

  // Upload image mutation
  const [uploadProductImage, { isLoading: uploading }] =
    useUploadProductImageMutation();

  // Create product mutation
  const [createProduct, { isLoading: creating }] =
    useCreateProductMutation();

  // Categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useFetchCategoriesQuery();

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Supported image formats
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/tiff",
      "image/webp",
      "image/bmp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid image format. Use JPG, JPEG, PNG, GIF, TIFF, WEBP or BMP."
      );

      e.target.value = "";
      return;
    }

    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size must be less than 10 MB.");

      e.target.value = "";
      return;
    }

    setImageName(file.name);

    // Local preview while uploading
    const localPreview = URL.createObjectURL(file);
    setImageUrl(localPreview);

    const formData = new FormData();

    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();

      console.log("IMAGE UPLOAD RESPONSE:", res);

      if (!res?.image) {
        throw new Error("Server did not return an image URL.");
      }

      setImage(res.image);
      setImageUrl(res.image);

      toast.success(res.message || "Image uploaded successfully");
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      setImage("");
      setImageName("");

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          error?.message ||
          "Image upload failed. Please try again."
      );

      e.target.value = "";
    }
  };

  // =========================================================
  // CREATE PRODUCT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------------------------
    // Validation
    // -------------------------

    if (!image) {
      toast.error("Please upload a product image first.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter product name.");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter product description.");
      return;
    }

    if (!price || Number(price) < 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (!quantity || Number(quantity) < 0) {
      toast.error("Please enter quantity.");
      return;
    }

    if (!brand.trim()) {
      toast.error("Please enter brand.");
      return;
    }

    // -------------------------
    // Create FormData
    // -------------------------

    try {
      const productData = new FormData();

      productData.append("image", image);
      productData.append("name", name.trim());
      productData.append("description", description.trim());
      productData.append("price", String(Number(price)));
      productData.append("category", category);
      productData.append("quantity", String(Number(quantity)));
      productData.append("brand", brand.trim());
      productData.append("countInStock", String(Number(stock) || 0));

      // Debug
      console.log("========== PRODUCT DATA ==========");
      console.log("image:", image);
      console.log("name:", name);
      console.log("description:", description);
      console.log("price:", price);
      console.log("category:", category);
      console.log("quantity:", quantity);
      console.log("brand:", brand);
      console.log("countInStock:", stock);
      console.log("==================================");

      // Send to backend
      const result = await createProduct(productData).unwrap();

      console.log("PRODUCT CREATED:", result);

      toast.success(
        `${result?.name || "Product"} created successfully`
      );

      // Clear form
      setImage("");
      setImageName("");
      setImageUrl("");
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setQuantity("");
      setBrand("");
      setStock(0);

      // Go to product list
      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.data ||
          error?.error ||
          error?.message ||
          "Failed to create product"
      );
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <AdminMenu />

      <main className="w-full px-4 sm:px-6 lg:pl-24 xl:pl-28 py-6">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Create Product
            </h1>

            <p className="text-gray-400 mt-1">
              Add a new product to your store.
            </p>
          </div>

          <div className="bg-[#151515] rounded-xl p-4 sm:p-6 shadow-lg">

            {/* =================================================
                IMAGE
            ================================================= */}

            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">
                Product Image
              </label>

              <label
                htmlFor="product-image"
                className="flex flex-col items-center justify-center w-full min-h-[220px] border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-pink-500 transition p-4"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Product preview"
                    className="max-h-56 max-w-full object-contain rounded-lg"
                  />
                ) : (
                  <>
                    <div className="text-4xl mb-3">
                      📷
                    </div>

                    <p className="font-semibold text-center">
                      Click to upload product image
                    </p>

                    <p className="text-gray-400 text-sm mt-2 text-center">
                      JPG, JPEG, PNG, GIF, TIFF, WEBP or BMP
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      Maximum 10 MB
                    </p>
                  </>
                )}

                <input
                  id="product-image"
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png,.gif,.tif,.tiff,.webp,.bmp,image/*"
                  onChange={uploadFileHandler}
                  className="hidden"
                />
              </label>

              {imageName && (
                <p className="text-sm text-gray-400 mt-2 break-all">
                  Selected: {imageName}
                </p>
              )}

              {uploading && (
                <p className="text-pink-400 mt-2">
                  Uploading image...
                </p>
              )}
            </div>

            {/* =================================================
                PRODUCT FIELDS
            ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Name */}
              <div>
                <label className="block mb-2 font-medium">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block mb-2 font-medium">
                  Price
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Enter price"
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block mb-2 font-medium">
                  Quantity
                </label>

                <input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity"
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block mb-2 font-medium">
                  Brand
                </label>

                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand"
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block mb-2 font-medium">
                  Count In Stock
                </label>

                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Enter stock"
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none"
                />
              </div>

              {/* =================================================
                  CATEGORY
              ================================================= */}

              <div>
                <label className="block mb-2 font-medium">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;

                    console.log(
                      "Selected category:",
                      selectedCategory
                    );

                    setCategory(selectedCategory);
                  }}
                  disabled={categoriesLoading}
                  className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none disabled:opacity-50"
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Choose Category"}
                  </option>

                  {categories.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

                {categoriesError && (
                  <p className="text-red-400 text-sm mt-2">
                    Unable to load categories.
                  </p>
                )}

                {!categoriesLoading &&
                  categories.length === 0 &&
                  !categoriesError && (
                    <p className="text-yellow-400 text-sm mt-2">
                      No categories found. Please create a
                      category first.
                    </p>
                  )}

                {category && (
                  <p className="text-green-400 text-xs mt-2 break-all">
                    Selected Category ID: {category}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <div className="mt-5">
              <label className="block mb-2 font-medium">
                Description
              </label>

              <textarea
                rows="6"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Enter product description"
                className="w-full p-3 rounded-lg bg-[#101011] border border-gray-700 focus:border-pink-500 outline-none resize-y"
              />
            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={
                uploading ||
                creating ||
                categoriesLoading
              }
              className="mt-6 w-full sm:w-auto px-8 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition"
            >
              {creating
                ? "Creating Product..."
                : uploading
                ? "Uploading Image..."
                : "Create Product"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;