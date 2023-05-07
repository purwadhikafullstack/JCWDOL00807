import React from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import Navbar from "../components/NavbarUser";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { uploadPaymentProof } from "../redux/action/order";
import DialogConfirmation from "../components/DialogConfirmation";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Image,
  Select,
  Textarea,
  Button,
} from "@chakra-ui/react";

const UploadPaymentProof = () => {
  let image = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("id");
  const order = useSelector((state) => state.orders.order);
  let userProduct = useSelector((state) => state.userProduct.userProduct);
  const branch_name = userProduct?.data?.branch;
  const [expiredDate, setExpiredDate] = useState("");

  console.log(id);
  console.log(order);
  console.log(branch_name);

  const [addFile, setAddFile] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [dialogTitle, setDialogTitle] = useState();
  const [msgDialog, setMsgDialog] = useState();

  const onBtnAddFile = (e) => {
    const file = e.target.files[0];
    if (file.size <= 1000000) {
      if (file) {
        setAddFile(file);
        let preview = document.getElementById("imgprev");
        preview.src = URL.createObjectURL(file);
        setMessage("");
      }
    } else {
      setAddFile("");
      let preview = document.getElementById("imgprev");
      preview.src =
        "https://dummyimage.com/600x400/d1d1d1/000000&text=No+Image";
      setMessage("Ukuran gambar lebih dari 1 Mb");
    }
  };

  const getTransactionByid = async (idtrx) => {
    try {
      const token = localStorage.getItem("my_Token");
      let response = await axios.get(
        `
      ${process.env.REACT_APP_API_BASE_URL}/transaction/transaction-by/${idtrx}
      `,
        {
          headers: {
            authorization: token,
          },
        }
      );
      const { data } = response?.data;
      setExpiredDate(data?.expired_date);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    try {
      const id_transaction = order.id || id;
      setLoading(true);
      if (addFile == "") {
        return setMessage("Please input payment proof file ");
      }
      let formData = new FormData();
      if (addFile) {
        formData.append("images", addFile);
      }
      if (!id_transaction) {
        return setMessage("No transaction");
      } else {
        formData.append("id_transaction", id_transaction);
      }
      if (!branch_name) {
        return setMessage("Branch name was empty");
      } else {
        formData.append("branch_name", branch_name);
      }
      console.log(formData);
      // debugger;
      dispatch(uploadPaymentProof({ formData }));
      navigate("/payment-success");
    } catch (error) {
      setLoading(false);
      setMessage(error.response.data.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getTransactionByid(id);
    } else {
      setExpiredDate(order.expired_date);
    }

  }, [id, order]);

  const handleCloseDialog = () => {
    setMsgDialog("")
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full max-w-[550px] bg-white">
          <div className="mb-5">
            <label
              for="email"
              className="mb-3 block text-base font-medium text-[#07074D]"
            >
              Order sudah berhasil di buat, silahkan lakukan pembayaran ke nomor
              rekening di bawah ini serta upload bukti pembayarannya:
            </label>
            <h5 className="text-base font-medium">
              BCA: A/N ONLINE GROCERY ( 08291882990 )
            </h5>
            <h5 className="text-base font-medium">
              BRI: A/N ONLINE GROCERY ( 08291882990 )
            </h5>
            <h5 className="text-base font-medium">
              MANDIRI: A/N ONLINE GROCERY ( 08291882990 )
            </h5>
            <br />
            <hr />
            <br />
            <h1 className="text-base font-semibold" style={{color: 'red'}}>
              Silahkan Lakukan Pembayaran sebelum - {new Date(expiredDate || '').toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', weekday:"long", hour: '2-digit', hour12: false, minute:'2-digit', second:'2-digit'})}
            </h1>
          </div>

          {message && (
            <div>
              <Alert status="error" mb="6" mt="2">
                <AlertIcon />
                <AlertTitle>{message}</AlertTitle>
              </Alert>
            </div>
          )}

          <div className="mb-6 pt-4">
            <label className="mb-5 block text-xl font-semibold text-[#07074D]">
              Upload File
            </label>

            <div className="mb-8">
              <Input
                type="file"
                ref={image}
                name="image"
                id="image"
                accept="image/png,image/jpg"
                onChange={onBtnAddFile}
              />
              <Image m="0 auto" id="imgprev" w="full" />
              <p
                className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                PNG OR JPG(MAX. 1MB)
              </p>
            </div>
          </div>

          <div>
            <button
              className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
              onClick={() => {
                setDialogTitle("Konfirmasi Pesanan")
                setMsgDialog("Upload payment proof dan konfirmasi pesanan anda ?")
              }}
            >
              Upload Payment Proof
            </button>
          </div>
        </div>
      </div>
      <Footer />

      {msgDialog ? (
        <DialogConfirmation message={msgDialog} title={dialogTitle} handleYes={handleSubmit} handleNo={handleCloseDialog} />
      ) : null}
    </>
  );
};

export default UploadPaymentProof;
