import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { BsPlus, BsPencil, BsTrash } from "react-icons/bs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import "./admin.css";

const iconSize = "20px";
const headerFontSize = "24px";

function Supplier() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamat, setAlamat] = useState("");
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setIsFormValid(
      namaPerusahaan.trim() !== "" &&
        alamat.trim() !== ""
    );
  }, [namaPerusahaan, alamat]);

  const handleCloseModal = () => {
    setShowModal(false);
    setShowEditModal(false);
  };

  const handleShowModal = () => setShowModal(true);

  const handleShowEditModal = (rowData) => {
    setEditData(rowData);
    setShowEditModal(true);
  };

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/v1/pt/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const mappedData = response.data.data.suppliers.map((row, index) => ({
        ...row,
        id: row._id,
        no: index + 1,
      }));
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

 const handleSubmit = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      "http://localhost:5000/api/v1/pt/add",
      {
        namaperusahaan: namaPerusahaan,
        alamat: alamat,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    Swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Data berhasil ditambahkan.",
    });
    handleCloseModal();
    setNamaPerusahaan("");
    setAlamat("");
    fetchData();
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      if (error.response.data.message === "Nama perusahaan sudah ada") {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Nama perusahaan sudah ada.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response.data.message,
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ada kesalahan!",
      });
    }
  }
};

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/v1/pt/${editData.id}`,
        {
          namaperusahaan: namaPerusahaan,
          alamat: alamat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Data berhasil diperbarui.",
      });
      handleCloseModal();
      setNamaPerusahaan("");
      setAlamat("");
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ada kesalahan!",
      });
    }
  };

  const handleEdit = (rowData) => {
    handleShowEditModal(rowData);
    setNamaPerusahaan(rowData.namaperusahaan);
    setAlamat(rowData.alamat);
  };

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
        await axios.delete(`http://localhost:5000/api/v1/pt/${id}`, {
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

  const columns = [
    { field: "no", headerName: "No", width: 70 },
    { field: "namaperusahaan", headerName: "Nama Perusahaan", width: 230 },
    { field: "alamat", headerName: "Alamat Perusahaan", width: 650 },
    {
      field: "Aksi",
      headerName: "Aksi",
      renderCell: (params) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleEdit(params.row)}
          >
            <BsPencil />
          </Button>{" "}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(params.row.id)}
            style={{ marginLeft: "5px" }}
          >
            <BsTrash />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = data
    .filter((row) =>
      row.namaperusahaan.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((row, index) => ({
      ...row,
      no: index + 1,
    }));

  return (
    <div className="main-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1
            style={{
              color: "black",
              marginBottom: "0",
              fontSize: headerFontSize,
            }}
          >
            <FontAwesomeIcon icon={faTruck} style={{ marginRight: "5px" }} />
            Data Perusahaan
          </h1>
        </div>
        <Button
          variant="primary"
          className="mb-2"
          style={{ height: "38px", marginRight: "10px" }}
          onClick={handleShowModal}
        >
          <BsPlus style={{ marginRight: "5px", fontSize: iconSize }} />
          Tambah Data Perusahaan
        </Button>
      </div>
      <hr style={{ color: "black" }} />
      <div className="me-2 mb-3">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama Perusahaan"
          className="form-control"
          value={searchTerm}
          style={{width:"30%"}}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Modal show={showModal || showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {showModal ? "Tambahkan Data Perusahaan" : "Edit Data Perusahaan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="namaPerusahaan">
              <Form.Label>Nama Perusahaan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama perusahaan"
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="alamat">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan alamat"
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
          <Button
            variant="primary"
            onClick={showModal ? handleSubmit : handleEditSubmit}
            disabled={!isFormValid}
          >
            {showModal ? "Submit" : "Simpan Perubahan"}
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          className="mt-2"
          rows={filteredData}
          columns={columns}
          pageSize={11}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
}

export default Supplier;
