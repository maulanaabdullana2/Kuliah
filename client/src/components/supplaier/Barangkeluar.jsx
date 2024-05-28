import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { FaBox } from "react-icons/fa";
import { BsPlus, BsEyeFill, BsTrash } from "react-icons/bs"; // Import BsTrash for delete icon
import Swal from "sweetalert2";
import "./supplier.css";

const iconSize = "20px";
const headerFontSize = "24px";

const UserComponent = () => {
  const [Po, setPo] = useState([]);
  const [Barang, setBarang] = useState([]);
  const [PTs, setPTs] = useState([]);
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    No_po: "",
    jumlah: "",
    PTid: "",
    BarangId: "",
    file: null,
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [existingFile, setExistingFile] = useState("");
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInvoices();
    fetchBarangList();
    fetchData();
  }, []);

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
      }));
      setPTs(mappedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchBarangList = async () => {
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
      setBarang(response.data.data.suppliers);
    } catch (error) {
      console.error("Error fetching supplier data:", error);
      setError("Gagal mengambil data perusahaan.");
    }
  };

 const fetchInvoices = async () => {
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

     const filteredData = response.data.data.PO.filter(
       (item) => item.BarangId !== null && item.PTid !== null, // Add a null check for PTid
     );

     const modifiedData = filteredData.map((item, index) => ({
       ...item,
       id: index + 1,
       Tgl_PO: formatDate(item.Tgl_PO),
       PTid: item.PTid ? item.PTid._id : null, // Add a null check for PTid and handle accordingly
       PTname: item.PTid ? item.PTid.namaperusahaan : "",
       BarangId: item.BarangId ? item.BarangId._id : null,
       BarangName: item.BarangId ? item.BarangId.jenisbarang : "",
       fileUrl: item.fileUrl,
     }));

     const dataWithoutTimestamps = modifiedData.map(
       ({ createdAt, updatedAt, ...rest }) => rest,
     );

     setPo(dataWithoutTimestamps);
   } catch (error) {
     console.error("Error fetching invoices:", error);
     setError("Gagal mengambil data faktur.");
   }
 };



  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({
        ...formData,
        file: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setSelectedRow(null);
    setFormData({
      No_po: "",
      jumlah: "",
      PTid: "",
      BarangId: "",
      file: null,
      price: "",
    });
    setExistingFile("");
    setError(null);
  };

  const handleViewFile = (url) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl("");
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
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
        await axios.delete(`http://localhost:5000/api/v1/po/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchInvoices();
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data berhasil dihapus.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal menghapus data.",
      });
    }
  };

const handleSubmit = async () => {
  setLoading(true);
  try {
    if (
      !formData.No_po ||
      !formData.jumlah ||
      !formData.PTid ||
      !formData.BarangId ||
      !formData.price
    ) {
      throw new Error("Semua input harus diisi.");
    }

    const token = localStorage.getItem("token");
    const formDataWithFile = new FormData();
    formDataWithFile.append("file", formData.file || existingFile);
    formDataWithFile.append("jumlah", parseFloat(formData.jumlah));
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "file" && key !== "jumlah") {
        formDataWithFile.append(key, value);
      }
    });

    // Check if the PO already exists
    const existingPO = Po.find((item) => item.No_po === formData.No_po);
    if (existingPO) {
      throw new Error("Silakan gunakan nomor PO yang berbeda.");
    }

    const barang = Barang.find((item) => item._id === formData.BarangId);
    if (!barang) {
      throw new Error("Barang tidak ditemukan.");
    }

    // Check if the stock is sufficient
    if (parseFloat(formData.jumlah) > barang.stock) {
      throw new Error("Stock tidak mencukupi.");
    }

    if (selectedRow) {
      await axios.put(
        `http://localhost:5000/api/v1/po/${selectedRow._id}`,
        formDataWithFile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    } else {
      await axios.post(
        "http://localhost:5000/api/v1/po/keluar/add",
        formDataWithFile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
    }
    handleClose();
    fetchInvoices();
    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: selectedRow
        ? "Data berhasil diperbarui."
        : "Data berhasil ditambahkan.",
    });
  } catch (error) {
    if (error.message === "Stock tidak mencukupi.") {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.message,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Gagal menambahkan data.",
      });
    }
  } finally {
    setLoading(false);
  }
};

  const columns = [
    { field: "id", headerName: "No" },
    { field: "No_po", headerName: "No. PO", width: 170 },
    {
      field: "PTid",
      headerName: "Nama Perusahaan",
      width: 170,
      valueGetter: (params) => {
        const perusahaan = PTs.find((pt) => pt.id === params.value);
        return perusahaan ? perusahaan.namaperusahaan : "";
      },
    },
    {
      field: "BarangId",
      headerName: "Jenis Barang",
      width: 150,
      valueGetter: (params) => {
        const barang = Barang.find((barang) => barang._id === params.value);
        return barang ? barang.jenisbarang : "";
      },
    },
    {
      field: "jumlah",
      headerName: "Jumlah",
      width: 150,
      valueFormatter: (params) => `${params.value} kg`,
    },
    {
      field: "price",
      headerName: "Harga (kg)",
      valueFormatter: (params) => `Rp. ${params.value}`,
    },
    { field: "Tgl_PO", headerName: "Tanggal" },
    {
      field: "actions",
      headerName: "Actions",
      renderCell: (params) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            style={{ marginRight: 5 }}
            onClick={() => handleViewFile(params.row.fileUrl)}
          >
            <BsEyeFill style={{ fontSize: iconSize }} />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(params.row._id)}
          >
            <BsTrash style={{ fontSize: iconSize }} />
          </Button>
        </div>
      ),
    },
  ];

  const filteredData = Po.filter(
    (item) =>
      (item.No_po &&
        item.No_po.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.Bahan_Baku &&
        item.Bahan_Baku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      searchQuery.trim() === "",
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
            <FaBox style={{ marginRight: "5px", fontSize: iconSize }} />
            Barang Keluar
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={handleShow}
          className="mb-2"
          style={{ height: "38px", marginRight: "10px" }}
        >
          <BsPlus style={{ marginRight: "5px", fontSize: iconSize }} />
          Tambah Barang
        </Button>
      </div>
      <hr style={{ color: "black" }} />
      <div className="mb-3">
        <input
          type="text"
          placeholder="Cari berdasarkan No Po"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-control"
        />
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRow ? "Edit Data PO" : "Tambahkan Data "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPOId">
              <Form.Label>No. PO</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan No. PO"
                name="No_po"
                value={formData.No_po}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formJumlahBeli">
              <Form.Label>Jumlah</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukan Jumlah"
                name="jumlah"
                value={formData.jumlah}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPrice">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan Harga"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formNamaPerusahaan">
              <Form.Label>Nama Perusahaan</Form.Label>
              <Form.Control
                as="select"
                name="PTid"
                value={formData.PTid}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Nama Perusahaan</option>
                {PTs.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.namaperusahaan}{" "}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formBahanBaku">
              <Form.Label>Jenis Barang</Form.Label>
              <Form.Control
                as="select"
                name="BarangId"
                value={formData.BarangId}
                onChange={handleChange}
                required
              >
                <option value="">Pilih Barang</option>
                {Barang.map((barang) => (
                  <option key={barang._id} value={barang._id}>
                    {barang.jenisbarang}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="formFile">
              <Form.Label>Unggah File</Form.Label>
              <Form.Control
                type="file"
                name="file"
                onChange={handleChange}
              />{" "}
            </Form.Group>
            {existingFile && (
              <div>
                <p>File yang sudah ada:</p>
                <a
                  href={existingFile}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Lihat File
                </a>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Mengirimkan..." : "Tambahkan"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showPdfModal} onHide={handleClosePdfModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Lihat PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe
            src={pdfUrl}
            style={{ width: "100%", height: "500px" }}
            frameBorder="0"
          ></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePdfModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ height: 400, width: "100%", marginTop: "5px" }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
    </div>
  );
};

export default UserComponent;
