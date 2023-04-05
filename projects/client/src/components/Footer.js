const Footer = () => {
  return (
    <footer>
      <div className="p-5 bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="mb-5">
              <h4 className="text-2xl pb-4">
                <strong>GoKu</strong>
              </h4>
              <p className="text-gray-500 text-sm">
                <p>
                  GoKu adalah Online Groceries yang menjual berbagai kebutuhan
                  maupun keperluan untuk sehari hari
                </p>
                <br></br>
                Jl. Jenderal Sudirman No.x, Jakarta <br></br>
                <strong>Whatsapp:</strong> 0812-3456-7899 <br></br>
                <strong>Email:</strong> info@goku.com <br></br>
              </p>
            </div>
            <div className="mb-5">
              <h4 className="pb-4">GoKu</h4>
              <ul className="text-gray-500 text-sm">
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Cara Kerja GoKu
                  </a>
                </li>
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Referral
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-5">
              <h4 className="pb-4">Kontak Kami</h4>
              <ul className="text-gray-500 text-sm">
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    F.A.Q
                  </a>
                </li>
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Blog
                  </a>
                </li>
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Kontak Kami
                  </a>
                </li>
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Syarat & Ketentuan
                  </a>
                </li>
                <li className="pb-4">
                  <a href="true" className="hover:text-yellow-500">
                    Kebijakan Privasi
                  </a>
                </li>
              </ul>
            </div>
            <div className="mb-5">
              <h4 className="pb-4">Download GoKu App</h4>
              <p className="text-gray-500 text-sm mb-4">
                Download GoKu App untuk pengalaman yang lebih baik
              </p>
              <p>
                <i className="m pb-3 fa-brands fa-google-play"></i>
              </p>
              <p>
                <i className="fa-brands fa-app-store"></i>
              </p>
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
