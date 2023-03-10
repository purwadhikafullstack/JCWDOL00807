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

export default function BackdropResetPassword({ message, handleConfirm }) {
  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  useEffect(() => {
    setOverlay(<OverlayOne />);
    onOpen();
  }, []);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [overlay, setOverlay] = React.useState(<OverlayOne />);

  return (
    <>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>{message}</Text>
          </ModalBody>
          <ModalFooter>
            {handleConfirm ? (
              <Link to="/">
                <Button onClick={() => handleConfirm()}>sure</Button>
              </Link>
            ) : (
              <Link to="/">
                <Button onClick={onClose}>close</Button>
              </Link>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
