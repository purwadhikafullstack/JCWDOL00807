import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CurrencyFormat from "react-currency-format";
import {
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Stack,
  Checkbox,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";

const UserOrderListByQuery = () => {
  const navigate = useNavigate();

  const checkboxRefs = useRef([]);
  const [branch, setBranch] = useState("");
  const [dataOrder, setDataOrder] = useState([]);
  const [dataStatus, setDataStatus] = useState([
    "Waiting For Payment",
    "Waiting For Confirmation Payment",
    "Canceled",
    "Ongoing",
    "On Delivering",
    "Order Confirmed",
  ]);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  let sort = useRef();
  let asc = useRef();



  const getOrderList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      console.log(inputSort, inputAsc);
      console.log(keyword, page);
      console.log(status);
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/user/order_search?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}&status=${status}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setDataOrder(response?.data?.data?.result);
      setBranch(response?.data?.data?.result[0].name);
      setPage(response?.data?.data?.page);
      setPages(response?.data?.data?.totalPage);
      setRows(response?.data?.data?.totalRows[0].count_row);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCheckboxChange = () => {
    const checkedValues = checkboxRefs.current
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    console.log(checkedValues.join(","));
    let checkedValuesString = checkedValues.join(",");
    setStatus(checkedValuesString);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "Cannot found data that you search, please search with another specific keyword "
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    getOrderList();
  };

  useEffect(() => {
    getOrderList();
  }, [page, keyword]);

  const handleAscSort = () => {
    getOrderList();
  };

  const handleDetailButton = (idtrx) => {
    navigate(`/accounts/detail-order-list/${idtrx}`)
  };

  const handleUploadPayment = (idtrx) => {
    navigate(`/upload/payment-proof?id=${idtrx}`);
  }
  return (
    <>
        <Navbar />
      <div className="p-4 sm:ml-0">
        <form className="m-5 flex justify-start" onSubmit={searchData}>
          <label
            for="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute mt-10 left-0 flex items-center pl-3  pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className=" mt-5 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Invoice Number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "30em" }}
            />
            <button
              type="submit"
              className=" text-white absolute right-2.5 mt-7 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
          <div className="relative flex items-center">
            <h3 className="mt-6 ml-5 mb-6 font-semibold text-gray-900 dark:text-white">
              Status- Filter
            </h3>

            {dataStatus?.map((value, index, idx) => {
              return (
                <>
                  <Stack direction={["column", "row"]}>
                    <div className="flex items-center pl-3">
                      <Checkbox
                        id={value + "-checkbox"}
                        type="checkbox"
                        name="category"
                        value={value}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        ref={(el) => (checkboxRefs.current[index] = el)}
                        onChange={handleCheckboxChange}
                      />
                      <label
                        for={value + "-checkbox"}
                        className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        {value}
                      </label>
                    </div>
                  </Stack>
                </>
              );
            })}
          </div>

          <div className="mt-5 mb-5 ml-5 ">
            <Select ref={sort} onChange={() => handleAscSort()}>
              <option value="id">Sort By Id</option>
              <option value="price">Sort By Price</option>
              <option value="status">Sort By Status </option>
              <option value="invoice">Sort By Invoice Number</option>
              <option value="expired">Sort By Expired Date</option>
              <option value="name">Sort by Username</option>
              <option value="date">Sort by Date</option>
            </Select>
          </div>
          <div className="mt-5 mb-5 ml-5 ">
            <Select ref={asc} onChange={() => handleAscSort()}>
              <option selected value="asc">
                Ascending
              </option>
              <option value="desc">Descending</option>
            </Select>
          </div>
        </form>

        <section className=" mt-10 mb-10 shadow shadow-slate-200 border border-slate-200 container mx-auto rounded-md ">
          <TableContainer>
            <Table variant="striped">
              <TableCaption
                placement="top"
                fontSize="lg"
                fontWeight="bold"
                textAlign="center"
              >
                Order List Table - {branch}
              </TableCaption>
              <Thead className=" text-center">
                <Tr>
                  <Th>No</Th>
                  <Th>Invoice Number</Th>
                  <Th>Date</Th>
                  <Th>Total Price</Th>
                  <Th>Status</Th>
                  <Th>Payment Proof</Th>
                  <Th>Expired Date</Th>
                  <Th>UpdatedAt</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataOrder?.map((value, index, idx) => {
                  return (
                    <Tr className=" text-center " key={value.id}>
                      <Td>{index + 1}</Td>
                      <Td>{value.invoice_no}</Td>
                      <Td>{value.Date}</Td>
                      <Td>
                        <CurrencyFormat
                          value={value.total_price}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          prefix={"Rp"}
                        />
                      </Td>
                      <Td>
                        {value?.status === "Waiting For Payment" ? (
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
                        ) : value?.status ===
                          "Waiting For Confirmation Payment" ? (
                          <div className="inline-flex items-center px-3 py-1 rounded-full gap-x-2 text-yellow-500 bg-yellow-100/60 dark:bg-gray-800">
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
                      </Td>
                      <Td>
                        <img
                          src={value.payment_proof}
                          alt="*"
                          width="100"
                          height="150"
                        ></img>
                      </Td>
                      <Td>{value.expired_date}</Td>
                      <Td>{value.updatedAt}</Td>
                      <Td>
                        <button className="text-lg text-blue-600 button flex items-center ml-2 hover:underline" onClick={() => handleDetailButton(value.id)}>
                          <span>See Detail</span>
                        </button>
                        {!value.payment_proof && (
                          <button className="text-lg text-blue-600 button flex items-center ml-2 hover:underline" onClick={() => handleUploadPayment(value.id)}>
                            <span>Upload Payment Proof</span>
                          </button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </section>
        <div className="flex justify-center mt-10 mb-10">
          <div>
            <p>
              Total Rows : {rows}  Page : {rows ? page + 1 : 0} of {pages}
            </p>
            <p className="flex justify-center text-red-500">{msg}</p>
          </div>
        </div>
        <div className="flex justify-center mt-10 mb-10">
          <nav key={rows} role="navigation" aria-label="pagination">
            <ReactPaginate
              breakLabel={
                <span ClassName="flex justify-center mr-4 ml-4">...</span>
              }
              previousLabel={"< Prev"}
              nextLabel={"Next >"}
              pageCount={Math.min(10, pages)}
              pageRangeDisplayed={5}
              onPageChange={changePage}
              containerClassName={"flex items-center justify-center mt-8 mb-4"}
              pageClassName={
                "block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
              }
              activeClassName="bg-purple-300 text-white"
            />
          </nav>
        </div>
        <Footer />
      </div>
    </>
  );
};
export default UserOrderListByQuery;
