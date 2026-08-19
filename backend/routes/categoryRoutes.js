import express from "express";

import {
  createCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router
  .route("/")
  .post(createCategory);

router
  .route("/categories")
  .get(fetchCategories);

router
  .route("/:id")
  .put(updateCategory)
  .delete(deleteCategory);

export default router;