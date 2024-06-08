import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { RiStackFill } from "react-icons/ri";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { BsFillArchiveFill } from "react-icons/bs";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Home() {
  const [data, setData] = useState([]);
  const [masuk, setMasuk] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selecteduser, setselectuser] = useState("");
  const [selectedlocation, setselectlocation] = useState("");
  const [selectstock, setselectStock] = useState("");

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
        (item) =>
          item.userid !== null && item.BarangId !== null && item.PTid !== null,
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
        (item) =>
          item.userid !== null && item.BarangId !== null && item.PTid !== null,
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
        .filter((row) => row.userid !== null)
        .map((row, index) => ({
          id: index + 1,
          jenisbarang: row.jenisbarang,
          stock: row.stock,
          image: row.image,
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

  const filteredData = data
    .filter((item) =>
      item.jenisbarang.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((item) =>
      selectedLocation ? item.lokasi === selectedLocation : true,
    )
    .map((item, index) => ({
      ...item,
      id: index + 1,
    }));

  const handleImageModal = (item) => {
    setSelectedItem(item);
    setSelectedItemImage(item.image);
    setSelectedItemType(item.jenisbarang);
    setselectStock(item.stock);
    setselectuser(item.userName);
    setselectlocation(item.lokasi);
    setShowDetailModal(true);
  };

  const uniqueLocations = [...new Set(data.map((item) => item.lokasi))];

  const columns = [
    { field: "id", headerName: "No", width: 120 },
    { field: "jenisbarang", headerName: "Jenis Barang", width: 200 },
    {
      field: "stock",
      headerName: "Jumlah Barang",
      width: 180,
      valueFormatter: (params) => `${params.value} kg`,
    },
    { field: "userName", headerName: "Nama Petugas", width: 200 },
    { field: "lokasi", headerName: "Lokasi", width: 180 },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      renderCell: (params) => (
        <div>
          <Button
            variant="info"
            size="sm"
            onClick={() => handleImageModal(params.row)}
            style={{ marginLeft: "5px" }}
          >
            Detail
          </Button>
        </div>
      ),
    },
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
      <div className="d-flex">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama Barang"
          className="form-control mt-3 mb-2"
          style={{ height: "38px", width: "25%" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="form-select mt-3 mb-2"
          style={{ height: "38px", width: "25%", marginLeft: "10px" }}
        >
          <option value="">Pilih Lokasi Gudang</option>
          {uniqueLocations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "24px" }}>Detail Barang</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "5%",
              }}
            >
              <img
                src={selectedItemImage}
                alt="Gambar Barang"
                style={{
                  maxWidth: "150px",
                  maxHeight: "150px",
                  borderRadius: "5px",
                  marginRight: "15%",
                }}
              />
              <div>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  <span>Jenis Barang:</span> {selectedItemType}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  <span>Stok:</span> {selectstock}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  <span>Lokasi:</span> {selectedlocation}
                </p>
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  <span>Nama Petugas:</span> {selecteduser}
                </p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ height: 300, width: "100%" }}>
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
