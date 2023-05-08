import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateCategories from "../components/CreateCategories";
import {
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
  CircularProgress,
  Tooltip,
  Box,
  Select,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../redux/action/categoriesProduct";
import SidebarAdmin from "../components/SidebarAdmin";
import AlertSuccess from "../components/AlertSuccess";
import BackdropResetPassword from "../components/BackdropResetPassword";
import Navbar from "../components/NavbarAdmin";
import { findAllCategory } from "../redux/action/categoriesProduct";
import ReactPaginate from "react-paginate";
import React from "react";
import { handleStateError } from "../redux/action/categoriesProduct";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const [messageSuccess, setMessageSuccess] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [idCategory, setIdCategory] = useState("");
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [msg, setMsg] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  let category = useSelector((state) => state.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(findAllCategory({ sort, page, search }));
  }, [dispatch, page, search, sort]);

  console.log(category);

  useEffect(() => {
    if (category?.category?.data) {
      setPage(category?.category?.page);
      setPages(category?.category?.totalPages);
      setRows(category?.category?.count);
      setDataCategory(category.category?.data);
    }
    if (category?.message) {
      setMessageSuccess(category?.message);
    }
  }, [category]);

  const handleClick = () => {
    setMessageSuccess("");
    dispatch(handleStateError("cancel"));
  };

  const handleDeleteCategory = (e) => {
    setConfirmDelete(`Are you sure want to delete ${e.name} `);
    setIdCategory(e.id);
  };

  const handleConfirm = () => {
    setConfirmDelete("");
    dispatch(deleteCategory(idCategory));
  };

  const handleClose = () => {
    setConfirmDelete("");
  };

  const handleSort = (e) => {
    console.log(e);
    setSort(e);
  };

  const handleSearch = (e) => {
    setSearch(e);
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

  setTimeout(() => {
    dispatch(handleStateError("cancel"));
    setMessageSuccess("");
  }, 3000);

  return (
    <div className="p-4 sm:ml-64">
      <Navbar />
      <section className=" mt-10 shadow shadow-slate-200 border border-slate-200 container mx-auto rounded-md mb-10 ">
        {messageSuccess ? (
          <AlertSuccess title={messageSuccess} handleClick={handleClick} />
        ) : null}

        <h1 className=" text-center font-extrabold text-lg p-10">
          Table List Categories
        </h1>

        <div className=" flex  gap-5 ml-5 mb-10">
          <Box className=" flex items-center md:gap-3 ">
            <h1 className="hidden md:block text-lg">Order By</h1>
            <Select
              w={["fit-content", "220px"]}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="">All Product</option>
              <option value="desc">Name a-z</option>
              <option value="asc">Name z-a</option>
            </Select>
          </Box>
          <InputGroup w={["fit-content", "300px"]}>
            <InputLeftElement
              pointerEvents="none"
              children={<Icon className=" text-xl " icon="ic:round-search" />}
            />
            <Input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.target.value);
                }
              }}
              placeholder="Search Product"
              type="text"
              bgColor="white"
            />
          </InputGroup>
        </div>

        <TableContainer>
          <SidebarAdmin />
          <Table variant="striped">
            <Thead className=" text-center">
              <Tr>
                <Th>Id Product</Th>
                <Th>Name Categories</Th>
                <Th>Created</Th>
                <Th>Updated</Th>
                <Th className=" flex flex-row justify-between items-center ">
                  <Text>Action</Text>
                  <Button>
                    <CreateCategories
                      title={"Create Category Product"}
                      buttonName={"New"}
                      action={"create"}
                      icon={"gridicons:create"}
                      inputName={"Type here..."}
                    />
                  </Button>
                </Th>
              </Tr>
            </Thead>
            {dataCategory.length === 0 ? (
              <TableCaption>
                <div className=" text-center">
                  <CircularProgress isIndeterminate color="green.300" />
                  <p>Loading...</p>
                </div>
              </TableCaption>
            ) : (
              <Tbody>
                {dataCategory?.map((val, idx) => (
                  <Tr key={idx.toLocaleString()} className=" text-center ">
                    <Td>{idx + 1}</Td>
                    <Td>{val?.name}</Td>
                    <Td>{val?.createdAt}</Td>
                    <Td>{val?.updatedAt}</Td>
                    <Td>
                      <div className="flex justify-start mr-2">
                        <Tooltip label="Edit" fontSize="xs">
                          <CreateCategories
                            title={"Update Category Product"}
                            action={"update"}
                            icon={"fluent:calendar-edit-16-regular"}
                            id_category={val.id}
                            tooltip={"Edit"}
                            buttonName={"Edit"}
                            inputName={val.name}
                          />
                        </Tooltip>
                        <Tooltip label="Delete" fontSize="xs">
                          <div
                            onClick={(e) =>
                              handleDeleteCategory({
                                id: val.id,
                                name: val.name,
                              })
                            }
                            className="text-lg  text-red-600 flex items-center ml-2  "
                          >
                            <Icon
                              icon="ph:trash-simple-thin"
                              className="text-lg  text-red-600"
                            />
                            Delete
                          </div>
                        </Tooltip>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </Table>
        </TableContainer>
        {confirmDelete ? (
          <BackdropResetPassword
            message={confirmDelete}
            handleConfirm={handleConfirm}
            handleClose={handleClose}
          />
        ) : null}
        <div className="flex justify-center mt-10 mb-10">
          <div>
            <p>
              Total Rows : {rows} Page : {rows ? page + 1 : 0} of {pages}
            </p>
            <p className="flex justify-center text-red-500">{msg}</p>
          </div>
        </div>
        <div className="flex justify-center mb-10">
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
              containerClassName={"flex items-center justify-center"}
              pageClassName={
                "block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
              }
              activeClassName="bg-purple-300 text-white"
            />
          </nav>
        </div>
      </section>
    </div>
  );
};

export default CategoryProduct;
