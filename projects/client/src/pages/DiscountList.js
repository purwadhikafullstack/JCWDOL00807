import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/NavbarAdmin";
import Footer from "../components/Footer";
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
  Button,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";

const DiscountListByQuery = () => {
  const navigate = useNavigate();
  const [dataDiscount, setDataDiscount] = useState([]);
  const [idDiscount, setIdDiscount] = useState("");
  const [discountType, setDiscountType] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  let sort = useRef();
  let asc = useRef();

  const getDiscountList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      console.log(inputSort, inputAsc);
      console.log(keyword, page);
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/discount/discount_search?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      setDataDiscount(response?.data?.data?.result);
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
  const handleConfirm = async (idDiscount) => {
    try {
      const token = localStorage.getItem("my_Token");
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/discount/discount/${idDiscount}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      onClose();
      getDiscountList();
    } catch (error) {
      console.log(error);
    }
  };
  const handleOnEdit = (idDiscount) => {
    navigate(`edit/${idDiscount}`);
  };
  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setKeyword(query);
    getDiscountList();
  };
  const handleOnOpen = async (idDiscount, discountType) => {
    setIdDiscount(idDiscount);
    setDiscountType(discountType);
    onOpen();
  };
  useEffect(() => {
    const token = localStorage.getItem("my_Token");

    if (!token) {
      navigate("/admin/login");
    }
    getDiscountList();
  }, [page, keyword]);
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
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 mb-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className=" mb-3 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Discount Type"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "30em" }}
            />
            <button
              type="submit"
              className=" text-white absolute right-2.5 bottom-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
          <div className="ml-10 mt-3 ">
            <Select ref={sort}>
              <option value="id">Sort By Id</option>
              <option value="type">Sort By Type</option>
              <option value="start">Sort By Discount Start </option>
              <option value="end">Sort By Discount End</option>
              <option value="status">Sort By Status</option>
            </Select>
          </div>
          <div className="ml-10 mt-3 ">
            <Select ref={asc}>
              <option selected value="asc">
                Ascending
              </option>
              <option value="desc">Descending</option>
            </Select>
          </div>
        </form>

        <Button size="xs" colorScheme="whatsapp" className="mt-5 ml-10 mr-10">
          <Icon icon="wpf:create-new" className="text-lg" />
          <Link to="/admin/manage-discount/create">+Create New Discount </Link>
        </Button>
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
                Discount List Table
              </TableCaption>
              <Thead className=" text-center">
                <Tr>
                  <Th>No.</Th>
                  <Th>Discount Type</Th>
                  <Th>Description</Th>
                  <Th>Discount(Rp)</Th>
                  <Th>Discount(%)</Th>
                  <Th>Discount Start at</Th>
                  <Th>Discount End at</Th>
                  <Th>Status</Th>
                  <Th>Created At</Th>
                  <Th>Updated At</Th>
                  <Th className=" flex flex-row justify-between ">
                    <Text>Action</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataDiscount?.map((value, index) => {
                  return (
                    <Tr className=" text-center " key={value.id}>
                      <Td>{index + 1}</Td>
                      <Td>{value.discount_type}</Td>
                      <Td>{value.description}</Td>
                      {value.cut_nominal ? (
                        <>
                          <Td>{value.cut_nominal}</Td>
                        </>
                      ) : (
                        <>
                          <Td>-</Td>
                        </>
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
                      <Td>{value.start}</Td>
                      <Td>{value.end}</Td>
                      {value.status === 1 ? (
                        <>
                          <Td>Active</Td>
                        </>
                      ) : (
                        <Td>Not Active</Td>
                      )}
                      <Td>{value.createdAt}</Td>
                      <Td>{value.updatedAt}</Td>
                      <Td>
                        <Button
                          size="xs"
                          colorScheme="whatsapp"
                          onClick={() => handleOnEdit(value.id)}
                        >
                          <Icon
                            icon="fluent:calendar-edit-16-regular"
                            className="text-lg"
                          />
                          Edit
                        </Button>
                        <Button
                          ml={2}
                          size="xs"
                          colorScheme="red"
                          onClick={() =>
                            handleOnOpen(value.id, value.discount_type)
                          }
                        >
                          <Icon
                            icon="ph:trash-simple-thin"
                            className="text-lg"
                          />
                          Delete
                        </Button>
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
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Discount Type {discountType}
              </AlertDialogHeader>

              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    handleConfirm(idDiscount);
                  }}
                  ml={3}
                >
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </div>
    </>
  );
};
export default DiscountListByQuery;
