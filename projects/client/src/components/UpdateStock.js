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
  DrawerFooter,
  Alert,
  AlertIcon,
  AlertTitle,
  useDisclosure,
  FormErrorMessage,
  FormControl,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import axios from "axios";
import BackdropResetPassword from "./BackdropResetPassword";
import Swal from "sweetalert2";

const UpdateStock = ({ id_product, name_product, stock, getProductList }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");
  const [newStock, setNewStock] = useState("");
  const [description, setDescription] = useState("");
  const [remove, setRemove] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [confirmUpdate, setConfirmUpdate] = useState("");
  const [afterAdjusment, setAfterAdjusment] = useState("");
  const toast = useToast();
  const isError = err !== "";

  useEffect(() => {
    const token = localStorage.getItem("my_Token");
    if (!token) {
      navigate("/login");
    }
    //eslint-disable-next-line
  }, []);

  const btnOpen = () => {
    onOpen();
  };

  const handleInput = (event) => {
    if (!event) {
      setErr("Reason field is require for stock history lock");
    } else {
      setErr("");
      setDescription(event);
    }
  };

  const onBtnClose = () => {
    onClose();
    setMessage("");
    setDescription("");
    setNewStock("");
    setRemove(false);
    setAfterAdjusment("");
    setErr("");
  };

  const handleSubmit = async () => {
    try {
      setMessage("");
      let token = localStorage.my_Token;
      const response = await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product-stock/update/${id_product}?stock=${newStock}&description=${description}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      Swal.fire("Good Job!", `${response.data.message}`, "success");

      getProductList();
      onBtnClose();
      setRemove("");
      setConfirmUpdate("");
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleDeleteQty = async () => {
    setRemove(true);
  };

  const btnConfirm = (e) => {
    if (e === "delete") {
      if (!description) {
        setMessage("Incomplete data");
      } else {
        setMessage("");
        setConfirm(
          `Are you sure want to delete the stock ${name_product} from current quantity ${stock} to 0 ?`
        );
      }
    } else {
      if (!newStock || !description) {
        setMessage("Incomplete data");
      } else {
        setMessage("");
        setConfirmUpdate(
          `Are you sure want to update the stock ${name_product} from the current quantity of ${stock} to ${afterAdjusment} ?`
        );
      }
    }
  };

  const handleConfirm = async () => {
    try {
      setConfirm("");
      let token = localStorage.my_Token;
      let response = await axios.patch(
        `http://localhost:8000/api/admin/product-stock/delete/${id_product}?description=${description}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      getProductList();
      Swal.fire("Good Job!", `${response.data.message}`, "success");

      onClose();
      setRemove(false);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleClose = () => {
    setConfirm("");
    onClose();
  };

  const handleNewStock = (e) => {
    if (e === "") {
      setAfterAdjusment(stock);
    } else {
      setNewStock(e);
      let stockAfterAdjusment = parseInt(stock) + parseInt(e);
      setAfterAdjusment(stockAfterAdjusment);
    }
  };

  return (
    <>
      <Button size="xs" onClick={btnOpen} colorScheme="whatsapp" mr={2}>
        <Icon icon="healthicons:rdt-result-out-stock" className="text-lg" />
        Edit Stock
      </Button>

      <Drawer
        size={["full", "xs"]}
        isOpen={isOpen}
        placement="right"
        onClose={onBtnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Update Stock Product
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
            <Stack spacing="5">
              <Box className="mt-17">
                <FormLabel htmlFor="productName">Product Name</FormLabel>
                <Input
                  placeholder={name_product}
                  defaultValue={name_product}
                  colorScheme="red"
                  disabled
                  mb={10}
                />

                {remove === true ? null : (
                  <>
                    <div className=" flex  gap-4 mb-3 ">
                      <div>
                        <FormLabel htmlFor="currentStock">
                          Current Stock
                        </FormLabel>
                        <Input
                          placeholder={stock}
                          defaultValue={stock}
                          colorScheme="red"
                          disabled
                        />
                      </div>
                      <div>
                        <FormControl>
                          <FormLabel htmlFor="stock qty">Adjustment</FormLabel>
                          <NumberInput onChange={(e) => handleNewStock(e)}>
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                          <FormHelperText fontSize="xs">
                            Adjustment quantity
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <FormControl isInvalid={afterAdjusment < 0} mb={10}>
                      <FormLabel htmlFor="afterAdjusment">
                        Stock After Adjusment
                      </FormLabel>
                      <Input
                        defaultValue={afterAdjusment}
                        colorScheme="red"
                        disabled
                      />
                      {afterAdjusment < 0 ? (
                        <FormErrorMessage>
                          {"Stock cannot be negative"}
                        </FormErrorMessage>
                      ) : null}
                    </FormControl>
                  </>
                )}

                <FormControl isInvalid={isError}>
                  <FormLabel htmlFor="description">Reason</FormLabel>
                  <Input
                    onBlur={(e) => handleInput(e.target.value)}
                    placeholder="Type here ..."
                    colorScheme="red"
                  />
                  {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>}
                </FormControl>
              </Box>
            </Stack>
          </DrawerBody>
          {remove === true ? (
            <>
              <DrawerFooter borderTopWidth="1px">
                <Button variant="outline" mr={3} onClick={onBtnClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClose={onClose}
                  onClick={(e) => btnConfirm("delete")}
                >
                  Delete
                </Button>
              </DrawerFooter>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                colorScheme="red"
                mb="5"
                ml="2"
                mr="2"
                onClick={handleDeleteQty}
                isDisabled={stock === 0}
              >
                <div className="flex justify-center gap-1 items-center">
                  <Icon
                    icon="ph:trash-simple-thin"
                    className="text-lg  text-red-600"
                  />
                  Delete Qty Stock
                </div>
              </Button>

              <DrawerFooter borderTopWidth="1px">
                <Button variant="outline" mr={3} onClick={onBtnClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="whatsapp"
                  onClose={onClose}
                  // onClick={handleSubmit}
                  onClick={(e) => btnConfirm("update")}
                >
                  Submit
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      <>
        {confirm ? (
          <BackdropResetPassword
            title={"Confirm Delete Stock Product "}
            message={confirm}
            handleConfirm={handleConfirm}
            handleClose={handleClose}
          />
        ) : null}
      </>
      <>
        {confirmUpdate ? (
          <BackdropResetPassword
            title={"Confirm Update Stock Product"}
            message={confirmUpdate}
            handleConfirm={handleSubmit}
            handleClose={handleClose}
          />
        ) : null}
      </>
    </>
  );
};

export default UpdateStock;
