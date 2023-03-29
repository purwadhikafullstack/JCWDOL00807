import { Button } from "@chakra-ui/react";

const Voucher = () => {
  return (
    <div className=" flex justify-start rounded-lg ">
      <div className="relative bg-[#DEF5E5] shadow-md p-4 w-28 flex items-center text-center">
        <div className="text-gray-600 text-lg font-medium">Gratis Ongkir</div>
        <div className="absolute top-0 bottom-0 left-0 w-2 bg-gray-400 "></div>
      </div>
      <div className="relative bg-white  shadow-md pt-4 pb-4 pl-4 pr-2 w-50  flex items-center gap-3 ">
        <div>
          <div className="text-gray-600 text-lg font-medium">Gratis Ongkir</div>
          <div className="text-gray-600 text-xs font-medium">
            Min belanja Rp 0
          </div>
          <div className="text-red-600 text-xs font-medium">
            berakhir 1 jam lagi
          </div>
        </div>
        <Button bgColor="#DEF5E5" size="xs">
          redeem
        </Button>
      </div>
    </div>
  );
};

export default Voucher;
