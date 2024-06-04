const router = require("express").Router();
const Auth = require("../controllers/AuthControllers");
const authenticate = require("../middleware/authenticate");
const checkRole = require("../middleware/checkRole");
const upload = require("../middleware/image");


router.post("/login", Auth.login);
router.get("/me", authenticate, Auth.currentuser);
router.get("/all", authenticate, checkRole('admin') ,Auth.getAllUsers);
router.get("/:id", authenticate, checkRole("admin"), Auth.getUserById);
router.post("/add", authenticate, checkRole('admin') ,Auth.addUser);
router.put("/update", authenticate, upload.single("image"), Auth.updateUser);
router.delete("/users/:id", authenticate, checkRole("admin"), Auth.deleteUser);

module.exports = router;
