import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { DataGrid } from "@mui/x-data-grid";
import Swal from "sweetalert2";
import { BsTrash } from "react-icons/bs";

function Laporan() {
  // State declarations
  const [poData, setPoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderId, setOrderId] = useState("");
  const [namasuplier, setNamaSupplier] = useState("");
  const [invoiceArray, setInvoiceArray] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [isOrderSelected, setIsOrderSelected] = useState(false); // State to track if order is selected
  const [isSupplierSelected, setIsSupplierSelected] = useState(false); // State to track if supplier is selected

  // Function to generate unique ID
  const generateUniqueId = () => {
    return "_" + Math.random().toString(36).substr(2, 9);
  };

  // Fetch PO data function
  const fetchPoData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/invoice/?ptid=${namasuplier}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const filterdatanull = response.data.data.po.filter((po) => po.BarangId  !== null );
      setPoData(filterdatanull);
    } catch (error) {
      setError("Error fetching PO data");
    } finally {
      setLoading(false);
    }
  };

  // Delete PO function
  const deletePo = (id) => {
    setInvoiceArray((prev) => prev.filter((item) => item.id !== id));
  };

  // Fetch supplier data function
  const fetchNamaSupplier = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/v1/pt/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSupplier(response.data.data.suppliers);
    } catch (error) {
      setError("Error fetching supplier data");
    } finally {
      setLoading(false);
    }
  };

  // useEffect hooks
  useEffect(() => {
    fetchPoData();
  }, [namasuplier]);

  useEffect(() => {
    fetchNamaSupplier();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/v1/invoice",
        {
          orderId: invoiceArray,
        },
        { responseType: "blob" },
      );

      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      setError("Error generating invoice");
    } finally {
      setLoading(false);
    }
  };

const addToArrayInvoice = (oid) => {
  invoiceArray.find((item) => item.orderId === oid.orderId);
  const uniqueId = generateUniqueId();
  const newOrder = { id: uniqueId, ...oid };
  setInvoiceArray((prev) => [...prev, newOrder]);
  setOrderId("");
};


  const handleOrderChange = (e) => {
    setOrderId(e.target.value);
    setIsOrderSelected(e.target.value !== "");
  };

  const handleSupplierChange = (e) => {
    setNamaSupplier(e.target.value);
    setIsSupplierSelected(e.target.value !== "");
  };

  const columns = [
    { field: "No_po", headerName: "No PO", width: 250 },
    { field: "namaperusahaan", headerName: "Nama Perusahaan", width: 250 },
    { field: "jumlah", headerName: "Jumlah", width: 150 },
    { field: "jenisbarang", headerName: "Jenis barang", width: 250 },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => (
        <Button variant="danger" onClick={() => deletePo(params.row.id)}>
          <BsTrash />
        </Button>
      ),
    },
  ];

  return (
    <div className="main-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ color: "black", marginBottom: "0", fontSize: "24px" }}>
          <FontAwesomeIcon icon={faFileInvoice} style={{ fontSize: "24px" }} />{" "}
          Buat Invoice
        </h1>
        <Button
          className="mt-3"
          onClick={() =>
            addToArrayInvoice({
              orderId,
              No_po: poData.find((po) => po._id === orderId)?.No_po || "",
              namaperusahaan:
                supplier.find((s) => s._id === namasuplier)?.namaperusahaan ||
                "",
              jumlah: poData.find((po) => po._id === orderId)?.jumlah || "",
              jenisbarang: poData.find((po) => po._id === orderId)?.BarangId.jenisbarang || "",
            })
          }
          disabled={!isOrderSelected || !isSupplierSelected} // Disable button if order or supplier is not selected
        >
          Tambah Po Ordernya
        </Button>
      </div>
      <hr style={{ color: "black" }} />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="orderId">
          <Form.Label>Select Suppliers</Form.Label>
          <Form.Control
            as="select"
            value={namasuplier}
            onChange={handleSupplierChange}
            required
          >
            <option value="">Select Perusahaan</option>
            {supplier.map((s) => (
              <option key={s._id} value={s._id}>
                {s.namaperusahaan}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <>
          <Form.Group controlId="orderId">
            <Form.Label>Select Order</Form.Label>
            <Form.Control
              as="select"
              value={orderId}
              onChange={handleOrderChange}
            >
              <option value="">Select Order</option>
              {poData.map((po) => (
                <option key={po._id} value={po._id}>
                  {po.No_po}
                </option>
              ))}
            </Form.Control>
            <div>
              <DataGrid
                rows={invoiceArray}
                columns={columns}
                pageSize={5}
                className="mt-4"
              />
            </div>
          </Form.Group>
        </>

        <Button
          variant="primary"
          type="submit"
          className="mt-5"
          disabled={loading || !isOrderSelected || !isSupplierSelected} // Disable button if loading or order or supplier is not selected
        >
          {loading ? "Generating..." : "Buat Invoice"}
        </Button>
      </Form>
    </div>
  );
}

export default Laporan;
