import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineUser,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import "./Navigation.css";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: <AiOutlineHome size={24} />,
    },
    {
      to: "/shop",
      label: "Shop",
      icon: <AiOutlineShopping size={24} />,
    },
    {
      to: "/cart",
      label: "Cart",
      icon: <AiOutlineShoppingCart size={24} />,
      badge: cartCount,
    },
    {
      to: "/favorite",
      label: "Favorites",
      icon: <FaHeart size={21} />,
      badgeComponent: <FavoritesCount />,
    },
  ];

  return (
    <>
      {/* =========================================================
          DESKTOP / TABLET SIDEBAR
      ========================================================= */}
      <aside
        id="navigation-container"
        className="
          hidden md:flex
          group
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-16
          hover:w-60
          flex-col
          bg-black
          text-white
          border-r
          border-gray-800
          transition-all
          duration-300
          ease-in-out
        "
      >
        {/* Logo / Top spacing */}
        <div className="flex h-20 shrink-0 items-center justify-center px-3">
          <Link
            to="/"
            className="
              flex
              w-full
              items-center
              justify-center
              rounded-lg
              px-2
              py-3
              transition
              hover:bg-gray-900
            "
          >
            <span className="text-lg font-bold text-white group-hover:hidden">
              E
            </span>

            <span className="hidden whitespace-nowrap text-lg font-bold group-hover:block">
              E-Commerce
            </span>
          </Link>
        </div>

        {/* Main navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="
                    relative
                    flex
                    min-h-12
                    w-full
                    items-center
                    justify-center
                    rounded-lg
                    px-3
                    py-3
                    transition
                    hover:bg-gray-900
                    group-hover:justify-start
                  "
                >
                  <span className="relative flex shrink-0 items-center justify-center">
                    {item.icon}

                    {item.badge > 0 && (
                      <span
                        className="
                          absolute
                          -right-3
                          -top-3
                          min-w-5
                          rounded-full
                          bg-pink-500
                          px-1.5
                          py-0.5
                          text-center
                          text-xs
                          font-bold
                          text-white
                        "
                      >
                        {item.badge}
                      </span>
                    )}

                    {item.badgeComponent}
                  </span>

                  <span
                    className="
                      ml-4
                      hidden
                      whitespace-nowrap
                      text-sm
                      font-medium
                      group-hover:block
                    "
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom user section */}
        <div className="shrink-0 border-t border-gray-800 p-2">
          {userInfo ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="
                  flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  rounded-lg
                  px-3
                  py-3
                  transition
                  hover:bg-gray-900
                  group-hover:justify-start
                "
              >
                <AiOutlineUser size={24} className="shrink-0" />

                <span className="ml-4 hidden min-w-0 flex-1 truncate text-left text-sm group-hover:block">
                  {userInfo.username}
                </span>

                <span className="ml-auto hidden group-hover:block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </button>

              {dropdownOpen && (
                <div
                  className="
                    absolute
                    bottom-16
                    left-2
                    w-56
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    text-gray-700
                    shadow-xl
                  "
                >
                  {userInfo.isAdmin && (
                    <>
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/admin/productlist"
                        className="block px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Products
                      </Link>

                      <Link
                        to="/admin/categorylist"
                        className="block px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Categories
                      </Link>

                      <Link
                        to="/admin/orderlist"
                        className="block px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Orders
                      </Link>

                      <Link
                        to="/admin/userlist"
                        className="block px-4 py-3 text-sm hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Users
                      </Link>

                      <div className="border-t border-gray-200" />
                    </>
                  )}

                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-sm hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    type="button"
                    onClick={logoutHandler}
                    className="
                      block
                      w-full
                      px-4
                      py-3
                      text-left
                      text-sm
                      hover:bg-gray-100
                    "
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  rounded-lg
                  px-3
                  py-3
                  hover:bg-gray-900
                  group-hover:justify-start
                "
              >
                <AiOutlineLogin size={24} />
                <span className="ml-4 hidden text-sm group-hover:block">
                  Login
                </span>
              </Link>

              <Link
                to="/register"
                className="
                  flex
                  min-h-12
                  items-center
                  justify-center
                  rounded-lg
                  px-3
                  py-3
                  hover:bg-gray-900
                  group-hover:justify-start
                "
              >
                <AiOutlineUserAdd size={24} />
                <span className="ml-4 hidden text-sm group-hover:block">
                  Register
                </span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
      ========================================================= */}
      <header
        className="
          fixed
          left-0
          right-0
          top-0
          z-50
          flex
          h-16
          items-center
          justify-between
          border-b
          border-gray-800
          bg-black
          px-4
          text-white
          md:hidden
        "
      >
        <Link to="/" className="text-lg font-bold">
          E-Commerce
        </Link>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="
            rounded-lg
            p-2
            hover:bg-gray-900
          "
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <AiOutlineClose size={26} />
          ) : (
            <AiOutlineMenu size={26} />
          )}
        </button>
      </header>

      {/* =========================================================
          MOBILE MENU
      ========================================================= */}
      {mobileMenuOpen && (
        <div
          className="
            fixed
            inset-x-0
            top-16
            z-40
            border-b
            border-gray-800
            bg-black
            px-4
            py-4
            text-white
            shadow-xl
            md:hidden
          "
        >
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={closeMobileMenu}
                    className="
                      flex
                      min-h-12
                      items-center
                      rounded-lg
                      px-3
                      py-3
                      hover:bg-gray-900
                    "
                  >
                    <span className="relative">
                      {item.icon}

                      {item.badge > 0 && (
                        <span
                          className="
                            absolute
                            -right-3
                            -top-3
                            min-w-5
                            rounded-full
                            bg-pink-500
                            px-1.5
                            py-0.5
                            text-center
                            text-xs
                            font-bold
                          "
                        >
                          {item.badge}
                        </span>
                      )}
                    </span>

                    <span className="ml-4 text-sm">{item.label}</span>
                  </Link>
                </li>
              ))}

              <li className="my-2 border-t border-gray-800" />

              {userInfo ? (
                <>
                  {userInfo.isAdmin && (
                    <li>
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className="
                          flex
                          min-h-12
                          items-center
                          rounded-lg
                          px-3
                          py-3
                          text-green-400
                          hover:bg-gray-900
                        "
                      >
                        <AiOutlineUser size={24} />
                        <span className="ml-4 text-sm">
                          Admin Dashboard
                        </span>
                      </Link>
                    </li>
                  )}

                  <li>
                    <Link
                      to="/profile"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        min-h-12
                        items-center
                        rounded-lg
                        px-3
                        py-3
                        hover:bg-gray-900
                      "
                    >
                      <AiOutlineUser size={24} />
                      <span className="ml-4 text-sm">
                        {userInfo.username}
                      </span>
                    </Link>
                  </li>

                  <li>
                    <button
                      type="button"
                      onClick={logoutHandler}
                      className="
                        flex
                        min-h-12
                        w-full
                        items-center
                        rounded-lg
                        px-3
                        py-3
                        text-left
                        hover:bg-gray-900
                      "
                    >
                      <AiOutlineLogin size={24} />
                      <span className="ml-4 text-sm">Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        min-h-12
                        items-center
                        rounded-lg
                        px-3
                        py-3
                        hover:bg-gray-900
                      "
                    >
                      <AiOutlineLogin size={24} />
                      <span className="ml-4 text-sm">Login</span>
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/register"
                      onClick={closeMobileMenu}
                      className="
                        flex
                        min-h-12
                        items-center
                        rounded-lg
                        px-3
                        py-3
                        hover:bg-gray-900
                      "
                    >
                      <AiOutlineUserAdd size={24} />
                      <span className="ml-4 text-sm">Register</span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}

      {/* =========================================================
          MOBILE BOTTOM NAVIGATION
      ========================================================= */}
      <nav
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          flex
          h-16
          items-center
          justify-around
          border-t
          border-gray-800
          bg-black
          px-2
          text-white
          md:hidden
        "
      >
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="
              relative
              flex
              min-w-16
              flex-col
              items-center
              justify-center
              gap-1
              rounded-lg
              px-2
              py-1
              text-xs
              hover:bg-gray-900
            "
          >
            <span className="relative">
              {item.icon}

              {item.badge > 0 && (
                <span
                  className="
                    absolute
                    -right-3
                    -top-3
                    min-w-5
                    rounded-full
                    bg-pink-500
                    px-1
                    text-center
                    text-[10px]
                    font-bold
                  "
                >
                  {item.badge}
                </span>
              )}
            </span>

            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};

export default Navigation;