import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  RadioGroup,
  Stack,
  Radio,
  Alert,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";

const CancelUserOrder = ({ status, handleSubmit, errorMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
  };

  return (
    <>
      {status !== "Waiting For Payment" ? null : (
        <Button colorScheme="red" onClick={onOpen}>
          Cancel Order
        </Button>
      )}

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInRight"
        size={["full", "xl"]}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select a reason for cancellation</ModalHeader>
          <ModalCloseButton onClick={(e) => handleClose(reason)} />
          {errorMessage ? (
            <Alert status="error" mb="2" mt="2">
              <AlertIcon />
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          ) : (
            <Text fontSize="xs" bg="orange.100" px="6">
              Please select a reason for cancellation, your order will be
              canceled immediately after the reason for cancellation is
              submitted
            </Text>
          )}

          <ModalBody mt="5" mb="3">
            <RadioGroup onChange={(e) => setReason(e)}>
              <Stack direction="column">
                <Radio
                  colorScheme="red"
                  value="i want to change the shipping address"
                >
                  I want to change the shipping address
                </Radio>
                <Radio colorScheme="red" value="i can't make a payment">
                  I can't make a payment
                </Radio>
                <Radio
                  colorScheme="red"
                  value="wrong order /  i want to make a new order"
                >
                  Wrong order / I want to make a new order
                </Radio>
                <Radio colorScheme="red" value="other">
                  Other
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              isDisabled={!reason}
              onClick={(e) => handleSubmit(reason, onClose)}
              colorScheme="red"
              w="full"
              variant="solid"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CancelUserOrder;
