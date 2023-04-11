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
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../redux/action/categoriesProduct";
import SidebarAdmin from "../components/SidebarAdmin";
import AlertSuccess from "../components/AlertSuccess";
import BackdropResetPassword from "../components/BackdropResetPassword";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { findAllCategory } from "../redux/action/categoriesProduct";

const CategoryProduct = () => {
  const navigate = useNavigate();
  const [messageSuccess, setMessageSuccess] = useState("");
  const [dataCategory, setDataCategory] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [idCategory, setIdCategory] = useState("");

  let category = useSelector((state) => state.category.category);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(findAllCategory());
  }, [dispatch]);

  useEffect(() => {
    let token = localStorage.my_Token;
    if (!token) {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (category?.data) {
      setDataCategory(category.data);
    }
    if (category?.message) {
      setMessageSuccess(category?.message);
    }
  }, [category]);

  const handleClick = () => {
    setMessageSuccess("");
  };

  const handleDeleteCategory = (e) => {
    setConfirmDelete(`Are you sure want to delete ${e.name} `);
    setIdCategory(e.id);
  };

  const handleConfirm = () => {
    setConfirmDelete("");
    dispatch(deleteCategory(idCategory));

    console.log(idCategory);
  };

  const handleClose = () => {
    setConfirmDelete("");
  };

  return (
    <div className="p-4 sm:ml-64">
      <Navbar />
      <section className=" mt-10 shadow shadow-slate-200 border border-slate-200 container mx-auto rounded-md mb-10 ">
        {messageSuccess ? (
          <AlertSuccess title={messageSuccess} handleClick={handleClick} />
        ) : null}

        <TableContainer>
          <SidebarAdmin />

          <Table variant="striped">
            <TableCaption>Tabel List Categories</TableCaption>
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
                    <Td>{val?.id}</Td>
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
                          <div className="text-lg  text-red-600 flex items-center ml-2 ">
                            <Icon
                              icon="ph:trash-simple-thin"
                              className="text-lg  text-red-600"
                              onClick={(e) =>
                                handleDeleteCategory({
                                  id: val.id,
                                  name: val.name,
                                })
                              }
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
      </section>
      <Footer />
    </div>
  );
};

export default CategoryProduct;
