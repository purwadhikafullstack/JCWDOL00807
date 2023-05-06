import { Button, ButtonGroup, Divider, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, cartList, saveCartToCheckout } from "../redux/action/carts";
import { useNavigate } from "react-router-dom";

const CardProduct = ({
  productid,
  discountPersentage,
  image,
  name,
  description,
  price,
  priceAfterDiscount,
  discount_type,
  status,
  weight,
  stock,
}) => {
  let dispatch = useDispatch();
  const navigate = useNavigate();
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const branch_id = userProduct?.data?.branch_id;
  const branch_name = userProduct?.data?.branch;
  let grandtotal = 0;

  const handleAddToCart = async () => {
    await dispatch(addToCart(productid, 1, branch_id));
    await dispatch(cartList(branch_id));
  };

  const handleBuyNow = () => {
    grandtotal = grandtotal + parseInt(priceAfterDiscount);
    const checkout = {
      detailOrder: [
        {
          product_name: name,
          qty: 1,
          discount_type: null,
          voucher_type: null,
          price_per_item: priceAfterDiscount,
          weight,
        },
      ],
      products_id: [
        {
          product_id: productid,
        },
      ],
      grandtotal,
      isFromCart: false,
      branch_name,
      branch_id,
    };
    console.log(checkout);
    dispatch(saveCartToCheckout(checkout));
    navigate("/shipping");
  };

  return (
    <div className="flex flex-col  w-[170px] h-[370px]  md:w-[300px] md:h-[480px] shadow  rounded-lg border-y border-slate-200">
      {discount_type === "Discount Tanpa Ketentuan (Persentase)" &&
      status === 1 ? (
        <Button
          size="xs"
          bgColor="#DF2E38"
          color="white"
          fontWeight="bold"
          disabled
          rounded="sm"
          mt="4"
          w="fit-content"
          className="p-0 ml-2 md:p-2 md:ml-6"
        >
          {discountPersentage}
        </Button>
      ) : discount_type === "Discount Bogo" && status === 1 ? (
        <Button
          size="xs"
          bgColor="#DF2E38"
          color="white"
          fontWeight="bold"
          disabled
          rounded="sm"
          mt="4"
          w="fit-content"
          className="p-0 ml-2 md:p-2 md:ml-6"
        >
          Buy one get one free!!
        </Button>
      ) : (
        <div className=" mt-8 md:mt-10"></div>
      )}
      {image ? (
        stock === 0 ? (
          <div className=" relative z-0">
            <Link to={`/product/${name}`}>
              <img
                className="object-cover object-center h-[100px] md:h-[160px] m-auto block mt-10  overflow-x-auto "
                src={image}
                alt={image}
              />
              <div className="absolute text-xs md:text-sm font-bold  px-1 md:px-0 p-0 md:p-2 h-5 md:h-10 rounded-xl bg-black text-white  text-center translate-x-10 md:translate-x-[105px]  translate-y-[-50px] md:translate-y-[-100px]">
                Out Of Stock
              </div>
            </Link>
          </div>
        ) : (
          <Link to={`/product/${name}`}>
            <img
              className="object-cover object-center h-[100px] md:h-[160px] m-auto block mt-10  "
              src={image}
              alt={image}
            />
          </Link>
        )
      ) : (
        <div className=" h-[100px] md:h-[430px]"></div>
      )}

      <div className="px-4 py-2 bg-white  w-[170px] h-[200px] md:w-[300px] md:h-[300px] mt-5 pl-2 md:pl-7 ">
        <Heading size={["xs", "sm"]} h={["40px", "35px"]} mb="3">
          <Link to={`/product/${name}`}>{name}</Link>
        </Heading>
        <Text className="  text-[10px] md:h-[40px] md:w-[250px] mb-3 md:text-sm text-gray-600 ">
          {description}
        </Text>

        <div className="flex gap-2 md:gap-4">
          {priceAfterDiscount ? (
            discount_type === "Discount Bogo" ? (
              <>
                <Text
                  color="#F99417"
                  fontSize={["11px", "sm"]}
                  fontWeight="bold"
                >
                  Rp. {price.toLocaleString()}
                </Text>
              </>
            ) : (
              <>
                <Text
                  color="gray.500"
                  fontSize={["11px", "sm"]}
                  as="del"
                  fontWeight="semibold"
                >
                  Rp. {price.toLocaleString()}
                </Text>
                <Text
                  color="#F99417"
                  fontSize={["11px", "sm"]}
                  fontWeight="bold"
                >
                  Rp. {priceAfterDiscount.toLocaleString()}
                </Text>
              </>
            )
          ) : (
            <>
              <Text color="#F99417" fontSize={["11px", "sm"]} fontWeight="bold">
                Rp. {price.toLocaleString()}
              </Text>
            </>
          )}
        </div>
      </div>
      <Divider />
      <div>
        <ButtonGroup spacing={["0", "2"]} m={["3", "5"]}>
          <Button
            variant="solid"
            colorScheme="gray"
            rounded="md"
            bgColor="#DEF5E5"
            size={["xs", "sm"]}
            onClick={() => handleBuyNow()}
            isDisabled={stock === 0}
          >
            Buy now
          </Button>
          <Button
            variant="ghost"
            color="gray.600"
            fontWeight="semibold"
            size={["xs", "sm"]}
            onClick={() => handleAddToCart()}
            isDisabled={stock === 0}
          >
            Add to cart
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default CardProduct;
