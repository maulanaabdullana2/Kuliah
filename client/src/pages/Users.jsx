import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"; 
import Header from "../components/supplaier/Header";
import Home from "../components/supplaier/Barang";
import Home1 from "../components/supplaier/Barangkeluar";
import Sidebar from "../components/supplaier/Sidebar";
import Dashboard from "../components/supplaier/Datas";
import Profile from "../components/supplaier/updateProfile";
import { useNavigate } from "react-router-dom";


function DashboardComponents(props) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [isUser, setUser] = useState(false); 
  const token = localStorage.getItem("token");
   const Navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken && decodedToken.role === "petugas") {
        setUser(true);
      }else{
        Navigate("/dashboard/admin");
      }
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
      {currentPage === "home" && <Dashboard />}
      {currentPage === "users" && <Home />}
      {currentPage === "users1" && <Home1 />}
      {currentPage === "updateprofile" && <Profile />}
    </div>
  );
}

export default DashboardComponents;
