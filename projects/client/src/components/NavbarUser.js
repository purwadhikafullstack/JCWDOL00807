import {
  Avatar,
  Button,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavbarUser = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("my_Token");

  let user = useSelector((state) => state.auth);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  let address = useSelector((state) => state.address);
  let count = useSelector((state) => state.carts.count);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [branchStore, setBranchStore] = useState("");

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("my_Token");
    localStorage.removeItem("my_Role");

    navigate("/login");
    window.location.reload();
  };

  useEffect(() => {
    if (!address.loading) {
      if (address?.userAddress?.data) {
        setBranchStore(userProduct?.data?.branch);
      } else {
        const timeOut = setTimeout(() => {
          setBranchStore(userProduct?.data?.branch);
        }, 500);
        return () => {
          clearTimeout(timeOut);
        };
      }
    }
    // eslint-disable-next-line
  }, [userProduct]);

  return (
    <>
      <nav className="shadow shadow-slate-200 bg-[#e9ffe7]  sticky top-0 z-10 ">
        <div className=" container mx-auto flex flex-wrap items-center justify-between h-24 p-3 md:p-2 lg:0">
          <Link to="/">
            <span className="self-center text-3xl font-extrabold whitespace-nowrap ">
              GoKu
            </span>
          </Link>

          <button
            onClick={handleMenuToggle}
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 "
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>

          <div
            className={`${
              isMenuOpen ? "" : "hidden"
            } w-full md:block md:w-auto`}
            id="navbar-default"
          >
            <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-[#e9ffe7] items-center ">
              {user?.user?.name ? (
                <>
                  <li className="flex gap-1 ">
                    <Icon
                      className="text-lg"
                      icon="material-symbols:location-on-outline"
                    />
                    <h1 className=" font-bold ">{branchStore}</h1>
                  </li>
                  <li>
                    <div className="cart-icon">
                      <Link to={"/shopping-cart"}>
                        <Icon
                          className=" text-4xl "
                          icon="ic:round-shopping-cart"
                        />
                        {token && (
                          <span className="cart-quantity w-6 h-6   ">
                            {count}
                          </span>
                        )}
                      </Link>
                    </div>
                  </li>
                  <li className=" flex flex-col justify-center items-center ">
                    <Menu>
                      <Tooltip label={user?.user?.name} fontSize="xs">
                        <MenuButton>
                          <Avatar src={user?.user?.image} size="sm" />
                        </MenuButton>
                      </Tooltip>
                      <MenuList>
                        <MenuGroup>
                          <Link to="/accounts/profile">
                            <MenuItem>My Profile</MenuItem>
                          </Link>
                          <Link to="/accounts/order-list">
                            <MenuItem>My Order</MenuItem>
                          </Link>
                          <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </MenuGroup>
                        <MenuDivider />
                      </MenuList>
                    </Menu>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex gap-1 ">
                    <Icon
                      className="text-lg"
                      icon="material-symbols:location-on-outline"
                    />
                    <h1 className=" font-bold ">{branchStore}</h1>
                  </li>
                  <li>
                    <Link to={"/register"}>
                      <Button variant={["ghost", "solid"]}>Register</Button>
                    </Link>
                  </li>
                  <li>
                    <Link to={"/login"}>
                      <Button variant={["ghost", "solid"]}>Login</Button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavbarUser;
