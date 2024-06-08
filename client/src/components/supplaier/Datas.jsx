import React, { useState, useEffect } from "react";
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
import { DataGrid } from "@mui/x-data-grid";
import { RiStackFill } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Swal from "sweetalert2";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

import "../supplaier/supplier.css";

const iconSize = "20px";
const headerFontSize = "24px";

function Datas() {
  const [showModal, setShowModal] = useState(false);
  const [jenisbarang, setJenisBarang] = useState("");
  const [stock, setStock] = useState(0);
  const [status, setStatus] = useState([]);
  const [keluar, setKeluar] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [editItemId, setEditItemId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItemImage, setSelectedItemImage] = useState(null);
  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectstock, setselectStock] = useState("");

  const handleClose = () => {
    setShowModal(false);
    setEditItemId("");
    setJenisBarang("");
    setStock(0);
    setFile(null);
  };

  const handleShow = () => setShowModal(true);

  const handleImageModal = (item) => {
    setSelectedItem(item);
    setSelectedItemImage(item.image);
    setSelectedItemType(item.jenisbarang);
    setselectStock(item.stock);
    setShowDetailModal(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("jenisbarang", jenisbarang);
      formData.append("stock", stock);
      if (file) {
        formData.append("image", file);
      }

      if (editItemId) {
        // Jika sedang mengedit data
        await axios.put(
          `http://localhost:5000/api/v1/supplier/stock/${editItemId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        // Jika sedang menambah data baru
        await axios.post(
          "http://localhost:5000/api/v1/supplier/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      }

      handleClose();
      fetchData();
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: editItemId
          ? "Data berhasil diubah."
          : "Data berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Error adding or editing supplier:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/supplier",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredSuppliers = response.data.data.suppliers.filter(
        (supplier) =>
          supplier.jenisbarang.toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setSuppliers(filteredSuppliers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatusMasuk = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/po/masuk",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredStatus = response.data.data.PO.filter(
        (item) => item.BarangId !== null && item.PTid !== null,
      );

      setStatus(filteredStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getStatusKeluar = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/po/keluar",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const filteredStatus = response.data.data.PO.filter(
        (item) => item.BarangId !== null && item.PTid !== null,
      );

      setKeluar(filteredStatus);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    getStatusMasuk();
    getStatusKeluar();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const result = await Swal.fire({
        title: "Apakah Anda yakin?",
        text: "Anda tidak akan dapat memulihkan data ini!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/v1/supplier/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchData();
        setShowDetailModal(false);
        Swal.fire("Terhapus!", "Data Anda telah dihapus.", "success");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleEdit = (item) => {
    setEditItemId(item._id);
    setJenisBarang(item.jenisbarang);
    setStock(item.stock);
    setShowModal(true);
    setShowDetailModal(false); // Tutup modal detail saat membuka modal edit
  };

  const columns = [
    {
      field: "id",
      headerName: "No",
      width: 150,
      valueGetter: (params) => {
        const index = suppliers.findIndex(
          (supplier) => supplier._id === params.row._id,
        );
        return params.row.userid ? index + 1 : null;
      },
    },
    { field: "jenisbarang", headerName: "Jenis Barang", width: 350 },
    {
      field: "stock",
      headerName: "Jumlah",
      width: 350,
      valueFormatter: (params) => `${params.value} kg`,
    },
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
    <div className="main-container">
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Jumlah Barang</h3>
            <RiStackFill className="card_icon" />
          </div>
          <h1>{suppliers.length}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Barang Masuk</h3>
            <FaArrowUp className="card_icon" />
          </div>
          <h1>{status.length}</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3 style={{ color: "white", fontSize: "20px" }}>Barang Keluar</h3>
            <FaArrowDown className="card_icon" />
          </div>
          <h1>{keluar.length}</h1>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <h1
          style={{
            color: "black",
            marginBottom: "0",
            fontSize: headerFontSize,
          }}
        >
          <RiStackFill style={{ marginRight: "5px", fontSize: iconSize }} />
          Data Barang
        </h1>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "10px",
          marginTop: "30px",
        }}
      >
        <Button
          variant="primary"
          className="mb-2"
          style={{ height: "38px", marginRight: "10px" }}
          onClick={handleShow}
        >
          <BsPlus style={{ marginRight: "5px", fontSize: iconSize }} />
          Tambah Data Barang
        </Button>
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama Barang"
          className="search-input mb-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ height: "38px", width: "25%" }}
        />
      </div>
      <DataGrid
        rows={suppliers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        getRowId={(row) => row._id}
        style={{ height: 400 }}
        className="mt-3"
      />
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "normal" }}>
            Detail Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
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
                  <p
                    style={{
                      fontSize: "18px",
                      marginBottom: "10px",
                      marginTop: "15px",
                    }}
                  >
                    <span>Stok:</span> {selectstock}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleEdit(selectedItem)}>
            <BsPencil /> Edit
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDelete(selectedItem._id)}
          >
            <BsTrash /> Hapus
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editItemId ? "Edit" : "Tambah"} Data Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="jenisbarang">
              <Form.Label>Jenis Barang</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan jenis barang"
                value={jenisbarang}
                onChange={(e) => setJenisBarang(e.target.value)}
              />
            </Form.Group>
            <Form.Group
              controlId="stock"
              style={{ display: editItemId ? "block" : "none" }}
            >
              <Form.Label>Stok</Form.Label>
              <Form.Control
                type="number"
                placeholder="Masukkan stok barang"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="file">
              <Form.Label>Upload Gambar Baru</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!jenisbarang.trim()}
          >
            {isLoading ? "Menyimpan..." : editItemId ? "Simpan" : "Tambah"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Datas;
