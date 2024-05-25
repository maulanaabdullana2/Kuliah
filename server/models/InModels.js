const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const KirimSchema = new Schema(
  {
    No_po: {
      type: String,
    },
    Tgl_PO: {
      type: Date,
    },
    jumlah: {
      type: Number,
      default: 0,
    },
    PTid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "supplier",
    },
    BarangId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Barang",
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
    },
    fileUrl: {
      type: String,
    },
    status: {
      type: String,
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const kirim = mongoose.model("kirim", KirimSchema);

module.exports = kirim;
