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
import { useParams } from "react-router-dom";
import { useRef, useState } from "react";
import axios from "axios";
import BackdropResetPassword from "../components/BackdropResetPassword";

const ResetPassword = () => {
  const password = useRef();
  const repeatPassword = useRef();
  const { token } = useParams();
  let [message, setMessage] = useState("");
  let [messageSuccess, setMessageSuccess] = useState("");

  const handleVisible = () => {
    let password = document.getElementById("myInput");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const handleVisible2 = () => {
    let password = document.getElementById("myInput2");
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  };

  const handleReset = async () => {
    try {
      let inputPassword = password.current.value;
      let inputRepeatPassword = repeatPassword.current.value;
      let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;

      if (!inputPassword || !inputRepeatPassword) {
        setMessage("Data not Complete");
      } else if (inputPassword !== inputRepeatPassword) {
        setMessage("Password and Repeat Password Not Match ");
      } else if (regxPassword.test(inputPassword) === false) {
        setMessage(
          "Password must be contains number and alphabet with minimum 6 character and maximum 12 character"
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
    <section className="flex justify-center min-h-screen w-full m-0 p-0 items-center   ">
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
            <h1>Reset Password</h1>
          </div>
        )}

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

        <InputGroup size="md" w="500px" mb="1.5" mt="1.5">
          <Input
            variant="flushed"
            placeholder="Repeat Password"
            type="password"
            id="myInput2"
            p="5"
            ref={repeatPassword}
          />
          <InputRightElement>
            <Icon onClick={handleVisible2} icon="ic:outline-remove-red-eye" />
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
  );
};

export default ResetPassword;
