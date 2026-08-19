import asyncHandler from "../middlewares/asyncHandler.js";
import Category from "../models/categoryModel.js";

// Create category
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const existingCategory = await Category.findOne({
    name: name.trim(),
  });

  if (existingCategory) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name: name.trim(),
  });

  res.status(201).json(category);
});

// Get all categories
const fetchCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });

  res.json(categories);
});

// Update category
const updateCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400);
    throw new Error("Category name is required");
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  category.name = name.trim();

  const updatedCategory = await category.save();

  res.json(updatedCategory);
});

// Delete category
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }

  await category.deleteOne();

  res.json({
    message: "Category deleted successfully",
    _id: category._id,
    name: category.name,
  });
});

export {
  createCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
};