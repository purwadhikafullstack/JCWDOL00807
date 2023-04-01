import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CurrencyFormat from "react-currency-format";
import SidebarAdmin from "../components/SidebarAdmin";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tfoot,
  Button,
  Text,
  useDisclosure,
  isOpen,
  onOpen,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import { useSelector } from "react-redux";
import BackdropResetPassword from "../components/BackdropResetPassword";
import React from "react";
import ReactPaginate from "react-paginate";

const DetailOrderListByQuery = () => {
  const navigate = useNavigate();

  const checkboxRefs = useRef([]);
  const [branch, setBranch] = useState("");
  const [dataDetailOrder, setDataDetailOrder] = useState([]);
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

  const getDetailOrderList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      console.log(inputSort, inputAsc);
      console.log(keyword, page);
      console.log(status);
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/admin/detailorder_search?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response);
      setDataDetailOrder(response?.data?.data?.result);
      setBranch(response?.data?.data?.branchName);
      setPage(response?.data?.data?.page);
      setPages(response?.data?.data?.totalPage);
      console.log(response.data.data.totalRows[0].count_row);
      setRows(response?.data?.data?.totalRows[0].count_row);
    } catch (error) {
      console.log(error);
    }
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
    getDetailOrderList();
  };

  useEffect(() => {
    const token = localStorage.getItem("my_Token");

    if (!token) {
      navigate("/admin/login");
    }
    getDetailOrderList();
  }, [page, keyword]);
  return (
    <>
      <SidebarAdmin />
      <div className="p-4 sm:ml-64">
        <Navbar />
        <form className="m-10" onSubmit={searchData}>
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search id or product name or quantity or discount type or voucher type or username "
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>

        <div className="m-10 flex justify-start">
          <div className="ml-10 ">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Sorting Data By:
            </h3>
            <Select ref={sort}>
              <option value="id">Sort By Id</option>
              <option value="transaction">Sort By Transaction Id</option>
              <option value="product">Sort By Product Name </option>
              <option value="qty">Sort By Quantity</option>
              <option value="discount">Sort By Discount Type</option>
              <option value="voucher">Sort By Voucher Type</option>
              <option value="price">Sort By Price</option>
              <option value="name">Sort by Username</option>
              <option value="weight">Sort By Weight</option>
              <option value="percentage">Sort by Percentage Off</option>
              <option value="nominal">Sort By Nominal Off</option>
            </Select>
          </div>
          <div className="ml-10 ">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Ordered by
            </h3>
            <Select ref={asc}>
              <option selected value="asc">
                Ascending
              </option>
              <option value="desc">Descending</option>
            </Select>
          </div>
        </div>
        <section className=" mt-10 mb-10 shadow shadow-slate-200 border border-slate-200 container mx-auto rounded-md ">
          <TableContainer>
            <SidebarAdmin />
            <Table variant="striped">
              <TableCaption
                placement="top"
                fontSize="lg"
                fontWeight="bold"
                textAlign="center"
              >
                Detail Order List Table - {branch}
              </TableCaption>
              <Thead className=" text-center">
                <Tr>
                  <Th>Id</Th>
                  <Th>Transaction Id</Th>
                  <Th>Product Name</Th>
                  <Th>Quantity</Th>
                  <Th>Price per item</Th>
                  <Th>Weight(kg)</Th>
                  <Th>Discount Type</Th>
                  <Th>Voucher Type</Th>
                  <Th>Discount(Rp)</Th>
                  <Th>Discount(%)</Th>
                  <Th>CreatedAt</Th>
                  <Th>UpdatedAt</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataDetailOrder?.map((value, index) => {
                  return (
                    <Tr className=" text-center " key={value.id}>
                      <Td>{value.id}</Td>
                      <Td>{value.transactions_id}</Td>
                      <Td>{value.product_name}</Td>
                      <Td>{value.qty}</Td>
                      <Td>
                        <CurrencyFormat
                          value={value.price_per_item}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          prefix={"Rp"}
                        />
                      </Td>
                      <Td>{value.weight}</Td>
                      {value.discount_type ? (
                        <>
                          <Td>{value.discount_type}</Td>
                        </>
                      ) : (
                        <>
                          <Td>-</Td>
                        </>
                      )}
                      {value.voucher_type ? (
                        <>
                          <Td>{value.voucher_type}</Td>
                        </>
                      ) : (
                        <Td>-</Td>
                      )}
                      {value.cut_nominal ? (
                        <>
                          <Td>
                            <CurrencyFormat
                              value={value.cut_nominal}
                              displayType={"text"}
                              thousandSeparator={"."}
                              decimalSeparator={","}
                              prefix={"Rp"}
                            />
                          </Td>
                        </>
                      ) : (
                        <Td>-</Td>
                      )}
                      {value.cut_percentage ? (
                        <>
                          <Td>{value.cut_percentage * 100}%</Td>
                        </>
                      ) : (
                        <>
                          <Td>-</Td>
                        </>
                      )}
                      <Td>{value.createdAt}</Td>
                      <Td>{value.updatedAt}</Td>
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
              Total Rows : {rows} Page : {rows ? page + 1 : 0} of {pages}
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
export default DetailOrderListByQuery;
