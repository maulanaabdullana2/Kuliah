const kirim = require("../models/InModels")
const Suppliers = require("../models/Sup")
const ApiError = require("../utils/ApiError")

const createsupplier = async(req,res,next) =>{
    try {
        const {namaperusahaan,alamat} = req.body

        const existingSupplier = await Suppliers.findOne({
          namaperusahaan
        });
        if (existingSupplier) {
          return res.status(400).json({
            status: "fail",
            message: "Nama perusahaan sudah ada",
          });
        }
        const supllier = await Suppliers.create({
            namaperusahaan,
            alamat,
        })
        res.status(201).json({
            status:"success",
            message:"Post Data Succesfully",
            data:{
                supllier
            }
        })
    } catch (error) {
        next(new ApiError(error.message))
    }
}


const getSupplierById = async (req, res, next) => {
  try {
    const supplier = await Suppliers.find({ userid: req.user._id });
    if (!supplier) {
      return res.status(404).json({
        status: "fail",
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        supplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const getAllSuppliers = async (req, res, next) => {
  try {
    const suppliers = await Suppliers.find(); // Retrieve only the user's suppliers
    res.status(200).json({
      status: "success",
      data: {
        suppliers,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { namaperusahaan, alamat } = req.body;
    const updatedSupplier = await Suppliers.findOneAndUpdate(
      { _id: id },
      { namaperusahaan, alamat},
      { new: true },
    );
    if (!updatedSupplier) {
      return res.status(404).json({
        status: "fail",
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Supplier updated successfully",
      data: {
        supplier: updatedSupplier,
      },
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedSupplier = await Suppliers.findOneAndDelete({
      _id: id,
    }); 

    if (!deletedSupplier) {
      return res.status(404).json({
        status: "fail",
        message: "Supplier not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Supplier deleted successfully",
      data: null,
    });
  } catch (error) {
    next(new ApiError(error.message));
  }
};


module.exports = {
    createsupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
}