import { Avatar, Button, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  let user = useSelector((state) => state.auth);
  return (
    <nav className="shadow shadow-slate-200 bg-[#e9ffe7]  sticky top-0 z-10 ">
      <div className="container mx-auto flex flex-row justify-between items-center h-24">
        <div className="flex flex-col gap-1">
          <Link to="/">
            <div className=" font-extrabold text-3xl ">GoKu</div>
          </Link>
        </div>
        {user?.user?.name ? (
          <Link to="/accounts/profile">
            <div className="flex flex-row justify-between gap-10 items-center">
              <Icon className=" text-4xl " icon="ic:round-shopping-cart" />
              <div className=" flex flex-col justify-center items-center ">
                <Tooltip label={user?.user?.name} fontSize="xs">
                  <Avatar src={user?.user?.image} size="sm" />
                </Tooltip>
              </div>
            </div>
          </Link>
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
      </div>
    </nav>
  );
};

export default Navbar;
