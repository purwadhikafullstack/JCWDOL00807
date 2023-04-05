import {
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginAdmin } from "../redux/action/admin";

import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const AdminLogin = () => {
  let email = useRef();
  let password = useRef();
  let role = useRef();
  // const role = useSelector((state) => state.user.role);
  const dispatch = useDispatch();
  let admin = useSelector((state) => state.admin);
  console.log(admin)
  console.log(admin.admin.role)
  let [message, setMessage] = useState("");
  const navigate = useNavigate();
  let regxEmail = /\S+@\S+\.\S+/;
  const [icon, setIcon] = useState("ic:outline-remove-red-eye");

  let my_token = localStorage.getItem('my_Token');

  const handleVisible = () => {
    let password = document.getElementById("myInput");
    if (password.type === "password") {
      password.type = "text";
      setIcon("mdi:eye-off-outline");
    } else {
      password.type = "password";
      setIcon("ic:outline-remove-red-eye");
    }
  };

  const handleLogin = () => {
    try {
      let inputEmail = email.current.value;
      let inputPassword = password.current.value;

      if (!inputEmail || !inputPassword) {
        setMessage("Incomplete data. Please fill in missing information.");
      } else if (regxEmail.test(inputEmail) === false) {
        setMessage("The email address you entered is not valid");
      } else {
        setMessage("");
        dispatch(
          loginAdmin({
            email: inputEmail,
            password: inputPassword,
          })
          )
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Navigate halaman berdasarkan ROLE
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (admin?.admin?.isSuccess) {
      localStorage.setItem("my_Token", admin?.admin?.token);
      localStorage.setItem("my_Role", admin?.admin?.role);
      if(admin.admin.role === 'admin branch'){
        navigate('/admin/home')
      } else if (admin.admin.role === 'super admin'){
        navigate('/admin/management')
      } else {
        setMessage("anda bukan admin")
      }
    }

    if (admin.errorMessage) {
      setMessage(admin.errorMessage);
  }
  // console.log(admin.admin.token)
    
  },[ admin, navigate]);

  // console.log(admin.admin.message)
  // console.log(admin.admin.token)

  return (
    <>
      {/* <Navbar /> */}
      <section className="flex justify-center min-h-screen w-full m-0 p-0 items-center border">
        <div className=" relative h-96 w-[full] md:w-[500px]  flex-col justify-center items-center ">
          {message ? (
            <div>
              <Alert status="error" mb="6" mt="2">
                <AlertIcon />
                <AlertTitle>{message}</AlertTitle>
              </Alert>
            </div>
          ) : (
            <div className=" flex flex-row  items-center gap-2 mb-10 ">
              <Icon className=" text-xl " icon="ion:enter-outline" />
              <h1>Admin Login</h1>
            </div>
          )}

          <Input
            variant="flushed"
            className=" w-[full] md:w-[500px]  "
            placeholder="Email"
            type="text"
            p="5"
            ref={email}
          />
        <div className=" flex justify-start mt-6">
          <Link to="/accounts/reset-password">
            <div className=" text-sm text-[#69cb44] font-semibold">
              Forgot Password
            </div>
          </Link>
        </div>

          <InputGroup
            size="md"
            mb="1.5"
            mt="1.5"
            className=" w-[full] md:w-[500px] "
          >
            <Input
              variant="flushed"
              placeholder="Password"
              type="password"
              id="myInput"
              p="5"
              className=" w-[full] md:w-[500px] "
              ref={password}
            />
            <InputRightElement>
              <Icon onClick={handleVisible} icon={icon} />
            </InputRightElement>
          </InputGroup>

          <Button
            colorScheme="whatsapp"
            mt="6"
            w="full"
            rounded="12px"
            onClick={handleLogin}
          >
            Log in
          </Button>
          <p className=" text-sm text-center mt-4 text-slate-500 ">
            Don't have an account?{" "}
            <Link to="/register">
              <span className="text-sm text-[#69cb44] font-semibold ">
                Register
              </span>
            </Link>
          </p>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;
