import {
  Button,
  Checkbox,
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

  const handleVisible = () => {
    let password = document.getElementById("myInput");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const handleLogin = () => {
    try {
      let inputEmail = email.current.value;
      let inputPassword = password.current.value;

      console.log();

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
    <section className="flex justify-center min-h-screen w-full m-0 p-0 items-center">
      <div className=" relative h-96 w-[500px] flex-col justify-center items-center ">
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
          w="500px"
          placeholder="Email"
          type="text"
          p="5"
          ref={email}
        />

        <InputGroup size="md" w="500px" mb="1.5" mt="1.5">
          <Input
            variant="flushed"
            placeholder="Password"
            type="password"
            id="myInput"
            p="5"
            ref={password}
          />
          <InputRightElement>
            <Icon onClick={handleVisible} icon="ic:outline-remove-red-eye" />
          </InputRightElement>
        </InputGroup>

        <div className=" flex justify-between mt-6">
          <Checkbox colorScheme="green" size="sm">
            Remember me
          </Checkbox>
          <Link to="/accounts/reset-password">
            {" "}
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
          <a href="true" className="text-sm text-[#69cb44] font-semibold ">
            Register
          </a>
        </p>
      </div>
    </section>
  );
};

export default Login;
