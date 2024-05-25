const mongoose = require("mongoose");

const { Schema } = mongoose;

const Invoiceschema = new Schema(
  {
    Poid: {
      type: Schema.Types.ObjectId,
      ref: "PO",
    },
  },
  {
    timestamps: true,
  },
);

const Invoice = mongoose.model("invoice", Invoiceschema);

module.exports = Invoice;
