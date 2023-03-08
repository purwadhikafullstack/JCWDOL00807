import { Icon } from "@iconify/react";

const Footer = () => {
  return (
    <section className="h-96 shadow shadow-slate-200 ">
      <div className=" container mx-auto flex flex-row justify-between gap-10 ">
        <div className=" w-[25%] flex flex-col gap-3  ">
          <h1 className=" font-extrabold  text-2xl ">GoKu</h1>
          <p className=" font-medium text-justify">
            GoKu adalah social enterprise untuk mewujudkan produksi, distribusi
            dan konsumsi pertanian secara lebih berkeadilan dan ramah
            lingkungan. Impian kami sederhana: Menjadikan sayuran organik itu
            menjadi "sayuran biasa" Dari sisi harga ia bisa bersaing, dari sisi
            pasokan ia bisa diandalkan, dari sisi konsumsi ia lebih sehat.
          </p>
        </div>
        <div className=" w-[25%]  flex flex-col gap-3  ">
          <h1 className="font-extrabold  text-2xl ">Ikuti Kami</h1>
          <div className=" flex flex-row justify-start gap-6 ">
            <Icon icon="logos:facebook" />
            <Icon icon="skill-icons:twitter" />
            <Icon icon="skill-icons:instagram" />
          </div>
        </div>
        <div className="w-[25%] flex flex-col gap-3 ">
          <h1 className="font-extrabold  text-2xl ">Kontak kami</h1>
          <h2>F.A.Q</h2>
          <h2>Blog</h2>
          <h2>Kontak Kami</h2>
          <h2>Syarat & Ketentuan</h2>
          <h2>Kebijakan Privasi</h2>
        </div>

        <div className="w-[25%] flex flex-col gap-3">
          <h1 className="font-extrabold  text-2xl ">Hubungi Kami</h1>
          <h2>
            Kantor GoKu Jl. H. Muri Salim III No.11 Pisangan, Kec. Ciputat Timur
            Kota Tangerang Selatan, Banten 15419 WhatsApp CS +62 812-1236-9254
          </h2>
          <h1 className="font-extrabold  text-2xl ">
            Layanan Pengaduan Konsumen
          </h1>
          <h2>
            Direktorat Jenderal Perlindungan Konsumen dan Tata Tertib Niaga
            Kementrian Perdagangan RI Nomor WhatsApp Ditjen PTKN : +62 853 1111
            1010
          </h2>
        </div>
      </div>
    </section>
  );
};
export default Footer;
