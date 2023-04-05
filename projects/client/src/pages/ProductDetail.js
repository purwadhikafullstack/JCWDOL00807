import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  NumberInputField,
  NumberInput,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar2";
import Footer from "../components/Footer";

const ProductDetail = () => {
  const api = process.env.REACT_APP_API_BASE_URL;
  const { id } = useParams();
  const [dataProduct, setDataProduct] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const getProductDetail = await axios.get(
          `${api}/user/product-detail/${id}`
        );
        console.log(getProductDetail.data.data);
        setDataProduct(getProductDetail.data.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <section className="text-gray-700 body-font overflow-hidden bg-white">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex justify-center gap-10 ">
            <img
              className=" h-[400px]  object-cover object-center rounded border border-gray-200"
              src={dataProduct?.images}
              alt={dataProduct?.name}
            />

            <div className="lg:w-1/2 w-full lg:pl-10 lg:pr-10  lg:py-6 mt-6 lg:mt-0 shadow shadow-slate-200 rounded-md ">
              {dataProduct?.discount_type === "Discount Bogo" &&
              dataProduct?.status === 1 ? (
                <Button
                  size="15px"
                  bgColor="#DF2E38"
                  color="white"
                  fontWeight="bold"
                  disabled
                  rounded="sm"
                  w="fit-content"
                  p="2"
                  mb="7"
                >
                  Buy one get one free!!
                </Button>
              ) : dataProduct?.discount_type && dataProduct?.status === 1 ? (
                <Button
                  size="15px"
                  bgColor="#DF2E38"
                  color="white"
                  fontWeight="bold"
                  disabled
                  rounded="sm"
                  w="fit-content"
                  p="2"
                  mb="7"
                >
                  Promotion Product
                </Button>
              ) : null}
              <h2 className="text-sm title-font text-gray-500 tracking-widest">
                {dataProduct?.category}
              </h2>
              <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                {dataProduct?.name}
              </h1>
              <p className="leading-relaxed">{dataProduct?.description}</p>
              <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                <div className="flex gap-2 items-center ">
                  <NumberInput
                    size="sm"
                    maxW={20}
                    defaultValue={0}
                    max={dataProduct?.stock}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <span className="mr-3">
                    Stock : {dataProduct?.stock} Dus{" "}
                  </span>
                </div>
              </div>

              <span className="title-font font-bold text-2xl text-gray-900 ">
                Rp.{" "}
                {dataProduct?.price_after_discount_notNull?.toLocaleString()}
              </span>
              {dataProduct?.cut_nominal && dataProduct?.status === 1 ? (
                <span className="title-font font-medium text-sm line-through text-gray-600 ml-2 ">
                  {dataProduct?.price?.toLocaleString()}
                </span>
              ) : null}
              {dataProduct?.cut_percentage && dataProduct?.status === 1 ? (
                <div className="flex gap-1 items-center mb-10 mt-1">
                  <Button
                    size="xs"
                    bgColor="#DF2E38"
                    color="white"
                    fontWeight="bold"
                    disabled
                    rounded="sm"
                    w="fit-content"
                  >
                    {dataProduct?.cut_percentage}
                  </Button>
                  <div className="title-font font-medium text-sm line-through text-gray-600">
                    {dataProduct?.price?.toLocaleString()}
                  </div>
                </div>
              ) : null}

              <div className=" flex gap-3 mt-4 justify-end  ">
                <Button>Add to cart</Button>
                <Button>Buy Now</Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </section>
    </>
  );
};

export default ProductDetail;
