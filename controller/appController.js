const Joi = require("joi");
const moment = require("moment");

const BaseURl = require("../middleware/cofig");
const base_url = BaseURl + "/assets/";

const baseurl_cover = base_url + "albums/";
const baseurl_cover01 = base_url + "cover/";
const baseurl_instrument = base_url + "instrument/";

exports.redirectToPP = async (req, res) => {
  res.sendFile(__dirname + "/view/privacyPolicy.html");
};

exports.redirectTerms = async (req, res) => {
  res.sendFile(__dirname + "/view/termsAndconditions.html");
};

const {
  fetchInstrumentList,
  chooseInstrument,
  instrumentSelect,
  getinstrumentSelected,
  getDataByInstrument,
  getinstrumentByUserid,
  getAllDataInstrument,
  fetchInsById,
  updateInstrumentSelect,
  fetchSongsById,
  fetchevoriateSong,
  updateSubscription,
  fetchSongsByCategory, fetchSongsByImage,
  fetch_last_songs,
  fetchevoriateSongUser,
} = require("../models/instrument");

const {
  fetchUserById,
  updateUserById,
  recorded_songs,
  fetchInstrumentUserid
} = require("../models/users");

exports.instrumentList = async (req, res) => {
  try {
    const results = await fetchInstrumentList();
    if (results.length !== 0) {
      await Promise.all(
        results.map(async (item) => {
          item.image = baseurl_instrument + item.image;
        })
      );
      return res.json({
        message: "fetched Instrument details successfully",
        status: 200,
        success: true,
        data: results,
      });
    } else {
      return res.json({
        message: "fetch details failed",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.chooseInstrument = async (req, res) => {
  try {
    var CurrentDate = moment().format();
    const { instrument, user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        instrument: [Joi.number().empty().required()],
        user_id: [Joi.number().empty().required()],
      })
    );
    const result = schema.validate({ instrument, user_id });

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const userInfo = await fetchUserById(user_id);
      const checkSubscription = await getinstrumentByUserid(user_id);

      if (userInfo.length !== 0) {
        let result1 = "";

        if (checkSubscription.length === 0) {
          let data = {
            user_id: user_id,
            instrument_selected: instrument,
            created_at: CurrentDate,
          };

          result1 = await instrumentSelect(data);

          primaryId = result1.insertId;
        } else {
          let data = {
            instrument_selected: instrument,
            updated_at: CurrentDate,
          };

          result1 = await updateInstrumentSelect(data, user_id);

          primaryId = checkSubscription[0]["id"];
        }

        if (result1.affectedRows) {
          const details = await getinstrumentSelected(primaryId);

          return res.json({
            message: "Instrument selection successfully done",
            status: 200,
            success: true,
            details: details[0],
          });
        } else {
          return res.json({
            message: "Instrument selection failed",
            status: 400,
            success: false,
          });
        }
      } else {
        return res.json({
          messgae: "User not found",
          status: 400,
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.getSongsByCategoryPaylist = async (req, res) => {
  try {
    const { user_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {

      const fetchInstId = await getinstrumentByUserid(user_id);
      const instId = fetchInstId[0].instrument_selected;

      const results = await fetchSongsByCategory();

      if (results.length !== 0) {
        let base_url = S3_URL;

        const groupedSongs = {
          high: [],
          medium: [],
          easy: [],
          category: []
        };

        await Promise.all(
          results.map(async (item) => {
            const category = item.category_group.toLowerCase();

            // Add base URL to cover image
            if (item.cover_image) {
              item.cover_image = baseurl_cover01 + item.cover_image;
            }

            if (item.drums != 0 && (instId == 5 || instId == 3)) {
              item.drums = item.drums;
              item.instrument_id = 3;
            } else {
              item.drums = '';
            }
            if (item.guitar != 0 && (instId == 5 || instId == 1)) {
              item.guitar = item.guitar;
              item.instrument_id = 1;
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (instId == 5 || instId == 2)) {
              item.bass = item.bass;
              item.instrument_id = 2;
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (instId == 5 || instId == 4)) {
              item.keyboards = item.keyboards;
              item.instrument_id = 4;
            } else {
              item.keyboards = '';
            }

            let allurl = [];

            const processInstrument = async (instrument, propertyName) => {
              if (item[instrument] !== "") {
                item[instrument] = base_url + item[instrument];
                allurl.push(item[instrument]);
              } else {
                item[propertyName] = "";
              }
            };

            await Promise.all([
              processInstrument("drums", "drums"),
              processInstrument("bass", "bass"),
              processInstrument("guitar", "guitar"),
              processInstrument("vocals", "vocals"),
              processInstrument("solo", "solo"),
              processInstrument("click_bpm", "click_bpm"),
              processInstrument("keyboards", "keyboards"),
              processInstrument("claps", "claps"),
              processInstrument("master1", "master1"),
            ]);

            groupedSongs.category.push(item);

            if (category == "medium") {
              groupedSongs.medium.push(item);
            }

            if (category == "easy") {
              groupedSongs.easy.push(item);
            }

            if (category == "high") {
              groupedSongs.high.push(item);
            }
          })
        );

        return res.json({
          message: "Fetch Songs details success121",
          status: 200,
          success: true,
          high: groupedSongs.high,
          medium: groupedSongs.medium,
          easy: groupedSongs.easy,
          data: groupedSongs.category,
        });
      } else {
        return res.json({
          message: "No Songs Uploaded!",
          status: 200,
          success: true,
          data: {},
          totalsongs: 0,
        });
      }
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.getDataByInstrumentPaylist = async (req, res) => {
  try {
    const { user_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {

      const fetchInstId = await getinstrumentByUserid(user_id);
      const instId = fetchInstId[0].instrument_selected;

      let result1;
      let fetchInsData;

      if (instId == 5) {
        fetchInsData = await fetchInstrumentList();
        result1 = await getAllDataInstrument();
        await Promise.all(result1.map(async item => {
          item.cover_image = baseurl_cover + item.cover_image;
        }));
      } else {
        fetchInsData = await fetchInsById(instId);
        result1 = await getDataByInstrument(instId);
        await Promise.all(result1.map(async item => {
          item.cover_image = base_url + "cover/" + item.cover_image;
        }));
      }

      if (result1) {
        return res.json({
          message: "Date fetched Successfully",
          status: 200,
          success: true,
          instrument: fetchInsData,
          details: result1,
        });
      } else {
        return res.json({
          message: "Instrument selection failed",
          status: 400,
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.getDataByInstrument = async (req, res) => {
  try {
    const { user_id } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let fetchInstId = await getinstrumentByUserid(user_id);
      let fetchInsData = await fetchInsById(
        fetchInstId[0]["instrument_selected"]
      );
      let result1 = await getDataByInstrument(
        fetchInstId[0]["instrument_selected"]
      );

      instId = fetchInstId[0]["instrument_selected"];

      if (instId == 5) {
        result1 = await getAllDataInstrument();
        await Promise.all(
          result1.map(async (item) => {
            item.cover_image = baseurl_cover + item.cover_image;
          })
        ),
          (fetchInsData = await fetchInstrumentList());
        await Promise.all(
          fetchInsData.map(async (item) => {
            item.image = baseurl_instrument + item.image;
          })
        );
      }

      if (result1) {
        return res.json({
          message: "Date fetched Successfully",
          status: 200,
          success: true,
          instrument: fetchInsData,
          details: result1,
        });
      } else {
        return res.json({
          message: "Instrument selection failed",
          status: 400,
          success: false,
        });
      }
    }
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.getSongsById = async (req, res) => {
  try {
    const { id, userId } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        id: Joi.number().required(),
        userId: Joi.number().required(),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let user_data = await fetchInstrumentUserid(userId);
      let results = await fetchSongsById(id);
      const data = await fetchevoriateSongUser(id, userId);
      const data12 = await fetchInsById(user_data[0]?.instrument_selected);

      if (results && results.length > 0) {
        results[0].is_favoriate = data?.length ? true : false;

        results[0].layout_name = data12?.length
          ? data12[0]?.instrument === 'All'
            ? 'Full Access'
            : `${data12[0]?.instrument}`
          : '';
      } else {
        return res.json({
          message: "Song not found",
          status: 404,
          success: false,
          data: [],
        });
      }

      if (results.length !== 0) {
        let base_url = S3_URL;
        const base_cover_url = 'https://159.223.251.167/assets/cover/';

        await Promise.all(
          results.map(async (item) => {
            let allurl = [];

            if (item.cover_image && !item.cover_image.startsWith('http')) {
              item.cover_image = base_cover_url + item.cover_image;
            }

            // Only add valid songs (skip null, "", "null")
            if (item.drums && item.drums !== "null") {
              item.drums = base_url + item.drums;
              allurl.push(item.drums);
            } else { item.drums = ""; }

            if (item.bass && item.bass !== "null") {
              item.bass = base_url + item.bass;
              allurl.push(item.bass);
            } else { item.bass = ""; }

            if (item.guitar && item.guitar !== "null") {
              item.guitar = base_url + item.guitar;
              allurl.push(item.guitar);
            } else { item.guitar = ""; }

            if (item.vocals && item.vocals !== "null") {
              item.vocals = base_url + item.vocals;
              allurl.push(item.vocals);
            } else { item.vocals = ""; }

            if (item.solo && item.solo !== "null") {
              item.solo = base_url + item.solo;
              allurl.push(item.solo);
            } else { item.solo = ""; }

            if (item.click_bpm && item.click_bpm !== "null") {
              item.click_bpm = base_url + item.click_bpm;
              allurl.push(item.click_bpm);
            } else { item.click_bpm = ""; }

            if (item.chords_songs && item.chords_songs !== "null") {
              item.chords_songs = base_url + item.chords_songs;
            } else {
              item.chords_songs = "";
            }

            if (item.keyboards && item.keyboards !== "null") {
              item.keyboards = base_url + item.keyboards;
              allurl.push(item.keyboards);
            } else { item.keyboards = ""; }

            if (item.claps && item.claps !== "null") {
              item.claps = base_url + item.claps;
              allurl.push(item.claps);
            } else { item.claps = ""; }

            // Backing tracks
            if (item.backing_track_guitar && item.backing_track_guitar !== "null") {
              item.backing_track_guitar = base_url + item.backing_track_guitar;
              allurl.push(item.backing_track_guitar);
            } else {
              item.backing_track_guitar = "";
            }

            if (item.backing_track_bass && item.backing_track_bass !== "null") {
              item.backing_track_bass = base_url + item.backing_track_bass;
              allurl.push(item.backing_track_bass);
            } else {
              item.backing_track_bass = "";
            }

            if (item.backing_track_drums && item.backing_track_drums !== "null") {
              item.backing_track_drums = base_url + item.backing_track_drums;
              allurl.push(item.backing_track_drums);
            } else {
              item.backing_track_drums = "";
            }

            if (item.backing_track_keys && item.backing_track_keys !== "null") {
              item.backing_track_keys = base_url + item.backing_track_keys;
              allurl.push(item.backing_track_keys);
            } else {
              item.backing_track_keys = "";
            }


            item.songs = allurl;
            item.has_claps = !!item.claps;

            // Images
            const images = await fetchSongsByImage(id);
            const imageKeys = ['drums', 'bass', 'guitar', 'vocals', 'solo', 'click_bpm', 'claps', 'chords_songs', 'keyboards'];
            const allImageArrays = {};

            imageKeys.forEach(key => allImageArrays[key] = []);

            await Promise.all(
              images.map(async (item1) => {
                imageKeys.forEach(key => {
                  if (item1[key] && item1[key] !== "" && item1[key] !== "null") {
                    const imgs = item1[key]
                      .split(',')
                      .filter(img => img.trim() !== '')
                      .map(img => base_url + 'images/' + img.trim());
                    allImageArrays[key].push(...imgs);
                  }
                });
              })
            );

            // Assign processed images to the song
            imageKeys.forEach(key => {
              item[`${key}_image`] = allImageArrays[key];
            });

          })
        );

        const [last_recorded_song] = await fetch_last_songs(userId, id);
        if (last_recorded_song && last_recorded_song.songs && last_recorded_song.songs !== "null") {
          last_recorded_song.songs = base_url + last_recorded_song.songs;
        }

        return res.json({
          message: "fetch Songs details success",
          status: 200,
          success: true,
          data: results,
          totalsongs: results.length,
          record: last_recorded_song || null,
        });

      } else {
        return res.json({
          message: "No Songs Uploaded!",
          status: 200,
          success: true,
          data: [],
          totalsongs: 0,
          record: null,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};


// exports.getSongsById = async (req, res) => {
//   try {
//     const { id, userId } = req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         id: Joi.number().required(),
//         userId: Joi.number().required(),
//       })
//     );
//     const result = schema.validate(req.body);

//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       return res.json({
//         message: result.error.details[0].message,
//         error: message,
//         missingParams: result.error.details[0].message,
//         status: 400,
//         success: false,
//       });
//     } else {
//       let user_data = await fetchInstrumentUserid(userId);

//       let results = await fetchSongsById(id);
//       const data = await fetchevoriateSongUser(id, userId);

//       const data12 = await fetchInsById(user_data[0]?.instrument_selected);
//       if (results && results.length > 0) {
//         results[0].is_favoriate = data?.length ? true : false;

//         results[0].layout_name = data12?.length
//           ? data12[0]?.instrument === 'All'
//             ? 'Full Access'
//             : `${data12[0]?.instrument}`
//           : '';
//       } else {
//         return res.json({
//           message: "Song not found",
//           status: 404,
//           success: false,
//           data: [],
//         });
//       }

//       if (results.length !== 0) {
//         let base_url = S3_URL;

//         await Promise.all(
//           results.map(async (item) => {
//             let allurl = [];
//             let base_cover_url = 'https://159.223.251.167/assets/cover/'
//             // let base_songs_url = 'https://159.223.251.167/assets/songs/'
//             if (item.cover_image && !item.cover_image.startsWith('http')) {
//               item.cover_image = base_cover_url + item.cover_image
//             }
//             if (item.drums != "") {
//               item.drums = base_url + item.drums;
//               item.songs += allurl.push(item.drums);
//             } else {
//               item.drums = "";
//             }

//             if (item.bass != "") {
//               item.bass = base_url + item.bass;
//               item.songs += allurl.push(item.bass);
//             } else {
//               item.bass = "";
//             }

//             if (item.guitar != "") {
//               item.guitar = base_url + item.guitar;
//               item.songs += allurl.push(item.guitar);
//             } else {
//               item.guitar = "";
//             }

//             if (item.vocals != "") {
//               item.vocals = base_url + item.vocals;
//               item.songs += allurl.push(item.vocals);
//             } else {
//               item.vocals = "";
//             }

//             if (item.solo != "") {
//               item.solo = base_url + item.solo;
//               item.songs += allurl.push(item.solo);
//             } else {
//               item.solo = "";
//             }

//             if (item.click_bpm != "") {
//               item.click_bpm = base_url + item.click_bpm;
//               item.songs += allurl.push(item.click_bpm);
//             } else {
//               item.click_bpm = "";
//             }

//             if (item.keyboards) {
//               item.keyboards = base_url + item.keyboards;
//               item.songs += allurl.push(item.keyboards);
//             } else {
//               item.keyboards = "";
//             }

//             let has_claps = false;
//             if (item.claps != "") {
//               has_claps = true;
//               item.claps = base_url + item.claps;
//               item.songs += allurl.push(item.claps);
//             } else {
//               item.claps = "";
//             }


//             if (item.chords_songs != "" && item.chords_songs != null) {
//               item.chords_songs = base_url + item.chords_songs;
//               // item.songs += allurl.push(item.chords_songs);
//             } else {
//               item.chords_songs = "";
//             }



//             if (item.back_track && item.back_track !== "null") {
//               item.back_track = base_url + item.back_track;
//               item.songs += allurl.push(item.back_track);
//             } else {
//               item.back_track = "";
//             }

//             const images = await fetchSongsByImage(id);

//             let allurl1 = [];
//             let allurl2 = [];
//             let allurl3 = [];
//             let allurl4 = [];
//             let allurl5 = [];
//             let allurl6 = [];
//             let allurl7 = [];
//             let allurl8 = [];
//             let allurl9 = [];

//             await Promise.all(
//               images.map(async (item1) => {

//                 if (item1.drums != "") {
//                   if (item1.drums) {
//                     let images = item1.drums
//                       .split(',')
//                       .filter(img => img.trim() !== '')
//                       .map(img => base_url + 'images/' + img.trim());
//                     item1.drums_image = allurl1.push(images);
//                   }
//                 } else {
//                   item1.drums_image = "";
//                 }

//                 if (item1.bass != "") {
//                   if (item1.bass) {
//                     let images = item1.bass
//                       .split(',')
//                       .filter(img => img.trim() !== '')
//                       .map(img => base_url + 'images/' + img.trim());
//                     item1.bass_image = allurl2.push(images);
//                   }
//                 } else {
//                   item1.bass_image = "";
//                 }

//                 if (item1.guitar != "") {
//                   if (item1.guitar) {
//                     let images = item1.guitar
//                       .split(',')
//                       .filter(img => img.trim() !== '')
//                       .map(img => base_url + 'images/' + img.trim());
//                     item1.guitar_image = allurl3.push(images);
//                   }
//                 } else {
//                   item1.guitar_image = "";
//                 }


//                 if (item1.keyboards != "") {
//                   if (item1.bass) {
//                     let images = item1.bass
//                       .split(',')
//                       .filter(img => img.trim() !== '')
//                       .map(img => base_url + 'images/' + img.trim());
//                     item1.keyboards_image = allurl7.push(images);
//                   }
//                 } else {
//                   item1.keyboards_image = "";
//                 }


//                 if (item1.vocals != "") {
//                   item1.vocals = base_url + item1.vocals;
//                   item1.vocals_image = allurl4.push(item1.vocals);
//                 } else {
//                   item1.vocals_image = "";
//                 }

//                 if (item1.solo != "") {
//                   item1.solo = base_url + item1.solo;
//                   item1.solo_image = allurl5.push(item1.solo);
//                 } else {
//                   item1.solo_image = "";
//                 }

//                 if (item1.click_bpm != "") {
//                   item1.click_bpm = base_url + item1.click_bpm;
//                   item1.click_bpm_image = allurl6.push(item1.click_bpm);
//                 } else {
//                   item1.click_bpm_image = "";
//                 }

//                 if (item1.claps != "") {
//                   item1.claps = base_url + 'images/' + item1.claps;
//                   item1.claps_image = allurl8.push(item1.claps);
//                 } else {
//                   item1.claps_image = "";
//                 }


//                 if (item1.chords_songs != "" && item1.chords_songs != null) {
//                   item1.chords_songs = base_url + 'images/' + item1.chords_songs;
//                   item1.chords_songs_image = allurl9.push(item1.chords_songs);
//                 } else {
//                   item1.chords_songs_image = "";
//                 }


//               })
//             );



//             item.songs = allurl;
//             item.has_claps = has_claps;
//             item.drums_image = allurl1[0]
//             item.bass_image = allurl2[0]
//             item.guitar_image = allurl3[0]
//             item.keyboards_image = allurl7[0]
//             item.vocals_image = allurl4
//             item.solo_image = allurl5
//             item.click_bpm_image = allurl6
//             item.claps_image = allurl8
//             item.chords_songs_image = allurl9
//           })
//         );
//         const [last_recorded_song] = await fetch_last_songs(userId, id)
//         if (last_recorded_song) {
//           last_recorded_song.songs = base_url + last_recorded_song.songs;
//         }
//         return res.json({
//           message: "fetch Songs details success",
//           status: 200,
//           success: true,
//           data: results,
//           totalsongs: results.length,
//           record: last_recorded_song || null,
//         });
//       } else {
//         return res.json({
//           message: "No Songs Uploaded!",
//           status: 200,
//           success: true,
//           data: [],
//           totalsongs: 0,
//           record: null,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//     });
//   }
// };


exports.getSongsByCategory = async (req, res) => {
  try {
    const results = await fetchSongsByCategory();

    if (results.length !== 0) {
      let base_url = S3_URL;

      const groupedSongs = {
        high: [],
        medium: [],
        easy: [],
      };

      await Promise.all(
        results.map(async (item) => {
          const category = item.category_group.toLowerCase();

          // Add base URL to cover image
          if (item.cover_image) {
            item.cover_image = baseurl_cover01 + item.cover_image;
          }

          let allurl = [];

          const processInstrument = async (instrument, propertyName) => {
            if (item[instrument] !== "") {
              item[instrument] = base_url + item[instrument];
              allurl.push(item[instrument]);
            } else {
              item[propertyName] = "";
            }
          };

          await Promise.all([
            processInstrument("drums", "drums"),
            processInstrument("bass", "bass"),
            processInstrument("guitar", "guitar"),
            processInstrument("vocals", "vocals"),
            processInstrument("solo", "solo"),
            processInstrument("click_bpm", "click_bpm"),
            processInstrument("keyboards", "keyboards"),
            processInstrument("claps", "claps"),
            processInstrument("master1", "master1"),
          ]);

          groupedSongs[category].push(item);
        })
      );

      return res.json({
        message: "Fetch Songs details success",
        status: 200,
        success: true,
        high: groupedSongs.high,
        medium: groupedSongs.medium,
        easy: groupedSongs.easy,
        data: groupedSongs,
      });
    } else {
      return res.json({
        message: "No Songs Uploaded!",
        status: 200,
        success: true,
        data: {},
        totalsongs: 0,
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.pay_now = async (req, res) => {
  try {
    var CurrentDate = moment().format();
    const { user_id, id, payment_status, amount } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        user_id: [Joi.number().empty(), Joi.string().empty()],
        id: [Joi.number().empty(), Joi.string().empty()],
        payment_status: [Joi.number().empty(), Joi.string().empty()],
        amount: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let data = {
        amount: amount,
        updated_at: CurrentDate,
        payment_status: payment_status,
      };

      let result1 = await updateSubscription(data, id, user_id);
      console.log('result1', result1);

      if (result1.affectedRows) {
        let data1 = {
          payment_status: payment_status,
        };

        let updateId = await updateUserById(data1, user_id);
        console.log('updateId', updateId);

        return res.json({
          message: "Payment Done Successfully",
          status: 200,
          success: true,
          details: data,
        });
      } else {
        return res.json({
          message: "Payment failed",
          status: 400,
          success: false,
          details: {},
        });
      }
    }
  } catch (err) {
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.uploadSong = async (req, res) => {
  try {

    console.log(req.file);

    const { user_id, song_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id is required",
        }),
        song_id: Joi.number().required()
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      let filename = "";
      if (req.file) {
        // const file = req.file;
        filename = req.file.filename;
      }
      const results = await recorded_songs({
        user_id: user_id,
        songs: filename,
        song_id: song_id,
      });
      if (results.length !== 0) {
        return res.json({
          message: "fetch Songs details success",
          status: 200,
          success: true,
          data: results,
          totalsongs: results.length,
        });
      } else {
        return res.json({
          message: "No Songs Uploaded!",
          status: 200,
          success: true,
          data: [],
          totalsongs: 0,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};
