import { useEffect, useState } from "react";
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
import UpdateStock from "../components/UpdateStock";

const ProductCRUD = () => {
  const [dataProduct, setDataProduct] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState("");
  const [idProduct, setIdProduct] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [limit, setLimit] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [rows, setRows] = useState(0);

  const getProductbyQuery = async () => {
    let token = localStorage.my_Token;
    const response = await axios.get(
      `
    ${process.env.REACT_APP_API_BASE_URL}/product_search?search_query=${keyword}&page=${page}&limit=${limit}`,
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
    setRows(response?.data?.data?.totalRows[0].count_row);
  };
  const getProductList = async () => {
    try {
      let token = localStorage.my_Token;
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
  const handleConfirm = async (idProduct) => {
    try {
      let token = localStorage.my_Token;
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/admin/product/${idProduct}`,
        {
          headers: {
            authorization: token,
          },
        }
      );
      onClose();
      getProductList();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnOpen = async (id, name) => {
    setIdProduct(id);
    setNameProduct(name);
    onOpen();
  };
  useEffect(() => {
    getProductList();
    // getProductbyQuery();
  }, []);

  return (
    <>
      <SidebarAdmin />
      <div className="p-4 sm:ml-64">
        <Navbar />
        <Button size="xs" colorScheme="whatsapp" className="mt-5 ml-5 mr-5">
          <Icon icon="wpf:create-new" className="text-lg" />
          <Link to="/admin/manage-product/create">+Create New Product </Link>
        </Button>
        <section className=" mt-10 mb-10 shadow shadow-slate-200 border border-slate-200 container mx-auto rounded-md ">
          <TableContainer>
            <SidebarAdmin />
            <Table variant="striped">
              <TableCaption>Product List Table</TableCaption>
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
                  <Th className=" flex flex-row justify-between ">
                    <Text>Action</Text>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataProduct?.map((value, index) => {
                  return (
                    <Tr className=" text-center ">
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
                      <Td>{value.voucherType}</Td>
                      <Td>{value.discountType}</Td>
                      <Td>
                        <UpdateStock
                          id_product={value.id}
                          name_product={value.name}
                          stock={value.stock}
                          getProductList={getProductList}
                        />
                        <Button size="xs" colorScheme="whatsapp">
                          <Icon
                            icon="fluent:calendar-edit-16-regular"
                            className="text-lg"
                          />
                          <Link to={`edit/${value.id}`}>Edit</Link>
                        </Button>
                        <Button
                          ml={2}
                          size="xs"
                          colorScheme="red"
                          onClick={() => handleOnOpen(value.id, value.name)}
                          // setIdProduct(value.id),
                          // setNameProduct(value.name)
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
        <Footer />
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Product {nameProduct}
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
                    handleConfirm(idProduct);
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
export default ProductCRUD;
