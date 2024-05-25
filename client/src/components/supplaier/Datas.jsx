import React, { useState, useEffect } from "react";
import { BsPlus, BsTrash, BsPencil } from "react-icons/bs";
import { DataGrid } from "@mui/x-data-grid";
import { RiStackFill } from "react-icons/ri";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Swal from "sweetalert2";
import { FaArrowDown, FaArrowUp, FaBox, FaBoxOpen } from "react-icons/fa";

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

  const handleClose = () => {
    setShowModal(false);
    setEditItemId("");
    setJenisBarang("");
    setStock(0);
  };

  const handleShow = () => setShowModal(true);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/v1/supplier/add",
        {
          jenisbarang: jenisbarang,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      handleClose();
      fetchData();
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data berhasil ditambahkan.",
      });
    } catch (error) {
      console.error("Error adding supplier:", error);
    }
  };

const getStatusMasuk = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/v1/po/masuk", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const filteredStatus = response.data.data.PO.filter(
      (item) => item.BarangId !== null,
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
       (item) => item.BarangId !== null,
     );

     setKeluar(filteredStatus);
   } catch (error) {
     console.error("Error fetching data:", error);
   }
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
        Swal.fire("Terhapus!", "Data Anda telah dihapus.", "success");
      }
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };

  const handleEdit = (id, stock, jenisbarang) => {
    setEditItemId(id);
    setStock(stock);
    setJenisBarang(jenisbarang);
    setShowModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/v1/supplier/stock/${editItemId}`,
        {
          stock: stock,
          jenisbarang: jenisbarang,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      handleClose();
      fetchData();
      Swal.fire({
        icon: "success",
        title: "Sukses!",
        text: "Data berhasil diubah.",
      });
    } catch (error) {
      console.error("Error editing stock:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "No",
      width: 200,
      valueGetter: (params) => {
        const index = suppliers.findIndex(
          (supplier) => supplier._id === params.row._id,
        );
        return params.row.userid ? index + 1 : null; // Check if userid is not null before assigning the index
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
      headerName: "Aksi",
      renderCell: (params) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() =>
              handleEdit(
                params.row._id,
                params.row.stock,
                params.row.jenisbarang,
              )
            }
          >
            <BsPencil />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(params.row._id)}
            style={{ marginLeft: "5px" }}
          >
            <BsTrash />
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
          style={{ height: 300 }}
          className="mt-3"
        />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editItemId ? "Edit" : "Tambah"} Data Barang
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {editItemId ? (
              <Form.Group controlId="stock">
                <Form.Label>Jenis Barang</Form.Label>
                <Form.Control
                  type="string"
                  placeholder="Masukkan Jenis barang"
                  value={jenisbarang}
                  onChange={(e) => setJenisBarang(e.target.value)}
                />
                <Form.Label>Jumlah</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Masukkan Jumlah barang"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="jenisbarang">
                <Form.Label>Jenis Barang</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Masukkan jenis barang"
                  value={jenisbarang}
                  onChange={(e) => setJenisBarang(e.target.value)}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={editItemId ? handleEditSubmit : handleSubmit}
          >
            {editItemId ? "Simpan" : "Tambah"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Datas;
