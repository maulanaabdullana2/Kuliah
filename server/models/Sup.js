const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Supplierchema = new Schema(
  {
    namaperusahaan:{
      type:String
    },
    alamat:{
      type:String
    },
    wilayah:{
      type:String
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
  },
  {
    timestamps: true,
  },
);

const Suppliers = mongoose.model("supplier", Supplierchema);

module.exports = Suppliers;
