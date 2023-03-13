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
import { loginUser } from "../redux/action/user";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  let email = useRef();
  let password = useRef();
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth);
  let [message, setMessage] = useState("");
  const navigate = useNavigate();
  let regxEmail = /\S+@\S+\.\S+/;
  const [icon, setIcon] = useState("ic:outline-remove-red-eye");

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
        setMessage("Data not complete");
      } else if (regxEmail.test(inputEmail) === false) {
        setMessage("Not Valid Email");
      } else {
        setMessage("");
        dispatch(
          loginUser({
            email: inputEmail,
            password: inputPassword,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (user.user.token) {
      setMessage("");

      localStorage.setItem("my_Token", user.user.token);
      navigate("/");
    }

    if (user.errorMessage) {
      setMessage(user.errorMessage);
    }
  });

  return (
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
            <h1>User Login</h1>
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

        <div className=" flex justify-start mt-6">
          <Link to="/accounts/forgot-password">
            <div className=" text-sm text-[#69cb44] font-semibold">
              Forgot Password
            </div>
          </Link>
        </div>

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
  );
};

export default Login;
