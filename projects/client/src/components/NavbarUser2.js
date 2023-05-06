import { Avatar, Button, Tooltip } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const NavbarUser2 = () => {
  const navigate = useNavigate();

  let user = useSelector((state) => state.auth);
  const token = localStorage.getItem("my_Token");

  const handleLogout = () => {
    localStorage.removeItem("my_Token");
    localStorage.removeItem("my_Role");
    window.location.href = "login";
  };

  return (
    <nav className="shadow shadow-slate-200 bg-[#e9ffe7]  sticky top-0 z-10">
      <div className="container mx-auto flex flex-row justify-between items-center h-28  ">
        <Link to={"/"}>
          <div className=" font-extrabold text-3xl ">GoKu</div>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarUser2;
