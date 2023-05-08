import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";

const AlertSuccess = ({ title, body, handleClick }) => {
  return (
    <Alert
      status="success"
      variant="subtle"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      height="120px"
      rounded="6px"
    >
      <CloseButton
        alignSelf="flex-end"
        position="relative"
        right={1}
        top={1}
        onClick={(e) => handleClick("yuhu")}
      />
      <AlertIcon boxSize="40px" mr={0} mt={-6} />
      <AlertTitle mt={4} mb={1} fontSize={["sm", "lg"]}>
        {title}
      </AlertTitle>
      <AlertDescription maxWidth="s">{body}</AlertDescription>
    </Alert>
  );
};

export default AlertSuccess;
