const easyinvoice = require("easyinvoice");
const POorder = require("../models/InModels");
const ApiError = require("../utils/ApiError");
const Barang = require("../models/BarangModels");
const Suppliers = require("../models/Sup");

// Fungsi untuk menghasilkan nomor invoice unik
const generateInvoiceNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const time = now.getTime().toString().slice(-4); // Mengambil 4 digit terakhir dari timestamp
  return `INV${year}-${time}`;
};

const generateInvoice = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    console.log(orderId);

    const products = [];
    let idperusahaan;

    for (const element of orderId) {
      const order = await POorder.findById(element.orderId);
      const barang = await Barang.findById(order?.BarangId);
      idperusahaan = order.PTid;
      if (barang) {
        products.push({
          quantity: order?.jumlah || 1000,
          description: barang?.jenisbarang || "abc",
          tax: 21,
          price: order?.price || 0,
        });
      }
    }

    const NamaPerusahaan = await Suppliers.findById(idperusahaan);

    if (!NamaPerusahaan) {
      return res.status(404).json({
        status: "Error",
        message: "Nama Perusahaan not found",
      });
    }

    // Membuat data invoice
    const data = {
      apiKey:
        "wHhs4qe75bKAVLj0msYbtAWYmVX0kwDZD3L9T8wap8Bmqj8FgnEZmWNsPOwtBdil",
      images: {
        logo: "https://ik.imagekit.io/aiilsappn/WhatsApp%20Image%202024-03-26%20at%2013.13.37_bb9b3324.jpg?updatedAt=1711433794721",
      },
      mode: "production",
      documentTitle: "Invoice",
      currency: "USD",
      taxNotation: "vat",
      marginTop: 25,
      marginRight: 25,
      marginLeft: 25,
      marginBottom: 25,
      sender: {
        company: "PT Berkah Mitra Perdana Sukses",
        address: "Perum Puri Jaya JL. Taman Merpati ",
        zip: "AD. 13 No 15 Rt. 02 RW. 011",
        city: "Sukamantri, Pasar Kemis,",
        country: "Tangerang Banten",
      },
      client: {
        company: NamaPerusahaan.namaperusahaan || "",
        zip: NamaPerusahaan.alamat || "",
      },
      information: {
        number: generateInvoiceNumber(),
        date: new Date().toLocaleDateString(),
      },
      invoiceDate: new Date().toDateString(),
      products: products.filter((product) => product.quantity > 0),
    };

    const result = await easyinvoice.createInvoice(data);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
    res.send(Buffer.from(result.pdf, "base64"));
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getpobynamaPerusahaan = async (req, res, next) => {
  try {
    const { ptid } = req.query;
    const po = await POorder.find({ PTid: ptid }).populate("BarangId");
    res.status(200).json({
      status: "Success",
      message: "Get Data Successfully",
      data: {
        po,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

module.exports = { generateInvoice, getpobynamaPerusahaan };
