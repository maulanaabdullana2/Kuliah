import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Form from "react-bootstrap/esm/Form";
import { FaUserFriends } from "react-icons/fa";
import { BsPlus, BsTrash } from "react-icons/bs";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert

const iconSize = "20px";
const headerFontSize = "24px";

function Petugas() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "",
    lokasi: "",
    jabatan: "",
  });
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/v1/auth/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setFormData({
        username: "",
        password: "",
        name: "",
        role: "",
        lokasi: "",
        jabatan: "",
      });
      handleCloseModal();
      fetchDataUser();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pengguna berhasil ditambahkan!",
      });
    } catch (error) {
      console.error("Kesalahan menambahkan pengguna:", error.message);
      Swal.fire({
        icon: "error",
        title: "Kesalahan",
        text: "Pengguna Sudah Ada",
      });
    }
  };

  const fetchDataUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/auth/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const formattedData = response.data.data.map((user, index) => ({
        ...user,
        id: user._id,
        no: index + 1,
      }));

      setUsers(formattedData);
    } catch (error) {
      console.error("Kesalahan mengambil data pengguna:", error);
    }
  };

  useEffect(() => {
    fetchDataUser();
  }, []);

  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda tidak akan dapat mengembalikan ini!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/v1/auth/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchDataUser();
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pengguna berhasil dihapus!",
        });
      } catch (error) {
        console.error("Kesalahan menghapus pengguna:", error.message);
        Swal.fire({
          icon: "error",
          title: "Kesalahan",
          text: "Terjadi kesalahan saat menghapus pengguna.",
        });
      }
    }
  };

  const columns = [
    {
      field: "no",
      headerName: "No",
      width: 70,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "imageUrl",
      headerName: "Image",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="user"
          style={{
            width: "70%",
            height: "auto",
          }}
        />
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "name",
      headerName: "Nama Petugas",
      width: 200,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "role",
      headerName: "Peran",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lokasi",
      headerName: "Lokasi",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "jabatan",
      headerName: "Jabatan",
      headerAlign: "center",
      align: "center",
    },
    {
      field: "actions",
      headerName: "Aksi",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <DeleteButton id={params.row.id} />,
    },
  ];

  const DeleteButton = ({ id }) => (
    <Button variant="danger" size="sm" onClick={() => handleDeleteUser(id)}>
      <BsTrash style={{ marginRight: "5px" }} />
    </Button>
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users
    .filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .map((user, index) => ({
      ...user,
      no: index + 1,
    }));

  const isFormValid = Object.values(formData).every(
    (value) => value.trim() !== "",
  );

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
            <FaUserFriends style={{ marginRight: "5px", fontSize: iconSize }} />
            Data Petugas
          </h1>
        </div>
        <Button
          variant="primary"
          className="mb-2"
          style={{ marginRight: "10px" }}
          onClick={handleShowModal}
        >
          <BsPlus style={{ marginRight: "5px", fontSize: iconSize }} />
          Tambah Pengguna
        </Button>
      </div>
      <hr style={{ color: "black" }} />
      <div className="mb-3">
        <input
          type="text"
          placeholder="Cari Berdasarkan Nama Petugas"
          className="form-control"
          style={{ width: "30%" }}
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          pageSize={5}
          rowHeight={90}
        />
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Tambahkan Pengguna</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Kata Sandi</Form.Label>
              <Form.Control
                type="password"
                placeholder="Masukkan Kata Sandi"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formName">
              <Form.Label>Nama Petugas</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Nama Petugas"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formRole">
              <Form.Label>Peran</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="">Pilih peran</option>
                <option value="admin">Admin</option>
                <option value="petugas">Petugas</option>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formLokasi">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Lokasi"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formJabatan">
              <Form.Label>Jabatan</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Jabatan"
                name="jabatan"
                value={formData.jabatan}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Simpan Perubahan
          </Button>
          <Button variant="danger" onClick={handleCloseModal}>
            Batal
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Petugas;
