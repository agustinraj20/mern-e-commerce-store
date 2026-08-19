import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import {
  addToCart,
  removeFromCart,
} from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

  return (
    <main className="min-h-screen w-full bg-gray-50 px-3 py-6 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">

        {/* =========================
            EMPTY CART
        ========================== */}
        {cartItems.length === 0 ? (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-gray-800">
                Your cart is empty
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                You haven't added anything to your cart yet.
              </p>

              <Link
                to="/shop"
                className="
                  mt-6
                  inline-flex
                  rounded-full
                  bg-pink-500
                  px-6
                  py-2.5
                  font-semibold
                  text-white
                  transition
                  hover:bg-pink-600
                "
              >
                Go To Shop
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* =========================
                PAGE TITLE
            ========================== */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Shopping Cart
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"} in your cart
              </p>
            </div>

            {/* =========================
                CART LAYOUT
            ========================== */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">

              {/* =========================
                  CART ITEMS
              ========================== */}
              <section className="min-w-0">

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <article
                      key={item._id}
                      className="
                        rounded-xl
                        bg-white
                        p-4
                        shadow-sm
                        transition
                        hover:shadow-md
                      "
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                        {/* Product Image */}
                        <div className="flex shrink-0 justify-center sm:block">
                          <Link to={`/product/${item._id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="
                                h-24
                                w-24
                                rounded-lg
                                object-cover
                                sm:h-28
                                sm:w-28
                              "
                            />
                          </Link>
                        </div>

                        {/* Product Information */}
                        <div className="min-w-0 flex-1 text-center sm:text-left">

                          <Link
                            to={`/product/${item._id}`}
                            className="
                              block
                              truncate
                              text-base
                              font-semibold
                              text-pink-500
                              hover:text-pink-600
                              sm:text-lg
                            "
                          >
                            {item.name}
                          </Link>

                          <p className="mt-1 text-sm text-gray-500">
                            {item.brand}
                          </p>

                          <p className="mt-2 text-lg font-bold text-gray-900">
                            ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center justify-center sm:justify-end">
                          <label
                            htmlFor={`quantity-${item._id}`}
                            className="mr-2 text-sm text-gray-500 sm:hidden"
                          >
                            Quantity:
                          </label>

                          <select
                            id={`quantity-${item._id}`}
                            value={item.qty}
                            onChange={(e) =>
                              addToCartHandler(
                                item,
                                Number(e.target.value)
                              )
                            }
                            className="
                              w-20
                              cursor-pointer
                              rounded-lg
                              border
                              border-gray-300
                              bg-white
                              p-2
                              text-center
                              text-sm
                              text-gray-900
                              outline-none
                              focus:border-pink-500
                              focus:ring-2
                              focus:ring-pink-200
                            "
                          >
                            {[...Array(item.countInStock).keys()].map(
                              (x) => (
                                <option
                                  key={x + 1}
                                  value={x + 1}
                                >
                                  {x + 1}
                                </option>
                              )
                            )}
                          </select>
                        </div>

                        {/* Remove */}
                        <div className="flex justify-center sm:justify-end">
                          <button
                            type="button"
                            aria-label={`Remove ${item.name}`}
                            onClick={() =>
                              removeFromCartHandler(item._id)
                            }
                            className="
                              rounded-lg
                              p-3
                              text-red-500
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                            "
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              {/* =========================
                  ORDER SUMMARY
              ========================== */}
              <aside className="h-fit lg:sticky lg:top-6">
                <div className="rounded-xl bg-white p-5 shadow-sm sm:p-6">

                  <h2 className="text-xl font-bold text-gray-900">
                    Order Summary
                  </h2>

                  <div className="mt-5 space-y-4">

                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">
                        Items
                      </span>

                      <span className="font-medium text-gray-900">
                        {totalItems}
                      </span>
                    </div>

                    <div className="border-t border-gray-200" />

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-bold text-gray-900">
                        ${totalPrice}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                    className="
                      mt-6
                      w-full
                      rounded-full
                      bg-pink-500
                      px-5
                      py-3
                      text-base
                      font-bold
                      text-white
                      transition
                      hover:bg-pink-600
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Proceed To Checkout
                  </button>

                  <Link
                    to="/shop"
                    className="
                      mt-3
                      block
                      text-center
                      text-sm
                      font-medium
                      text-gray-500
                      hover:text-pink-500
                    "
                  >
                    Continue Shopping
                  </Link>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Cart;