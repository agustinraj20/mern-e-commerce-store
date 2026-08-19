import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";

const Home = () => {
  const { keyword } = useParams();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery({ keyword });

  const products = data?.products || [];

  return (
    <main className="min-h-screen w-full bg-gray-50">

      {/* =========================
          HEADER
      ========================== */}
      {!keyword && <Header />}

      {/* =========================
          LOADING
      ========================== */}
      {isLoading && (
        <div className="flex min-h-[50vh] items-center justify-center px-4">
          <Loader />
        </div>
      )}

      {/* =========================
          ERROR
      ========================== */}
      {isError && (
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4">
          <Message variant="danger">
            {error?.data?.message ||
              error?.error ||
              "Unable to load products"}
          </Message>
        </div>
      )}

      {/* =========================
          CONTENT
      ========================== */}
      {!isLoading && !isError && (
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          {/* =========================
              TITLE + SHOP BUTTON
          ========================== */}
          <div
            className="
              mb-8
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <h1
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-gray-900
                  sm:text-3xl
                  lg:text-4xl
                "
              >
                {keyword
                  ? `Search Results for "${keyword}"`
                  : "Special Products"}
              </h1>

              <p className="mt-2 text-sm text-gray-500 sm:text-base">
                Discover our latest products
              </p>
            </div>

            <Link
              to="/shop"
              className="
                inline-flex
                w-full
                items-center
                justify-center
                rounded-full
                bg-pink-600
                px-6
                py-2.5
                text-sm
                font-bold
                text-white
                transition
                duration-200
                hover:bg-pink-700
                focus:outline-none
                focus:ring-2
                focus:ring-pink-500
                focus:ring-offset-2
                sm:w-auto
                sm:px-8
              "
            >
              Shop All
            </Link>
          </div>

          {/* =========================
              PRODUCT COUNT
          ========================== */}
          <div className="mb-5">
            <p className="text-sm text-gray-500">
              {products.length}{" "}
              {products.length === 1 ? "product" : "products"}
            </p>
          </div>

          {/* =========================
              PRODUCTS
          ========================== */}
          {products.length > 0 ? (
            <div
              className="
                grid
                grid-cols-1
                gap-4
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4
                xl:grid-cols-4
                2xl:grid-cols-5
              "
            >
              {products.map((product) => (
                <div
                  key={product._id}
                  className="min-w-0"
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="
                flex
                min-h-64
                items-center
                justify-center
                rounded-xl
                bg-white
                p-8
                text-center
                shadow-sm
              "
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  No products found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try searching for a different product.
                </p>

                <Link
                  to="/shop"
                  className="
                    mt-5
                    inline-flex
                    rounded-full
                    bg-pink-600
                    px-6
                    py-2
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-pink-700
                  "
                >
                  Browse Shop
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Home;