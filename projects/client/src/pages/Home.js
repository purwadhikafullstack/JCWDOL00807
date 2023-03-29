import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Icon } from "@iconify/react";
import CardProduct from "../components/CardProduct";
import { Button } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { userProductList } from "../redux/action/userProduct";
import Banner from "../components/Banner";
import Carousel from "nuka-carousel";
import ramadhanSales from "../asset/banner/ramadhan-sales.png";
import shipping from "../asset/banner/shipping.png";
import { keepLogin } from "../redux/action/user";

const Home = () => {
  let userProduct = useSelector((state) => state.userProduct);
  let address = useSelector((state) => state.address.userAddress);
  const dispatch = useDispatch();

  const [allProduct, setAllProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [latest, setLatest] = useState([]);
  const [promotion, setPromotion] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);
  const [branch, setBranch] = useState([]);

  const geolocation = () => {
    dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
    if (address?.data) {
      let lat = address?.data[0]?.latitude;
      let lng = address?.data[0]?.longitude;
      dispatch(userProductList({ lat: lat, lng: lng }));
    } else {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            dispatch(userProductList({ lat: latitude, lng: longitude }));
          },
          function (error) {
            console.log("cannot access location because user deny");
            dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
          }
        );
      } else {
        console.log("Browser not support geolocation");
        dispatch(userProductList({ lat: "-6.18234", lng: "106.8428715" }));
      }
    }
  };

  useEffect(() => {
    if (userProduct?.userProduct?.data?.branch) {
      setAllProduct(userProduct?.userProduct?.data?.allProduct);
      setCategory(userProduct?.userProduct?.data?.category);
      setLatest(userProduct?.userProduct?.data?.latest);
      setPromotion(userProduct?.userProduct?.data?.promotion);
      setBestSeller(userProduct?.userProduct?.data?.bestSeller);
      setBranch(userProduct?.userProduct?.data?.branch);
    }
  }, [userProduct]);

  useEffect(() => {
    geolocation();
    dispatch(keepLogin());
  }, [address]);

  return (
    <section>
      <Navbar />
      <div className=" container mx-auto flex flex-col gap-10  mt-3 ">
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
          {/* <img
            className=" w-full h-[300px] object-cover"
            src={ramadhanSales}
            alt=""
          /> */}
          <img
            className=" w-full h-[300px] object-cover"
            src={shipping}
            alt=""
          />
        </Carousel>

        <div className="flex gap-1  border p-1 rounded-md w-fit ">
          <Icon
            className="text-lg"
            icon="material-symbols:location-on-outline"
          />
          <h1 className=" font-bold ">Store Location : {branch}</h1>
        </div>

        <div>
          <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
            Categories
          </h1>
          <div className=" flex justify-between items-center container px-10 py-5 shadow shadow-slate-200 rounded-lg   ">
            {category.map((val, idx) => (
              <div>{val}</div>
            ))}
          </div>
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Promotion
            </h1>
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
          </div>

          <div className="flex  justify-between gap-3 items-center">
            {promotion.map((val, idx) => (
              <CardProduct
                key={idx}
                discountPersentage={val.cut_percentage}
                image={val.images}
                name={val.name}
                description={val.description}
                price={val.price}
                priceAfterDiscount={val.price_after_discount}
                discount_type={val.discount_type}
              />
            ))}
          </div>
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">Latest</h1>
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
          </div>

          <div className="flex  justify-between gap-4">
            {latest.map((val, idx) => (
              <CardProduct
                key={idx}
                discountPersentage={val.cut_percentage}
                image={val.images}
                name={val.name}
                description={val.description}
                price={val.price}
                priceAfterDiscount={val.price_after_discount}
                discount_type={val.discount_type}
              />
            ))}
          </div>
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              All Product
            </h1>
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
          </div>

          <div className="flex  justify-between gap-4">
            {allProduct.map((val) => (
              <CardProduct
                discountPersentage={val.cut_percentage}
                image={val.images}
                name={val.name}
                description={val.description}
                price={val.price}
                priceAfterDiscount={val.price_after_discount}
                discount_type={val.discount_type}
              />
            ))}
          </div>
        </div>
        <div>
          <div className=" flex justify-between">
            <h1 className=" font-bold mb-3 text-[#3C6255] text-lg ">
              Best Selling Product
            </h1>
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
          </div>
          <div className="flex justify-between gap-4 mb-4">
            {bestSeller.map((val, idx) => (
              <CardProduct
                discountPersentage={val.cut_percentage}
                image={val.images}
                name={val.name}
                description={val.description}
                price={val.price}
                priceAfterDiscount={val.price_after_discount}
                discount_type={val.discount_type}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </section>
  );
};
export default Home;
