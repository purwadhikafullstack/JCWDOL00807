import React from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Image,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

import { useState, useRef, useEffect } from "react";
import { createProduct } from "../redux/action/product";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Icon } from "@iconify/react";

const CreateProduct = () => {
  let image = useRef();
  let name = useRef();
  let description = useRef();
  let category = useRef();
  let weight = useRef();
  let stock = useRef();
  let price = useRef();
  let discountType = useRef();
  let voucherType = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [addFile, setAddFile] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldCategory, setFieldCategory] = useState("");
  const [fieldWeight, setFieldWeight] = useState("");
  const [fieldStock, setFieldStock] = useState("");
  const [fieldPrice, setFieldPrice] = useState("");
  const [dataCategories, setDataCategories] = useState([]);
  const [dataDiscountType, setDataDiscountType] = useState([]);
  const [dataVoucherType, setDataVoucherType] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleInputChangeName = (e) => setFieldName(e.target.value);
  const handleInputChangeDescription = (e) =>
    setFieldDescription(e.target.value);
  const handleInputChangeCategory = (e) => setFieldCategory(e.target.value);
  const handleInputChangeWeight = (e) => setFieldWeight(e.target.value);
  const handleInputChangeStock = (e) => setFieldStock(e.target.value);
  const handleInputChangePrice = (e) => setFieldPrice(e.target.value);

  const onBtnAddFile = (e) => {
    if (e.target.files[0]) {
      setAddFile(e.target.files[0]);
      let preview = document.getElementById("imgprev");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };

  const isErrorName = fieldName === "";
  const isErrorDescription = fieldDescription === "";
  const isErrorCategory = fieldCategory === "";
  const isErrorWeight = fieldWeight === "";
  const isErrorStock = fieldStock === "";
  const isErrorPrice = fieldPrice === "";

  const getData = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/getData`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response);
      await setDataCategories(response?.data?.data?.dataCategory);
      await setDataDiscountType(response?.data?.data?.dataDiscountType);
      await setDataVoucherType(response?.data?.data?.dataVoucherType);
    } catch (error) {
      console.log(error);
    }
  };

  function handleClick() {
    window.history.back();
  }

  const handleSubmit = () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("my_Token");
      console.log(token);
      let inputName = name.current.value;
      let inputDescription = description.current.value;
      let inputCategory = category.current.value;
      let inputWeight = weight.current.value;
      let inputStock = stock.current.value;
      let inputPrice = price.current.value;
      let inputDiscountType = discountType.current.value;
      let inputVoucherType = voucherType.current.value;
      if (
        !inputName ||
        !inputDescription ||
        !inputCategory ||
        !inputWeight ||
        !inputStock ||
        !inputPrice
      ) {
        setMessage("Data is incomplete");
      } else if (inputDiscountType && inputVoucherType) {
        setMessage("Please Voucher Type only or Discount Type only");
      } else if (inputWeight <= 0) {
        setMessage(
          "Please input weight in positive integer / positive float number"
        );
      } else if (inputStock < 1) {
        setMessage("Please input stock in positive number");
      } else if (inputPrice < 1000) {
        setMessage("Please input price in positive number ");
      }
      let formData = new FormData();
      if (addFile) {
        formData.append("images", addFile);
      }
      formData.append("name", inputName);
      formData.append("description", inputDescription);
      formData.append("category", inputCategory);
      formData.append("weight", inputWeight);
      formData.append("stock", inputStock);
      formData.append("price", inputPrice);
      if (inputDiscountType) {
        formData.append("discountType", inputDiscountType);
      }
      if (inputVoucherType) {
        formData.append("voucherType", inputVoucherType);
      }
      console.log(formData);
      console.log(token);
      dispatch(createProduct({ formData }, { token }));
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("my_Token");
    if (!token) {
      navigate("/admin/login");
    }
    getData();
  }, []);
  return (
    <>
      <Button
        leftIcon={<Icon icon="bx:arrow-back" />}
        backgroundColor="blue.500"
        color="white"
        _hover={{ backgroundColor: "blue.600" }}
        onClick={handleClick}
      >
        Back
      </Button>
      <div className="bg-neutral-50 py-6     px-6 text-center text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
        <h1 className="mb-6 text-5xl font-bold">Create Product Form</h1>
      </div>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Product Details</p>
                  <p>Please fill out all the fields.</p>
                </div>

                <div className="lg:col-span-2">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-5">
                      {message ? (
                        <div>
                          <Alert status="error" mb="6" mt="2">
                            <AlertIcon />
                            <AlertTitle>{message}</AlertTitle>
                          </Alert>
                        </div>
                      ) : (
                        <div>
                          <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Product Details
                          </h1>
                        </div>
                      )}

                      <FormControl isInvalid={isErrorName}>
                        <FormLabel>Product Name</FormLabel>
                        <Input
                          type="text"
                          value={fieldName}
                          ref={name}
                          onChange={handleInputChangeName}
                        />
                        {!isErrorName ? (
                          <FormHelperText>
                            Input product name more details for better result
                            search
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Product name field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-5 item-center">
                      <FormLabel>Product Images</FormLabel>
                      <Input
                        type="file"
                        ref={image}
                        name="image"
                        id="image"
                        accept="image/png,image/jpg"
                        onChange={onBtnAddFile}
                      />
                      <Image m="0 auto" id="imgprev" w="full" />
                      <p
                        class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                        id="file_input_help"
                      >
                        PNG OR JPG(MAX. 1MB)
                      </p>
                    </div>

                    <div className="md:col-span-5">
                      <FormControl isInvalid={isErrorDescription}>
                        <FormLabel>Product Description</FormLabel>
                        <Textarea
                          type="text"
                          value={fieldDescription}
                          ref={description}
                          onChange={handleInputChangeDescription}
                        />
                        {!isErrorDescription ? (
                          <FormHelperText>
                            More details description, helps for a better product
                            explanation
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Product description field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-5">
                      <FormControl isInvalid={isErrorCategory}>
                        <FormLabel>Product Category</FormLabel>
                        <Select
                          type="text"
                          value={fieldCategory}
                          ref={category}
                          placeholder="Select product category"
                          onChange={handleInputChangeCategory}
                        >
                          {dataCategories?.map((value, index) => {
                            return (
                              <>
                                <option>{value}</option>
                              </>
                            );
                          })}
                        </Select>
                        {!isErrorCategory ? (
                          <FormHelperText>
                            Choose Category to improve better search and
                            filtering
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Product category field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-1">
                      <FormControl isInvalid={isErrorWeight}>
                        <FormLabel>Weight (kg)</FormLabel>
                        <Input
                          type="number"
                          value={fieldWeight}
                          ref={weight}
                          onChange={handleInputChangeWeight}
                        />
                        {!isErrorWeight ? (
                          <FormHelperText>
                            Weight is needed for delivery info.
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Weight field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>
                    {/* <div className="md:col-span-1">
                      <FormControl isInvalid={isErrorStock}>
                        <FormLabel>Stock (unit)</FormLabel>
                        <Input
                          type="number"
                          value={fieldStock}
                          ref={stock}
                          onChange={handleInputChangeStock}
                        />
                        {!isErrorStock ? (
                          <FormHelperText>Stock Product Info.</FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Stock field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div> */}
                    <div className="md:col-span-3">
                      <FormControl isInvalid={isErrorPrice}>
                        <FormLabel>Price (Rp.)</FormLabel>
                        <Input
                          type="number"
                          value={fieldPrice}
                          ref={price}
                          onChange={handleInputChangePrice}
                        />
                        {!isErrorPrice ? (
                          <FormHelperText>Input Unique Price </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Price field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-2">
                      <FormControl>
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          type="text"
                          ref={discountType}
                          placeholder="Select Discount Type"
                        >
                          {dataDiscountType?.map((value, index) => {
                            return (
                              <>
                                <option>{value}</option>
                              </>
                            );
                          })}
                        </Select>
                        <p
                          class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                          id="file_input_help"
                        >
                          Discount type field is optional.
                        </p>
                      </FormControl>
                    </div>
                    <div className="md:col-span-2">
                      <FormControl>
                        <FormLabel>Voucher Type</FormLabel>
                        <Select
                          type="text"
                          ref={voucherType}
                          placeholder="Select VoucherType"
                        >
                          {dataVoucherType?.map((value, index) => {
                            return (
                              <>
                                <option>{value}</option>
                              </>
                            );
                          })}
                        </Select>
                        <p
                          class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                          id="file_input_help"
                        >
                          Voucher type field is optional.
                        </p>
                      </FormControl>
                    </div>

                    <div className="md:col-span-5 text-right">
                      <div className="inline-flex items-end">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateProduct;
