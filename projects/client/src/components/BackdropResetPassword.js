import {
  Button,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalBody,
  Modal,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function BackdropResetPassword({
  message,
  handleConfirm,
  handleClose,
  title,
}) {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  useEffect(() => {
    setOverlay(<OverlayOne />);
    onOpen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton onClick={handleClose} />
          <ModalBody>
            <Text>{message}</Text>
          </ModalBody>
          <ModalFooter>
            {handleConfirm ? (
              <Button onClick={handleConfirm}>sure</Button>
            ) : (
              <Button onClick={handleClose}>close</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
