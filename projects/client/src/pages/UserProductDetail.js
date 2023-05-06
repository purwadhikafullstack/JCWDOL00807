import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  NumberInputField,
  NumberInput,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberIncrementStepper,
  CircularProgress,
} from "@chakra-ui/react";
import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import BackdropResetPassword from "../components/BackdropResetPassword";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, cartList, saveCartToCheckout } from "../redux/action/carts";
import CardProduct from "../components/CardProduct";
import { Divider } from "@chakra-ui/react";
import Swal from "sweetalert2";

const UserProductDetail = () => {
  const dispatch = useDispatch();
  const api = process.env.REACT_APP_API_BASE_URL;
  const { name } = useParams();
  const [dataProduct, setDataProduct] = useState({});
  const [productRecomendation, setProductRecomendation] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [qty, setQty] = useState(0);
  const userProduct = useSelector((state) => state.userProduct);
  const branch_id = userProduct?.userProduct?.data?.branch_id;
  const branch_name = userProduct?.userProduct?.data?.branch;
  let grandtotal = 0;

  useEffect(() => {
    if (!userProduct.loading) {
      async function fetchData() {
        try {
          const getProductDetail = await axios.get(
            `${api}/user/product-detail/${name}?branch_id=${branch_id}`
          );
          // console.log(getProductDetail.data.data.product);
          setDataProduct(getProductDetail.data.data.product);
          setProductRecomendation(
            getProductDetail.data.data.productRecomendation
          );
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }
  }, [name, userProduct]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.my_Token;
      // debugger
      if (!token) {
        setMessage(
          "Unauthorization, please register or login for continue  add product to cart"
        );
      } else if (qty < 1) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: " Out of stock",
        });
        // alert("Quantity product was zero");
      } else if (qty > dataProduct.stock) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Input exceed the stock",
        });
        // alert("Sorry your quantity more then stock");
      } else {
        await dispatch(addToCart(branch_id, name, qty));
        await dispatch(cartList(branch_id));
      }
    } catch (error) {
      setMessage(
        "Unauthorization, please register or login for continue  add product to cart"
      );
    }
  };

  const handleClose = () => {
    setMessage("");
  };

  const handleAddToTransaction = async () => {
    try {
      const token = localStorage.my_Token;
      if (!token) {
        setMessage(
          "Unauthorization, please register or login for continue  add product to cart"
        );
      } else if (qty < 1) {
        setMessage("Quantity product was zero");
      } else if (qty > dataProduct.stock) {
        setMessage("Sorry your quantity more then stock");
      } else {
        grandtotal = grandtotal + parseInt(dataProduct.price_after_discount);
        const checkout = {
          detailOrder: [
            {
              product_name: dataProduct.name,
              qty,
              discount_type: null,
              voucher_type: null,
              price_per_item: dataProduct.price_after_discount,
              weight: dataProduct.weight,
            },
          ],
          products_id: [
            {
              product_id: dataProduct.id,
            },
          ],
          grandtotal,
          isFromCart: false,
          branch_name,
          branch_id,
        };
        console.log(checkout);
        dispatch(saveCartToCheckout(checkout));
        navigate("/shipping");
      }
    } catch (error) {
      console.log(error);
      setMessage(
        "Unauthorization, please register or login for continue  add product to cart"
      );
    }
  };

  const handleQty = (e) => {
    setQty(e);
  };

  return (
    <>
      <Navbar />
      <section className="text-gray-700 body-font overflow-hidden bg-white container mx-auto">
        {!dataProduct?.stock ? (
          <div className="  flex justify-center h-screen items-center ">
            <CircularProgress isIndeterminate color="green.300" />
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <div className="px-5 py-5 md:py-24">
              <div className="md:flex justify-between flex-wrap  ">
                {dataProduct?.stock === 0 ? (
                  <>
                    <img
                      className="h-full md:h-[400px] object-cover object-center rounded border border-gray-200"
                      src={dataProduct?.images}
                      alt={dataProduct?.name}
                    />
                    <div className=" absolute  text-lg font-bold w-fit p-2 h-10 rounded-xl bg-black text-white  text-center translate-x-32  translate-y-44 ">
                      Out Of Stock
                    </div>
                  </>
                ) : (
                  <img
                    className=" h-full md:h-[400px] object-cover object-center rounded border border-gray-200"
                    src={dataProduct?.images}
                    alt={dataProduct?.name}
                  />
                )}

                <div className="lg:w-1/2 w-full lg:pl-10 lg:pr-10  lg:py-6 mt-6 lg:mt-0 shadow shadow-slate-200 rounded-md p-6 md:0  ">
                  {dataProduct?.discount_type === "Discount Bogo" &&
                  dataProduct?.status === 1 ? (
                    <Button
                      size="15px"
                      bgColor="#DF2E38"
                      color="white"
                      fontWeight="bold"
                      disabled
                      rounded="sm"
                      w="fit-content"
                      p="2"
                      mb="7"
                    >
                      Buy one get one free!!
                    </Button>
                  ) : dataProduct?.discount_type &&
                    dataProduct?.status === 1 ? (
                    <Button
                      size="15px"
                      bgColor="#DF2E38"
                      color="white"
                      fontWeight="bold"
                      disabled
                      rounded="sm"
                      w="fit-content"
                      p="2"
                      mb="7"
                    >
                      Promotion Product
                    </Button>
                  ) : null}
                  <h2 className="text-sm title-font text-gray-500 tracking-widest">
                    {dataProduct?.category}
                  </h2>
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">
                    {dataProduct?.name}
                  </h1>
                  <p className="leading-relaxed">{dataProduct?.description}</p>
                  <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-200 mb-5">
                    <div className="flex gap-2 items-center ">
                      <NumberInput
                        size="sm"
                        maxW={20}
                        defaultValue={0}
                        max={dataProduct?.stock}
                        onChange={(e) => handleQty(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <span className="mr-3">
                        Stock : {dataProduct?.stock} Dus{" "}
                      </span>
                    </div>
                  </div>

                  <span className="title-font font-bold text-2xl text-gray-900 ">
                    Rp.{" "}
                    {dataProduct?.price_after_discount_notNull?.toLocaleString()}
                  </span>
                  {dataProduct?.cut_nominal && dataProduct?.status === 1 ? (
                    <span className="title-font font-medium text-sm line-through text-gray-600 ml-2 ">
                      {dataProduct?.price?.toLocaleString()}
                    </span>
                  ) : null}
                  {dataProduct?.cut_percentage && dataProduct?.status === 1 ? (
                    <div className="flex gap-1 items-center mb-10 mt-1">
                      <Button
                        size="xs"
                        bgColor="#DF2E38"
                        color="white"
                        fontWeight="bold"
                        disabled
                        rounded="sm"
                        w="fit-content"
                      >
                        {dataProduct?.cut_percentage}
                      </Button>
                      <div className="title-font font-medium text-sm line-through text-gray-600">
                        {dataProduct?.price?.toLocaleString()}
                      </div>
                    </div>
                  ) : null}

                  <div className=" flex gap-3 mt-4 justify-end  ">
                    <Button
                      onClick={handleAddToCart}
                      isDisabled={dataProduct?.stock === 0}
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={handleAddToTransaction}
                      isDisabled={dataProduct?.stock === 0}
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className=" md:flex items-center mb-0 md:mb-10 mt-5 md:mt-0  p-5 gap-2  ">
              <h1 className=" text-md md:text-lg  title-font text-gray-500 tracking-widest min-w-fit ">
                Product Recomendation
              </h1>
              <Divider />
            </div>

            <div className="  flex overflow-x-auto w-[full] gap-5 mb-10 mx-5  ">
              {productRecomendation.map((val, idx) => (
                <div key={idx.toLocaleString()}>
                  <CardProduct
                    productid={val.id}
                    discountPersentage={val.cut_percentage}
                    image={val.images}
                    name={val.name}
                    description={val.description}
                    price={val.price}
                    priceAfterDiscount={val.price_after_discount}
                    discount_type={val.discount_type}
                    status={val.status}
                    weight={val.weight}
                    stock={val.stock}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      <Footer />
      {message ? (
        <BackdropResetPassword message={message} handleClose={handleClose} />
      ) : null}
    </>
  );
};

export default UserProductDetail;
