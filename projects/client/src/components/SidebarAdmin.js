import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const SidebarAdmin = () => {
  const [role, setRole] = useState(null);
  useEffect(() => {
    setRole(localStorage.getItem("my_Role"));
  }, []);

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("my_Token");
    localStorage.removeItem("my_Role");
    localStorage.removeItem("adminName");
    localStorage.removeItem("branchStoreAdmin");
    navigate("/admin/login");
    window.location.reload();
  };

  return (
    <section>
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2">
            <Link to={"/"}>
              <li>
                <span className="flex-1 ml-3 justify-center whitespace-nowrap text-3xl font-bold w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  GoKu
                </span>
                {}{" "}
                <small className=" capitalize w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                  {role}
                </small>
              </li>
            </Link>
            <li>
              <Link
                to="/admin/home"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            {role === "super admin" ? (
              <>
                <li>
                  <Link
                    to="/admin/management"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Admin Management
                    </span>
                  </Link>
                </li>
              </>
            ) : null}

            {role === "admin branch" ? (
              <>
                <li>
                  <Link
                    to="/admin/categories"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon icon="tabler:category-2" width="25" height="25" />
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Categories Products
                    </span>
                  </Link>
                </li>
              </>
            ) : null}

            {role === "admin branch" ? (
              <>
                <li>
                  <Link
                    to="/admin/manage-product"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Manage Products
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/product-list"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <svg
                      aria-hidden="true"
                      className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Product List
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/manage-discount"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon icon="mdi:discount-outline" width="25" height="25" />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Manage Discount
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/manage-Voucher"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon icon="mdi:voucher-outline" width="25" height="25" />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Manage Voucher
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/order-list"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon
                      icon="fluent-mdl2:activate-orders"
                      width="25"
                      height="25"
                    />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Order List
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/detail-order-list"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon
                      icon="fluent-mdl2:activate-orders"
                      width="25"
                      height="25"
                    />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      Detail Order List
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/history-stock-logs"
                    className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon
                      icon="fluent-mdl2:activate-orders"
                      width="25"
                      height="25"
                    />

                    <span className="flex-1 ml-3 whitespace-nowrap">
                      History Stock Logs
                    </span>
                  </Link>
                </li>
              </>
            ) : null}

            <li>
              <Link
                to="/admin/sales"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon icon="mdi:sale" width="25" height="25" />
                <span className="flex-1 ml-3 whitespace-nowrap">Sales</span>
              </Link>
            </li>
            <li onClick={handleLogout}>
              <Link
                to="/admin/sales"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Icon icon="simple-line-icons:logout" width="25" height="25" />
                <span className="flex-1 ml-3 whitespace-nowrap">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </section>
  );
};

export default SidebarAdmin;
