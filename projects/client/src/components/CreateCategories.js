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
  Tooltip,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "../redux/action/categoriesProduct";
import { updateCategory } from "../redux/action/categoriesProduct";

const CreateCategories = ({
  title,
  buttonName,
  icon,
  action,
  id_category,
  tooltip,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState("");
  const [err, setErr] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();

  let category = useSelector((state) => state.category);

  useEffect(() => {
    const token = localStorage.getItem("my_Token");
    if (!token) {
      navigate("/login");
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (category.errorMessage) {
      setMessage(category.errorMessage);
    } else {
      setMessage("");
      onClose();
      setCategoryName("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const btnOpen = () => {
    setErr("Input require");
    onOpen();
  };

  const handleInput = (event) => {
    if (event.length < 4) {
      setErr("Input require");
    } else {
      setErr("");
      setCategoryName(event);
    }
  };

  const onBtnClose = () => {
    onClose();
    setMessage("");
    setCategoryName("");
  };

  const handleSubmit = async () => {
    try {
      console.log(categoryName);
      if (!categoryName) {
        setMessage("Data not complete ");
      } else {
        setMessage("");
        if (action === "create") {
          dispatch(createCategory(categoryName));
          setCategoryName("");
        } else if (action === "update") {
          dispatch(updateCategory(categoryName, id_category));
          setCategoryName("");
        }
      }
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  const isError = err !== "";

  return (
    <>
      <Tooltip label={tooltip} fontSize="xs">
        <Button
          onClick={btnOpen}
          leftIcon=""
          colorScheme="whatsapp"
          variant="link"
        >
          <Icon className=" text-lg" icon={icon} />
          {buttonName}
        </Button>
      </Tooltip>

      <Drawer
        size={["full", "xs"]}
        isOpen={isOpen}
        placement="right"
        onClose={onBtnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{title}</DrawerHeader>
          <DrawerBody>
            {message ? (
              <div>
                <Alert status="error" mb="6" mt="2">
                  <AlertIcon />
                  <AlertTitle>{message}</AlertTitle>
                </Alert>
              </div>
            ) : null}
            <Stack spacing="">
              <Box className="mt-17">
                <FormControl isInvalid={isError}>
                  <FormLabel htmlFor="name">Category Name</FormLabel>
                  <Input
                    onChange={(e) => handleInput(e.target.value)}
                    placeholder="Type here ..."
                    colorScheme="red"
                  />
                  {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>}
                </FormControl>
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onBtnClose}>
              Cancel
            </Button>
            <Button
              colorScheme="whatsapp"
              onClose={onClose}
              onClick={(e) => handleSubmit({ categoryName })}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateCategories;
