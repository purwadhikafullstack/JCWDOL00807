import {
  Alert,
  AlertIcon,
  AlertTitle,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Button,
  InputGroup,
  InputRightElement,
  Input,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";

import { Icon } from "@iconify/react";
import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import AlertSuccess from "../components/AlertSuccess";
import { useState } from "react";
import SidebarUser from "../components/SidebarUser";
import axios from "axios";
import BackdropResetPassword from "../components/BackdropResetPassword";
import { useSelector } from "react-redux";

const UserChangePassword = () => {
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("ic:outline-remove-red-eye");
  const [icon2, setIcon2] = useState("ic:outline-remove-red-eye");
  const [icon3, setIcon3] = useState("ic:outline-remove-red-eye");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errNewPassword, setErrNewPassword] = useState("");
  const [errRepeatPassword, setErrRepeatPassword] = useState("");
  const [messageError, setMessageError] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  let api = process.env.REACT_APP_API_BASE_URL;
  // let user = useSelector((state) => state.auth);

  const handleClick = () => {
    setMessage("");
  };

  // console.log(user);

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

  const handleVisible3 = () => {
    let password = document.getElementById("myInput3");
    if (password.type === "password") {
      password.type = "text";
      setIcon3("mdi:eye-off-outline");
    } else {
      password.type = "password";
      setIcon3("ic:outline-remove-red-eye");
    }
  };

  const handleChangePasswordStep1 = async () => {
    try {
      let token = localStorage.my_Token;
      await axios.get(
        `${api}/user/change-password-step1?oldPassword=${oldPassword}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setMessageSuccess(true);
      setMessageError("");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      setMessageError(error.response.data.message);
    }
  };

  const handleInputNewPassword = (event) => {
    setNewPassword(event);
    let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (event.length === 0) {
      setErrNewPassword("Input require");
    } else if (regxPassword.test(event) === false) {
      setErrNewPassword(
        "Password must contains both letters and numbers, and is between 6 and 12 character."
      );
    } else {
      setErrNewPassword("");
      setNewPassword(event);
    }
  };

  const handleInpuRepeatPassword = (event) => {
    setRepeatPassword(event);
    let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (event.length === 0) {
      setErrRepeatPassword("Input require");
    } else if (regxPassword.test(event) === false) {
      setErrRepeatPassword(
        "Password must contains both letters and numbers, and is between 6 and 12 character."
      );
    } else {
      setErrRepeatPassword("");
      setRepeatPassword(event);
    }
  };

  const handleChangePassword = () => {
    let regxPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,12}$/;
    if (newPassword !== repeatPassword) {
      console.log(newPassword, repeatPassword);
      console.log(repeatPassword === newPassword);
      setErrRepeatPassword("Password and repeat password do not match");
    } else if (!newPassword || !repeatPassword) {
      setMessageError("Data Not Complete");
    } else if (
      regxPassword.test(repeatPassword) === true ||
      regxPassword.test(repeatPassword) === true
    ) {
      setMessageError("");
      setDeleteMessage("Are you sure want to change your password");
    }
  };

  const handleConfirm = async () => {
    try {
      let token = localStorage.my_Token;
      const changePassword = await axios.patch(
        `${api}/users/change-password`,
        {
          newPassword,
          repeatPassword,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setDeleteMessage("");
      setMessageError("");
      setMessage(changePassword.data.message);
      setMessageSuccess(false);
      const newToken = changePassword.data.data;
      localStorage.setItem("my_Token", newToken);
      // navigate("/accounts/profile");
    } catch (error) {
      setMessageError(error.response.data.message);
    }
  };

  const handleClose = () => {
    setDeleteMessage("");
  };

  return (
    <>
      <Navbar />
      <section
        className=" flex-row md:flex justify-center container mx-auto gap-5  min-h-screen
      items-center  px-0  mt-0 md:mt-10 mb-10 "
      >
        <Card textColor="#234E52" className="w-[full] md:w-[800px]  md:px-0   ">
          {message ? (
            <CardHeader textAlign="center">
              <AlertSuccess title={message} handleClick={handleClick} />
            </CardHeader>
          ) : (
            <CardHeader
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              height={["fit-content", "160px"]}
              variant="subtle"
              bgColor={["white", "#DEF5E5"]}
              rounded="4px"
              textColor="#234E52"
            >
              <Heading size="md" mt={["10", "45px"]} textAlign="center">
                Change My Password
              </Heading>
            </CardHeader>
          )}
          <div className=" md:px-5 items-center flex flex-row flex-wrap  ">
            <SidebarUser />
            <CardBody className=" p-0 md:p-20 md:mt-[-130px]    ">
              {messageError ? (
                <div>
                  <Alert status="error" mt="16" mb="5" rounded="5">
                    <AlertIcon />
                    <AlertTitle>{messageError}</AlertTitle>
                  </Alert>
                </div>
              ) : null}

              {messageSuccess === false ? (
                <>
                  <FormLabel>Current Password</FormLabel>
                  <InputGroup
                    size="md"
                    mb="1.5"
                    mt="1.5"
                    className="w-[full] md:w-[500px]"
                  >
                    <FormControl isInvalid={oldPassword.length === 0}>
                      <Input
                        placeholder="Password"
                        className="w-[full] md:w-[600px]"
                        type="password"
                        id="myInput"
                        p="5"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      {oldPassword.length === 0 ? (
                        <FormErrorMessage> Input require </FormErrorMessage>
                      ) : null}
                    </FormControl>
                    <InputRightElement>
                      <Icon onClick={handleVisible} icon={icon} />
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    colorScheme="gray"
                    bgColor="#BCEAD5"
                    mt="6"
                    w="full"
                    rounded="12px"
                    onClick={handleChangePasswordStep1}
                  >
                    Next Step 2
                  </Button>
                </>
              ) : (
                <>
                  <FormLabel mt="10">New Password</FormLabel>
                  <InputGroup
                    size="md"
                    mb="1.5"
                    mt="1.5"
                    className="w-[full] md:w-[500px]"
                  >
                    <FormControl isInvalid={errNewPassword}>
                      <Input
                        placeholder="New Password"
                        type="password"
                        id="myInput2"
                        p="5"
                        className="w-[full] md:w-[full]"
                        value={newPassword}
                        onChange={(e) => handleInputNewPassword(e.target.value)}
                        colorScheme="red"
                      />
                      {!errNewPassword ? null : (
                        <FormErrorMessage>{errNewPassword}</FormErrorMessage>
                      )}
                    </FormControl>
                    <InputRightElement>
                      <Icon onClick={handleVisible2} icon={icon2} />
                    </InputRightElement>
                  </InputGroup>
                  <FormLabel>Repeat Password</FormLabel>
                  <InputGroup
                    size="md"
                    mb="1.5"
                    mt="1.5"
                    className="w-[full] md:w-[full]"
                  >
                    <FormControl isInvalid={errRepeatPassword}>
                      <Input
                        placeholder="Repeat Password"
                        type="password"
                        id="myInput3"
                        p="5"
                        className="w-[full] md:w-[full]"
                        value={repeatPassword}
                        onChange={(e) =>
                          handleInpuRepeatPassword(e.target.value)
                        }
                        colorScheme="red"
                      />
                      {!errRepeatPassword ? null : (
                        <FormErrorMessage>{errRepeatPassword}</FormErrorMessage>
                      )}
                    </FormControl>
                    <InputRightElement>
                      <Icon onClick={handleVisible3} icon={icon3} />
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    colorScheme="gray"
                    bgColor="#BCEAD5"
                    mt="6"
                    w="full"
                    rounded="12px"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </Button>
                </>
              )}
            </CardBody>
          </div>
        </Card>
      </section>
      <Footer />
      {deleteMessage ? (
        <BackdropResetPassword
          message={deleteMessage}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
        />
      ) : null}
    </>
  );
};

export default UserChangePassword;
