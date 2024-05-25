import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import { RiStackFill } from "react-icons/ri";
import { FaArrowDown, FaArrowUp, FaBox, FaBoxOpen } from "react-icons/fa";

function Home() {
  const [data, setData] = useState([]);
  const [masuk, setMasuk] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
    fetchDataMasuk();
    fetchDataKeluar();
  }, []);

  const fetchDataMasuk = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/po/masuk/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredData = response.data.data.PO.filter(
        (item) => item.userid !== null && item.BarangId !== null,
      );

      setMasuk(filteredData);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };


  const fetchDataKeluar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/po/keluar/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredData = response.data.data.PO.filter(
        (item) => item.userid !== null && item.BarangId !== null,
      );

      setKeluar(filteredData);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/supplier/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredData = response.data.data.suppliers
        .filter((row) => row.userid !== null) // Filter out rows with null userid
        .map((row, index) => ({
          id: index + 1,
          jenisbarang: row.jenisbarang,
          stock: row.stock,
          userName: row.userid ? row.userid.name : "Unknown",
          lokasi: row.userid ? row.userid.lokasi : "Unknown",
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
        }));

      setData(filteredData);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
    }
  };

  // Filter data based on search term
  const filteredData = data.filter((item) =>
    item.jenisbarang.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const columns = [
    { field: "id", headerName: "No", width: 100 },
    { field: "jenisbarang", headerName: "Jenis Barang", width: 250 },
    {
      field: "stock",
      headerName: "Jumlah Barang",
      width: 250,
      valueFormatter: (params) => `${params.value} kg`,
    },
    { field: "userName", headerName: "Nama Petugas", width: 250 },
    { field: "lokasi", headerName: "Lokasi", width: 250 },
  ];

  return (
    <main className="main-container">
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Barang</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{data.length}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Barang Masuk</h3>
            <FaArrowUp className="card_icon" />
          </div>
          <h1>{masuk.length}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Barang Keluar</h3>
            <FaArrowDown className="card_icon" />
          </div>
          <h1>{keluar.length}</h1>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <RiStackFill
          style={{ marginRight: "10px", color: "black", fontSize: "24px" }}
        />
        <h1 style={{ color: "black", fontSize: "24px" }}>Data Barang</h1>
      </div>
      <input
        type="text"
        placeholder="Cari Berdasarkan Nama Barang"
        className="search-input mt-3 mb-2"
        style={{ height: "38px", width: "25%" }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          className="mt-3"
        />
      </div>
    </main>
  );
}

export default Home;
