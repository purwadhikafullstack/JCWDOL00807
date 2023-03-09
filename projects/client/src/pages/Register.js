import {
  Button,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../redux/action/user";
import { useDispatch, useSelector } from "react-redux";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth);
  // console.log(user);
  let [message, setMessage] = useState("");
  const navigate = useNavigate();
  let regxEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
  let regxPhoneNumber =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

  //Ambil Variable untuk fetching post ke DB

  let name = useRef();
  let email = useRef();
  let password = useRef();
  let repeatPassword = useRef();
  let phone_number = useRef();
  let referral_code = useRef();

  const handleRegister = () => {
    try {
      setLoading(true);
      let inputName = name.current.value;
      let inputEmail = email.current.value;
      let inputPassword = password.current.value;
      let inputRepeatPassword = repeatPassword.current.value;
      let inputPhoneNumber = phone_number.current.value;
      let inputReferralCode = referral_code.current.value;
      // console.log(
      //   inputName,
      //   inputEmail,
      //   inputPassword,
      //   inputRepeatPassword,
      //   inputPhoneNumber,
      //   inputReferralCode
      // );
      if (
        !inputName ||
        !inputEmail ||
        !inputPassword ||
        !inputRepeatPassword ||
        !inputPhoneNumber
      ) {
        setMessage("Data is incomplete");
      } else if (regxEmail.test(inputEmail) === false) {
        setMessage("Email is invalid");
      } else if (regxPassword.test(inputPassword) === false) {
        setMessage(
          "Password must be contains number and alphabet with minimum 6 character and maximum 12 character"
        );
      } else if (inputPassword !== inputRepeatPassword) {
        setMessage("Password and Repeat Password must be same");
      } else if (regxPhoneNumber.test(inputPhoneNumber) === false) {
        setMessage("Please enter a valid phone number");
      } else {
        setMessage("");
        dispatch(
          registerUser({
            name: inputName,
            email: inputEmail,
            password: inputPassword,
            repeatPassword: inputRepeatPassword,
            phone_number: inputPhoneNumber,
            referral_code: inputReferralCode,
          })
        );
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    if (user.user.message) {
      setLoading(true);
      name.current.value = "";
      email.current.value = "";
      password.current.value = "";
      repeatPassword.current.value = "";
      phone_number.current.value = "";
      referral_code.current.value = "";
      setLoading(false);
      // navigate("/login");
    } else {
      setLoading(false);
    }
  });

  const handleVisible = () => {
    let x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  const handleVisible2 = () => {
    let y = document.getElementById("repeat-password");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
  };

  return (
    <div>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="true"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="w-8 h-8 mr-2" src="" alt="logo" />
            GoKu - Registration Form
          </a>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              {message ? (
                <div>
                  <Alert status="error" mb="6" mt="2">
                    <AlertIcon />
                    <AlertTitle>{message}</AlertTitle>
                  </Alert>
                </div>
              ) : (
                <div>
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Create your account
                  </h1>
                </div>
              )}

              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    ref={name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input your name"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    ref={email}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@mail.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <InputGroup>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      ref={password}
                      placeholder="Input your password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />

                    <InputRightElement>
                      <Icon
                        onClick={handleVisible}
                        icon="ic:outline-remove-red-eye"
                      />
                    </InputRightElement>
                  </InputGroup>
                </div>
                <div>
                  <label
                    for="repeat-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Repeat Password
                  </label>
                  <InputGroup>
                    <input
                      type="password"
                      name="repeat-password"
                      id="repeat-password"
                      ref={repeatPassword}
                      placeholder="Input your repeat password"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required=""
                    />
                    <InputRightElement>
                      <Icon
                        onClick={handleVisible2}
                        icon="ic:outline-remove-red-eye"
                      />
                    </InputRightElement>
                  </InputGroup>
                </div>
                <div>
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    ref={phone_number}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input your phone number"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Referral Code
                  </label>
                  <input
                    type="text"
                    name="referralCode"
                    id="referralCode"
                    ref={referral_code}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Input your friend's referral code to get voucher"
                    required=""
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      for="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="font-medium hover:underline text-[#69cb44] text-500"
                        href="true"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                {loading === true ? null : (
                  <div>
                    <Button
                      type="submit"
                      colorScheme="whatsapp"
                      className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                      onClick={handleRegister}
                    >
                      Create an account
                    </Button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account?{" "}
                      <Link to="/login">
                        <a
                          href="true"
                          className="font-medium  hover:underline text-[#69cb44] text-500"
                        >
                          Login here
                        </a>
                      </Link>
                    </p>
                  </div>
                )}
                <Toaster />
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default Register;
