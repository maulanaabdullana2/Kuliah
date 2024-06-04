const router = require("express").Router();
const supplier = require("../controllers/SupplierControllers");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");


router.post("/add", authenticate, checkRole('admin') ,supplier.createsupplier);
router.get("/", authenticate, checkRole("admin"), supplier.getSupplierById);
router.get("/all", authenticate, supplier.getAllSuppliers);
router.put("/:id", authenticate, checkRole("admin"), supplier.updateSupplier);
router.delete(
  "/:id",
  authenticate,
  checkRole("admin"),
  supplier.deleteSupplier,
);

module.exports = router;
