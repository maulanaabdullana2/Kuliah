const router = require("express").Router();
const supplier = require("../controllers/SupplierControllers");
const authenticate = require("../middleware/authenticate");

router.post("/add", authenticate, supplier.createsupplier);
router.get("/", authenticate, supplier.getSupplierById);
router.get("/all", authenticate, supplier.getAllSuppliers);
router.put("/:id", authenticate, supplier.updateSupplier);
router.delete("/:id", authenticate, supplier.deleteSupplier);

module.exports = router;
