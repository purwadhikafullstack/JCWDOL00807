import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormLabel,
  Input,
  Stack,
  Select,
  DrawerFooter,
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { updateProfile } from "../redux/action/user";

const UpdateUserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  let name = useRef();
  let birthdate = useRef();
  let gender = useRef();
  let email = useRef();
  let image = useRef();

  let user = useSelector((state) => state.auth);

  const [date, setdate] = useState("");
  const [message, setMessage] = useState("");
  const [addFile, setAddFile] = useState("");
  let dispatch = useDispatch();

  const handleUpdateProfile = async () => {
    let regxEmail = /\S+@\S+\.\S+/;
    try {
      let inputName = name.current.value;
      let inputBirthdate = birthdate.current.value;
      let inputGender = gender.current.value;
      let inputEmail = email.current.value;

      if (regxEmail.test(inputEmail) === false) {
        return setMessage("not valid email");
      }

      let formData = new FormData();
      formData.append("images", addFile);
      formData.append("name", inputName);
      formData.append("email", inputEmail);
      formData.append("gender", inputGender);
      formData.append("birthdate", inputBirthdate);

      dispatch(
        updateProfile({
          formData,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.user.birthdate) {
      setdate(user.user.birthdate.slice(0, 10));
    }
    if (user.errorMessage) {
      setMessage(user.errorMessage);
    } else {
      setMessage("");
      onClose();
    }
  }, [user]);

  const onBtnAddFile = (e) => {
    if (e.target.files[0]) {
      setAddFile(e.target.files[0]);
      let preview = document.getElementById("imgprev");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  return (
    <>
      <Button leftIcon="" colorScheme="whatsapp" onClick={onOpen}>
        Update Profile
      </Button>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Update My Profile</DrawerHeader>

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
              <Image m="0 auto" id="imgprev" w="100px" />
              <Box>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  placeholder={user?.user.name}
                  ref={name}
                  defaultValue={user?.user.name}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
                <Input
                  value={date}
                  size="md"
                  type="date"
                  ref={birthdate}
                  onChange={(e) => {
                    setdate(e.target.value);
                  }}
                />
              </Box>

              <Box>
                <FormLabel htmlFor="gender">Gender</FormLabel>
                <Select
                  placeholder={user?.user.gender}
                  selected
                  defaultValue={user?.user.gender}
                  ref={gender}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </Select>
              </Box>
              <Box>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  type="email"
                  placeholder={user?.user.email}
                  defaultValue={user?.user.email}
                  ref={email}
                />
              </Box>
              <Box>
                <FormLabel htmlFor="profile_picture">Profile_Picture</FormLabel>
                <Input
                  type="file"
                  ref={image}
                  name="image"
                  id="image"
                  onChange={onBtnAddFile}
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleUpdateProfile}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UpdateUserProfile;