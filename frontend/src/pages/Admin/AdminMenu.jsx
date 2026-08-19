import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

const AdminMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const menuItems = [
    {
      to: "/admin/dashboard",
      label: "Admin Dashboard",
    },
    {
      to: "/admin/categorylist",
      label: "Create Category",
    },
    {
      to: "/admin/productlist",
      label: "Create Product",
    },
    {
      to: "/admin/allproductslist",
      label: "All Products",
    },
    {
      to: "/admin/userlist",
      label: "Manage Users",
    },
    {
      to: "/admin/orderlist",
      label: "Manage Orders",
    },
  ];

  return (
    <>
      {/* Menu Button */}
      <button
        type="button"
        aria-label={isMenuOpen ? "Close admin menu" : "Open admin menu"}
        className={`${
          isMenuOpen ? "top-2 right-2" : "top-5 right-7"
        } fixed z-50 bg-[#151515] p-2 rounded-lg`}
        onClick={toggleMenu}
      >
        {isMenuOpen ? (
          <FaTimes color="white" size={20} />
        ) : (
          <>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
            <div className="w-6 h-0.5 bg-gray-200 my-1"></div>
          </>
        )}
      </button>

      {/* Admin Menu */}
      {isMenuOpen && (
        <section className="fixed z-40 right-7 top-5 bg-[#151515] p-4 pt-14 rounded-lg shadow-lg">
          <ul className="list-none mt-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className="block py-2 px-3 mb-5 hover:bg-[#2E2D2D] rounded-sm"
                  style={({ isActive }) => ({
                    color: isActive ? "greenyellow" : "white",
                  })}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};

export default AdminMenu;