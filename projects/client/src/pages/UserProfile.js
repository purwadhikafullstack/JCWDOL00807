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

import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import UpdateUserProfile from "../components/UpdateUserProfile";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";
import moment from "moment";

const UserProfile = () => {
  let user = useSelector((state) => state.auth.user);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user.message) {
      const newToken = user?.data?.token;
      setMessage(user.message);
      localStorage.setItem("my_Token", newToken);
    }
  }, [user]);

  const handleClick = () => {
    setMessage("");
  };

  const userBirthdate = user?.birthdate;
  const date = moment(userBirthdate);

  return (
    <>
      <Navbar />
      <section
        className=" flex justify-center container mx-auto gap-5  min-h-screen
      items-center  px-0  mt-0 md:mt-10 mb-10"
      >
        <Card textColor="#234E52" className="w-[full] md:w-[full] md:px-0  ">
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
                My Profile
              </Heading>
            </CardHeader>
          )}
          <div className=" flex justify-start px-0 md:px-5 items-center flex-wrap  ">
            <SidebarUser />
            <CardBody>
              <Stack
                divider={
                  <StackDivider display={{ base: "none", md: "flex" }} />
                }
                spacing="4"
                className=" px-14 py-5  -m-5 md:m-0 md:p-20  md:rounded-lg min-h-fit md:h-[800px] flex flex-col gap-3 md:gap-0 justify-center "
              >
                <Box className="grid grid-cols-2 ">
                  <Text w="28" size="xs">
                    Name{" "}
                  </Text>
                  <Text className=" text-[10px] md:text-sm capitalize ">
                    {user?.name}
                  </Text>
                </Box>
                <Box className="grid grid-cols-2 ">
                  <Text w="28" size="xs">
                    Phone Number
                  </Text>
                  <Text className=" text-[10px] md:text-sm  ">
                    {user?.phone_number}
                  </Text>
                </Box>
                <Box className="grid grid-cols-2 ">
                  <Text w="28" size="xs">
                    Birthdate
                  </Text>
                  {user?.birthdate ? (
                    <Text className=" text-[10px] md:text-sm  ">
                      {date.format("DD MMMM YYYY")}
                    </Text>
                  ) : (
                    <UpdateUserProfile tabel={true} />
                  )}
                </Box>
                <Box className="grid grid-cols-2 ">
                  <Text w="28" size="xs">
                    Gender
                  </Text>
                  {user?.gender ? (
                    <Text className=" text-[10px] md:text-sm capitalize ">
                      {user?.gender}
                    </Text>
                  ) : (
                    <UpdateUserProfile tabel={true} />
                  )}
                </Box>
                <Box className="grid grid-cols-2 ">
                  <Text w="28" size="xs">
                    Email
                  </Text>
                  <Text className=" text-[10px] md:text-sm  ">
                    {user?.email}
                  </Text>
                </Box>
                <UpdateUserProfile tabel={false} />
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
