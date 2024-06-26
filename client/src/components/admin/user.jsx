import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { BsEyeFill } from "react-icons/bs";
import "./admin.css";
import { FaBox } from "react-icons/fa";
import * as XLSX from "xlsx";

const iconSize = "20px";
const headerFontSize = "24px";

const UserComponent = () => {
  const [Po, setPo] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchInvoices();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const fetchInvoices = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/v1/po/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;

      if (responseData.status === "Success") {
        const poData = responseData.data.PO.map((item) => ({
          ...item,
          id: item._id,
          No_PO: item.No_po,
          Tgl_PO: formatDate(item.Tgl_PO),
          lokasi: item.userid ? item.userid.lokasi : "",
          Nama_Perusahaan: item.PTid ? item.PTid.namaperusahaan : "",
          jumlah: item.jumlah,
          Bahan_Baku: item.BarangId ? item.BarangId.jenisbarang : "",
          fileUrl: item.fileUrl,
          price: item.price,
          status: item.status,
        }));

        const filteredPoData = poData.filter(
          (item) => item.Bahan_Baku && item.No_PO && item.Nama_Perusahaan,
        );

        setPo(filteredPoData);
      } else {
        console.error("Error fetching invoices:", responseData.message);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleViewFile = (url) => {
    setPdfUrl(url);
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
    setPdfUrl("");
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const exportToExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileName = "data.xlsx";

    let dataToExport = Po;

    if (selectedMonth) {
      dataToExport = dataToExport.filter((item) =>
        item.Tgl_PO.startsWith(selectedMonth),
      );
    }

    const data = dataToExport.map((item) => ({
      "No. PO": item.No_PO,
      "Nama Perusahaan": item.Nama_Perusahaan,
      "Jenis Barang": item.Bahan_Baku,
      Jumlah: item.jumlah,
      Tanggal: item.Tgl_PO,
      Lokasi: item.lokasi,
      price: item.price,
      Status: item.status || "",
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "data");
    XLSX.writeFile(wb, fileName);
  };

  const buttonAndInputStyle = {
    height: "40px",
    marginRight: "10px",
  };

  const filteredPo = Po.filter(
    (item) =>
      (item.No_PO &&
        item.No_PO.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.Bahan_Baku &&
        item.Bahan_Baku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      searchQuery.trim() === "",
  );

  const filteredPoWithLocation = filteredPo.filter(
    (item) => item.lokasi !== null && item.lokasi !== "",
  );

  const numberedFilteredPo = filteredPoWithLocation.map((item, index) => ({
    ...item,
    no: index + 1,
  }));

  const columns = [
    { field: "no", headerName: "No", width: 85 },
    { field: "No_PO", headerName: "No. PO", width: 150 },
    { field: "Nama_Perusahaan", headerName: "Nama Perusahaan", width: 150 },
    { field: "Bahan_Baku", headerName: "Jenis Barang", width: 110 },
    {
      field: "jumlah",
      headerName: "Jumlah",
      width: 82,
      valueFormatter: (params) => `${params.value} kg`,
    },
    {
      field: "price",
      headerName: "Harga (kg)",
      width: 90,
      valueFormatter: (params) => `Rp.${params.value}`,
    },
    { field: "Tgl_PO", headerName: "Tanggal", width: 100 },
    { field: "lokasi", headerName: "Lokasi", width: 100 },
    { field: "status", headerName: "Status", width: 80 },
    {
      field: "fileUrl",
      headerName: "File",
      renderCell: (params) => (
        <div>
          <Button
            variant="primary"
            size="sm"
            style={{ marginRight: 5 }}
            onClick={() => handleViewFile(params.row.fileUrl)}
          >
            <BsEyeFill />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="main-container">
      <h1
        style={{
          color: "black",
          marginBottom: "0",
          fontSize: headerFontSize,
          marginRight: "10px",
        }}
      >
        <FaBox style={{ marginRight: "5px", fontSize: iconSize }} />
        Data Kiriman
      </h1>
      <hr style={{ color: "black" }} />
      <div className="form-container d-flex flex-wrap mb-3">
        <div className="me-2 mb-2">
          <input
            type="text"
            placeholder="Cari Berdasarkan No PO"
            value={searchQuery}
            onChange={handleSearchChange}
            className="form-control"
            style={buttonAndInputStyle}
          />
        </div>
        <div className="me-2 mb-2">
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            className="form-select"
            style={buttonAndInputStyle}
          >
            <option value="">Pilih Bulan</option>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">November</option>
            <option value="12">Desember</option>
          </select>
        </div>
        <div>
          <Button onClick={exportToExcel} style={buttonAndInputStyle}>
            Export to Excel
          </Button>
        </div>
      </div>
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
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={numberedFilteredPo}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
};

export default UserComponent;
