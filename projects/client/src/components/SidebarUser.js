import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Text,
  Avatar,
  Tooltip,
  Button,
} from "@chakra-ui/react";

import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import BackdropResetPassword from "../components/BackdropResetPassword";
import axios from "axios";
import { keepLogin } from "../redux/action/user";
import { Link } from "react-router-dom";

const SidebarUser = () => {
  const dispatch = useDispatch();
  let user = useSelector((state) => state.auth.user);
  const [messageDelete, setMessageDelete] = useState("");

  const handleClose = () => {
    setMessageDelete("");
  };

  const handleDeleteImages = () => {
    if (user?.image) {
      setMessageDelete("are you sure want to delete your profile");
    }
  };
  const handleConfirm = async () => {
    let token = localStorage.my_Token;
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/user/delete-photo-profile`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );
      dispatch(keepLogin());
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user?.image) {
      setMessageDelete("");
    }
  }, [user]);

  return (
    <section>
      <Card className="  flex flex-col justify-center w-screen md:w-[300px] min-h-fit  md:h-[800px]  pt-10 items-center  ">
        <CardHeader className="flex flex-col items-center gap-5">
          {user?.image ? (
            <Tooltip label="Delete Profile" size="xs">
              <Avatar
                onClick={handleDeleteImages}
                size="xl"
                src={user?.image}
              />
            </Tooltip>
          ) : (
            <Avatar onClick={handleDeleteImages} size="xl" src={user?.image} />
          )}

          <Text fontSize="xl" fontWeight="bold">
            {user?.name}
          </Text>
        </CardHeader>

        <CardBody className=" flex flex-col  gap-3 md:gap-14 w-full md:h-screen rounded-none md:rounded-lg ">
          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl " icon="line-md:account-small" />
            <Box className=" flex flex-col">
              <Text fontWeight="bold" size="sm">
                My Account
              </Text>

              <Link to="/accounts/profile">
                <Button variant="link" pt="2" fontSize="sm">
                  My Profile
                </Button>
              </Link>
              <Link to="/accounts/change-password">
                <Button variant="link" pt="2" fontSize="sm">
                  Change My Password
                </Button>
              </Link>

              <Link to="/accounts/address">
                <Button variant="link" pt="2" fontSize="sm">
                  Change My Address
                </Button>
              </Link>
            </Box>
          </Box>

          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl" icon="ant-design:form-outlined" />
            <Box>
              <Text fontWeight="bold" size="sm">
                My Order
              </Text>
              <Text pt="2" fontSize="sm">
                History Order
              </Text>
              <Link to="/accounts/order-list">
                <Button variant="link" pt="2" fontSize="sm">
                  Order List
                </Button>
              </Link>
            </Box>
          </Box>
          <Box className="flex flex-row gap-3 ">
            <Icon className=" text-2xl " icon="ri:hand-heart-line" />
            <div>
              <Text fontWeight="bold" size="sm">
                Referal Code
              </Text>
              <Text pt="2" fontSize="sm">
                {user?.referral_code}
              </Text>
            </div>
          </Box>
        </CardBody>
      </Card>

      {messageDelete ? (
        <BackdropResetPassword
          message={messageDelete}
          handleConfirm={handleConfirm}
          handleClose={handleClose}
        />
      ) : null}
    </section>
  );
};

export default SidebarUser;
