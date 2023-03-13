import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  StackDivider,
  Avatar,
  Tooltip,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import UpdateUserProfile from "../components/UpdateUserProfile";
import { Icon } from "@iconify/react";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import BackdropResetPassword from "../components/BackdropResetPassword";
import axios from "axios";
import { keepLogin } from "../redux/action/user";

const UserProfile = () => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);
  // let link = process.env.REACT_APP_API_BASE_URL.slice(0, 21) + user.image;
  const [message, setMessage] = useState("");
  const [messageDelete, setMessageDelete] = useState("");

  useEffect(() => {
    if (user.message) {
      setMessage(user.message);
    }
  }, [user]);

  const handleClick = () => {
    setMessage("");
  };

  const handleDeleteImages = () => {
    if (user?.image) {
      setMessageDelete("are you sure want to delete your profile");
    }
  };
  const handleConfirm = async () => {
    let token = localStorage.my_Token;
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/delete-photo-profile`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      dispatch(keepLogin());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section
      className=" flex-row md:flex justify-star container mx-auto gap-5  min-h-screen
      items-center  px-5 md:px-0 "
    >
      <Card className=" relative  flex flex-col justify-center   w-[full] md:w-[300px] ">
        <CardHeader className="flex flex-col items-center gap-5">
          {user?.image ? (
            <Tooltip label="Delete Profile" size="xs">
              <Avatar
                onClick={handleDeleteImages}
                size="xl"
                src={user?.image}
              />
            </Tooltip>
          ) : (
            <Avatar onClick={handleDeleteImages} size="xl" src={user?.image} />
          )}

          <Text fontSize="xl" fontWeight="bold">
            {user?.name}
          </Text>
        </CardHeader>

        <CardBody className=" flex flex-col gap-10 h-screen">
          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl " icon="line-md:account-small" />
            <Box>
              <Text fontWeight="bold" size="sm">
                My Account
              </Text>
              <Text pt="2" fontSize="sm">
                My Profile
              </Text>
              <Text pt="2" fontSize="sm">
                Change My Password
              </Text>
              <Text pt="2" fontSize="sm">
                Change My Address
              </Text>
            </Box>
          </Box>

          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl" icon="ant-design:form-outlined" />
            <Box>
              <Text fontWeight="bold" size="sm">
                My Order
              </Text>
              <Text pt="2" fontSize="sm">
                History Order
              </Text>
            </Box>
          </Box>
          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl " icon="ri:hand-heart-line" />
            <Text fontWeight="bold" size="sm">
              Referal Code
            </Text>
          </Box>
        </CardBody>
      </Card>

      <Card textColor="#234E52" className="w-[full] md:w-[700px] px-5 md:px-0 ">
        {message ? (
          <CardHeader textAlign="center">
            <AlertSuccess title={message} handleClick={handleClick} />
          </CardHeader>
        ) : (
          <CardHeader
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="160px"
            variant="subtle"
            bgColor="#e9ffe7"
            rounded="4px"
            textColor="#234E52"
          >
            <Heading size="md" mt="45px" textAlign="center">
              My Profile
            </Heading>
          </CardHeader>
        )}

        <CardBody>
          <Stack
            divider={<StackDivider />}
            spacing="4"
            mt="-3"
            className=" p-0 md:p-20 "
          >
            <Box className="flex  items-center justify-start gap-20 ">
              <Text w="28" size="xs">
                Name{" "}
              </Text>
              <Text className=" text-[10px] md:text-sm  ">{user?.name}</Text>
            </Box>
            <Box className="flex justify-start items-center gap-20 ">
              <Text w="28" size="xs">
                Phone Number
              </Text>
              <Text className=" text-[10px] md:text-sm  ">
                {user?.phone_number}
              </Text>
            </Box>
            <Box className="flex justify-start  items-center gap-20 ">
              <Text w="28" size="xs">
                Birthdate
              </Text>
              <Text className=" text-[10px] md:text-sm  ">
                {user?.birthdate?.slice(0, 10)}
              </Text>
            </Box>
            <Box className="flex  items-center justify-start gap-20 ">
              <Text w="28" size="xs">
                Gender
              </Text>
              <Text className=" text-[10px] md:text-sm  ">{user?.gender}</Text>
            </Box>
            <Box className="flex justify-start  items-center gap-20 ">
              <Text w="28" size="xs">
                Email
              </Text>
              <Text className=" text-[10px] md:text-sm  ">{user?.email}</Text>
            </Box>
            <UpdateUserProfile />
          </Stack>
        </CardBody>
      </Card>
      {messageDelete ? (
        <BackdropResetPassword
          message={messageDelete}
          handleConfirm={handleConfirm}
        />
      ) : null}
    </section>
  );
};

export default UserProfile;
