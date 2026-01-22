const express = require("express");
const homeController = require("../controller/homeController");
const appController = require("../controller/appController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/homePage", auth, homeController.homePage);
router.post("/homePagePaylist", auth, homeController.homePagePaylist);
router.post("/homePagePaylistsearch", auth, homeController.homePagePaylistsearch);
router.post("/get_song", homeController.get_song);
router.post("/category", appController.getSongsByCategory);
router.post("/categoryPaylist", auth, appController.getSongsByCategoryPaylist);


module.exports = router;
