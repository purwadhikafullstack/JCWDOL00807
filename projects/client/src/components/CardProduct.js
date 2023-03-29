import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
  Image,
} from "@chakra-ui/react";

const CardProduct = ({
  discountPersentage,
  image,
  name,
  description,
  price,
  priceAfterDiscount,
  discount_type,
}) => {
  return (
    <Card w="xs" h="420px" rounded="lg">
      <CardBody>
        {discount_type === "discount tanpa ketentuan persentage" ? (
          <Button
            size="xs"
            bgColor="#DF2E38"
            mr="2"
            color="white"
            fontWeight="bold"
            disabled
            rounded="sm"
            mb="2"
          >
            {discountPersentage}
          </Button>
        ) : discount_type === "discount Bogo" ? (
          <Button
            size="xs"
            bgColor="#DF2E38"
            mr="2"
            color="white"
            fontWeight="bold"
            disabled
            rounded="sm"
            mb="2"
          >
            Buy one get one free!!
          </Button>
        ) : (
          <Button
            size="xs"
            disabled
            rounded="sm"
            mb="6"
            variant="link"
          ></Button>
        )}

        <div className=" flex flex-col items-center">
          <Image
            src={image}
            alt={name}
            borderRadius="md"
            height="140px"
            objectFit="cover"
          />

          <Stack mt="6" spacing="3">
            <Heading size="sm">{name}</Heading>

            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>

            <div className="flex gap-4">
              {priceAfterDiscount ? (
                discount_type === "discount Bogo" ? (
                  <>
                    <Text color="#F99417" fontSize="sm" fontWeight="bold">
                      Rp. {price.toLocaleString()}
                    </Text>
                  </>
                ) : (
                  <>
                    <Text
                      color="gray.500"
                      fontSize="sm"
                      as="del"
                      fontWeight="semibold"
                    >
                      Rp. {price.toLocaleString()}
                    </Text>
                    <Text color="#F99417" fontSize="sm" fontWeight="bold">
                      Rp. {priceAfterDiscount.toLocaleString()}
                    </Text>
                  </>
                )
              ) : (
                <>
                  <Text color="#F99417" fontSize="sm" fontWeight="bold">
                    Rp. {price.toLocaleString()}
                  </Text>
                </>
              )}
            </div>
          </Stack>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <ButtonGroup spacing="2">
          <Button
            variant="solid"
            colorScheme="gray"
            rounded="md"
            bgColor="#DEF5E5"
            size="sm"
          >
            Buy now
          </Button>
          <Button
            variant="ghost"
            color="gray.600"
            fontWeight="semibold"
            size="sm"
          >
            Add to cart
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};

export default CardProduct;
