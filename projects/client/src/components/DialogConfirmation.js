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
  ButtonGroup,
} from "@chakra-ui/react";
import React, { useEffect } from "react";

import PropTypes from "prop-types";

export default function DialogConfirmation({
  message,
  handleYes,
  handleNo,
  btnTitleYes,
  btnTitleNo,
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
            <ButtonGroup gap="4">
              {handleNo && (
                <Button colorScheme="red" onClick={handleNo}>
                  {btnTitleNo}
                </Button>
              )}
              {handleYes && (
                <Button colorScheme="green" onClick={handleYes}>
                  {btnTitleYes}
                </Button>
              )}
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

DialogConfirmation.propTypes = {
  message: PropTypes.string,
  handleYes: PropTypes.func,
  btnTitleYes: PropTypes.string,
  btnTitleNo: PropTypes.string,
  handleNo: PropTypes.func,
  handleClose: PropTypes.func,
  title: PropTypes.string,
};

DialogConfirmation.defaultProps = {
  btnTitleYes: "Yes, Sure!",
  btnTitleNo: "No, Thanks!",
};
