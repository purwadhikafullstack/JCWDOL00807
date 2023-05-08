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
  Image
} from "@chakra-ui/react";
import React, { useEffect } from "react";

import PropTypes from "prop-types";

export default function ImagePreviewModal({ imageUrl, handleClose, title }) {
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
            <Image src={imageUrl} m="0 auto" w="full" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
