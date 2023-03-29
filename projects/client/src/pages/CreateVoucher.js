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
} from "@chakra-ui/react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useState, useRef, useEffect } from "react";
import { createVoucher } from "../redux/action/voucher";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";

const CreateVoucher = () => {
  let username = useRef();
  let voucher_type = useRef();
  let description = useRef();
  let cut_nominal = useRef();
  let cut_percentage = useRef();
  let image = useRef();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  //   let admin = useSelector((state) => state.auth);
  const [voucherType, setVoucherType] = useState("");
  const [dataUser, setDataUser] = useState([]);
  const [addFile, setAddFile] = useState("");
  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");
  const [message, setMessage] = useState("");
  const [fieldName, setFieldName] = useState("");
  const [fieldDescription, setFieldDescription] = useState("");
  const [fieldCutNominal, setFieldCutNominal] = useState("");
  const [fieldCutPercentage, setFieldCutPercentage] = useState("");
  const [fieldUsername, setFieldUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const handleInputChangeName = (e) => {
    setFieldName(e.target.value);
    setVoucherType(e.target.value);
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
  const handleInputChangeUsername = (e) => {
    setFieldUsername(e.target.value);
  };
  const onBtnAddFile = (e) => {
    if (e.target.files[0]) {
      setAddFile(e.target.files[0]);
      let preview = document.getElementById("imgprev");
      preview.src = URL.createObjectURL(e.target.files[0]);
    }
  };
  const getUserVerified = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/admin/getUserVerified`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response);
      console.log(response?.data?.data);
      setDataUser(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const isErrorName = fieldName === "";
  const isErrorDescription = fieldDescription === "";
  const isErrorNominal = fieldCutNominal === "";
  const isErrorPercentage = fieldCutPercentage === "";
  const isErrorUsername = fieldUsername === "";
  const handleSubmit = async () => {
    const token = localStorage.getItem("my_Token");
    try {
      setLoading(true);
      // event.preventDefault();

      let inputUsername = username.current.value;
      let inputVoucher_type = voucher_type.current.value;
      let inputDescription = description.current.value;
      let inputCut_nominal;
      let inputCut_percentage;
      if (cut_nominal) {
        inputCut_nominal = cut_nominal.current.value;
      }
      if (cut_percentage) {
        inputCut_percentage = cut_percentage.current.value / 100;
      }

      console.log(
        inputUsername,
        inputVoucher_type,
        inputDescription,
        inputCut_nominal,
        inputCut_percentage
      );

      if (
        !inputVoucher_type ||
        !inputUsername ||
        (!inputDescription && (!inputCut_nominal || !inputCut_percentage))
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
      }

      let formData = new FormData();
      if (addFile) {
        formData.append("images", addFile);
      }
      formData.append("username", inputUsername);
      formData.append("voucher_type", inputVoucher_type);
      formData.append("description", inputDescription);
      if (inputCut_nominal) {
        formData.append("cut_nominal", inputCut_nominal);
      }
      if (inputCut_percentage) {
        formData.append("cut_percentage", inputCut_percentage);
      }

      dispatch(createVoucher({ formData }, { token }));
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
    getUserVerified();
  }, []);

  return (
    <>
      <div className="bg-neutral-50 py-6     px-6 text-center text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
        <h1 className="mb-6 text-5xl font-bold">Create Voucher Form</h1>
      </div>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div>
            <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
              <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
                <div className="text-gray-600">
                  <p className="font-medium text-lg">Voucher Details</p>
                  <p>Please fill out all the fields that required.</p>
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
                            Vouchers Details
                          </h1>
                        </div>
                      )}

                      <FormControl isInvalid={isErrorName} id="options">
                        <FormLabel>Voucher Type</FormLabel>
                        <Select
                          type="text"
                          value={fieldName}
                          ref={voucher_type}
                          placeholder="Select voucher type"
                          onChange={handleInputChangeName}
                        >
                          <option value="Potongan Ongkir (Nominal)">
                            Potongan Ongkir (Nominal)
                          </option>
                          <option value="Potongan Produk (Persentase)">
                            Potongan Produk (Presentase)
                          </option>
                          <option value="Potongan Produk (Nominal)">
                            Potongan Produk (Nominal)
                          </option>
                          <option value="Referral Code">Referral Code</option>
                        </Select>
                        {!isErrorName ? (
                          <FormHelperText>
                            Input Voucher Type based on your preferences
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Voucher Type field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>

                    <div className="md:col-span-5">
                      <FormControl isInvalid={isErrorDescription}>
                        <FormLabel>Voucher Description</FormLabel>
                        <Textarea
                          type="text"
                          value={fieldDescription}
                          ref={description}
                          onChange={handleInputChangeDescription}
                        />
                        {!isErrorDescription ? (
                          <FormHelperText>
                            More details description, helps for understanding
                            information about voucher
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            Voucher description field is required.
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </div>
                    <div className="md:col-span-5 item-center">
                      <FormLabel>Voucher Images</FormLabel>
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

                    <div className="md:col-span-2">
                      <FormControl id="form1">
                        <FormLabel>Voucher Nominal(Rp.)</FormLabel>
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
                        <FormLabel> Voucher Percentage(%)</FormLabel>
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
                            result (not greater than 100 also not less than 0)
                          </FormHelperText>
                        ) : (
                          ""
                        )}
                      </FormControl>
                    </div>
                    <div className="md:col-span-2">
                      <FormControl isInvalid={isErrorUsername} id="options">
                        <FormLabel>Username list</FormLabel>
                        <Select
                          type="text"
                          value={fieldUsername}
                          ref={username}
                          placeholder="Select username"
                          onChange={handleInputChangeUsername}
                        >
                          {dataUser?.map((value, index) => {
                            return (
                              <>
                                <option value={value.name}>{value.name}</option>
                              </>
                            );
                          })}
                        </Select>
                        {!isErrorUsername ? (
                          <FormHelperText>
                            Input Username verified
                          </FormHelperText>
                        ) : (
                          <FormErrorMessage>
                            User name field is required.
                          </FormErrorMessage>
                        )}
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
export default CreateVoucher;
