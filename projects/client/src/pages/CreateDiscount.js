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
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Th,
  Td,
  Thead,
  Tr,
  Button,
} from "@chakra-ui/react";

import { useState, useRef, useEffect } from "react";
import { createDiscount } from "../redux/action/discount";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import { Icon } from "@iconify/react";

const CreateDiscount = () => {
  let discount_type = useRef();
  let description = useRef();
  let cut_nominal = useRef();
  let cut_percentage = useRef();
  let start = useRef();
  let end = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkboxRefs = useRef([]);
  const [idProduct, setIdProduct] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [discountType, setDiscountType] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [message, setMessage] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldCutNominal, setFieldCutNominal] = useState("");
  const [fieldCutPercentage, setFieldCutPercentage] = useState("");
  const [fieldStart, setFieldStart] = useState("");
  const [fieldEnd, setFieldEnd] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInputChangeName = (e) => {
    setFieldName(e.target.value);
    setDiscountType(e.target.value);
  };
  const handleInputChangeDescription = (e) => {
    setFieldDescription(e.target.value);
  };
  const handleInputChangeNominal = (e) => {
    setFieldCutNominal(e.target.value);
    setValue1(e.target.value);
    setValue2("");
  };
  const handleInputChangePercentage = (e) => {
    setFieldCutPercentage(e.target.value);
    setValue2(e.target.value);
    setValue1("");
  };
  const handleInputChangeStart = (e) => setFieldStart(e.target.value);
  const handleInputChangeEnd = (e) => setFieldEnd(e.target.value);
  function handleClick() {
    window.history.back();
  }

  const isErrorName = fieldName === "";
  const isErrorDescription = fieldDescription === "";
  const isErrorNominal = fieldCutNominal === "";
  const isErrorPercentage = fieldCutPercentage === "";
  const isErrorStart = fieldStart === "";
  const isErrorEnd = fieldEnd === "";

  const handleSubmit = (event) => {
    try {
      setLoading(true);
      event.preventDefault();
      const token = localStorage.getItem("my_Token");
      let inputDiscount_type = discount_type.current.value;
      let inputDescription = description.current.value;
      let inputCut_nominal;
      let inputCut_percentage;
      if (cut_nominal) {
        inputCut_nominal = cut_nominal.current.value;
      }
      if (cut_percentage) {
        inputCut_percentage = cut_percentage.current.value / 100;
      }
      let inputStart = start.current.value;
      let inputEnd = end.current.value;
      let now = moment();
      if (
        !inputDiscount_type ||
        !inputDescription ||
        !inputStart ||
        !inputEnd
      ) {
        setMessage("Data is incomplete");
      } else if (inputCut_nominal && inputCut_percentage) {
        setMessage("Please cut nominal only or cut percentage only");
        return;
      } else if (inputCut_nominal) {
        if (inputCut_nominal < 0) {
          return setMessage("Please input positive number");
        }
      } else if (inputCut_percentage) {
        if (inputCut_percentage < 0 || inputCut_percentage > 100) {
          return setMessage(
            "Please input discount percentage value greater than 0 and less than 100"
          );
        }
      } else if (moment(inputStart).isBefore(now)) {
        setMessage("Please input discount start further day than today");
        return;
      } else if (inputEnd < inputStart) {
        setMessage("Please input discount end further day than input start");
        return;
      }
      dispatch(
        createDiscount({
          discount_type: inputDiscount_type,
          description: inputDescription,
          cut_nominal: inputCut_nominal,
          cut_percentage: inputCut_percentage,
          start: inputStart,
          end: inputEnd,
          token,
          idProduct,
        })
      );
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
      console.log(error);
    }
  };
  const handleCheckboxChange = () => {
    const checkedValues = checkboxRefs.current
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    console.log(checkedValues);
    setIdProduct(checkedValues);
  };

  const getProductList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response.data.data);
      setDataProduct(response?.data?.data.productList);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("my_Token");
    if (!token) {
      navigate("/admin/login");
    }
    getProductList();
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
        <h1 className="mb-6 text-5xl font-bold">Create Discount Form</h1>
      </div>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="lg:col-span-3">
                  <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                    <div className="md:col-span-2">
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
                            Discount Details
                          </h1>
                        </div>
                      )}

                      <FormControl isInvalid={isErrorName} id="options">
                        <FormLabel>Discount Type</FormLabel>
                        <Select
                          type="text"
                          value={fieldName}
                          ref={discount_type}
                          placeholder="Select Discount Type"
                          onChange={handleInputChangeName}
                        >
                          <option value="Discount Tanpa Ketentuan (Nominal)">
                            Discount Tanpa Ketentuan (Nominal)
                          </option>
                          <option value="Discount BOGO">Discount BOGO</option>
                          <option value="Discount Tanpa Ketentuan (Persentase)">
                            Discount Tanpa Ketentuan (Persentase)
                          </option>
                        </Select>
                        {!isErrorName ? (
                          <FormHelperText>
                            Input discount name, improve name with unique words
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Discount name field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-5">
                      <FormControl isInvalid={isErrorDescription}>
                        <FormLabel>Discount Description</FormLabel>
                        <Textarea
                          type="text"
                          value={fieldDescription}
                          ref={description}
                          onChange={handleInputChangeDescription}
                        />
                        {!isErrorDescription ? (
                          <FormHelperText>
                            More details description, helps for understanding
                            information about discount
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Discount description field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>
                    {discountType !== "Discount BOGO" ? (
                      <>
                        <div className="md:col-span-2">
                          <FormControl id="form1">
                            <FormLabel>Nominal Discount (Rp.)</FormLabel>
                            <Input
                              type="number"
                              value={fieldCutNominal}
                              ref={cut_nominal}
                              onChange={handleInputChangeNominal}
                              disabled={value2 !== ""}
                            />

                            {!isErrorNominal ? (
                              <FormHelperText>
                                Input unique number to improve better result
                                (positive number only)
                              </FormHelperText>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </div>

                        <div className="md:col-span-2">
                          <FormControl id="form2">
                            <FormLabel> Discount Percentage(%)</FormLabel>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={fieldCutPercentage}
                              ref={cut_percentage}
                              onChange={handleInputChangePercentage}
                              disabled={value1 !== ""}
                            />

                            {!isErrorPercentage ? (
                              <FormHelperText>
                                Input unique number on percent to improve better
                                result (not greater than 100 also not less than
                                0)
                              </FormHelperText>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="md:col-span-2">
                          <FormControl id="form1">
                            <FormLabel>Nominal Discount (Rp.)</FormLabel>
                            <Input
                              type="number"
                              value={fieldCutNominal}
                              ref={cut_nominal}
                              onChange={handleInputChangeNominal}
                              disabled
                            />

                            {!isErrorNominal ? (
                              <FormHelperText>
                                Input unique number to improve better result
                                (positive number only)
                              </FormHelperText>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </div>

                        <div className="md:col-span-2">
                          <FormControl id="form2">
                            <FormLabel> Discount Percentage(%)</FormLabel>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={fieldCutPercentage}
                              ref={cut_percentage}
                              onChange={handleInputChangePercentage}
                              disabled
                            />

                            {!isErrorPercentage ? (
                              <FormHelperText>
                                Input unique number on percent to improve better
                                result (not greater than 100 also not less than
                                0)
                              </FormHelperText>
                            ) : (
                              ""
                            )}
                          </FormControl>
                        </div>
                      </>
                    )}

                    <div className="md:col-span-2">
                      <FormControl isInvalid={isErrorStart}>
                        <FormLabel>Discount Start in </FormLabel>
                        <Input
                          type="datetime-local"
                          size="md"
                          placeholder="Select Date and Time"
                          value={fieldStart}
                          ref={start}
                          onChange={handleInputChangeStart}
                        />
                        {!isErrorStart ? (
                          <FormHelperText>
                            Input date when discount start
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Discount Start field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>
                    <div className="md:col-span-2">
                      <FormControl isInvalid={isErrorEnd}>
                        <FormLabel>Discount End in </FormLabel>
                        <Input
                          type="datetime-local"
                          size="md"
                          placeholder="Select Date and Time"
                          value={fieldEnd}
                          ref={end}
                          onChange={handleInputChangeEnd}
                        />
                        {!isErrorStart ? (
                          <FormHelperText>
                            Input date when discount end
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Discount End field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>
                    <div className="md:col-span-5">
                      <FormLabel>Applied Discount for Product :</FormLabel>
                      <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                        <TableContainer>
                          <Table variant="striped">
                            <TableCaption
                              placement="top"
                              fontSize="lg"
                              fontWeight="bold"
                              textAlign="center"
                            >
                              Product List Table
                            </TableCaption>
                            <Thead className=" text-center">
                              <Tr>
                                <Th>CheckList</Th>
                                <Th>Name</Th>
                                <Th>Images</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {dataProduct?.map((value, index) => {
                                return (
                                  <Tr className=" text-center " key={value.id}>
                                    <Td>
                                      <input
                                        id={value + "-checkbox"}
                                        type="checkbox"
                                        name="category"
                                        value={value.id}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        ref={(el) =>
                                          (checkboxRefs.current[index] = el)
                                        }
                                        onChange={handleCheckboxChange}
                                      />
                                    </Td>
                                    <Td>{value.name}</Td>
                                    <Td>
                                      <img
                                        src={value.images}
                                        alt="*"
                                        width="150"
                                        height="75"
                                      ></img>
                                    </Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </ul>
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
export default CreateDiscount;
