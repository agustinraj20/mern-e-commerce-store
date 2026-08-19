import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

const Shop = () => {
  const dispatch = useDispatch();

  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const [priceFilter, setPriceFilter] = useState("");

  const categoriesQuery = useFetchCategoriesQuery();

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  const allProducts = filteredProductsQuery.data || [];

  /*
   * Load categories
   */
  useEffect(() => {
    if (categoriesQuery.data) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  /*
   * Filter products by price
   */
  useEffect(() => {
    if (!filteredProductsQuery.data) {
      return;
    }

    const filteredProducts = allProducts.filter((product) => {
      if (!priceFilter) {
        return true;
      }

      return product.price.toString().includes(priceFilter);
    });

    dispatch(setProducts(filteredProducts));
  }, [
    filteredProductsQuery.data,
    priceFilter,
    dispatch,
  ]);

  /*
   * Get unique brands
   */
  const uniqueBrands = useMemo(() => {
    return [
      ...new Set(
        allProducts
          .map((product) => product.brand)
          .filter((brand) => brand)
      ),
    ];
  }, [allProducts]);

  /*
   * Category checkbox
   */
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((categoryId) => categoryId !== id);

    dispatch(setChecked(updatedChecked));
  };

  /*
   * Brand filter
   */
  const handleBrandClick = (brand) => {
    const productsByBrand = allProducts.filter(
      (product) => product.brand === brand
    );

    dispatch(setProducts(productsByBrand));
  };

  /*
   * Price filter
   */
  const handlePriceChange = (event) => {
    setPriceFilter(event.target.value);
  };

  /*
   * Reset filters
   */
  const handleReset = () => {
    setPriceFilter("");
    dispatch(setChecked([]));

    dispatch(setProducts(allProducts));
  };

  /*
   * Loading
   */
  if (
    categoriesQuery.isLoading ||
    filteredProductsQuery.isLoading
  ) {
    return <Loader />;
  }

  /*
   * Error
   */
  if (categoriesQuery.isError || filteredProductsQuery.isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="rounded-lg bg-red-100 px-6 py-4 text-center text-red-600">
          Unable to load products. Please try again.
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-6 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =========================
            PAGE HEADER
        ========================== */}
        <div className="mb-6">
          <h1 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Shop
          </h1>

          <p className="mt-1 text-center text-sm text-gray-500">
            Find the products you are looking for
          </p>
        </div>

        {/* =========================
            MAIN LAYOUT
        ========================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">

          {/* =========================
              FILTER SIDEBAR
          ========================== */}
          <aside className="h-fit w-full rounded-xl bg-[#151515] p-4 text-white shadow-lg lg:sticky lg:top-6">

            {/* Categories */}
            <div className="mb-6">
              <h2 className="rounded-lg bg-black px-4 py-3 text-center text-base font-semibold">
                Filter by Categories
              </h2>

              <div className="mt-4 space-y-3">
                {categories?.length > 0 ? (
                  categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex items-center"
                    >
                      <input
                        type="checkbox"
                        id={`category-${category._id}`}
                        checked={checked.includes(category._id)}
                        onChange={(event) =>
                          handleCheck(
                            event.target.checked,
                            category._id
                          )
                        }
                        className="
                          h-4
                          w-4
                          shrink-0
                          cursor-pointer
                          rounded
                          border-gray-300
                          bg-gray-100
                          text-pink-600
                          focus:ring-2
                          focus:ring-pink-500
                        "
                      />

                      <label
                        htmlFor={`category-${category._id}`}
                        className="ml-3 cursor-pointer text-sm text-gray-200"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <p className="py-2 text-center text-sm text-gray-400">
                    No categories available
                  </p>
                )}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h2 className="rounded-lg bg-black px-4 py-3 text-center text-base font-semibold">
                Filter by Brands
              </h2>

              <div className="mt-4 max-h-52 space-y-3 overflow-y-auto pr-1">
                {uniqueBrands.length > 0 ? (
                  uniqueBrands.map((brand) => {
                    const brandId = `brand-${brand
                      .replace(/\s+/g, "-")
                      .toLowerCase()}`;

                    return (
                      <div
                        key={brand}
                        className="flex items-center"
                      >
                        <input
                          type="radio"
                          id={brandId}
                          name="brand"
                          onChange={() =>
                            handleBrandClick(brand)
                          }
                          className="
                            h-4
                            w-4
                            shrink-0
                            cursor-pointer
                            border-gray-300
                            text-pink-500
                            focus:ring-2
                            focus:ring-pink-500
                          "
                        />

                        <label
                          htmlFor={brandId}
                          className="ml-3 cursor-pointer text-sm text-gray-200"
                        >
                          {brand}
                        </label>
                      </div>
                    );
                  })
                ) : (
                  <p className="py-2 text-center text-sm text-gray-400">
                    No brands available
                  </p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <h2 className="rounded-lg bg-black px-4 py-3 text-center text-base font-semibold">
                Filter by Price
              </h2>

              <div className="mt-4">
                <input
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={priceFilter}
                  onChange={handlePriceChange}
                  className="
                    w-full
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-3
                    py-2.5
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-pink-500
                    focus:ring-2
                    focus:ring-pink-200
                  "
                />
              </div>
            </div>

            {/* Reset */}
            <button
              type="button"
              onClick={handleReset}
              className="
                w-full
                rounded-lg
                border
                border-gray-500
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:border-pink-500
                hover:bg-pink-500
              "
            >
              Reset Filters
            </button>
          </aside>

          {/* =========================
              PRODUCTS
          ========================== */}
          <section className="min-w-0">

            {/* Product count */}
            <div className="mb-5 flex flex-col gap-2 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Products
              </h2>

              <span className="text-sm text-gray-500">
                {products?.length || 0} products found
              </span>
            </div>

            {/* Product grid */}
            {products?.length > 0 ? (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                  md:grid-cols-2
                  xl:grid-cols-3
                  2xl:grid-cols-4
                "
              >
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="min-w-0"
                  >
                    <ProductCard p={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center rounded-xl bg-white p-8 shadow-sm">
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-700">
                    No products found
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Try changing your filters.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Shop;