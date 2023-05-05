import React from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import axios from "axios";
import { Icon } from "@iconify/react";
import CurrencyFormat from "react-currency-format";
import { Chart } from "react-google-charts";
import moment from "moment";
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

const AdminSales = () => {
  const timezoneOffset = new Date().getTimezoneOffset() / 60;

  const navigate = useNavigate();
  const [message1, setMessage1] = useState("");
  const [message2, setMessage2] = useState("");
  const [message3, setMessage3] = useState("");
  const [message4, setMessage4] = useState("");
  const [data1, setData1] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [data2, setData2] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [data3, setData3] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [data4, setData4] = useState([]);
  const [options4, setOptions4] = useState([]);
  const [topBranch, setTopBranch] = useState(null);
  const [topProduct, setTopProduct] = useState(null);
  const [totalStats, setTotalStats] = useState(null);
  const [branchName, setBranchName] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [dataDone, setDataDone] = useState(false);
  const [fromProduct, setFromProduct] = useState("");
  const [toProduct, setToProduct] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [fromUsers, setFromUsers] = useState("");
  const [toUsers, setToUsers] = useState(new Date().toISOString().slice(0, 16));
  const [fromSales, setFromSales] = useState("");
  const [toSales, setToSales] = useState(
    new Date(Date.now() - timezoneOffset * 3600 * 1000)
      .toISOString()
      .slice(0, 16)
  );
  const [fromTrx, setFromTrx] = useState("");
  const [toTrx, setToTrx] = useState(new Date().toISOString().slice(0, 16));
  const [dataProduct, setDataProduct] = useState([]);
  const [dataSales, setDataSales] = useState([]);
  const [dataTrx, setDataTrx] = useState([]);
  const [dataUsers, setDataUsers] = useState([]);
  const [totalSales, setTotalSales] = useState([""]);
  const [sortUsers, setSortUsers] = useState("date");
  const [sortSales, setSortSales] = useState("date");
  const [sortTrx, setSortTrx] = useState("date");
  const [sortProduct, setSortProduct] = useState("date");
  const [ascProduct, setAscProduct] = useState("");
  const [ascSales, setAscSales] = useState("");
  const [ascTrx, setAscTrx] = useState("");
  const [ascUsers, setAscUsers] = useState("");
  let getDataSales = async () => {
    try {
      let token = localStorage.my_Token;
      console.log(fromSales, toSales, sortSales, ascSales);

      let response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/getDataSales?fromProduct=${fromProduct}&toProduct=${toProduct}&sortProduct=${sortProduct}&ascProduct=${ascProduct}&fromUsers=${fromUsers}&toUsers=${toUsers}&sortUsers=${sortUsers}&ascUsers=${ascUsers}&fromSales=${fromSales}&toSales=${toSales}&sortSales=${sortSales}&ascSales=${ascSales}&fromTrx=${fromTrx}&toTrx=${toTrx}&sortTrx=${sortTrx}&ascTrx=${ascTrx}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      await setDataProduct(response?.data?.data?.dataProduct);

      setDataSales(response?.data?.data?.dataSales);

      setDataTrx(response?.data?.data?.dataTransaction);

      setDataUsers(response?.data?.data?.dataUsers);
      if (adminRole == "super admin") {
        setTotalSales(response?.data?.data?.totalSales[0]);
      }
      if (adminRole == "admin branch") {
        setTotalSales(response?.data?.data?.totalSales[0]);
      }
      if (adminRole == "super admin") {
        setTopBranch(response?.data?.data?.topBranch);
      }

      setTopProduct(response?.data?.data?.topProduct);
      setTotalStats(response?.data?.data?.totalStats[0]);
      setBranchName(response?.data?.data?.branchName[0]);
      setIsActive(response?.data?.data?.isActive);
      setAdminRole(response?.data?.data?.role);
      setDataDone(true);
      setMessage1("");
      setMessage2("");
      setMessage3("");
      setMessage4("");
    } catch (error) {
      console.log(error);
    }
  };
  const saleChart = () => {
    const data = dataSales;
    if (dataSales.length == 1) {
      setMessage2("Data in range filter is not exist , please try again");
      return;
    }

    setData1(data);
    const options = {
      title: "Sales Chart ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Sales",
      },
    };
    setOptions1(options);
  };

  const orderChart = () => {
    const data = dataTrx;
    if (dataTrx.length == 1) {
      setMessage3("Data in range filter is not exist , please try again");
      return;
    }
    setData2(data);
    const options = {
      title: "Successful Order Chart",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Successful Order",
      },
    };
    setOptions2(options);
  };
  const productSoldChart = () => {
    const data = dataProduct;
    if (dataProduct.length == 1) {
      setMessage1("Data in range filter is not exist , please try again");
      return;
    }

    setData3(data);
    const options = {
      title: " Total Product Sold ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Product Sold (unit)",
      },
    };
    setOptions3(options);
  };

  const usersChart = () => {
    const data = dataUsers;
    if (dataUsers.length == 1) {
      setMessage4("Data in range filter is not exist , please try again");
      return;
    }
    setData4(data);
    const options = {
      title: " Total Unique Users ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Unique Users",
      },
    };
    setOptions4(options);
  };
  //   const handleAscSort = () => {
  //     getDataSales();
  //   };

  useEffect(() => {
    let token = localStorage.my_Token;
    if (!token) {
      navigate("/admin/login");
    }

    getDataSales();
  }, [dataDone]);
  useEffect(() => {
    saleChart();
    orderChart();
    productSoldChart();
    usersChart();
  }, [dataUsers, dataTrx, dataProduct, dataSales]);

  const handleFromSales = (event) => {
    const selectedDate = event.target.value;
    setFromSales(selectedDate);
  };

  const handleToSales = (event) => {
    const selectedDate = event.target.value;
    setToSales(selectedDate);
  };

  const handleFilterSales = (event) => {
    try {
      event.preventDefault();
      let now = moment();
      if (moment(fromSales).isAfter(now)) {
        setMessage2(
          "Please input correct from value, the value should before than today"
        );
        return;
      } else if (toSales < fromSales) {
        setMessage2(
          "Please input correct to value, from input must be earlier than to "
        );
        return;
      }
      getDataSales();
      setMessage2("");
    } catch (error) {
      setMessage2(error.response.data.message);
      console.log(error);
    }
  };
  const handleFromProduct = (event) => {
    const selectedDate = event.target.value;
    setFromProduct(selectedDate);
  };

  const handleToProduct = (event) => {
    const selectedDate = event.target.value;
    setToProduct(selectedDate);
  };

  const handleFilterProduct = (event) => {
    try {
      event.preventDefault();
      let now = moment();
      if (moment(fromProduct).isAfter(now)) {
        setMessage1(
          "Please input correct from value, the value should before than today"
        );
        return;
      } else if (toProduct < fromProduct) {
        setMessage1(
          "Please input correct to value, from input must be earlier than to "
        );
        return;
      }
      getDataSales();
      setMessage1("");
    } catch (error) {
      setMessage1(error.response.data.message);
      console.log(error);
    }
  };
  const handleFromTrx = (event) => {
    const selectedDate = event.target.value;
    setFromTrx(selectedDate);
  };

  const handleToTrx = (event) => {
    const selectedDate = event.target.value;
    setToTrx(selectedDate);
  };

  const handleFilterTrx = (event) => {
    try {
      event.preventDefault();
      let now = moment();
      if (moment(fromTrx).isAfter(now)) {
        setMessage3(
          "Please input correct from value, the value should before than today"
        );
        return;
      } else if (toTrx < fromTrx) {
        setMessage3(
          "Please input correct to value, from input must be earlier than to "
        );
        return;
      }
      getDataSales();
      setMessage3("");
    } catch (error) {
      setMessage3(error.response.data.message);
      console.log(error);
    }
  };
  const handleFromUsers = (event) => {
    const selectedDate = event.target.value;
    setFromUsers(selectedDate);
  };

  const handleToUsers = (event) => {
    const selectedDate = event.target.value;
    setToUsers(selectedDate);
  };

  const handleFilterUsers = (event) => {
    try {
      event.preventDefault();
      let now = moment();
      if (moment(fromUsers).isAfter(now)) {
        setMessage4(
          "Please input correct from value, the value should before than today"
        );
        return;
      } else if (toUsers < fromUsers) {
        setMessage4(
          "Please input correct to value, from input must be earlier than to "
        );
        return;
      }
      getDataSales();
      setMessage4("");
    } catch (error) {
      setMessage4(error.response.data.message);
      console.log(error);
    }
  };
  return (
    <div>
      <SidebarAdmin />

      <div className="p-4 sm:ml-64">
        <Navbar />

        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6 mb-6">
            <h1 className="text-4xl font-semibold mb-2">Sale Report</h1>
            <h2 className="text-black text-xl ml-0.5">
              {adminRole == "admin branch"
                ? `GoKu - Branch ${branchName?.name} `
                : "Goku - Super Admin"}
            </h2>
          </div>
        </div>
        <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="flex items-center p-8 bg-white shadow rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600 bg-blue-100 rounded-full mr-6">
              <Icon icon="ph:users-four" className="h-12 w-12" />
            </div>
            <div>
              <span className="block text-2xl font-bold">
                {totalStats?.total_users}
              </span>
              <span className="block text-gray-500">Total Users</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-green-600 mr-6">
              <Icon icon="ph:currency-circle-dollar" className="w-16 h-16" />
            </div>
            <div>
              {adminRole == "super admin" ? (
                <span className="block text-2xl font-bold">
                  <CurrencyFormat
                    value={totalSales?.total_sales}
                    displayType={"text"}
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    prefix={"Rp"}
                  />
                </span>
              ) : (
                <span className="block text-2xl font-bold">
                  <CurrencyFormat
                    value={totalSales?.total_sales}
                    displayType={"text"}
                    thousandSeparator={"."}
                    decimalSeparator={","}
                    prefix={"Rp"}
                  />
                </span>
              )}

              <span className="block text-gray-500">Total Earning</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600  mr-6">
              <Icon icon="fluent-mdl2:activate-orders" className="h-16 w-16" />
            </div>
            <div>
              <span className="inline-block text-2xl font-bold">
                {totalStats?.total_order}
              </span>
              <span className="block text-gray-500">Total Orders</span>
            </div>
          </div>
          <div className="flex items-center p-8 bg-white shadow rounded-lg">
            <div className="inline-flex flex-shrink-0 items-center justify-center h-16 w-16 text-blue-600  mr-6">
              <Icon
                icon="carbon:shopping-cart-arrow-down"
                className="h-16 w-16"
              />
            </div>
            <div>
              <span className="block text-2xl font-bold">
                {totalStats?.total_product_sold}
              </span>
              <span className="block text-gray-500">Total Product Sold</span>
            </div>
          </div>
        </section>
        {branchName?.name ? null : (
          <div className="flex justify-between bg-gray-100 py-10 p-5">
            <div className="container mr-5 ml-2 mx-auto bg-white shadow-xl">
              <div className="w-11/12 mx-auto">
                <div className="bg-white my-6">
                  <table className="text-left w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="py-4 px-6 bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          TOP - BRANCH
                        </th>
                        <th className="py-4 px-6 text-center bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          TOTAL SALES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topBranch?.map((value, index) => {
                        return (
                          <>
                            <tr className="hover:bg-grey-lighter font-bold">
                              <td className="py-4 px-6 border-b border-grey-light">
                                {value?.branch_store}
                              </td>
                              <td className="py-4 px-6 text-center border-b border-grey-light">
                                <CurrencyFormat
                                  value={value?.sales}
                                  displayType={"text"}
                                  thousandSeparator={"."}
                                  decimalSeparator={","}
                                  prefix={"Rp"}
                                />
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="container mr-5 mx-auto bg-white shadow-xl">
              <div className="w-11/12 mx-auto">
                <div className="bg-white my-6">
                  <table className="text-left w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="py-4 px-6 bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          TOP FIVE PRODUCTS
                        </th>
                        <th className="py-4 px-6 text-center bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          QUANTITY
                        </th>
                        <th className="py-4 px-6 text-center bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          BRANCH NAME
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProduct?.map((value, index) => {
                        return (
                          <>
                            <tr className="hover:bg-grey-lighter font-bold">
                              <td className="py-4 px-6 border-b border-grey-light">
                                {value?.product_name}
                              </td>
                              <td className="py-4 px-6 text-center border-b border-grey-light">
                                {value?.qty}
                              </td>
                              <td className="py-4 px-6 text-center border-b border-grey-light">
                                {value?.branch_store}
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between my-5">
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2 mr-5">
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <p>Sale Chart</p>
            </div>
            {message2 !== "" ? (
              <div>
                <Alert status="error">
                  <AlertIcon />
                  {message2}
                </Alert>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <div className="md:col-span-2 mx-3">
                <FormControl>
                  <FormLabel>From:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    defaultValue={fromSales}
                    onChange={handleFromSales}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-4">
                <FormControl>
                  <FormLabel>To:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    placeholder="Select Date and Time"
                    defaultValue={toSales}
                    onChange={handleToSales}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-3">
                {adminRole == "super admin" ? (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortSales(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="Jakarta_Pusat">Jakarta Pusat</option>
                      <option value="Jakarta_Barat">Jakarta Barat</option>
                      <option value="Jakarta_Timur">Jakarta Timur</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscSales(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortSales(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="sales">Sales</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscSales(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                )}
              </div>
              <Button
                onClick={handleFilterSales}
                className="mt-12"
                colorScheme="green"
              >
                Change
              </Button>
            </div>
            <Chart
              chartType="LineChart"
              data={data1}
              options={options1}
              width="100%"
              height="500px"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2 mr-2">
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <p>Order Chart</p>
            </div>
            {message3 !== "" ? (
              <div>
                <Alert status="error">
                  <AlertIcon />
                  {message3}
                </Alert>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <div className="md:col-span-2 mx-3">
                <FormControl>
                  <FormLabel>From:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    defaultValue={fromTrx}
                    onChange={handleFromTrx}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-4">
                <FormControl>
                  <FormLabel>To:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    placeholder="Select Date and Time"
                    defaultValue={toTrx}
                    onChange={handleToTrx}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-3">
                {adminRole == "super admin" ? (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortTrx(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="Jakarta_Pusat">Jakarta Pusat</option>
                      <option value="Jakarta_Barat">Jakarta Barat</option>
                      <option value="Jakarta_Timur">Jakarta Timur</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscTrx(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortTrx(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="transaction">Transaction</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscTrx(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                )}
              </div>
              <Button
                onClick={handleFilterTrx}
                className="mt-12"
                colorScheme="green"
              >
                Change
              </Button>
            </div>
            <Chart
              chartType="LineChart"
              data={data2}
              options={options2}
              width="100%"
              height="500px"
            />
          </div>
        </div>
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between my-5">
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2 mr-5">
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <p>Product Sold Chart</p>
            </div>
            {message1 !== "" ? (
              <div>
                <Alert status="error">
                  <AlertIcon />
                  {message1}
                </Alert>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <div className="md:col-span-2 mx-3">
                <FormControl>
                  <FormLabel>From:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    defaultValue={fromProduct}
                    onChange={handleFromProduct}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-4">
                <FormControl>
                  <FormLabel>To:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    placeholder="Select Date and Time"
                    defaultValue={toProduct}
                    onChange={handleToProduct}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-3">
                {adminRole == "super admin" ? (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortProduct(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="Jakarta_Pusat">Jakarta Pusat</option>
                      <option value="Jakarta_Barat">Jakarta Barat</option>
                      <option value="Jakarta_Timur">Jakarta Timur</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscProduct(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortProduct(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="productSold">Product</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscProduct(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                )}
              </div>
              <Button
                onClick={handleFilterProduct}
                className="mt-12"
                colorScheme="green"
              >
                Change
              </Button>
            </div>
            <Chart
              chartType="LineChart"
              data={data3}
              options={options3}
              width="100%"
              height="500px"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2 mr-2">
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <p>User Chart</p>
            </div>
            {message4 !== "" ? (
              <div>
                <Alert status="error">
                  <AlertIcon />
                  {message4}
                </Alert>
              </div>
            ) : (
              <></>
            )}
            <div className="flex flex-row bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <div className="md:col-span-2 mx-3">
                <FormControl>
                  <FormLabel>From:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    defaultValue={fromUsers}
                    onChange={handleFromUsers}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-4">
                <FormControl>
                  <FormLabel>To:</FormLabel>
                  <Input
                    type="datetime-local"
                    size="sm"
                    placeholder="Select Date and Time"
                    defaultValue={toUsers}
                    onChange={handleToUsers}
                  />
                </FormControl>
              </div>
              <div className="md:col-span-2 mx-3">
                {adminRole == "super admin" ? (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortUsers(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="Jakarta_Pusat">Jakarta Pusat</option>
                      <option value="Jakarta_Barat">Jakarta Barat</option>
                      <option value="Jakarta_Timur">Jakarta Timur</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscUsers(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                ) : (
                  <>
                    <FormLabel>Sort By:</FormLabel>
                    <Select
                      onChange={(event) => {
                        setSortUsers(event.target.value);
                      }}
                    >
                      <option value="date">Date</option>
                      <option value="users">Users</option>
                    </Select>
                    <Select
                      onChange={(event) => {
                        setAscUsers(event.target.value);
                      }}
                    >
                      <option selected value="asc">
                        Ascending
                      </option>
                      <option value="desc">Descending</option>
                    </Select>
                  </>
                )}
              </div>
              <Button
                onClick={handleFilterUsers}
                className="mt-12"
                colorScheme="green"
              >
                Change
              </Button>
            </div>
            <Chart
              chartType="LineChart"
              data={data4}
              options={options4}
              width="100%"
              height="500px"
            />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};
export default AdminSales;
