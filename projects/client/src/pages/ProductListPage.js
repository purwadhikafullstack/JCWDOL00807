import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  Select,
  Box,
  FormLabel,
  Checkbox,
  InputGroup,
  Input,
  InputRightAddon,
} from "@chakra-ui/react";
import Navbar from "../components/Navbar2";
import Footer from "../components/Footer";
import CardProduct from "../components/CardProduct";
import axios from "axios";
import { Icon } from "@iconify/react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { name } = useParams();
  const [listProduct, setListProduct] = useState([]);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("");
  const [filterCategory, setFilterCategory] = useState([]);
  const [promo, setPromo] = useState(false);
  const [latest, setLatest] = useState(false);
  const [bestSeller, setBestSeller] = useState(false);
  const [search, setSearch] = useState("");
  const [inputSearch, setInputSearch] = useState("");
  const [allProduct, setAllProduct] = useState(false);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [msg, setMsg] = useState("");

  const api = process.env.REACT_APP_API_BASE_URL;
  let userProduct = useSelector((state) => state.userProduct);

  const handleSort = (e) => {
    setSort(e);
  };
  const handleFilterCategory = (e) => {
    let newFilterCategory = [...filterCategory];
    if (e.target.checked === false) {
      let idxData = newFilterCategory.indexOf(e.target.value);
      newFilterCategory.splice(idxData, 1);
    } else {
      newFilterCategory.push(e.target.value);
    }
    setFilterCategory(newFilterCategory);
  };

  const getDataFilterSearch = async () => {
    try {
      if (!userProduct.loading) {
        const limit = 8;
        let inputPromotion;
        let inputLatest;
        let inputBestSeller;
        let inputAllProduct;
        let inputCategory;
        const branch = userProduct.userProduct.data.branch;
        const branchId = userProduct.userProduct.data.branch_id;
        setCategories(userProduct.userProduct.data.category);

        if (name.includes("-")) {
          let nameSplit = name.split("-");
          let category = nameSplit[1];
          setTitle(`category ${category}`);
          inputCategory = category;
          inputPromotion = "";
          inputLatest = "";
          inputBestSeller = "";
          inputAllProduct = "";
        } else {
          if (name === "promotion") {
            setPromo(true);
            inputPromotion = "promotion";
            inputLatest = "";
            inputBestSeller = "";
            inputAllProduct = "";
            inputCategory = "";
          } else if (name === "latest") {
            setLatest(true);
            inputLatest = "latest";
            inputPromotion = "";
            inputBestSeller = "";
            inputAllProduct = "";
            inputCategory = "";
          } else if (name === "bestSeller") {
            setBestSeller(true);
            inputBestSeller = "bestSeller";
            inputPromotion = "";
            inputLatest = "";
            inputAllProduct = "";
            inputCategory = "";
          } else if (name === "allproduct") {
            setAllProduct(true);
            inputAllProduct = "allproduct";
            inputPromotion = "";
            inputLatest = "";
            inputBestSeller = "";
            inputCategory = "";
          }
        }

        if (promo === true || name === "promotion") {
          inputPromotion = "promotion";
        } else {
          inputPromotion = "";
        }
        if (latest === true || name === "latest") {
          inputLatest = "latest";
        } else {
          inputLatest = "";
        }
        if (bestSeller === true || name === "bestSeller") {
          inputBestSeller = "bestSeller";
        } else {
          inputBestSeller = "";
        }
        if (allProduct === true || name === "allproduct") {
          inputAllProduct = "allproduct";
        } else {
          inputAllProduct = "";
        }

        if (filterCategory.length > 0) {
          console.log(filterCategory);
          inputCategory = filterCategory;
        }
        const dataSearchAndFilter = await axios.get(
          `${api}/user/product-filter?branch_stores_id=${branchId}&branch_store_name=${branch}&promotion=${inputPromotion}&bestSeller=${inputBestSeller}&latest=${inputLatest}&allProduct=${inputAllProduct}&categories=${inputCategory}&search=${search}&sortBy=${sort}&limit=${limit}&page=${page}`
        );
        console.log(dataSearchAndFilter);

        setListProduct(dataSearchAndFilter?.data?.data);
        setPage(dataSearchAndFilter?.data?.page);
        setPages(dataSearchAndFilter?.data?.totalPages);
        setRows(dataSearchAndFilter?.data?.count);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataFilterSearch();
  }, [
    bestSeller,
    promo,
    latest,
    sort,
    filterCategory,
    search,
    userProduct,
    name,
    page,
    allProduct,
  ]);

  const handleSearch = (e) => {
    setInputSearch(e);
  };
  const handleSearchSubmit = () => {
    setSearch(inputSearch);
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

  return (
    <section>
      <Navbar />
      <div className="container mx-auto min-h-[100vh] relative ">
        <div className=" flex justify-between  gap-10">
          <div className=" sticky top-28 z-auto w-[250px] ">
            <h1 className="capitalize font-bold  text-[20px] mb-6 mt-10">
              filter product based on
            </h1>
            <div className=" flex flex-col gap-5">
              <Checkbox
                size="md"
                colorScheme="green"
                isChecked={allProduct}
                value={"allProduct"}
                onChange={(e) => setAllProduct(e.target.checked)}
              >
                All Product
              </Checkbox>
              <Checkbox
                size="md"
                colorScheme="green"
                value="promotion"
                id="promotion"
                isChecked={promo}
                onChange={(e) => setPromo(e.target.checked)}
              >
                Promotion
              </Checkbox>
              <Checkbox
                size="md"
                colorScheme="green"
                isChecked={latest}
                value="latest"
                onChange={(e) => setLatest(e.target.checked)}
              >
                Latest
              </Checkbox>
              <Checkbox
                size="md"
                colorScheme="green"
                isChecked={bestSeller}
                value="bestSeller"
                onChange={(e) => setBestSeller(e.target.checked)}
              >
                Best Seller
              </Checkbox>

              <h1 className="capitalize font-bold  text-[20px]">
                product category
              </h1>
              {categories.map((val, idx) => (
                <Checkbox
                  key={idx}
                  size="md"
                  colorScheme="green"
                  id={val}
                  value={val}
                  onChange={(e) => handleFilterCategory(e)}
                >
                  {val}
                </Checkbox>
              ))}
            </div>
          </div>

          <div className=" flex flex-col justify-center shadow shadow-slate-200 p-3 w-[1400px] ">
            <div className=" flex justify-between items-center capitalize ">
              <h1 className=" font-semibold text-xl ml-3 ">{title}</h1>
              <div className=" flex justify-end gap-5 items-center mt-5 mb-5  ">
                <Box className=" flex items-center ">
                  <FormLabel htmlFor="sortBy">Sort By</FormLabel>
                  <Select
                    w="220px"
                    onChange={(e) => handleSort(e.target.value)}
                  >
                    <option value="all">All Product</option>
                    <option value="nameAsc">Name a-z</option>
                    <option value="nameDesc">Name z-a</option>
                    <option value="highPrice">Highest Price </option>
                    <option value="lowestPrice">Lowest Price</option>
                  </Select>
                </Box>
                <InputGroup w="300px">
                  <Input
                    placeholder="Search Product"
                    type="text"
                    p="5"
                    bgColor="white"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <InputRightAddon>
                    <Icon
                      className=" text-xl "
                      onClick={handleSearchSubmit}
                      icon="ic:round-search"
                    />
                  </InputRightAddon>
                </InputGroup>
              </div>
            </div>

            {listProduct.length < 1 ? (
              <h1 className=" text-center font-bold h-screen  ">
                The product you are looking for does not exist
              </h1>
            ) : (
              <div className=" grid grid-cols-4 gap-5 p-2 ">
                {listProduct.map((val, idx) => (
                  <Link key={idx} to={`/product/${val.id}`}>
                    <CardProduct
                      discountPersentage={val.cut_percentage}
                      image={val.images}
                      name={val.name}
                      description={val.description}
                      price={val.price}
                      priceAfterDiscount={val.price_after_discount}
                      discount_type={val.discount_type}
                      status={val.status}
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
    </section>
  );
};

export default ProductList;
