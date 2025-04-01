// src/components/About.jsx
export const About = () => {
    return (
      <div className="min-h-screen hero  p-4 md:p-6">
        <div className="card w-full max-w-lg   ">
          <div className="card-body p-6">
            <h1 className="text-3xl font-bold text-primary text-center mb-6 tracking-tight">
              About Sparepart Manager
            </h1>
            <p className="text-base text-base-content text-center leading-relaxed mb-6">
              Sparepart Manager adalah aplikasi yang dirancang untuk mengelola stok sparepart, transaksi penjualan, dan laporan mekanik secara efisien. Dibuat khusus untuk bengkel dan toko sparepart, kami membantu Anda melacak inventaris, mencatat transaksi, dan menganalisis performa dengan mudah. Aplikasi ini dibangun menggunakan teknologi modern seperti React, React Router, dan Tailwind CSS dengan DaisyUI untuk antarmuka yang intuitif.
            </p>
            <div className="divider">Fitur Utama</div>
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="badge badge-outline badge-primary badge-lg">Efisien</span>
              <span className="badge badge-outline badge-primary badge-lg">Mudah Digunakan</span>
              <span className="badge badge-outline badge-primary badge-lg">Modern</span>
            </div>
            <div className="text-center">
              <button className="btn btn-primary btn-wide">Pelajari Lebih Lanjut</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default About;