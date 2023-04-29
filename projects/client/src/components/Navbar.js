import { Avatar, Button, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  let user = useSelector((state) => state.auth);
  const token = localStorage.getItem("my_Token");

  const handleLogout = () => {
    localStorage.removeItem("my_Token");
    localStorage.removeItem("my_Role");
    window.location.href = "login";
  };

  // let link =
  //   process.env.REACT_APP_API_BASE_URL.slice(0, 21) + user?.user?.image;

  return (
    <nav className="shadow shadow-slate-200 bg-[#e9ffe7]  sticky top-0 z-10">
      <div className="container mx-auto flex flex-row justify-between items-center h-28  ">
        <Link to={"/"}>
          {" "}
          <div className=" font-extrabold text-3xl ">GoKu</div>
        </Link>
        {user?.user?.name ? (
          <div className="flex flex-row justify-between gap-10 items-center">
            <Icon
              className=" text-4xl "
              icon="ic:round-shopping-cart"
              onClick={() => navigate("/accounts/profile")}
            />
            <div className=" flex flex-col justify-center items-center ">
              <Tooltip label={user?.user?.name} fontSize="xs">
                <Avatar src={user?.user?.image} size="sm" />
              </Tooltip>
            </div>
          </div>
        ) : (
          <>
            {token ? (
              <Button className="mr-4" onClick={() => handleLogout()}>
                Logout
              </Button>
            ) : (
              <div className="flex flex-row justify-between gap-4 items-center">
                <Link to={"/register"}>
                  <Button>Register</Button>
                </Link>
                <Link to={"/login"}>
                  <Button>Login</Button>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
