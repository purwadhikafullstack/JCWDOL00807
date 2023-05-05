import { Icon } from "@iconify/react";

import bca from "../asset/logoFooter/bca.webp";
import bni from "../asset/logoFooter/logobni.png";
import mandiri from "../asset/logoFooter/mandirii.png";
import appstore from "../asset/logoFooter/get-it-on-app-store.png";
import googleplay from "../asset/logoFooter/googleplay.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className=" bg-gray-200 py-10 px-3 md:px-1 lg:px-1 ">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5  ">
            <div className=" flex flex-col justify-start gap-3 ">
              <div>
                <h1 className=" font-extrabold  mb-3 text-2xl text-center md:text-start ">
                  GoKu
                </h1>
                <p className="text-gray-500 text-sm text-center md:text-justify ">
                  GoKu adalah Online Groceries yang menjual berbagai kebutuhan
                  maupun keperluan untuk sehari hari
                </p>
              </div>
              <div>
                <h1 className=" font-bold mb-5 text-xl text-center md:text-start  ">
                  Hubungi Kami
                </h1>
                <div className=" grid grid-row-3 ">
                  <p className="text-gray-500 text-sm text-center md:text-justify ">
                    <strong>Branch Store Pusat:</strong> Jl. Jenderal Sudirman
                    No.111, Bendungan hilir, Tanah Abang, Jakarta Pusat, DKI
                    Jakarta
                  </p>
                  <p className="text-gray-500 text-sm  text-center md:text-justify ">
                    <strong>Whatsapp:</strong> 0812-3456-7899
                  </p>
                  <p className="text-gray-500 text-sm  text-center md:text-justify">
                    <strong>Email:</strong> info@goku.com
                  </p>
                </div>
              </div>
            </div>

            <div className=" flex flex-col ml-0 lg:ml-20 text-center  md:text-justify ">
              <h1 className=" font-bold mb-5 text-xl  ">Metode Pembayaran</h1>
              <div className=" flex justify-center md:justify-start gap-3">
                <div>
                  <img src={bca} alt="bca" width="50px" />
                </div>
                <div>
                  <img src={mandiri} alt="mandiri" width="50px" />
                </div>
                <div>
                  <img src={bni} alt="bni" width="50px" />
                </div>
              </div>
            </div>

            <div className="lg:ml-20   ">
              <h1 className=" font-bold mb-5 text-xl text-center  md:text-justify ">
                Tautan
              </h1>
              <div className="text-gray-500 text-sm flex flex-row flex-wrap md:flex-col gap-4 justify-center md:justify-start ">
                <p>
                  <Link to="/">Home</Link>
                </p>
                <p>
                  <Link to="/promotion">Promosi</Link>
                </p>
                <p>
                  <Link to="/login">Login</Link>
                </p>
                <p>
                  <Link to="/register">Register</Link>
                </p>
                <p>
                  <Link to="/" className="hover:text-yellow-500">
                    Syarat & Ketentuan
                  </Link>
                </p>
                <p>
                  <Link to="/" className="hover:text-yellow-500">
                    Kebijakan Privasi
                  </Link>
                </p>
              </div>
            </div>

            <div className=" flex flex-col justify-start gap-3  ">
              <div>
                <h1 className=" font-bold mb-5 text-xl text-center  md:text-justify   ">
                  Download GoKu App
                </h1>
                <div className=" flex justify-center md:justify-start gap-3 items-center ">
                  <img
                    className="bg-transparent h-8  "
                    src={appstore}
                    alt="appstore"
                  />

                  <img
                    className="bg-transparent h-10  "
                    src={googleplay}
                    alt="googlplay"
                  />
                </div>
              </div>
              <div>
                <h1 className=" font-bold mb-5 text-xl text-center  md:text-justify  ">
                  Layanan Pengaduan Konsumen
                </h1>
                <p className="text-gray-500 text-sm text-center  md:text-justify ">
                  Direktorat Jenderal Perlindungan Konsumen dan Tata Tertib
                  Niaga Kementrian Perdagangan RI Nomor WhatsApp Ditjen PTKN :
                  +62 853 1111 1010
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-gray-900 text-gray-500 px-10">
        <div className="max-w-7xl flex flex-col sm:flex-row py-4 mx-auto justify-center items-center">
          <div className="text-center">
            <div>
              ©Copyright 2023{" "}
              <strong>
                <span>Goku</span>
              </strong>
              . All Rights Reserved
            </div>
            <br></br>
            <div className="text-center text-xl text-white mb-2">
              <a
                href="true"
                className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 mx-1 inline-block pt-1"
              >
                <i className="fa fa-facebook"></i>
              </a>
              <a
                href="true"
                className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 mx-1 inline-block pt-1"
              >
                <i className="fa fa-twitter"></i>{" "}
              </a>
              <a
                href="true"
                className="w-10 h-10 rounded-full bg-yellow-500 hover:bg-yellow-600 mx-1 inline-block pt-1"
              >
                <i className="fa fa-instagram"></i>{" "}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
