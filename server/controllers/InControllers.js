const POorder = require("../models/InModels");
const Imagekit = require("../lib/imagekit");
const ApiError = require("../utils/ApiError");
const Barang = require("../models/BarangModels");
const Barangmasuk = async (req, res, next) => {
  try {
    const { No_po, jumlah, PTid, BarangId, price } = req.body;
    const file = req.file;
    let fileUrl;

     const existingPO = await POorder.findOne({ No_po: No_po.toUpperCase() });

     if (existingPO) {
       return res.status(400).json({
         status: "error",
         message: "Nomor PO sudah ada. Silakan gunakan nomor PO yang berbeda.",
       });
     }


    if (!No_po || !jumlah || !PTid || !BarangId) {
      return res.status(400).json({
        status: "error",
        message: "Semua field harus diisi",
      });
    }

    if (file) {
      const img = await Imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      fileUrl = img.url;
    }

    const userId = req.user.id;
    const Tgl_PO = new Date().toISOString().split("T")[0];

    const barang = await Barang.findById(BarangId);
    barang.stock += parseInt(jumlah, 10);

    await barang.save();

    const uppercaseNo_po = No_po.toUpperCase();


    const PO = await POorder.create({
      No_po: uppercaseNo_po,
      Tgl_PO,
      jumlah,
      PTid,
      BarangId,
      fileUrl,
      status: "masuk",
      price,
      userid: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      data: {
        PO,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const Barangkeluar = async (req, res, next) => {
  try {
    const { No_po, jumlah, PTid, BarangId, price } = req.body;
    const file = req.file;
    let fileUrl;

    const existingPO = await POorder.findOne({ No_po: No_po.toUpperCase() });

    if (existingPO) {
      return res.status(400).json({
        status: "error",
        message: "Nomor PO sudah ada. Silakan gunakan nomor PO yang berbeda.",
      });
    }

    if (!No_po || !jumlah || !PTid || !BarangId) {
      return res.status(400).json({
        status: "error",
        message: "Semua field harus diisi",
      });
    }

    if (file) {
      const img = await Imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
      });
      fileUrl = img.url;
    }

    const userId = req.user.id;
    const Tgl_PO = new Date().toISOString().split("T")[0];

    const barang = await Barang.findById(BarangId);
    barang.stock -= parseInt(jumlah, 10);

    if (barang.stock < 0) {
        return res.status(400).json({
          status: "error",
          message: "Stock tidak mencukupi",
        });
      }
      
    await barang.save();

    const uppercaseNo_po = No_po.toUpperCase();

    const PO = await POorder.create({
      No_po: uppercaseNo_po,
      Tgl_PO,
      jumlah,
      PTid,
      BarangId,
      fileUrl,
      status: "keluar",
      price,
      userid: userId,
    });

    res.status(201).json({
      status: "success",
      message: "Invoice created successfully",
      data: {
        PO,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getInvoice = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const PO = await POorder.find({ userid: userId });

    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getInvoiceAll = async (req, res, next) => {
  try {
    const { no_po } = req.query;

    let filter = {};
    if (no_po) {
      filter = { no_po };
    }

    const PO = await POorder.find(filter)
      .populate("BarangId")
      .populate("userid")
      .populate("PTid");

    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


const deleteInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedPO = await POorder.findById(id);

    if (!deletedPO) {
      return res.status(404).json({
        status: "error",
        message: "Invoice not found",
      });
    }

    const jumlahBarang = deletedPO.jumlah;
    const status = deletedPO.status;
    const barang = await Barang.findById(deletedPO.BarangId);

    if (status === "masuk") {
      barang.stock -= jumlahBarang;
    } else if (status === "keluar") {
      barang.stock += jumlahBarang; 
    }

    await barang.save();

    const deletedPOs = await POorder.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: "Invoice deleted successfully",
      data: {
        PO: deletedPOs,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


const getmasukall = async (req, res, next) => {
  try {
    const PO = await POorder.find({
      status: "masuk",
    }).populate("BarangId").populate("PTid");

    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getmasukbyid= async (req, res, next) => {
  try {
    const userCompletedPOs = await POorder.find({
      userid: req.user.id,
      status: "masuk",
    })
      .populate("BarangId")
      .populate("PTid");
    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO: userCompletedPOs,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


const getstauskeluar = async (req, res, next) => {
  try {
    const userCompletedPOs = await POorder.find({
      userid: req.user.id,
      status: "keluar",
    }).populate("BarangId").populate("PTid");
    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO: userCompletedPOs,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getstauskeluaradmin = async (req, res, next) => {
  try {
    const userCompletedPOs = await POorder.find({
      status: "keluar",
    }).populate("BarangId").populate("PTid");
    res.status(200).json({
      status: "Success",
      message: "Data Berhasil Didapatkan",
      data: {
        PO: userCompletedPOs,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


module.exports = {
  Barangmasuk,
  Barangkeluar,
  getInvoice,
  deleteInvoice,
  getInvoiceAll,
  getmasukall,
  getmasukbyid,
  getstauskeluar,
  getstauskeluaradmin,
};
