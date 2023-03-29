import { Button } from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import voucherImage from "../supports/assets/voucher.png";
const VoucherReferral = () => {
  let { token } = useParams();
  console.log(token);
  let [user, setUser] = useState("");
  const formData = new FormData();
  formData.append("images", voucherImage);
  const handleVoucher = async () => {
    try {
      let response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/referralcode`,
        formData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(response);
      setUser(response.data.data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };
  useEffect(() => {
    handleVoucher();
  });
  return (
    <div>
      <Navbar />
      {user === "" ? (
        <p> Loading... </p>
      ) : (
        <div className="border border-slate-200 flex w-[50%] flex-col container mx-auto p-10 mt-[60px]">
          <div className="font-semibold mb-5">Welcome {user},</div>
          <p className="text-center mb-3 ">
            Your account had a Voucher 25k Off for one transaction (Expired at 1
            weeks)✅
          </p>
          <p className="text-center mb-3 ">
            Let's start shopping with start click button below
          </p>
          <div className="ml-[35%]">
            <Link to="/login">
              <Button>Click this to login</Button>
            </Link>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};
export default VoucherReferral;
