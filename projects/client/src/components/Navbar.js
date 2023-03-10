import {
  Avatar,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  Tooltip,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Navbar = () => {
  let user = useSelector((state) => state.auth);
  let link =
    process.env.REACT_APP_API_BASE_URL.slice(0, 21) + user?.user?.image;

  return (
    <nav>
      <div className="shadow shadow-slate-200 sticky top-0 bg-[#e9ffe7]">
        <div className="container mx-auto flex flex-row justify-between items-center h-28 ">
          <div className=" font-extrabold text-3xl ">GoKu</div>
          <InputGroup size="md" w="md">
            <Input placeholder="cari" type="text" p="5" bgColor="white" />
            <InputRightAddon>
              <Icon className=" text-xl " icon="ic:round-search" />
            </InputRightAddon>
          </InputGroup>
          {user?.user?.name ? (
            <div className="flex flex-row justify-between gap-10 items-center">
              <Icon className=" text-4xl " icon="ic:round-shopping-cart" />
              <div className=" flex flex-col justify-center items-center ">
                <Tooltip label={user?.user?.name} fontSize="xs">
                  <Avatar src={link} size="sm" />
                </Tooltip>
              </div>
            </div>
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
      </div>
    </nav>
  );
};

export default Navbar;
