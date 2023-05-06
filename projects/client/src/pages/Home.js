import Footer from "../components/Footer";
import Navbar from "../components/NavbarUser";
import { Icon } from "@iconify/react";
import CardProduct from "../components/CardProduct";
import { Button, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import MainBanner from "../components/MainBanner";
import Banner from "../components/Banner";
import Carousel from "nuka-carousel";
import ramadhanSales from "../asset/banner/ramadhan-sales.png";
import shipping from "../asset/banner/shipping.png";
import { Link, useNavigate } from "react-router-dom";
import { keepLogin } from "../redux/action/user";
import { dataSeach } from "../redux/action/userProduct";

const Home = () => {
  let userProduct = useSelector((state) => state.userProduct);
  let dispatch = useDispatch();
  const [allProduct, setAllProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [latest, setLatest] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(keepLogin());
    if (userProduct?.userProduct?.data?.branch) {
      setAllProduct(userProduct?.userProduct?.data?.allProduct);
      setCategory(userProduct?.userProduct?.data?.category);
      setLatest(userProduct?.userProduct?.data?.latest);
      setPromotion(userProduct?.userProduct?.data?.promotion);
      setBestSeller(userProduct?.userProduct?.data?.bestSeller);
    }
    // eslint-disable-next-line
  }, [userProduct]);

  const handleSearch = (e) => {
    dispatch(dataSeach(e));
    navigate(`/product-list/${e}`);
  };

  return (
    <section>
      <Navbar />
      <div className=" container mx-auto flex flex-col gap-10 mt-5 ">
        <Carousel
          renderCenterLeftControls
          renderCenterRightControls
          wrapAround={true}
          autoplay={true}
          autoplayInterval={5000}
          speed={2000}
        >
          <MainBanner
            title={"Goku"}
            title2={
              "Shop for all you need everyday and more from the comfort of your home."
            }
            images={
              "https://imageproxy.wolt.com/venue/62b326af59f6dcbecb57b09e/fbbf146c-300e-11ed-8852-f640312e7d17_list_menu_4.jpg"
            }
            button={"Shop now"}
          />
          <Banner images={shipping} title="shipping" />
          <Banner images={ramadhanSales} title="ramadhanSale" />
        </Carousel>

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

        <div className=" mx-3 md:mx-2">
          <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
            Categories
          </h1>
          <div className=" flex  overflow-x-auto w-[full] gap-10 shadow shadow-slate-200 p-6 rounded-lg md: justify-between    ">
            {category.map((val, idx) => (
              <Link
                key={idx.toLocaleString()}
                to={`/product-list/category-${val.toLowerCase()}`}
              >
                <div className=" min-w-fit ">{val}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mx-3 md:mx-2">
          <div className=" flex justify-between  ">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Promotion
            </h1>
            <Link to={`/product-list/promotion`}>
              <Button
                bg="#3C6255"
                textColor="white"
                className=" font-bold mb-3  text-lg "
                size="xs"
              >
                View All{" "}
                <Icon
                  className="text-[25px]"
                  icon="material-symbols:arrow-right-alt-rounded"
                />
              </Button>
            </Link>
          </div>

          <div className="flex overflow-x-auto w-[full] gap-5 border-x-2 rounded-lg  ">
            {promotion.map((val, idx) => (
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
        </div>
        <div className="mx-3 md:mx-2">
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">Latest</h1>
            <Link to={`/product-list/latest`}>
              <Button
                bg="#3C6255"
                textColor="white"
                className=" font-bold mb-3  text-lg "
                size="xs"
              >
                View All{" "}
                <Icon
                  className="text-[25px]"
                  icon="material-symbols:arrow-right-alt-rounded"
                />
              </Button>
            </Link>
          </div>

          <div className="flex  overflow-x-auto w-[full] gap-5  border-x-2 rounded-lg ">
            {latest.map((val, idx) => (
              <div key={idx.toLocaleString()}>
                <CardProduct
                  discountPersentage={val.cut_percentage}
                  productid={val.id}
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
        </div>
        <div className="mx-3 md:mx-2">
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              All Product
            </h1>
            <Link to={`/product-list/allproduct`}>
              <Button
                bg="#3C6255"
                textColor="white"
                className=" font-bold mb-3  text-lg "
                size="xs"
              >
                View All{" "}
                <Icon
                  className="text-[25px]"
                  icon="material-symbols:arrow-right-alt-rounded"
                />
              </Button>
            </Link>
          </div>

          <div className="flex  overflow-x-auto w-[full] gap-5  border-x-2 rounded-lg ">
            {allProduct.map((val, idx) => (
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
        </div>
        <div className="mx-3 md:mx-2">
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Product Best Seller
            </h1>
            <Link to={`/product-list/bestSeller`}>
              <Button
                bg="#3C6255"
                textColor="white"
                className=" font-bold mb-3  text-lg "
                size="xs"
              >
                View All{" "}
                <Icon
                  className="text-[25px]"
                  icon="material-symbols:arrow-right-alt-rounded"
                />
              </Button>
            </Link>
          </div>
          <div className="flex  overflow-x-auto w-[full] gap-5 mb-5  border-x-2 rounded-lg ">
            {bestSeller.map((val, idx) => (
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
        </div>
      </div>

      <Footer />
    </section>
  );
};
export default Home;
