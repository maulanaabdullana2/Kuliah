import React, { useEffect, useState } from "react";
import { FaArrowDown, FaBox, FaChartLine } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

function Sidebar({ openSidebarToggle, OpenSidebar, handleMenuClick }) {
  const [previewImage, setPreviewImage] = useState(null);
  const [name, setName] = useState("");

  const getUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = response.data;
      setPreviewImage(data.user.imageUrl);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name);
    }
  }, []);

  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      <div className="sidebar-title">
        <div
          className="sidebar-brand"
          style={{ color: "white", height: "20px" }}
        >
          {previewImage ? (
            <img
              src={previewImage}
              className="icon"
              style={{ width: "30vh", height: "20vh", borderRadius: "10%",objectFit:"cover" }}
              alt="User"
            />
          ) : (
            <p>Loading...</p>
          )}
          <p
            style={{
              margin: 0,
              textAlign: "center",
              paddingTop: "20px",
              fontSize: "15px",
            }}
          >
            Hi, {name}
          </p>
        </div>
        <span className="icon close_icon" onClick={OpenSidebar}>
          X
        </span>
      </div>

      <ul className="sidebar-list">
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("home")}
        >
          <a href="#">
            <FaChartLine className="icon" />
            Dashboard
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("users")}
        >
          <a href="#">
            <FaArrowUp className="icon" />
            Barang Masuk
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("users1")}
        >
          <a href="#">
            <FaArrowDown className="icon" />
            Barang Keluar
          </a>
        </li>
        <li
          className="sidebar-list-item"
          onClick={() => handleMenuClick("updateprofile")}
        >
          <a href="#">
            <CiSettings className="icon" />
            Settings
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
