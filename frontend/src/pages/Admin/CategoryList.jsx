import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  // Get all categories from MongoDB
  const {
    data: categories = [],
    isLoading,
    isError,
    refetch,
  } = useFetchCategoriesQuery();

  // Create category
  const [name, setName] = useState("");

  // Update / Delete category
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");

  // Modal
  const [modalVisible, setModalVisible] = useState(false);

  // RTK Query mutations
  const [createCategory, { isLoading: creating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: updating }] =
    useUpdateCategoryMutation();

  const [deleteCategory, { isLoading: deleting }] =
    useDeleteCategoryMutation();

  // ==============================
  // CREATE CATEGORY
  // ==============================
  const handleCreateCategory = async (e) => {
    e.preventDefault();

    const categoryName = name.trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({
        name: categoryName,
      }).unwrap();

      toast.success(`${result.name} is created successfully`);

      // Clear input
      setName("");

      // Refresh categories
      refetch();
    } catch (error) {
      console.error("CREATE CATEGORY ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Creating category failed. Try again."
      );
    }
  };

  // ==============================
  // OPEN EDIT MODAL
  // ==============================
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
  };

  // ==============================
  // CLOSE MODAL
  // ==============================
  const closeModal = () => {
    setModalVisible(false);
    setSelectedCategory(null);
    setUpdatingName("");
  };

  // ==============================
  // UPDATE CATEGORY
  // ==============================
  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    const categoryName = updatingName.trim();

    if (!categoryName) {
      toast.error("Category name is required");
      return;
    }

    if (!selectedCategory?._id) {
      toast.error("Category not selected");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: categoryName,
        },
      }).unwrap();

      toast.success(`${result.name} is updated successfully`);

      closeModal();
      refetch();
    } catch (error) {
      console.error("UPDATE CATEGORY ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Updating category failed. Try again."
      );
    }
  };

  // ==============================
  // DELETE CATEGORY
  // ==============================
  const handleDeleteCategory = async () => {
    if (!selectedCategory?._id) {
      toast.error("Category not selected");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${selectedCategory.name}"?`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const result = await deleteCategory(
        selectedCategory._id
      ).unwrap();

      toast.success(
        `"${result.name}" deleted successfully`
      );

      closeModal();
      refetch();
    } catch (error) {
      console.error("DELETE CATEGORY ERROR:", error);

      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Category deletion failed. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white">
      <div className="flex flex-col md:flex-row">

        {/* =========================
            ADMIN MENU
        ========================== */}
        <AdminMenu />

        {/* =========================
            MAIN CONTENT
        ========================== */}
        <main className="flex-1 p-4 md:p-8">

          {/* HEADER */}
          <div className="max-w-5xl mx-auto">

            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Manage Categories
              </h1>

              <p className="text-gray-400 mt-2">
                Create, edit and delete product categories.
              </p>
            </div>

            {/* =========================
                CREATE CATEGORY
            ========================== */}
            <div className="bg-[#151515] rounded-xl p-6 mb-8 shadow-lg">

              <h2 className="text-xl font-semibold mb-5">
                Add New Category
              </h2>

              <form
                onSubmit={handleCreateCategory}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 p-3 rounded-lg bg-[#101011] border border-gray-700 text-white outline-none focus:border-pink-500"
                />

                <button
                  type="submit"
                  disabled={creating}
                  className="px-6 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 disabled:opacity-50 font-bold"
                >
                  {creating ? "Creating..." : "Add Category"}
                </button>
              </form>
            </div>

            {/* =========================
                CATEGORY LIST
            ========================== */}
            <div className="bg-[#151515] rounded-xl p-6 shadow-lg">

              <div className="flex justify-between items-center mb-5">

                <h2 className="text-xl font-semibold">
                  Categories
                </h2>

                <span className="text-gray-400">
                  {categories.length} categories
                </span>

              </div>

              {/* LOADING */}
              {isLoading && (
                <div className="text-center py-10">
                  <p className="text-gray-400">
                    Loading categories...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {isError && (
                <div className="text-center py-10">
                  <p className="text-red-400 mb-4">
                    Failed to load categories.
                  </p>

                  <button
                    onClick={() => refetch()}
                    className="bg-pink-600 px-5 py-2 rounded-lg"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* EMPTY */}
              {!isLoading &&
                !isError &&
                categories.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-gray-400">
                      No categories found.
                    </p>

                    <p className="text-gray-500 text-sm mt-2">
                      Create your first category above.
                    </p>
                  </div>
                )}

              {/* CATEGORY BUTTONS */}
              {!isLoading &&
                !isError &&
                categories.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                    {categories.map((category) => (
                      <button
                        key={category._id}
                        type="button"
                        onClick={() =>
                          openEditModal(category)
                        }
                        className="group text-left bg-[#101011] border border-gray-700 rounded-lg p-4 hover:border-pink-500 hover:bg-[#191919] transition"
                      >

                        <div className="flex justify-between items-center">

                          <div>
                            <p className="font-semibold text-lg">
                              {category.name}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              ID: {category._id}
                            </p>
                          </div>

                          <span className="text-pink-500 group-hover:text-white">
                            Edit
                          </span>

                        </div>

                      </button>
                    ))}

                  </div>
                )}

            </div>
          </div>
        </main>
      </div>

      {/* =========================
          EDIT CATEGORY MODAL
      ========================== */}
      <Modal
        isOpen={modalVisible}
        onClose={closeModal}
      >
        <div className="p-2">

          <h2 className="text-xl font-bold mb-5">
            Edit Category
          </h2>

          <CategoryForm
            value={updatingName}
            setValue={setUpdatingName}
            handleSubmit={handleUpdateCategory}
            buttonText={
              updating ? "Updating..." : "Update"
            }
            handleDelete={handleDeleteCategory}
            disabled={updating || deleting}
          />

        </div>
      </Modal>
    </div>
  );
};

export default CategoryList;