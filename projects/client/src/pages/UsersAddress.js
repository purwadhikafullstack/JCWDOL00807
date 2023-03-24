import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  StackDivider,
  Button,
} from "@chakra-ui/react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";
import CreateUserAddress from "../components/CreateUserAddress";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import UpdateUserAddress from "../components/UpdateUserAddress";
import SidebarUser from "../components/SidebarUser";

const UserAddress = () => {
  let userAddress = useSelector((state) => state.address.userAddress);

  const [message, setMessage] = useState("");
  const [dataAddress, setDataAddress] = useState([]);

  useEffect(() => {
    if (userAddress.message) {
      setMessage(userAddress.message);
    }
    if (userAddress.data) {
      setDataAddress(userAddress?.data);
    } else {
      setMessage("");
    }
  }, [userAddress]);

  const handleClick = () => {
    setMessage("");
  };
  return (
    <div>
      <Navbar />
      <section
        className=" flex-row md:flex justify-center
       container mx-auto gap-5  min-h-screen
        px-5 md:px-0 m-10"
      >
        <Card
          textColor="#234E52"
          className="w-[full] md:w-[1000px] px-5 md:px-0 "
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
              bgColor="#DEF5E5"
              rounded="4px"
              textColor="#234E52"
            >
              <Heading size="md" mt="45px" textAlign="center">
                My Address
              </Heading>
            </CardHeader>
          )}
          <div className=" md:flex md:px-5  flex flex-row h-[800px] ">
            <SidebarUser />
            {!dataAddress ? (
              <div>Loading ...</div>
            ) : (
              <CardBody className=" p-0 md:p-20  overflow-auto max-h-[700px] mt-0 ">
                <Stack
                  divider={<StackDivider />}
                  spacing="4"
                  mt="-3"
                  className=" p-0 md:p-20 "
                >
                  {dataAddress?.map((val, idx) => (
                    <Box
                      key={idx.toLocaleString()}
                      className="flex justify-between items-center"
                    >
                      <Box className="flex flex-col  items-start justify-start gap-1 ">
                        <div className=" flex flex-row gap-3 ">
                          <Text className=" font-semibold ">
                            {val.recipient}
                          </Text>
                          <Text>| {val.recipients_phone}</Text>
                        </div>
                        <Text className=" text-sm">{val.street_address}</Text>
                        <Text textTransform="uppercase" className=" text-sm ">
                          {val.city}, {val.province}, {val.postal_code}
                        </Text>

                        {val.isDefault === true ? (
                          <Box className=" flex gap-3 items-center mt-2">
                            <Button disabled size="sm">
                              Utama
                            </Button>
                            <Button size="sm">
                              <UpdateUserAddress id={val.id} data={val} />
                            </Button>
                          </Box>
                        ) : null}
                      </Box>

                      {val.isDefault === true ? null : (
                        <Box>
                          <UpdateUserAddress id={val.id} data={val} />
                        </Box>
                      )}
                    </Box>
                  ))}
                  {!dataAddress ? (
                    <Text className=" text-center text-lg  ">
                      You don't have any address
                    </Text>
                  ) : null}

                  <CreateUserAddress />
                </Stack>
              </CardBody>
            )}
          </div>
        </Card>
      </section>
      <Footer />
    </div>
  );
};

export default UserAddress;
