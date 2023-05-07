import { Link } from "react-router-dom";

const MainBanner = ({ images, title, title2, button }) => {
  return (
    <div>
      <div className="relative bg-gray-80  h-[180px] md:h-[300px] ">
        <img
          src={images}
          alt={title}
          className="absolute inset-0 w-full h-[180px] md:h-[300px] object-cover"
        />

        <div className="absolute inset-0 bg-gray-900 opacity-75  h-[180px] md:h-[300px]"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="">
            <h1 className="text-4xl font-bold text-white leading-tight mt-0 md:mt-10 ">
              {title}
            </h1>
            <p className=" text-xs  md:text-xl text-gray-300 md:mt-3 md:mb-10 mb-2  ">
              {title2}
            </p>
            <Link to="/product-list/allproduct">
              <div className="inline-block bg-white text-xs md:text-lg text-gray-900 md:font-bold py-1  px-1 md:py-3 md:px-6 rounded-lg hover:bg-gray-200">
                {" "}
                {button}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
