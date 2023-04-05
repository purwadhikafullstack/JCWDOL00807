import { Button, ButtonGroup, Divider, Heading, Text } from "@chakra-ui/react";

const CardProduct = ({
  discountPersentage,
  image,
  name,
  description,
  price,
  priceAfterDiscount,
  discount_type,
  status,
}) => {
  return (
    <div className="flex flex-col w-[300px] h-[480px] shadow  rounded-lg border-y border-slate-200">
      {discount_type === "Discount Tanpa Ketentuan (Persentase)" &&
      status === 1 ? (
        <Button
          size="xs"
          bgColor="#DF2E38"
          ml="6"
          color="white"
          fontWeight="bold"
          disabled
          rounded="sm"
          mt="4"
          w="fit-content"
          p="2"
        >
          {discountPersentage}
        </Button>
      ) : discount_type === "Discount Bogo" && status === 1 ? (
        <Button
          size="xs"
          bgColor="#DF2E38"
          ml="6"
          color="white"
          fontWeight="bold"
          disabled
          rounded="sm"
          mt="4"
          w="fit-content"
          p="2"
        >
          Buy one get one free!!
        </Button>
      ) : (
        <div className="mt-10"></div>
      )}
      {image ? (
        <img
          className="object-cover object-center h-[160px]   m-auto block mt-10  "
          src={image}
          alt={image}
        />
      ) : (
        <div className="h-[430px]"></div>
      )}

      <div className="px-4 py-2 bg-white  w-[300px] h-[300px] mt-5  pl-7 ">
        <Heading size="sm" h="35px" mb="3">
          {name}
        </Heading>
        <Text fontSize="sm" color="gray.600" h="40px" w="250px" mb="3">
          {description}
        </Text>

        <div className="flex gap-4">
          {priceAfterDiscount ? (
            discount_type === "Discount Bogo" ? (
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
      </div>
      <Divider />
      <div>
        <ButtonGroup spacing="2" m="5">
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
      </div>
    </div>
  );
};

export default CardProduct;
