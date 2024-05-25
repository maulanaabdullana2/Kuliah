const generateInvoice = require("../controllers/InvoiceControllers");
const router = require("express").Router();

router.post("/", generateInvoice.generateInvoice);
router.get("/", generateInvoice.getpobynamaPerusahaan);

module.exports = router;
