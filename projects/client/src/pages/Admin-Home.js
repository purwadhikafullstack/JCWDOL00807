import React from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import axios from "axios";
import { Icon } from "@iconify/react";
import CurrencyFormat from "react-currency-format";
import { Chart } from "react-google-charts";

const AdminHome = () => {
  const navigate = useNavigate();
  const [data1, setData1] = useState([]);
  const [options1, setOptions1] = useState([]);
  const [data2, setData2] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [data3, setData3] = useState([]);
  const [options3, setOptions3] = useState([]);
  const [dataChart, setDataChart] = useState({});
  const [topBranch, setTopBranch] = useState(null);
  const [topProduct, setTopProduct] = useState(null);
  const [totalStats, setTotalStats] = useState(null);
  const [branchName, setBranchName] = useState(null);
  const [isActive, setIsActive] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [dataBranchTransaction, setDataBranchTransaction] = useState(null);
  const [dataDone, setDataDone] = useState(false);
  const [totalSales, setTotalSales] = useState([""]);

  const dailySaleChart = () => {
    const data = [
      ["Date", "Daily Sale (Rp)"],
      [dataChart[6]?.stat_day, dataChart[6]?.sales],
      [dataChart[5]?.stat_day, dataChart[5]?.sales],
      [dataChart[4]?.stat_day, dataChart[4]?.sales],
      [dataChart[3]?.stat_day, dataChart[3]?.sales],
      [dataChart[2]?.stat_day, dataChart[2]?.sales],
      [dataChart[1]?.stat_day, dataChart[1]?.sales],
      [dataChart[0]?.stat_day, dataChart[0]?.sales],
    ];

    // Convert string date values to Date data type
    for (let i = 1; i < data.length; i++) {
      data[i][1] = parseInt(data[i][1]);
    }

    setData1(data);
    const options = {
      title: "Daily Sales Last 7 days ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Daily Sales",
      },
    };
    setOptions1(options);
  };

  const dailyOrderChart = () => {
    const data = [
      ["Date", "Daily Order"],
      [dataChart[6]?.stat_day, dataChart[6]?.total_order],
      [dataChart[5]?.stat_day, dataChart[5]?.total_order],
      [dataChart[4]?.stat_day, dataChart[4]?.total_order],
      [dataChart[3]?.stat_day, dataChart[3]?.total_order],
      [dataChart[2]?.stat_day, dataChart[2]?.total_order],
      [dataChart[1]?.stat_day, dataChart[1]?.total_order],
      [dataChart[0]?.stat_day, dataChart[0]?.total_order],
    ];

    // Convert string date values to Date data type
    for (let i = 1; i < data.length; i++) {
      data[i][1] = parseInt(data[i][1]);
    }

    setData2(data);
    const options = {
      title: "Daily Order Last 7 days ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Daily Order",
      },
    };
    setOptions2(options);
  };
  const dailyProductSoldChart = () => {
    const data = [
      ["Date", "Daily Total Product Sold"],
      [dataChart[6]?.stat_day, dataChart[6]?.total_product],
      [dataChart[5]?.stat_day, dataChart[5]?.total_product],
      [dataChart[4]?.stat_day, dataChart[5]?.total_product],
      [dataChart[3]?.stat_day, dataChart[3]?.total_product],
      [dataChart[2]?.stat_day, dataChart[2]?.total_product],
      [dataChart[1]?.stat_day, dataChart[1]?.total_product],
      [dataChart[0]?.stat_day, dataChart[0]?.total_product],
    ];

    // Convert string date values to Date data type
    for (let i = 1; i < data.length; i++) {
      data[i][1] = parseInt(data[i][1]);
    }

    setData3(data);
    const options = {
      title: "Daily Total Product Sold Last 7 days ",
      curveType: "function",
      legend: { position: "bottom" },
      hAxis: {
        title: "Date",
        format: "dd-MM-YYYY",
      },
      vAxis: {
        title: "Daily Total Product Sold",
      },
    };
    setOptions3(options);
  };
  useEffect(() => {
    let token = localStorage.my_Token;
    if (!token) {
      navigate("/admin/login");
    }

    let getDataDashboard = async () => {
      try {
        let response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/admin/getDataDashboard`,
          {
            headers: {
              // Authorization: `${token}`,
              Authorization: token,
            },
          }
        );
        await setDataChart(response?.data?.data?.dataChart);
        setTopBranch(response?.data?.data?.topBranch);
        setTotalSales(response?.data?.data?.totalSales);
        setTopProduct(response?.data?.data?.topProduct);
        console.log(response?.data?.data?.totalStats[0]);
        setTotalStats(response?.data?.data?.totalStats[0]);
        console.log(response?.data?.data?.branchName);
        setBranchName(response?.data?.data?.branchName[0]);
        setIsActive(response?.data?.data?.isActive);
        setAdminRole(response?.data?.data?.role);
        setDataBranchTransaction(response?.data?.data?.dataBranchTransaction);
        setDataDone(true);
      } catch (error) {
        console.log(error);
      }
    };
    getDataDashboard();
  }, [dataDone]);
  useEffect(() => {
    dailySaleChart();
    dailyOrderChart();
    dailyProductSoldChart();
  }, [dataDone]);
  return (
    <div>
      <SidebarAdmin />

      <div className="p-4 sm:ml-64">
        <Navbar />

        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row justify-between">
          <div className="mr-6 mb-6">
            <h1 className="text-4xl font-semibold mb-2">Dashboard</h1>
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
              <span className="block text-2xl font-bold">
                <CurrencyFormat
                  value={totalSales[0].total_sales}
                  displayType={"text"}
                  thousandSeparator={"."}
                  decimalSeparator={","}
                  prefix={"Rp"}
                />
              </span>
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
                          TOP - ADMIN BRANCH
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
                                {value?.admin_name}
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
                          TOP THREE PRODUCTS
                        </th>
                        <th className="py-4 px-6 text-center bg-red-400 font-bold uppercase text-sm text-white border-b border-grey-light">
                          QUANTITY
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
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2">
            <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              Daily Sale Chart
            </div>
            <Chart
              chartType="LineChart"
              data={data1}
              options={options1}
              width="110%"
              height="500px"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2">
            <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              Daily Order Chart
            </div>
            <Chart
              chartType="LineChart"
              data={data2}
              options={options2}
              width="110%"
              height="500px"
            />
          </div>
          <div className="overflow-hidden rounded-lg shadow-lg w-1/2">
            <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              Daily Product Sold Chart
            </div>
            <Chart
              chartType="LineChart"
              data={data3}
              options={options3}
              width="110%"
              height="500px"
            />
          </div>
        </div>
        {branchName?.name ? (
          <>
            <div className="bg-neutral-50 py-3 px-5 dark:bg-neutral-700 dark:text-black-200 text-2xl font-bold">
              <center>Last 10 Transactions</center>
            </div>
            <section className="container px-4 mx-auto mb-5">
              <div className="flex flex-col">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th
                              scope="col"
                              className="py-3.5 px-4 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              <div className="flex items-center gap-x-3">
                                <input
                                  type="checkbox"
                                  className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                />
                                <span>No.</span>
                              </div>
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Customer Name
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Date
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Product Name
                            </th>

                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                            >
                              Status
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                          {dataBranchTransaction?.map((value, index) => {
                            return (
                              <>
                                <tr>
                                  <td className="px-4 py-4 text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
                                    <div className="inline-flex items-center gap-x-3">
                                      <input
                                        type="checkbox"
                                        className="text-blue-500 border-gray-300 rounded dark:bg-gray-900 dark:ring-offset-gray-900 dark:border-gray-700"
                                      />

                                      <span>{index + 1}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                    <div className="flex items-center gap-x-2">
                                      <h2 className="text-sm font-medium text-gray-800 dark:text-white ">
                                        {value?.name}
                                      </h2>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                    {value?.Date}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                    {value?.purchase}
                                  </td>
                                  <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                    <CurrencyFormat
                                      value={value?.total_price}
                                      displayType={"text"}
                                      thousandSeparator={"."}
                                      decimalSeparator={","}
                                      prefix={"Rp"}
                                    />
                                  </td>
                                  <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                    {value?.status === "Waiting For Payment" ? (
                                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-yellow-500 bg-yellow-100/60 dark:bg-gray-800">
                                        <h2 className="text-sm font-normal">
                                          {value?.status}
                                        </h2>
                                      </div>
                                    ) : value?.status ===
                                      "Waiting For Order Confirmation" ? (
                                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-yellow-500 bg-yellow-100/60 dark:bg-gray-800">
                                        <h2 className="text-sm font-normal">
                                          {value?.status}
                                        </h2>
                                      </div>
                                    ) : value?.status === "Canceled" ? (
                                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-red-500 bg-red-100/60 dark:bg-gray-800">
                                        <h2 className="text-sm font-normal">
                                          {value?.status}
                                        </h2>
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-emerald-500 bg-emerald-100/60 dark:bg-gray-800">
                                        <h2 className="text-sm font-normal">
                                          {value?.status}
                                        </h2>
                                      </div>
                                    )}
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
            </section>
          </>
        ) : null}

        <Footer />
      </div>
    </div>
  );
};
export default AdminHome;
