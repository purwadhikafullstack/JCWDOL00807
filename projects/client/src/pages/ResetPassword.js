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
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import BackdropResetPassword from "../components/BackdropResetPassword";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const ResetPassword = () => {
  const password = useRef();
  const repeatPassword = useRef();
  const { token } = useParams();
  let [message, setMessage] = useState("");
  let [messageSuccess, setMessageSuccess] = useState("");
  const [icon, setIcon] = useState("ic:outline-remove-red-eye");
  const [icon2, setIcon2] = useState("ic:outline-remove-red-eye");

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

  const handleVisible2 = () => {
    let password = document.getElementById("myInput2");
    if (password.type === "password") {
      password.type = "text";
      setIcon2("mdi:eye-off-outline");
    } else {
      password.type = "password";
      setIcon2("ic:outline-remove-red-eye");
    }
  };

  const handleReset = async () => {
    try {
      let inputPassword = password.current.value;
      let inputRepeatPassword = repeatPassword.current.value;
      let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

      if (!inputPassword || !inputRepeatPassword) {
        setMessage("Incomplete data. Please fill in missing information.");
      } else if (inputPassword !== inputRepeatPassword) {
        setMessage(
          "Password and repeat password do not match. Please make sure they are the same."
        );
      } else if (regxPassword.test(inputPassword) === false) {
        setMessage(
          "Please choose a password that contains both letters and numbers, and is between 6 and 12 character."
        );
      } else {
        setMessage("");
        let response = await axios.patch(
          `${process.env.REACT_APP_API_BASE_URL}/user/reset-password?password=${inputPassword}&repeatPassword=${inputRepeatPassword}`,
          {},
          {
            headers: {
              Authorization: token,
            },
          }
        );
        setMessageSuccess(response.data.message);
      }
    } catch (error) {
      setMessage(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <>
    <Navbar />
    <section className="flex justify-center min-h-screen w-full m-0 p-0 items-center   ">
      <div className=" relative h-96 w-[full] md:w-[500px] flex-col justify-center items-center ">
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
            <h1>Reset Password</h1>
          </div>
        )}

        <InputGroup
          size="md"
          mb="1.5"
          mt="1.5"
          className="w-[full] md:w-[500px]"
        >
          <Input
            variant="flushed"
            placeholder="Password"
            className="w-[full] md:w-[500px]"
            type="password"
            id="myInput"
            p="5"
            ref={password}
          />
          <InputRightElement>
            <Icon onClick={handleVisible} icon={icon} />
          </InputRightElement>
        </InputGroup>

        <InputGroup
          size="md"
          mb="1.5"
          mt="1.5"
          className="w-[full] md:w-[500px]"
        >
          <Input
            variant="flushed"
            placeholder="Repeat Password"
            type="password"
            id="myInput2"
            p="5"
            className="w-[full] md:w-[500px]"
            ref={repeatPassword}
          />
          <InputRightElement>
            <Icon onClick={handleVisible2} icon={icon2} />
          </InputRightElement>
        </InputGroup>
        <Button
          colorScheme="whatsapp"
          mt="6"
          w="full"
          rounded="12px"
          onClick={handleReset}
        >
          Reset Password
        </Button>
      </div>
      {messageSuccess ? (
        <BackdropResetPassword message={messageSuccess} />
      ) : null}
    </section>
    <Footer />
    </>
  );
};

export default ResetPassword;
