const router = require("express").Router();
const AuthRouter = require("./AuthRouter");
const PO = require("./InRouter")
const Supplier = require("./BarangRoutes")
const Pt = require("./supplier")
const SJ = require("./Invoice")


router.use("/api/v1/auth", AuthRouter);
router.use("/api/v1/po", PO);
router.use("/api/v1/supplier", Supplier);
router.use("/api/v1/pt", Pt);
router.use("/api/v1/invoice", SJ);

module.exports = router
