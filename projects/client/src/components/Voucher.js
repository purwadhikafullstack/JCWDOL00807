import moment from "moment";

const Voucher = ({ title, cut_percentage, cut_nominal, expired }) => {
  const date = moment(expired);
  return (
    <div className=" flex justify-start rounded-lg h-[80px] ">
      <div className="relative bg-[#DEF5E5] shadow-md  p-3  w-36 flex items-center text-center">
        <div className="text-gray-600 text-sm font-medium">{title}</div>
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gray-400 "></div>
      </div>
      <div className="relative bg-white  shadow-md px-4  w-50  flex items-center gap-3 w-52 ">
        <div className="grid grid-rows-2">
          <div className="text-gray-600 text-sm font-medium ">{title}</div>
          <div>
            {cut_nominal ? (
              <div className="text-gray-600 text-xs font-medium">
                Potongan : Rp. {cut_nominal.toLocaleString()}
              </div>
            ) : (
              <div className="text-gray-600 text-xs font-medium">
                Potongan : {cut_percentage * 100}%
              </div>
            )}
            <div className="text-red-600 text-xs font-medium">
              Expired : {date.format("DD MMMM YYYY")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
