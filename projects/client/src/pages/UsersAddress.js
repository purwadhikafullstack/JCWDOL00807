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

import Navbar from "../components/Navbar2";
import Footer from "../components/Footer";
import { useSelector, useDispatch } from "react-redux";
import CreateUserAddress from "../components/CreateUserAddress";
import AlertSuccess from "../components/AlertSuccess";
import { useEffect, useState } from "react";
import UpdateUserAddress from "../components/UpdateUserAddress";
import SidebarUser from "../components/SidebarUser";
import { handleStateError } from "../redux/action/userAddress";

const UserAddress = () => {
  const dispatch = useDispatch();
  let userAddress = useSelector((state) => state.address);
  const [message, setMessage] = useState("");
  const [dataAddress, setDataAddress] = useState([]);

  useEffect(() => {
    if (!userAddress.loading) {
      setDataAddress(userAddress.userAddress.data);
      setMessage(userAddress.messageSuccess);
    }
  }, [userAddress]);

  const handleClick = () => {
    dispatch(handleStateError("cancel"));
    setMessage("");
  };

  setTimeout(() => {
    dispatch(handleStateError("cancel"));
    setMessage("");
  }, 5000);

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
            {dataAddress?.length === 0 || !dataAddress ? (
              <div className=" ml-20 mt-20 text-lg   ">
                <h1 className="mb-5"> You don't have any address</h1>
                <div className="ml-5">
                  <CreateUserAddress />
                </div>
              </div>
            ) : (
              <div>
                <CardBody>
                  <Stack
                    divider={<StackDivider />}
                    spacing="4"
                    mt="16"
                    className=" p-0 md:pl-20 "
                  >
                    <Box className="flex justify-between items-center">
                      <Box className="flex flex-col  items-start justify-start gap-1 ">
                        <div className=" flex flex-row gap-3 ">
                          <Text
                            textTransform="capitalize"
                            className=" font-semibold "
                          >
                            {dataAddress[0]?.recipient}
                          </Text>
                          <Text>| {dataAddress[0]?.recipients_phone}</Text>
                        </div>
                        <Text textTransform="capitalize" className=" text-sm">
                          {dataAddress[0]?.street_address}
                        </Text>
                        <Text textTransform="uppercase" className=" text-sm ">
                          {dataAddress[0]?.city}, {dataAddress[0]?.province},
                          {dataAddress[0]?.postal_code}
                        </Text>

                        <Box className=" flex gap-3 items-center mt-2">
                          <Button disabled size="sm">
                            Utama
                          </Button>
                          <Button size="sm">
                            <UpdateUserAddress
                              id={dataAddress[0]?.id}
                              data={dataAddress[0]}
                            />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </CardBody>
                <CardBody className=" p-0   overflow-auto max-h-[350px]  ">
                  <Stack
                    divider={<StackDivider />}
                    spacing="4"
                    mt="-4"
                    className=" p-0 md:pl-20 "
                  >
                    {dataAddress?.map((val, idx) => (
                      <div key={idx.toLocaleString()}>
                        {val.isDefault === false ? (
                          <Box className="flex justify-between items-center">
                            <Box className="flex flex-col  items-start justify-start gap-1 ">
                              <div className=" flex flex-row gap-3 ">
                                <Text
                                  textTransform="capitalize"
                                  className=" font-semibold "
                                >
                                  {val.recipient}
                                </Text>
                                <Text>| {val.recipients_phone}</Text>
                              </div>
                              <Text
                                textTransform="capitalize"
                                className=" text-sm"
                              >
                                {val.street_address}
                              </Text>
                              <Text
                                textTransform="uppercase"
                                className=" text-sm "
                              >
                                {val.city}, {val.province}, {val.postal_code}
                              </Text>
                            </Box>

                            <Box>
                              <UpdateUserAddress id={val.id} data={val} />
                            </Box>
                          </Box>
                        ) : null}
                      </div>
                    ))}
                  </Stack>
                </CardBody>
                <div className=" text-center mt-10  ">
                  <CreateUserAddress />
                </div>
              </div>
            )}
          </div>
        </Card>
      </section>
      <Footer />
    </div>
  );
};

export default UserAddress;
