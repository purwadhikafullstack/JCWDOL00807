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
  FormControl,
  Switch,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { updateUserAddress } from "../redux/action/userAddress";
import { handleStateError } from "../redux/action/userAddress";
import { deleteUserAddress } from "../redux/action/userAddress";
import BackdropResetPassword from "./BackdropResetPassword";
import { Icon } from "@iconify/react";

const UpdateUserAddress = ({ id, data, defaultAddress }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const api = process.env.REACT_APP_API_BASE_URL;

  let userAddress = useSelector((state) => state.address);
  let dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [dataProvince, setDataProvince] = useState([]);
  const [dataCity, setDataCity] = useState([]);
  const [dataAddress, setDataAddress] = useState({});
  const [inputStreetAddress, setInputStreetAddress] = useState("");
  const [inputRecipient, setInputRecipient] = useState("");
  const [inputPostalCode, setInputPostalCode] = useState("");
  const [inputPhoneNumber, setInputPhoneNumber] = useState("");
  const [errPhone, setErrorPhone] = useState("");
  const [previousData, setPreviousData] = useState({});
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(false);
  const [messageDelete, setMessageDelete] = useState("");
  const [messageConfirmPrimaryAddress, setMessageConfirmPrimaryAddress] =
    useState("");

  const onBtnOpen = () => {
    setPreviousData(data);
    setDataAddress({
      city: data.city,
      province: data.province,
      postalCode: data.postal_code,
      coordinat: { lat: data.latitude, lng: data.longitude },
    });
    setInputPostalCode(data.postal_code);
    setInputRecipient(data.recipient);
    setInputPhoneNumber(data.recipients_phone);
    setInputStreetAddress(data.street_address);
    setIsPrimaryAddress(data.isDefault);
    onOpen();
  };

  const getProvince = async () => {
    try {
      let dataProvince = await axios.get(`${api}/raja-ongkir/province`, {
        headers: {
          key: "acf1fedfe40de47e566d66c32ae45cf3",
        },
      });
      setDataProvince(dataProvince.data.data.rajaongkir.province);
    } catch (error) {
      console.log(error);
    }
  };

  const getCity = async (e) => {
    try {
      setDataAddress("");
      setInputPostalCode("");
      setInputStreetAddress("");
      let province_id = e.target.value;
      let dataCity = await axios.get(
        `${api}/raja-ongkir/city?province_id=${province_id}`,
        {
          headers: {
            key: "acf1fedfe40de47e566d66c32ae45cf3",
          },
        }
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
      // console.log(response.data.message);
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

  useEffect(() => {
    getProvince();
    //eslint-disable-next-line
  }, []);

  const handlePhoneNumber = (e) => {
    const regxPhoneNumber =
      //eslint-disable-next-line
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    if (regxPhoneNumber.test(e) === false) {
      setErrorPhone("Phone number is invalid");
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
        setMessage("Data not complete");
      } else if (errPhone) {
        setMessage("Phone number is invalid");
      } else {
        try {
          setMessage("");
          const formData = {
            street_address: inputStreetAddress,
            city: dataAddress.city,
            province: dataAddress.province,
            postal_code: inputPostalCode,
            country: "indonesia",
            latitude: dataAddress?.coordinat?.lat,
            longitude: dataAddress?.coordinat?.lng,
            recipient: inputRecipient,
            recipients_phone: inputPhoneNumber,
            isDefault: isPrimaryAddress,
          };
          const id_address = id;
          // console.log(formData);
          // console.log(previousData);
          dispatch(updateUserAddress({ formData }, { id_address }));
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

  const handleRemoveAddress = () => {
    setMessageDelete("Are you sure want to delete your address");
  };

  const handleConfirm = () => {
    setMessageDelete("");
    const id_address = id;
    dispatch(deleteUserAddress({ id_address }));
  };

  const handleClose = () => {
    setMessageDelete("");
  };

  const onBtnClose = () => {
    dispatch(handleStateError("cancel"));
    setDataAddress({
      city: data.city,
      province: data.province,
      postalCode: data.postal_code,
      coordinat: { lat: data.latitude, lng: data.longitude },
    });
    setInputPostalCode(data.postal_code);
    setInputRecipient(data.recipient);
    setInputPhoneNumber(data.recipients_phone);
    setInputStreetAddress(data.street_address);
    setIsPrimaryAddress(data.isDefault);

    setErrorPhone("");
    setMessage("");
    onClose();
  };

  const handleConfirmPrimaryAddress = () => {
    setMessageConfirmPrimaryAddress(
      `Are you sure want to proceed this action. Keep in mind that it will change both your shopping cart and shipping destination.`
    );
  };

  const handleChangePrimaryAddress = () => {
    setMessageConfirmPrimaryAddress("");
    setIsPrimaryAddress(true);
  };

  return (
    <>
      {" "}
      {defaultAddress ? (
        <>
          {" "}
          <Button leftIcon="" size="sm" variant="solid" onClick={onBtnOpen}>
            <div className=" flex gap-1">
              <Icon icon="fluent:calendar-edit-16-regular" />
              Edit
            </div>
          </Button>
        </>
      ) : (
        <>
          <Button colorScheme="whatsapp" variant="link" onClick={onBtnOpen}>
            <div className=" flex gap-1">
              <Icon icon="fluent:calendar-edit-16-regular" />
              Edit
            </div>
          </Button>
        </>
      )}
      <Drawer
        size={["full", "md"]}
        isOpen={isOpen}
        placement="right"
        onClose={onBtnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Change Address</DrawerHeader>
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
                    className=" w-[full] md:w-[500px]  "
                    onChange={(e) => setInputRecipient(e.target.value)}
                    defaultValue={previousData.recipient}
                    // placeholder={previousData.recipient}
                  />
                </Box>
                <Box>
                  <FormLabel htmlFor="phone_number">Phone Number</FormLabel>
                  <Input
                    defaultValue={previousData.recipients_phone}
                    className=" w-[full] md:w-[500px]  "
                    // placeholder={previousData.recipients_phone}
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
                <Box className="grid grid-cols-2 gap-3">
                  <Box>
                    <FormLabel htmlFor="province">Province</FormLabel>
                    <Select
                      // defaultValue={previousData.province}
                      className=" w-[full] md:w-[500px]  "
                      defaultValue={dataAddress.province}
                      placeholder={dataAddress.province}
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

                  <Box>
                    <FormLabel htmlFor="city">City</FormLabel>
                    <Select
                      className=" w-[full] md:w-[500px]  "
                      defaultValue={dataAddress.city}
                      placeholder={dataAddress.city}
                      onChange={(e) => dataToSend(e.target.value)}
                    >
                      {dataCity.map((val, idx) => (
                        <option
                          key={idx.toLocaleString()}
                          value={[val.province, val.city_name, val.postal_code]}
                        >
                          {val.type} {val.city_name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </Box>
                <Box className="">
                  <Box>
                    <FormLabel htmlFor="streetAddress">
                      Street Address
                    </FormLabel>
                    <Textarea
                      id="streetAddress"
                      defaultValue={inputStreetAddress}
                      value={inputStreetAddress}
                      // placeholder={inputStreetAddress}
                      onChange={(e) => setInputStreetAddress(e.target.value)}
                    />
                  </Box>

                  <Box>
                    <FormLabel htmlFor="postalCode">Postal Code</FormLabel>
                    <Input
                      size="lg"
                      // defaultValue={inputPostalCode}
                      placeholder={inputPostalCode}
                      onChange={(e) => setInputPostalCode(e.target.value)}
                    />
                  </Box>
                </Box>

                <Box>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <Input
                    className=" w-[full] md:w-[500px]  "
                    placeholder="Indonesia"
                    defaultValue="Indonesia"
                    disabled
                  />
                </Box>
              </Box>

              {previousData.isDefault ? (
                <Box>
                  <FormControl className=" flex ">
                    <FormLabel htmlFor="isPrimaryAddress">
                      set as the primary address
                    </FormLabel>
                    <Switch
                      isChecked={isPrimaryAddress}
                      disabled
                      onChange={() => setIsPrimaryAddress(!isPrimaryAddress)}
                    />
                  </FormControl>
                </Box>
              ) : (
                <Box>
                  <FormControl className=" flex ">
                    <FormLabel htmlFor="isPrimaryAddress">
                      set as the primary address
                    </FormLabel>
                    <Switch
                      colorScheme="whatsapp"
                      onChange={handleConfirmPrimaryAddress}
                      // onChange={() => setIsPrimaryAddress(!isPrimaryAddress)}
                    />
                  </FormControl>
                </Box>
              )}
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Box className=" w-full">
              <Button
                variant="outline"
                colorScheme="red"
                mr={3}
                onClick={handleRemoveAddress}
              >
                <div className="flex gap-1 md:gap-3 items-center">
                  <Icon icon="ph:trash-simple-thin" className="text-lg" />
                  Remove Address
                </div>
              </Button>
            </Box>
            <Button variant="outline" mr={[1, 3]} onClick={onBtnClose}>
              Cancel
            </Button>
            <Button colorScheme="whatsapp" onClick={handleUpdateAddress}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {messageDelete ? (
        <BackdropResetPassword
          message={messageDelete}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
        />
      ) : null}
      {messageConfirmPrimaryAddress ? (
        <BackdropResetPassword
          message={messageConfirmPrimaryAddress}
          handleConfirm={handleChangePrimaryAddress}
          handleClose={handleClose}
        />
      ) : null}
    </>
  );
};

export default UpdateUserAddress;
