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

const ProductListByQuery = () => {
  const navigate = useNavigate();
  const [dataCategories, setDataCategories] = useState([]);
  // const [categories, setCategories] = useState({
  //   category: [],
  //   response: [],
  // });
  const checkboxRefs = useRef([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  let sort = useRef();
  let asc = useRef();
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
      // console.log(dataCategories, dataDiscountType, dataVoucherType);
    } catch (error) {
      console.log(error);
    }
  };

  const getProductList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      console.log(inputSort, inputAsc);
      console.log(keyword, page);
      console.log(category);
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/admin/product_search?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}&categories=${category}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      console.log(response);
      setDataProduct(response?.data?.data?.result);
      setPage(response?.data?.data?.page);
      setPages(response?.data?.data?.totalPage);
      console.log(response.data.data.totalRows[0].count_row);
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
    setCategory(checkedValuesString);
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
    getProductList();
  };

  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("my_Token");

    if (!token) {
      navigate("/admin/login");
    }
    getProductList();
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
              placeholder="Search Product Name, Discount Type, Categories and Voucher Type"
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
          <div>
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Category Product - Filter
            </h3>
            <ul className="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
              {dataCategories?.map((value, index) => {
                return (
                  <>
                    <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                      <div className="flex items-center pl-3">
                        <input
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
                    </li>
                  </>
                );
              })}
            </ul>
          </div>
          <div className="ml-10 ">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">
              Sorting Data By:
            </h3>
            <Select ref={sort}>
              <option value="id">Sort By Id</option>
              <option value="price">Sort By Price</option>
              <option value="name">Sort By Name </option>
              <option value="category">Sort By Category</option>
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
                Product List Table
              </TableCaption>
              <Thead className=" text-center">
                <Tr>
                  <Th>Id Product</Th>
                  <Th>Name</Th>
                  <Th>Images</Th>
                  <Th>Categories</Th>
                  <Th>Weight</Th>
                  <Th>Stock</Th>
                  <Th>Price</Th>
                  <Th>Created At</Th>
                  <Th>Updated At</Th>
                  <Th>Voucher Type</Th>
                  <Th>Discount Type</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataProduct?.map((value, index) => {
                  return (
                    <Tr className=" text-center " key={value.id}>
                      <Td>{value.id}</Td>
                      <Td>{value.name}</Td>
                      <Td>
                        <img
                          src={value.images}
                          alt="*"
                          width="150"
                          height="75"
                        ></img>
                      </Td>
                      <Td>{value.categories}</Td>
                      <Td>{value.weight}</Td>
                      <Td>{value.stock}</Td>
                      <Td>
                        <CurrencyFormat
                          value={value.price}
                          displayType={"text"}
                          thousandSeparator={"."}
                          decimalSeparator={","}
                          prefix={"Rp"}
                        />
                      </Td>
                      <Td>{value.createdAt}</Td>
                      <Td>{value.updatedAt}</Td>
                      {value.voucherType ? (
                        <>
                          <Td>{value.voucherType}</Td>
                        </>
                      ) : (
                        <Td>-</Td>
                      )}
                      {value.discountType ? (
                        <>
                          <Td>{value.discountType}</Td>
                        </>
                      ) : (
                        <>
                          <Td>-</Td>
                        </>
                      )}
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
export default ProductListByQuery;
