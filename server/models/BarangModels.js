const mongoose = require("mongoose");


const BarangSchema = new mongoose.Schema(
  {
    jenisbarang: {
      type: String,
    },
    image: {
      type: String,
      default: "https://ik.imagekit.io/aiilsappn/pngwing.com(1).png",
    },
    stock: {
      type: Number,
      default: 0,
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

const Barang = mongoose.model("Barang", BarangSchema);

module.exports = Barang;
