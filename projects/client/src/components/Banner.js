const Banner = ({ images, title }) => {
  return (
    <div>
      <div className="relative bg-gray-80  h-[180px] md:h-[300px] ">
        <img
          src={images}
          alt={title}
          className="absolute inset-0 w-full h-[180px] md:h-[300px] object-cover"
        />
      </div>
    </div>
  );
};

export default Banner;
