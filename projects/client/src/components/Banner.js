const Banner = ({ images, title, title2, button }) => {
  return (
    <div>
      <div className="relative bg-gray-80 h-[300px] ">
        <img
          src={images}
          alt={title}
          className="absolute inset-0 w-full h-[300px] object-cover"
        />

        <div className="absolute inset-0 bg-gray-900 opacity-75 h-[300px]"></div>
        <div className="relative container mx-auto px-4 py-12">
          <div className="lg:w-1/2 h-[300px]">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 mt-10">
              {title}
            </h1>
            <p className="text-xl text-gray-300 mb-10">{title2}</p>
            <a
              href="#"
              className="inline-block bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-200"
            >
              {button}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
