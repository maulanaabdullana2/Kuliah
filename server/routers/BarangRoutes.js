const router = require("express").Router();
const supplier = require('../controllers/BarangControllers');
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/image");


router.post(
  "/add",
  authenticate,
  upload.single('image'),
  supplier.CreateBarang,
);
router.get("/", authenticate, supplier.GetBarang);
router.get("/all", authenticate, supplier.GetallBarang);
router.put("/stock/:id", authenticate, upload.single('image'),supplier.UpdateStockBarang);
router.get("/:id", authenticate, supplier.GetBarangbyid);
router.delete('/:id', authenticate,supplier.deleteBarang)


module.exports = router