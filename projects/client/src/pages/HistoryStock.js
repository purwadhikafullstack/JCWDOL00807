import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
import CurrencyFormat from "react-currency-format";
import SidebarAdmin from "../components/SidebarAdmin";
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
  Button,
  ButtonGroup,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";

import DialogConfirmation from "../components/DialogConfirmation";

const HistoryStockByQuery = () => {
  const navigate = useNavigate();

  const checkboxRefs = useRef([]);
  const [branch, setBranch] = useState("");
  const [dataHistory, setDataHistory] = useState([]);
  
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  let sort = useRef();
  let asc = useRef();


  const getHistoryList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      console.log(inputSort, inputAsc);
      console.log(keyword, page);
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/admin/history_stock?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setDataHistory(response?.data?.data?.result);
      setBranch(response?.data?.data?.result[0].branch_store);
      setPage(response?.data?.data?.page);
      setPages(response?.data?.data?.totalPage);
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
    getHistoryList();
  };

  useEffect(() => {
    getHistoryList();
  }, [page, keyword]);

  const handleAscSort = () => {
    getHistoryList();
  };

  return (
    <>
      <SidebarAdmin />
      <div className="p-4 sm:ml-64">
        <Navbar />
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
              placeholder="Search..."
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

          <div className="mt-5 mb-5 ml-5 ">
            <Select ref={sort} onChange={() => handleAscSort()}>
              <option value="id">Sort By No</option>
              <option value="admin">Sort By Admin Name</option>
              <option value="product">Sort By Product Name </option>
              {/* <option value="branch">Sort By Branch Store</option> */}
              <option value="date">Sort By Created Date</option>
              <option value="qty">Sort by Quantity</option>
            </Select>
          </div>
          <div className="mt-5 mb-5 ml-5 ">
            <Select ref={asc} onChange={() => handleAscSort()} defaultValue="desc">
              <option value="desc">Descending</option>
              <option selected value="asc">
                Ascending
              </option>
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
                History Stock Logs - {branch}
              </TableCaption>
              <Thead className=" text-center">
                <Tr>
                  <Th>No</Th>
                  <Th>Admin Name</Th>
                  <Th>Branch Store</Th>
                  <Th>Product Name</Th>
                  <Th>Quantity</Th>
                  <Th>Description</Th>
                  <Th>Created Date</Th>
                  <Th>Updated Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataHistory?.map((value, index) => {
                  return (
                    <Tr className=" text-center " key={value.id}>
                      <Td>{index + 1}</Td>
                      <Td>{value.admin_name}</Td>
                      <Td>{value.branch_store}</Td>
                      <Td>{value.product_name}</Td>
                      <Td>{value.qty}</Td>
                      <Td>{value.description}</Td>
                      <Td>{value.created_at}</Td>
                      <Td>{value.updated_at}</Td>
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
export default HistoryStockByQuery;
