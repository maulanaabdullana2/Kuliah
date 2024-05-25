import React, { useEffect, useState } from "react";
import Header from "../components/admin/Header";
import Home from "../components/admin/Home";
import Sidebar from "../components/admin/Sidebar";
import Users from "../components/admin/user";
import Petugas from "../components/admin/petugas";
import { jwtDecode } from "jwt-decode";
import Laporan from "../components/admin/Laporan";
import Profile from "../components/admin/updateProfile";
import Supplier from "../components/admin/supplier";
import {useNavigate} from "react-router-dom";


function DashboardComponents(props) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const token = localStorage.getItem("token");
  const Navigate = useNavigate()

  useEffect(() => {
    const decodedToken = jwtDecode(token);
    if (decodedToken && decodedToken.role === "admin") {
      setIsAdmin(true);
    }else{
      Navigate('/dashboard/users')
    }
  }, [token]);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleMenuClick = (pageName) => {
    setCurrentPage(pageName);
  };


  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        handleMenuClick={handleMenuClick}
      />
      {/* Tampilkan halaman berdasarkan currentPage */}
      {currentPage === "home" && <Home />}
      {currentPage === "users" && <Users />}
      {currentPage === "petugas" && <Petugas />}
      {currentPage === "laporan" && <Laporan />}
      {currentPage === "sup" && <Supplier />}
      {currentPage === "updateprofile" && <Profile />}
    </div>
  );
}

export default DashboardComponents;
