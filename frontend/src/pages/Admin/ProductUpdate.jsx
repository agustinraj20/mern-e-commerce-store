import { useEffect, useState } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const AdminProductUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Get product
  const {
    data: productData,
    isLoading: productLoading,
    isError: productError,
  } = useGetProductByIdQuery(id);

  // Get categories
  const { data: categories = [] } = useFetchCategoriesQuery();

  // Form state
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  // Mutations
  const [uploadProductImage, { isLoading: uploadingImage }] =
    useUploadProductImageMutation();

  const [updateProduct, { isLoading: updatingProduct }] =
    useUpdateProductMutation();

  const [deleteProduct, { isLoading: deletingProduct }] =
    useDeleteProductMutation();

  // Load product data into form
  useEffect(() => {
    if (productData) {
      setImage(productData.image || "");
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price ?? "");
      setQuantity(productData.quantity ?? "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock ?? 0);

      // Category can be populated object or just an ID
      if (productData.category) {
        setCategory(
          typeof productData.category === "object"
            ? productData.category._id
            : productData.category
        );
      }
    }
  }, [productData]);

  // Upload image
  const uploadFileHandler = async (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Allowed image types
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
        "Please select a JPG, JPEG, PNG, GIF, TIFF, WEBP or BMP image."
      );
      e.target.value = "";
      return;
    }

    // Optional size limit: 10 MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB.");
      e.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();

      if (!res?.image) {
        throw new Error("Server did not return an image URL.");
      }

      setImage(res.image);

      toast.success("Image uploaded successfully.");
    } catch (error) {
      console.error("IMAGE UPLOAD ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Image upload failed."
      );
    }
  };

  // Update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      toast.error("Product ID is missing.");
      return;
    }

    if (!name.trim()) {
      toast.error("Product name is required.");
      return;
    }

    if (!image) {
      toast.error("Product image is required.");
      return;
    }

    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    if (!price || Number(price) <= 0) {
      toast.error("Enter a valid price.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (!quantity || Number(quantity) < 1) {
      toast.error("Enter a valid quantity.");
      return;
    }

    if (!brand.trim()) {
      toast.error("Brand is required.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", image);
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      formData.append("price", String(Number(price)));
      formData.append("category", category);
      formData.append("quantity", String(Number(quantity)));
      formData.append("brand", brand.trim());
      formData.append("countInStock", String(Number(stock) || 0));

      const updatedProduct = await updateProduct({
        productId: id,
        formData,
      }).unwrap();

      toast.success(
        `${updatedProduct?.name || "Product"} successfully updated.`
      );

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Product update failed. Please try again."
      );
    }
  };

  // Delete product
  const handleDelete = async () => {
    const answer = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!answer) {
      return;
    }

    try {
      const deletedProduct = await deleteProduct(id).unwrap();

      toast.success(
        `"${deletedProduct?.name || "Product"}" has been deleted.`
      );

      navigate("/admin/allproductslist");
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Delete failed. Please try again."
      );
    }
  };

  // Loading
  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-white">Loading product...</p>
      </div>
    );
  }

  // Error
  if (productError || !productData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-500 text-lg">
          Unable to load product.
        </p>

        <button
          type="button"
          onClick={() => navigate("/admin/allproductslist")}
          className="bg-pink-600 px-5 py-2 rounded-lg text-white"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Admin Menu */}
          <div className="shrink-0">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <main className="w-full lg:flex-1 py-4">
            <div className="bg-[#151515] rounded-xl p-4 sm:p-6 shadow-lg">
              <h1 className="text-xl sm:text-2xl font-bold mb-6">
                Update / Delete Product
              </h1>

              {/* Image Preview */}
              {image && (
                <div className="mb-6 flex justify-center">
                  <div className="w-full max-w-md overflow-hidden rounded-lg bg-black">
                    <img
                      src={image}
                      alt={name || "Product"}
                      className="w-full h-64 sm:h-80 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Upload Image */}
              <div className="mb-6">
                <label
                  htmlFor="product-image"
                  className="flex min-h-28 items-center justify-center border-2 border-dashed border-gray-500 rounded-lg cursor-pointer hover:border-pink-500 transition-colors px-4"
                >
                  <span className="text-center font-semibold">
                    {uploadingImage
                      ? "Uploading image..."
                      : image
                      ? "Click to change image"
                      : "Click to upload image"}
                  </span>

                  <input
                    id="product-image"
                    type="file"
                    name="image"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/tiff,image/webp,image/bmp"
                    onChange={uploadFileHandler}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Product Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 font-medium"
                    >
                      Product Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label
                      htmlFor="price"
                      className="block mb-2 font-medium"
                    >
                      Price
                    </label>

                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Quantity */}
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block mb-2 font-medium"
                    >
                      Quantity
                    </label>

                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Brand */}
                  <div>
                    <label
                      htmlFor="brand"
                      className="block mb-2 font-medium"
                    >
                      Brand
                    </label>

                    <input
                      id="brand"
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Stock */}
                  <div>
                    <label
                      htmlFor="stock"
                      className="block mb-2 font-medium"
                    >
                      Count In Stock
                    </label>

                    <input
                      id="stock"
                      type="number"
                      min="0"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label
                      htmlFor="category"
                      className="block mb-2 font-medium"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-[#101011] text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Choose Category</option>

                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5">
                  <label
                    htmlFor="description"
                    className="block mb-2 font-medium"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    rows="6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-[#101011] text-white resize-y focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={updatingProduct || uploadingImage}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-bold bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updatingProduct ? "Updating..." : "Update"}
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deletingProduct}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-bold bg-pink-600 hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deletingProduct ? "Deleting..." : "Delete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/admin/allproductslist")}
                    className="w-full sm:w-auto px-8 py-3 rounded-lg text-lg font-bold bg-gray-600 hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;