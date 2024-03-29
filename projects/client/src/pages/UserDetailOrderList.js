import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import CurrencyFormat from "react-currency-format";
import CancelUserOrder from "../components/CancelUserOrder";
import {
  ButtonGroup,
  Button,
  Select,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import ReactPaginate from "react-paginate";
import SidebarUser from "../components/SidebarUser";
import BackdropResetPassword from "../components/BackdropResetPassword";
import DialogConfirmation from "../components/DialogConfirmation";
import { useSelector } from "react-redux";

const UserDetailOrderListByQuery = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [branch, setBranch] = useState("");
  const [dataDetailOrder, setDataDetailOrder] = useState([]);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");
  const [messageCancel, setMessageCancel] = useState("");
  const [cancelErrorMessage, setCancelErrorMessage] = useState("");
  const [branchStore, setBranchStore] = useState("");
  const [branchId, setBranchId] = useState("");
  let sort = useRef();
  let asc = useRef();

  const allowedApprove = ["On Delivering"];
  const [isApprove, setIsApprove] = useState();
  let userProductList = useSelector((state) => state.userProduct);
  // console.log(userProductList);

  useEffect(() => {
    // console.log(userProductList.userProduct.data.branch);
    if (!userProductList?.loading) {
      setBranchStore(userProductList?.userProduct?.data?.branch);
      setBranchId(userProductList?.userProduct?.data?.branch_id);
    }
  }, [userProductList]);

  console.log(branchStore);
  console.log(branchId);

  const getDetailOrderList = async () => {
    try {
      const token = localStorage.getItem("my_Token");
      let inputSort = sort.current.value;
      let inputAsc = asc.current.value;
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/user/detailorder_search/${id}?search_query=${keyword}&page=${page}&limit=${limit}&sort=${inputSort}&asc=${inputAsc}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      // console.log(response);
      setDataDetailOrder(response?.data?.data?.result);
      setBranch(
        `transaction ${
          response?.data?.data?.result[0]?.invoice_no || "-"
        } on status ${response?.data?.data?.result[0]?.status || "-"}`
      );
      setPage(response?.data?.data?.page);
      setPages(response?.data?.data?.totalPage);
      setRows(response?.data?.data?.totalRows[0].count_row);
      setIsApprove(
        allowedApprove.includes(response?.data?.data?.result[0]?.status)
      );
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
    getDetailOrderList();
  }, [page, keyword]);

  const handleAscSort = () => {
    getDetailOrderList();
  };

  const handleReasonCancellation = async (reason, onClose) => {
    try {
      const token = localStorage.my_Token;
      console.log(token);
      const cancelOrder = await axios.patch(
        ` ${process.env.REACT_APP_API_BASE_URL}/transaction/cancel-order-by-user?transactionId=${dataDetailOrder[0]?.transactions_id}&cancellation_reasons=${reason}&branchId=${branchId}&branchStore=${branchStore}`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      );

      onClose();
      setMessageCancel(cancelOrder.data.message);
    } catch (error) {
      console.log(error.response.data.message);
      setCancelErrorMessage(error.response.data.message);
    }
  };

  const handleClose = () => {
    setMessageCancel("");
    navigate("/accounts/order-list");
  };

  const handleUploadPayment = (idtrx) => {
    navigate(`/upload/payment-proof?id=${idtrx}`);
  };

  const updateStatus = async (idtrx) => {
    handleCloseDialog();
    try {
      const token = localStorage.getItem("my_Token");
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/transaction/order-confirmed/${idtrx}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      const { data } = response?.data;
      setBranch(
        `transaction ${data?.invoice_no || "-"} on status ${
          data?.status || "-"
        }`
      );
      setIsApprove(allowedApprove.includes(data?.status));
    } catch (error) {
      console.log(error);
    }
  };

  const [dialogMsg, setDialogMsg] = useState("");
  const [trxId, setTrxId] = useState("");
  const [btnTitleYes, setBtnTitleYes] = useState("");
  const handleConfirmDialog = (idtrx) => {
    updateStatus(idtrx);
  };

  const handleCloseDialog = () => {
    setDialogMsg("");
    setTrxId("");
    setBtnTitleYes("");
  };

  const backToOrderList = () => {
    navigate("/accounts/order-list");
  };

  return (
    <>
      <Navbar />
      <div className="p-4 sm:ml-0">
        <form className="m-5 justify-start hidden" onSubmit={searchData}>
          <label
            for="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="mt-3 absolute inset-y-0 left-0 flex items-center pl-3  pointer-events-none">
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
              className=" mt-5 p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search id or product name or quantity or discount type or voucher type"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: "50em" }}
            />
            <button
              type="submit"
              className=" text-white absolute right-2.5 bottom-4 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>

          <div className="mt-5 mb-5 ml-5 ">
            <Select ref={sort} onChange={() => handleAscSort()}>
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
          <Button
            className="flex font-semibold text-indigo-600 text-sm mt-10 ml-2"
            onClick={backToOrderList}
          >
            <svg
              className="fill-current mr-2 text-indigo-600 w-4"
              viewBox="0 0 448 512"
            >
              <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
            </svg>
            Back to Order List
          </Button>
          <TableContainer>
            <Table variant="striped">
              <TableCaption
                placement="top"
                fontSize="lg"
                fontWeight="bold"
                textAlign="center"
              >
                Detail Order List Table - {branch}
              </TableCaption>
              <TableCaption placement="top" textAlign="end" mt="-3" mb="4">
                <ButtonGroup>
                  <CancelUserOrder
                    status={dataDetailOrder[0]?.status}
                    handleSubmit={handleReasonCancellation}
                    errorMessage={cancelErrorMessage}
                  />
                  {dataDetailOrder[0]?.status == "Waiting For Payment" && (
                    <Button
                      colorScheme="pink"
                      onClick={() => handleUploadPayment(id)}
                    >
                      Upload Payment Proof
                    </Button>
                  )}
                  {isApprove && (
                    <Button
                      colorScheme="green"
                      onClick={() => {
                        setDialogMsg(
                          `Are you sure Approve this transaction ${dataDetailOrder[0]?.invoice_no} ?`
                        );
                        setTrxId(id);
                        setBtnTitleYes("Yes, Approve!");
                      }}
                    >
                      Approve Order
                    </Button>
                  )}
                </ButtonGroup>
              </TableCaption>

              <Thead className=" text-center">
                <Tr>
                  {/* <Th>Id</Th> */}
                  {/* <Th>Transaction Id</Th> */}
                  <Th>No</Th>
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
                      {/* <Td>{value.id}</Td> */}
                      {/* <Td>{value.transactions_id}</Td> */}
                      <Td>{index + 1}</Td>
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
        {messageCancel ? (
          <BackdropResetPassword
            message={messageCancel}
            handleClose={handleClose}
          />
        ) : null}

        {dialogMsg ? (
          <DialogConfirmation
            message={dialogMsg}
            btnTitleNo="Close"
            btnTitleYes={btnTitleYes}
            handleClose={handleCloseDialog}
            handleYes={() => handleConfirmDialog(trxId)}
            handleNo={handleCloseDialog}
          />
        ) : null}

        <Footer />
      </div>
    </>
  );
};
export default UserDetailOrderListByQuery;
