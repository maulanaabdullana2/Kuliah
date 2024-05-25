const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const po = require("../controllers/Purcahsecontrollers");

router.post("/add", authenticate, po.createPO );
router.get("/", authenticate, po.getAllPOs);
router.get("/all", authenticate, po.getAllPOsAdmin);
router.get("/:id", authenticate, po.getPOById);
router.put("/:id", authenticate, po.updatePO);
router.delete("/:id", authenticate, po.deletePO);

module.exports = router;
