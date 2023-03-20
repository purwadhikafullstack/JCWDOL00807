import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Stack,
  Select,
  DrawerFooter,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { createUserAddress } from "../redux/action/userAddress";
import { handleStateError } from "../redux/action/userAddress";
import { Icon } from "@iconify/react";

const CreateUserAddress = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const api = process.env.REACT_APP_API_BASE_URL;
  let user = useSelector((state) => state.auth);
  let userAddress = useSelector((state) => state.address);
  let dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataAddress, setDataAddress] = useState({});
  const [inputStreetAddress, setInputStreetAddress] = useState("");
  const [inputRecipient, setInputRecipient] = useState("");
  const [inputPostalCode, setInputPostalCode] = useState(
    dataAddress.postalCode
  );
  const [inputPhoneNumber, setInputPhoneNumber] = useState("");
  const [errPhone, setErrorPhone] = useState("");

  const getProvince = async () => {
    try {
      let dataProvince = await axios.get(`${api}/raja-ongkir/province`);
      setDataProvince(dataProvince.data.data.rajaongkir.province);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProvince();
    //eslint-disable-next-line
  }, []);
  const getCity = async (e) => {
    try {
      let province_id = e.target.value;
      let dataCity = await axios.get(
        `${api}/raja-ongkir/city?province_id=${province_id}`
      );
      setDataCity(dataCity.data.data.rajaongkir.city);
    } catch (error) {
      console.log(error);
    }
  };

  const dataToSend = async (event) => {
    try {
      const dataSelected = event.split(",");
      setInputPostalCode(dataSelected[2]);
      const response = await axios.get(
        `${api}/geo-location/coordinate?city=${dataSelected[1]}&province=${dataSelected[0]}&country=indonesia`
      );
      const coordinat = response.data.data;
      setDataAddress({
        city: dataSelected[1],
        province: dataSelected[0],
        postalCode: dataSelected[2],
        coordinat: coordinat,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePhoneNumber = (e) => {
    const regxPhoneNumber =
      //eslint-disable-next-line
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (regxPhoneNumber.test(e) === false) {
      setErrorPhone("not valid phone number");
    } else {
      setErrorPhone("");
      setInputPhoneNumber(e);
    }
  };

  const handleUpdateAddress = async () => {
    try {
      if (
        !dataAddress.province ||
        !inputRecipient ||
        !inputStreetAddress ||
        !inputPostalCode ||
        !inputPhoneNumber
      ) {
        setMessage("data not complete");
      } else {
        try {
          setMessage("");
          const formData = {
            street_address: inputStreetAddress,
            city: dataAddress.city,
            province: dataAddress.province,
            postal_code: inputPostalCode,
            country: "indonesia",
            latitude: dataAddress.coordinat.lat,
            longitude: dataAddress.coordinat.lng,
            recipient: inputRecipient,
            recipients_phone: inputPhoneNumber,
          };

          dispatch(createUserAddress({ formData }));
        } catch (error) {
          setMessage(error.response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userAddress.errorMessage) {
      setMessage(userAddress.errorMessage);
    } else {
      setMessage("");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAddress]);

  const onBtnClose = () => {
    dispatch(handleStateError("cancel"));
    setInputPostalCode("");
    setInputPhoneNumber("");
    setDataAddress("");
    setInputStreetAddress("");
    setDataCity([]);
    onClose();
  };

  return (
    <>
      <Button
        leftIcon=""
        colorScheme="whatsapp"
        variant="link"
        onClick={onOpen}
      >
        <Icon className=" text-lg mr-1" icon="gridicons:create" />
        Create New Address
      </Button>

      <Drawer
        size={["full", "md"]}
        isOpen={isOpen}
        placement="right"
        onClose={onBtnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Create New Address
          </DrawerHeader>
          <DrawerBody>
            {message ? (
              <div>
                <Alert status="error" mb="6" mt="2">
                  <AlertIcon />
                  <AlertTitle>{message}</AlertTitle>
                </Alert>
              </div>
            ) : null}
            <Stack spacing="24px">
              <Box className=" flex flex-col gap-2 mb-7">
                <Text className=" text-xl font-semibold  mb-3  ">Contact</Text>
                <Box>
                  <FormLabel htmlFor="recipient">Recipient</FormLabel>
                  <Input
                    onChange={(e) => setInputRecipient(e.target.value)}
                    placeholder="exp Jane Doe"
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                  <Input
                    placeholder={`exp ${user?.user?.phone_number}`}
                    size="md"
                    onChange={(e) => {
                      handlePhoneNumber(e.target.value);
                    }}
                  />
                  <Text className=" text-xs text-rose-500">{errPhone}</Text>
                </Box>
              </Box>

              <Box className=" flex flex-col gap-2 mb-">
                <Text className=" text-xl font-semibold  mb-3  ">Address</Text>
                <Box className="grid grid-cols-2 gap-2 ">
                  <Box>
                    <FormLabel htmlFor="province">Province</FormLabel>
                    <Select
                      placeholder="Select Province"
                      onChange={(e) => getCity(e)}
                    >
                      {dataProvince.map((val, idx) => (
                        <option
                          key={idx.toLocaleString()}
                          value={val.province_id}
                        >
                          {val.province}
                        </option>
                      ))}
                    </Select>
                  </Box>
                  {dataCity.length === 0 ? null : (
                    <Box>
                      <FormLabel htmlFor="city">City</FormLabel>
                      <Select
                        placeholder="Select City"
                        onChange={(e) => dataToSend(e.target.value)}
                      >
                        {dataCity.map((val, idx) => (
                          <option
                            key={idx.toLocaleString()}
                            value={[
                              val.province,
                              val.city_name,
                              val.postal_code,
                            ]}
                          >
                            {val.type} {val.city_name}
                          </option>
                        ))}
                      </Select>
                    </Box>
                  )}
                </Box>
                <Box>
                  <Box>
                    <FormLabel htmlFor="streetAddress">
                      Street Address
                    </FormLabel>
                    <Textarea
                      id="streetAddress"
                      onChange={(e) => setInputStreetAddress(e.target.value)}
                    />
                  </Box>
                  {!inputPostalCode ? null : (
                    <Box>
                      <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                      <Input
                        w="fit-content"
                        placeholder={inputPostalCode}
                        onChange={(e) => setInputPostalCode(e.target.value)}
                      />
                    </Box>
                  )}
                </Box>

                <Box>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <Input
                    placeholder="Indonesia"
                    defaultValue="Indonesia"
                    disabled
                  />
                </Box>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onBtnClose}>
              Cancel
            </Button>
            <Button colorScheme="whatsapp" onClick={handleUpdateAddress}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateUserAddress;
