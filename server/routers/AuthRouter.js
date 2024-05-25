const router = require("express").Router();
const Auth = require("../controllers/AuthControllers");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/image");

router.post("/login", Auth.login);
router.get("/me", authenticate, Auth.currentuser);
router.get("/all", authenticate, Auth.getAllUsers);
router.get("/:id", authenticate, Auth.getUserById);
router.post("/add", authenticate, Auth.addUser);
router.put("/update", upload.single('image') ,authenticate, Auth.updateUser);
router.delete("/users/:id", authenticate, Auth.deleteUser);

module.exports = router;
