const router = require("express").Router();
const Invoice = require("../controllers/InControllers");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload")

router.post("/add", authenticate, upload.single("file"), Invoice.Barangmasuk);
router.post("/keluar/add", authenticate, upload.single("file"), Invoice.Barangkeluar);
router.get("/", authenticate , Invoice.getInvoice);
router.get("/all", authenticate , Invoice.getInvoiceAll);
router.get("/masuk/all", authenticate, Invoice.getmasukall);
router.get("/masuk/", authenticate, Invoice.getmasukbyid);
router.get("/keluar", authenticate, Invoice.getstauskeluar);
router.get("/keluar/all", authenticate, Invoice.getstauskeluaradmin);
router.delete("/:id", authenticate , Invoice.deleteInvoice);


module.exports = router;
