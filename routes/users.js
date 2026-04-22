const express = require("express");
const userController = require("../controller/userController");
const adminuserController = require("../controller/adminuserController");
const appController = require("../controller/appController");
const homeController = require("../controller/homeController");
const legalController = require("../controller/legalController");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const uploadSong = require("../middleware/uploadSong");
const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/verifyhomeUser/:token/:id", userController.verifyhomeUser);
router.post("/forgetPassword", userController.forgetPassword);

// ===================================================
router.get("/verifyUser/:token", userController.verifyUser);
router.get("/verifyPassword/:token", userController.verifyPassword);

router.post("/resetPassword", userController.resetPassword);
router.post("/sociallogin", userController.sociallogin);
router.post("/userProfile", userController.userProfile);
router.post(
  "/editProfile",
  upload.single("file"),
  auth,
  userController.editProfile
);

//admin Apis
router.post("/allUsers", adminuserController.allUsers);
router.post("/addUser", upload.single("file"), adminuserController.addUser);
router.post(
  "/editProfilebyId",
  upload.single("file"),
  adminuserController.editProfile
);
router.post("/userProfilebyId", adminuserController.userProfile);
router.post("/deleteUser", adminuserController.deleteUser);

router.post("/getSongsOfArtist", userController.getSongsOfArtist);
router.post("/getSongsOfArtistByGenre", userController.getSongsOfArtistByGenre);

// == Forgot Password ========== Date : 25/11/2022

router.post("/updatePassword", userController.updatePassword);
router.get("/redirectToPP", appController.redirectToPP);
router.get("/redirectTerms", appController.redirectTerms);
router.get("/privacy-policy", legalController.getPrivacyPolicy);
router.get("/terms-and-conditions", legalController.getTermsAndConditions);
router.get("/mixer-status", legalController.getMixerStatus);
// ========================

//============ 16-02-2023 === SHIKHA

router.get("/instrumentList", appController.instrumentList);
router.post("/chooseInstrument", appController.chooseInstrument);
router.post("/getDataByInstrument", appController.getDataByInstrument);
router.post("/getDataByInstrumentPaylist", auth, appController.getDataByInstrumentPaylist);

//============ 22-02-2023 === SHIKHA
//============ 24-07-2023 === SHIKHA
router.post("/fetchSongsById", appController.getSongsById);

//=================Chandni 21-08-2023========
router.post("/pay_now", appController.pay_now);

router.post("/insert_song_request", userController.song_request);
router.post("/insert_notification", userController.insertNotification);

router.post("/get_all_notification", userController.Allnotification);
router.post("/uploadSong", uploadSong.single("file"), appController.uploadSong);
router.delete("/delete_recorded_song", uploadSong.single("file"), homeController.delete_recorded_song);


//genre
router.get("/get-genre", homeController.get_genre_data_api);
router.post("/get-songs-by-genre", auth, homeController.get_songs_by_genre);

// Created by @Krishn 19-02-2026
//instruments
router.get("/get-instrument/:user_id", homeController.get_instrument_data_api);
router.post("/get-songs-by-instrument", auth, homeController.get_songs_by_instrument);


//favorite
router.post("/add-romove-favorite", homeController.add_remove_favorite);

module.exports = router;
