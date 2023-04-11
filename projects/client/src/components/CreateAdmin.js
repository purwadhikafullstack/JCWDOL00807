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
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  createAdminByRole,
  updateAdminByRole,
  getBranchStore,
} from "../redux/action/admin";

const CreateAdmin = ({
  title,
  buttonName,
  icon,
  action,
  tooltip,
  data,
  admin_id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [err, setErr] = useState("");
  const [errName, setErrName] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [errRole, setErrRole] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [errIsActive, setErrIsActive] = useState("");
  const [errBranchStoreName, setErrBranchStoreName] = useState("");

  const [message, setMessage] = useState("");
  const [item, setItem] = useState({});
  const dispatch = useDispatch();

  let { branchStore, errorMessage } = useSelector((state) => state.admin);

  useEffect(() => {
    if (data) {
      setItem({
        name: data.name,
        email: data.email,
        role: data.role,
        password: "",
        isActive: data.isActive ? "1" : "0",
        branch_stores_id: data.branch_stores_id,
      });
    }
    // dispatch(getBranchStore());
    if (isOpen) {
      console.log(item);
      dispatch(getBranchStore());
    }
    //eslint-disable-next-line
  }, [navigate, isOpen]);

  useEffect(() => {
    if (errorMessage !== null) {
      setMessage();
    }
  }, [errorMessage]);

  const btnOpen = () => {
    setErr("Input require");
    onOpen();
  };

  const onBtnClose = () => {
    onClose();
    setMessage("");
    setItem({});
  };

  const handleSubmit = async () => {
    debugger;
    try {
      console.log(item)
      if (!item.name) {
        setMessage("Name is required ");
      } else if (!item.email) {
        setMessage("Email is required ");
      } else if (!item.role) {
        setMessage("Role is required ");
      } else if (!item.isActive) {
        setMessage("IsActive is required");
      } else if (!item.password) {
        setMessage("Password is required");
      } else if (!item.branch_stores_id) {
        setMessage("Branch Store Name required")
      } else {
        setMessage("");
        if (action === "create") {
          const data = item;
          const response = await dispatch(createAdminByRole(data));
          const { status } = response;
          if (status === 200) {
            onClose()
            window.location.reload()
          } else {
            const { message } = response.data
            setMessage(message)
          }
        } else if (action === "update") {
          // debugger;
          const data = item;
          const response = await dispatch(updateAdminByRole(data, admin_id));
          const { status } = response;
          if (status === 200) {
            onClose()
            
          } else {
            const { message } = response.data
            setMessage(message)
          }
        }
      }
      console.log(item);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  const onChangeName = (e) => {
    setItem({ ...item, name: e.target.value });
    if (e.target.value.length === 0) {
      setErrName("Name is Required");
    } else {
      setErrName("");
    }
  };

  const onChangeEmail = (e) => {
    setItem({ ...item, email: e.target.value });
    if (e.target.value.length === 0) {
      setErrEmail("Email is Required");
    } else {
      setErrEmail("");
    }
  };

  const onChangeRole = (e) => {
    setItem({ ...item, role: e.target.value });
    if (e.target.value.length === 0) {
      setErrRole("Role is Required");
    } else {
      setErrRole("");
    }
  };
  const onChangePassword = (e) => {
    setItem({ ...item, password: e.target.value });
    if (e.target.value.length === 0) {
      setErrPassword("Password is Required");
    } else {
      setErrPassword("");
    }
  };
  const onChangeIsActiveError = (e) => {
    setItem({ ...item, isActive: e.target.value });
    if (e.target.value.length === 0) {
      setErrIsActive("isActive is Required");
    } else {
      setErrIsActive("");
    }
  };
  const onChangeBranchStoreName = (e) => {
    setItem({ ...item, branch_stores_id: e.target.value });
    if (e.target.value.length === 0) {
      setErrBranchStoreName("Branch Store Name is Required");
    } else {
      setErrBranchStoreName("");
    }
    console.log(item)
  };

  const isError = err !== "";
  const isNameError = errName !== "";
  const isEmailError = errEmail !== "";
  const isRoleError = errRole !== "";
  const isPasswordError = errPassword !== "";
  const isIsActiveError = errIsActive !== "";
  const isBranchStoreNameError = errBranchStoreName !== "";

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
                <FormControl isInvalid={isNameError}>
                  <FormLabel htmlFor="name">Admin Name</FormLabel>
                  <Input
                    onChange={(e) => onChangeName(e)}
                    placeholder="Type here ..."
                    colorScheme="red"
                    value={item.name}
                  />
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                </FormControl>

                <FormControl isInvalid={isEmailError}>
                  <FormLabel htmlFor="name">Email</FormLabel>
                  <Input
                    value={item.email}
                    onChange={(e) => onChangeEmail(e)}
                    placeholder="Type here ..."
                    colorScheme="red"
                  />
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                </FormControl>

                {/* <FormControl isInvalid={isError}> */}
                {/* <FormLabel htmlFor="name">Role</FormLabel>
                  <Input
                    value= {item.role}
                    onChange={(e) => setItem({...item, role: e.target.value})}
                    placeholder="Type here ..."
                    colorScheme="red"
                  /> */}
                {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                {/* </FormControl> */}

                <FormControl isInvalid={isRoleError}>
                  <FormLabel htmlFor="name">Role</FormLabel>
                  <Select
                    value={item.role}
                    onChange={(e) => onChangeRole(e)}
                    placeholder="Select an option"
                    colorScheme="red"
                  >
                    <option value="admin branch">Admin Branch</option>
                  </Select>
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                </FormControl>

                <FormControl isInvalid={isPasswordError}>
                  <FormLabel htmlFor="name">Password</FormLabel>
                  <Input
                    value={item.password}
                    onChange={(e) => onChangePassword(e)}
                    placeholder="Type here ..."
                    colorScheme="red"
                  />
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                </FormControl>

                <FormControl isInvalid={isIsActiveError}>
                  <FormLabel htmlFor="name">isActive</FormLabel>
                  <Select
                    value={item.isActive}
                    onChange={(e) => onChangeIsActiveError(e)}
                    placeholder="Select an option"
                    colorScheme="red"
                  >
                    <option value="1">Active</option>
                    <option value="0">Not Active</option>
                  </Select>
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
                </FormControl>

                <FormControl isInvalid={isBranchStoreNameError}>
                  <FormLabel htmlFor="name">Branch Store Name</FormLabel>
                  <Select
                    value={item.branch_stores_id}
                    onChange={(e) => onChangeBranchStoreName(e)}
                    placeholder="Select an option"
                    colorScheme="red"
                  >
                    {branchStore?.map((val, idx) => (
                      <option value={val.id}>{val.name}</option>
                    ))}
                  </Select>
                  {/* {!isError ? null : <FormErrorMessage>{err}</FormErrorMessage>} */}
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
              onClick={(e) => handleSubmit()}
            >
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default CreateAdmin;
