const mongoose = require("mongoose");


const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  PoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PO",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
