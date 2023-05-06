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
  Image,
  Alert,
  AlertIcon,
  AlertTitle,
  useDisclosure,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRef } from "react";
import { updateProfile } from "../redux/action/user";
import { handleStateError } from "../redux/action/user";
import moment from "moment";

const UpdateUserProfile = ({ tabel }) => {
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
  const [errBirthdate, setErrBirthdate] = useState("");
  const [errName, setErrName] = useState("");

  let dispatch = useDispatch();

  const handleUpdateProfile = async () => {
    let regxEmail = /\S+@\S+\.\S+/;
    try {
      let inputName = name.current.value;
      let inputBirthdate = date;
      let inputGender = gender.current.value;
      let inputEmail = email.current.value;

      if (regxEmail.test(inputEmail) === false) {
        return setMessage("not valid email");
      } else if (!message && !errBirthdate) {
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user?.user.birthdate) {
      setdate(user.user.birthdate);
    }
    if (user.errorMessage) {
      setMessage(user.errorMessage);
    } else {
      setMessage("");
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const onBtnClose = () => {
    dispatch(handleStateError("cancel"));
    onClose();
    setErrBirthdate("");
    setErrName("");
  };

  const onBtnAddFile = (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 1000000) {
        setMessage("Sorry, the image size cannot exceed 1MB.");
      } else {
        setMessage("");
        setAddFile(e.target.files[0]);
        let preview = document.getElementById("imgprev");
        preview.src = URL.createObjectURL(e.target.files[0]);
      }
    }
  };

  const updateBirthDate = (e) => {
    const date = moment(new Date());
    if (new Date(e) > new Date()) {
      setMessage("The date you selected is invalid");
      setErrBirthdate(
        `The birthdate format entered must be before ${date.format(
          "DD MMMM YYYY"
        )}`
      );
    } else {
      setErrBirthdate("");
      setMessage("");
      setdate(e);
    }
  };

  const updateName = (e) => {
    if (e < 1) {
      setErrName("Your name is required. Please fill in the field.");
    } else {
      setErrName("");
    }
  };

  return (
    <>
      {tabel === true ? (
        <Button
          size="sm"
          variant="link"
          colorScheme="red"
          onClick={onOpen}
          w="fit-content"
        >
          Update Profile
        </Button>
      ) : (
        <Button colorScheme="gray" bgColor="#BCEAD5" onClick={onOpen}>
          Update Profile
        </Button>
      )}

      <Drawer
        size={["full", "md"]}
        isOpen={isOpen}
        placement="right"
        onClose={onBtnClose}
      >
        <DrawerOverlay />
        <DrawerContent>
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
              <Image m="0 auto" id="imgprev" w="full" />
              <Box>
                <FormControl>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    // value={name}
                    placeholder={user?.user.name}
                    ref={name}
                    defaultValue={user?.user.name}
                    onChange={(e) => updateName(e.target.value)}
                  />
                  {errName ? (
                    <FormHelperText color="red">{errName}</FormHelperText>
                  ) : null}
                </FormControl>
              </Box>

              <Box>
                <FormControl>
                  <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
                  <Input
                    value={date}
                    size="md"
                    type="date"
                    onChange={(e) => updateBirthDate(e.target.value)}
                  />
                  {errBirthdate ? (
                    <FormHelperText color="red">{errBirthdate}</FormHelperText>
                  ) : null}
                </FormControl>
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
                  accept="image/png,image/jpg,image/gif"
                  onChange={onBtnAddFile}
                />
              </Box>
            </Stack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" mr={3} onClick={onBtnClose}>
              Cancel
            </Button>
            <Button colorScheme="whatsapp" onClick={handleUpdateProfile}>
              Submit
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default UpdateUserProfile;
