import Navbar from "../components/NavbarAdmin";
import SidebarAdmin from "../components/SidebarAdmin";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { listAdminByRole, deleteAdminByRole } from "../redux/action/admin";
import CreateAdmin from "../components/CreateAdmin";
import ReactPaginate from "react-paginate";

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
  Badge,
  Input,
  InputRightAddon,
  InputGroup,
  FormControl,
  HStack,
} from "@chakra-ui/react";
import { Icon } from "@iconify/react";
import AlertSuccess from "../components/AlertSuccess";
import BackdropResetPassword from "../components/BackdropResetPassword";
import Footer from "../components/Footer";
import MyPagination from "../components/MyPagination";

const AdminManagement = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admins, page, limit } = useSelector((state) => state.admin);
  const { totalRecord, totalReturn, contents, searchText } = admins;

  const [confirmDelete, setConfirmDelete] = useState("");
  const [idAdmin, setIdAdmin] = useState("");

  const [messageSuccess, setMessageSuccess] = useState("");

  useEffect(() => {
    console.log("useeffect navigate");
    dispatch(listAdminByRole(page, limit, searchText));
  }, [navigate]);

  const handleDeleteAdmin = (e) => {
    setConfirmDelete(`Are you sure want to delete ${e.name}?`);
    setIdAdmin(e.id);
  };

  const handleConfirm = () => {
    setConfirmDelete("");
    dispatch(deleteAdminByRole(idAdmin));
  };

  const handleClose = () => {
    setConfirmDelete("");
  };

  const handleClick = () => {
    setMessageSuccess("");
  };

  const handlePageChange = (newPage) => {
    console.log("handlepage");
    dispatch(listAdminByRole(newPage, limit, searchText));
  };

  const handlePrevClick = (prevPage) => {
    dispatch(listAdminByRole(prevPage, limit, searchText));
  };

  const handleNextClick = (nextPage) => {
    dispatch(listAdminByRole(nextPage, limit, searchText));
  };

  const handleSearchChange = (e) => {
    const {
      target: { value },
    } = e;
    dispatch(listAdminByRole(page, limit, value));
  };

  return (
    <div>
      <SidebarAdmin />
      <div className="p-4 sm:ml-64">
        <Navbar />
        <div className="flex-grow">
          <span className="text-center block mt-4 font-bold">
            Tabel List Admin Branch
          </span>
          <form class="form w-3/12 my-4 ml-4">
            <Input
              class="w-full bg-gray-200"
              onChange={(e) => handleSearchChange(e)}
              type="text"
              placeholder="Search..."
            />
          </form>
        </div>

        {/* <InputGroup size="md" w="md">
        <Input placeholder="cari" type="text" p="5" bgColor="white" />
        <InputRightAddon>
          <Icon className=" text-xl " icon="ic:round-search" />
        </InputRightAddon>
      </InputGroup> */}
        <div>
          {messageSuccess ? (
            <AlertSuccess title={messageSuccess} handleClick={handleClick} />
          ) : null}
          <TableContainer>
            {/* <SidebarAdmin /> */}
            <Table variant="striped">
              {/* <TableCaption>Tabel List Admin Branch</TableCaption> */}

              <Thead className="text-center">
                <Tr>
                  <Th>No</Th>
                  <Th>Name </Th>
                  <Th>Branch Store</Th>
                  <Th>Email </Th>
                  <Th>Role </Th>
                  <Th>isActive</Th>
                  <Th className=" flex flex-row justify-between items-center ">
                    <Text>Action</Text>
                    <Button className="ml-4" title="New Admin">
                      <CreateAdmin
                        title={"Create Admin Branch"}
                        buttonName={"New"}
                        action={"create"}
                        icon={"gridicons:create"}
                      />
                    </Button>
                  </Th>
                </Tr>
              </Thead>
              {contents.length === 0 ? (
                <TableCaption>
                  <div className=" text-center">
                    <CircularProgress isIndeterminate color="green.300" />
                    <p>Loading...</p>
                  </div>
                </TableCaption>
              ) : (
                <Tbody>
                  {contents?.map((val, idx) => {
                    return (
                      <Tr key={idx} className=" text-center ">
                        <Td>{idx + 1}</Td>
                        <Td>{val?.name}</Td>
                        <Td>{val?.branch_store?.name}</Td>
                        <Td>{val?.email}</Td>
                        <Td>{val?.role}</Td>
                        <Td>
                          <Badge
                            colorScheme={val?.isActive ? "green" : "red"}
                            borderRadius="full"
                            px="2"
                          >
                            {val?.isActive ? "Active" : "Not Active"}
                          </Badge>
                        </Td>
                        <Td>
                          <div className="flex justify-start mr-2">
                            <Tooltip label="Edit" fontSize="xs">
                              <CreateAdmin
                                title={"Update Admin"}
                                action={"update"}
                                icon={"fluent:calendar-edit-16-regular"}
                                tooltip={"Edit"}
                                buttonName={"Edit"}
                                data={val}
                                admin_id={val?.id}
                              />
                            </Tooltip>
                            <Tooltip label="Delete" fontSize="xs">
                              <button
                                className="text-lg text-red-600 button flex items-center ml-2 hover:underline"
                                onClick={(e) =>
                                  handleDeleteAdmin({
                                    id: val.id,
                                    name: val.name,
                                  })
                                }
                              >
                                <Icon
                                  icon="ph:trash-simple-thin"
                                  className="text-lg text-red-600"
                                />
                                <span>Delete</span>
                              </button>
                            </Tooltip>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
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
          <HStack mt="4" justify="center" spacing="2" paddingBottom="50px">
            <div className="flex justify-center mt-10 mb-10">
              <nav role="navigation" aria-label="pagination">
                <ReactPaginate
                  breakLabel={
                    <span ClassName="flex justify-center mr-4 ml-4">...</span>
                  }
                  previousLabel={"< Prev"}
                  nextLabel={"Next >"}
                  pageCount={Math.ceil(totalRecord / limit)}
                  onPageChange={(data) => handlePageChange(data.selected + 1)}
                  forcePage={page - 1}
                  containerClassName={
                    "flex items-center justify-center mt-8 mb-4"
                  }
                  previousLinkClassName={"pagination__link"}
                  nextLinkClassName={"pagination__link"}
                  disabledClassName={"pagination__link--disabled"}
                  activeClassName="bg-purple-300 text-white"
                  pageClassName={
                    "block border- border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
                  }
                />
              </nav>
            </div>
          </HStack>

          {/* <Footer /> */}
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
