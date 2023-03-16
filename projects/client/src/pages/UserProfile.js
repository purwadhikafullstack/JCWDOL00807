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

import { useSelector } from "react-redux";
import UpdateUserProfile from "../components/UpdateUserProfile";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import SidebarUser from "../components/SidebarUser";

const UserProfile = () => {
  let user = useSelector((state) => state.auth.user);
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
    <section
      className=" flex-row md:flex justify-star container mx-auto gap-5  min-h-screen
      items-center  px-5 md:px-0 "
    >
      <SidebarUser />
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
    </section>
  );
};

export default UserProfile;
