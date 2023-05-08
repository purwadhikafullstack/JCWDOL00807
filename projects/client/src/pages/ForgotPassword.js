import { Alert, AlertIcon, AlertTitle, Input, Button } from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import BackdropResetPassword from "../components/BackdropResetPassword";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/NavbarUser2";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  let email = useRef();
  let [message, setMessage] = useState("");
  let [messageSuccess, setMessageSuccess] = useState("");
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const regxEmail = /\S+@\S+\.\S+/;
      let inputEmail = email.current.value;

      if (!regxEmail.test(inputEmail)) {
        setMessage("The email address you entered is not valid");
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

  const handleClose = () => {
    setMessageSuccess("");
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <section className="flex justify-center min-h-screen w-full m-0 p-0 items-center   ">
        <div className=" relative h-96  w-[320px] md:w-[500px] flex-col justify-center items-center ">
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
            className="w-[320px] md:w-[500px]"
            placeholder="Email"
            type="text"
            p="5"
            ref={email}
          />
          {loading === true ? null : (
            <Button
              colorScheme="gray"
              bgColor="#DEF5E5"
              mt="6"
              className="w-[320px] md:w-[500px]"
              rounded="12px"
              onClick={handleSubmit}
            >
              Send login link
            </Button>
          )}

          <p className=" text-sm text-center mt-4 text-slate-500 ">
            You can{" "}
            <Link to="/login">
              {" "}
              <span className="text-sm text-[#8EC3B0] font-semibold">
                login
              </span>
            </Link>{" "}
            or you can create new account?
            <Link to="/register">
              <span className="text-sm text-[#8EC3B0] font-semibold ">
                create new one
              </span>
            </Link>
          </p>
        </div>
        {messageSuccess ? (
          <BackdropResetPassword
            message={messageSuccess}
            handleClose={handleClose}
          />
        ) : null}
      </section>
      <Footer />
    </>
  );
};

export default ForgotPassword;
