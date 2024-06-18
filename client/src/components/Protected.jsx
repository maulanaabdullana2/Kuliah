import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Protected({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const getMe = async (token) => {
      try {
        await axios.get("http://localhost:5000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Jika berhasil, biarkan pengguna melanjutkan
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            // Token expired, hapus token dan arahkan ke halaman login
            localStorage.removeItem("token");
            toast.warn("Session expired. Please login again.");
            navigate("/");
          } else {
            // Kesalahan lain dari server
            toast.error(
              error.response ? error.response.data.message : error.message,
            );
          }
        } else {
          // Kesalahan jaringan atau lainnya
          toast.error(error.message);
        }
      }
    };

    const token = localStorage.getItem("token");

    if (!token) {
      // Jika tidak ada token, arahkan kembali ke halaman login
      navigate("/");
      return;
    }

    // Lakukan pengecekan token
    getMe(token);
  }, [navigate]);

  return children;
}

export default Protected;
