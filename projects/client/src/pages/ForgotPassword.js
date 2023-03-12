import { Alert, AlertIcon, AlertTitle, Input, Button } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import BackdropResetPassword from "../components/BackdropResetPassword";
import axios from "axios";

const ForgotPassword = () => {
  let email = useRef();
  let [message, setMessage] = useState("");
  let [messageSuccess, setMessageSuccess] = useState("");
  let [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const regxEmail = /\S+@\S+\.\S+/;
      let inputEmail = email.current.value;

      if (!regxEmail.test(inputEmail)) {
        setMessage("not valid email");
        return setLoading(false);
      } else {
        setMessage("");
        let response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/user/forgot-password`,
          {
            email: inputEmail,
          }
        );
        setMessageSuccess(response.data.message);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
            <h1>Trouble logging in?</h1>
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
        {loading === true ? null : (
          <Button
            colorScheme="whatsapp"
            mt="6"
            w="full"
            rounded="12px"
            onClick={handleSubmit}
          >
            Send login link
          </Button>
        )}

        <p className=" text-sm text-center mt-4 text-slate-500 ">
          Or you can create new account?{" "}
          <a href="true" className="text-sm text-[#69cb44] font-semibold ">
            create new one
          </a>
        </p>
      </div>
      {messageSuccess ? (
        <BackdropResetPassword message={messageSuccess} />
      ) : null}
    </section>
  );
};

export default ForgotPassword;
