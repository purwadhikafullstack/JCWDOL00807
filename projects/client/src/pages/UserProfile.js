import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  StackDivider,
} from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import UpdateUserProfile from "../components/UpdateUserProfile";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";

const UserProfile = () => {
  let user = useSelector((state) => state.auth.user);
  // console.log(user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user.message) {
      setMessage(user.message);
    }
  }, [user]);

  const handleClick = () => {
    setMessage("");
  };

  return (
    <>
      <Navbar />
      <section
        className=" flex-row md:flex justify-center container mx-auto gap-5  min-h-screen
      items-center  px-5 md:px-0  "
      >
        <Card
          textColor="#234E52"
          className="w-[full] md:w-[full] px-5 md:px-0 "
        >
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
          <div className=" md:flex justify-start  md:px-5 items-center flex flex-row ">
            <SidebarUser />
            <CardBody>
              <Stack
                divider={<StackDivider />}
                spacing="4"
                className=" p-0 md:p-20 shadow shadow-slate-200 rounded-lg  "
              >
                <Box className="flex  items-center justify-start gap-20 ">
                  <Text w="28" size="xs">
                    Name{" "}
                  </Text>
                  <Text className=" text-[10px] md:text-sm  ">
                    {user?.name}
                  </Text>
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
                  {user?.birthdate ? (
                    <Text className=" text-[10px] md:text-sm  ">
                      {user?.birthdate}
                    </Text>
                  ) : (
                    <Text className=" text-[10px] md:text-sm  text-red-600 font-semibold ">
                      Update Birthdate
                    </Text>
                  )}
                </Box>
                <Box className="flex  items-center justify-start gap-20 ">
                  <Text w="28" size="xs">
                    Gender
                  </Text>
                  {user?.gender ? (
                    <Text className=" text-[10px] md:text-sm  ">
                      {user?.gender}
                    </Text>
                  ) : (
                    <Text className=" text-[10px] md:text-sm  text-red-600 font-semibold ">
                      Update Gender
                    </Text>
                  )}
                </Box>
                <Box className="flex justify-start  items-center gap-20 ">
                  <Text w="28" size="xs">
                    Email
                  </Text>
                  <Text className=" text-[10px] md:text-sm  ">
                    {user?.email}
                  </Text>
                </Box>
                <UpdateUserProfile />
              </Stack>
            </CardBody>
          </div>
        </Card>
      </section>
      <Footer />
    </>
  );
};

export default UserProfile;
