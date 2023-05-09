import { Button } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const NavbarAdmin = () => {
  // const navigate = useNavigate();
  // const token = localStorage.getItem("my_Token");
  const branchStore = localStorage.getItem("branchStoreAdmin");
  const name = localStorage.getItem("adminName");

  // const handleLogout = () => {
  //   localStorage.removeItem("my_Token");
  //   localStorage.removeItem("my_Role");
  //   window.location.href = "login";
  // };

  return (
    <nav className=" shadow shadow-slate-200 -mx-4   bg-white  sticky top-0 z-10">
      <div className="container mx-auto flex  justify-end gap-3 items-center h-20  ">
        {/* <Link to={"/"}>
          {" "}
          <div className=" font-extrabold text-3xl ">GoKu</div>
        </Link> */}

        {/* <>
          {token ? (
            <Button className="mr-4" onClick={() => handleLogout()}>
              Logout
            </Button>
          ) : null}
        </> */}

        <div className=" flex gap-3 ">
          <h1 className=" font-bold capitalize ">Hai {name}</h1>
          <div className=" flex  ">
            <Icon
              className="text-lg"
              icon="material-symbols:location-on-outline"
            />
            <div className=" font-bold capitalize "> {branchStore}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
