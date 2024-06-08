const Barang = require("../models/BarangModels");
const Supplier = require("../models/BarangModels");
const kirim = require("../models/InModels");
const ApiError = require("../utils/ApiError");
const imagekit = require("../lib/imagekit");

const CreateBarang = async (req, res, next) => {
  try {
    let { jenisbarang} = req.body;
    jenisbarang = jenisbarang.charAt(0).toUpperCase() + jenisbarang.slice(1);
    const userid = req.user.id;
    const file = req.file;

      let image;

      if (file) {
        const img = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
        });
        image = img.url;
      }

    const supplier = await Supplier.create({
      jenisbarang,
      userid: userid,
      image
    });

    res.status(201).json({
      status: "Success",
      message: "Supplier added successfully",
      data: {
        supplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const GetBarang = async (req, res, next) => {
  try {
    const userid = req.user.id;
    const suppliers = await Supplier.find({ userid });
    res.status(200).json({
      status: "Success",
      message: "Data Retrieved Successfully",
      data: {
        suppliers,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const GetBarangbyid = async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);

    if (!supplier) {
      return next(new ApiError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Supplier ID Retrieved Successfully",
      data: {
        supplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteBarang = async (req, res, next) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByIdAndDelete(id);

    const barangnull = await kirim.find({BarangId:id})

    for (const barang of barangnull) {
      const update = await kirim.findByIdAndUpdate(barang._id,{BarangId:null},{new:true})
    }

    if (!supplier) {
      return next(new ApiError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Supplier deleted Successfully",
      data: {
        supplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const UpdateStockBarang = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stock, jenisbarang } = req.body;
     const userId = req.user.id;

    const existingBarang = await Supplier.findOne({ _id: id, userid : userId });

      let image = existingBarang.image;
      const file = req.file;

      if (file) {
        const img = await imagekit.upload({
          file: file.buffer,
          fileName: file.originalname,
        });
        image = img.url;
      }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { stock, jenisbarang, image },
      { new: true },
    );

    if (!updatedSupplier) {
      return next(new ApiError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "Success",
      message: "Supplier stock updated successfully",
      data: {
        supplier: updatedSupplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const GetallBarang = async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().populate("userid");
    res.status(200).json({
      status: "Success",
      message: "All Suppliers Retrieved Successfully",
      data: {
        suppliers,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};



module.exports = {
  CreateBarang,
  GetBarang,
  GetBarangbyid,
  deleteBarang,
  UpdateStockBarang,
  GetallBarang,
};
