const mongoose = require("mongoose");

const user = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    lokasi:{
      type:String
    },
    jabatan:{
      type:String
    },
    imageUrl: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg",
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    profileImageUrl: {
      type: String,
    },
    role: {
      type: String,
      default: "petugas",
    },
  },
  {
    timestamps: true,
  },
);
const User = mongoose.model("Auth", user);

module.exports = User;
