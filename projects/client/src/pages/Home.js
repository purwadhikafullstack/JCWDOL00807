import Footer from "../components/Footer";
import Navbar from "../components/Navbar2";
import { Icon } from "@iconify/react";
import CardProduct from "../components/CardProduct";
import { Button } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Carousel from "nuka-carousel";
import ramadhanSales from "../asset/banner/ramadhan-sales.png";
import shipping from "../asset/banner/shipping.png";
import { Link } from "react-router-dom";
import { keepLogin } from "../redux/action/user";

const Home = () => {
  let userProduct = useSelector((state) => state.userProduct);
  let dispatch = useDispatch();
  const [allProduct, setAllProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [latest, setLatest] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  // const [branch, setBranch] = useState([]);

  useEffect(() => {
    dispatch(keepLogin());
    if (userProduct?.userProduct?.data?.branch) {
      setAllProduct(userProduct?.userProduct?.data?.allProduct);
      setCategory(userProduct?.userProduct?.data?.category);
      setLatest(userProduct?.userProduct?.data?.latest);
      setPromotion(userProduct?.userProduct?.data?.promotion);
      setBestSeller(userProduct?.userProduct?.data?.bestSeller);
      // setBranch(userProduct?.userProduct?.data?.branch);
    }
  }, [userProduct]);

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
          <Banner
            title={"Goku"}
            title2={
              "Shop for all you need everyday and more from the comfort of your home."
            }
            images={
              "https://imageproxy.wolt.com/venue/62b326af59f6dcbecb57b09e/fbbf146c-300e-11ed-8852-f640312e7d17_list_menu_4.jpg"
            }
            button={"Shop now"}
          />
          <img
            className=" w-full h-[300px] object-cover"
            src={shipping}
            alt=""
          />
          <img
            className=" w-full h-[300px] object-cover"
            src={ramadhanSales}
            alt=""
          />
        </Carousel>

        {/* <div className="flex gap-1  border p-1 rounded-md w-fit ">
          <Icon
            className="text-lg"
            icon="material-symbols:location-on-outline"
          />
          <h1 className=" font-bold ">Store Location : {branch}</h1>
        </div> */}

        <div>
          <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
            Categories
          </h1>
          <div className=" flex justify-between items-center container px-10 py-5 shadow shadow-slate-200 rounded-lg   ">
            {category.map((val, idx) => (
              <Link key={idx} to={`/category-${val.toLowerCase()}`}>
                <div>{val}</div>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Promotion
            </h1>
            <Link to={`/promotion`}>
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

          <div className="flex overflow-x-auto w-[full] gap-5 ">
            {promotion.map((val, idx) => (
              <Link to={`/product/${val.id}`}>
                <CardProduct
                  key={idx}
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
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">Latest</h1>
            <Link to={`/latest`}>
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

          <div className="flex  overflow-x-auto w-[full] gap-5 ">
            {latest.map((val, idx) => (
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
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              All Product
            </h1>
            <Link to={`/allproduct`}>
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

          <div className="flex  overflow-x-auto w-[full] gap-5 ">
            {allProduct.map((val, idx) => (
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
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Best Selling Product
            </h1>
            <Link to={`/bestSeller`}>
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
          <div className="flex  overflow-x-auto w-[full] gap-5 mb-5  ">
            {bestSeller.map((val, idx) => (
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
        </div>
      </div>

      <Footer />
    </section>
  );
};
export default Home;
