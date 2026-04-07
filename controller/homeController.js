const {
  getPop,
  getFolk,
  getyourMood,
  getClassic,
  get_recorded_song,
  fetchUserBy_Id,
  get_songs_data_song_id,
  get_artist_data_artist_id,
  delete_recorded_song_by_recorded_song_id,
  get_recorded_song_data_recoreded_song_id,
  get_genre_data_from_database,
  get_songs_by_genre_id,
  user_subscription_data,
  get_songs_by_genre_id_by_instrument_id,
  add_faorite_data,
  add_favorite_data,
  remove_favorite_data,
  get_favorite_data,
  get_instrument_data_by_instrument_id,
  get_songs_by_genre_with_optional_instrument,
  get_songs_by_instrument_id,
  get_all_songs,
  get_songs_by_genre_name_and_instrument,
  get_songs_by_genre_name,
  getSongsByGenreIdAndInstrument,
  getSongsByGenreId,
  getSongsByAllGenres,
  getSongsByGenreAndInstrument,
  getSongs_All,
  getSongs_By_Genre,
  getSongs_By_Genre_And_Instrument,
  getSongs_By_InstrumentOnly,
  getSongs_All_By_Instrument,
  getInstrumentDataById,
  getInstrumentDataByGenreId,
  getAllGenres,
  getHomeSongsByGenreCategory,
  getAllSongsByInstrument,
  getyourMoods,
  getUserSubscription,
  getLatestSongsBySubscription,
  get_instrument_data_from_database,
  getGenreDataByGenreId,
  get_mobile_banners
} = require("../models/home");

const {
  getinstrumentByUserid,
} = require("../models/instrument");

const Joi = require("joi");
const BaseURl = require("../middleware/cofig");

const base_url = BaseURl + "/assets/";

const baseurl_songs = base_url + "songs/";
const baseurl_cover = base_url + "cover/";
const baseurl_banners = BaseURl + "/assets/mobile_banners/";


const formatResponse = (list = []) => {
  return list.map(item => ({
    id: item.id,
    instrument_id: item.instrument_id,
    track: item.track,
    category: item.category,
    artist_name: item.artist_name || "",
    label: item.label,
    cover_image: item.cover_image,
    lyrics: item.lyrics,
    master1: item.master1
  }));
};



// exports.homePagePaylistsearch = async (req, res) => {
//   try {

//     const { user_id } = req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         user_id: Joi.number().empty().required().messages({
//           "number.empty": "id can't be empty",
//           "number.required": "id  is required",
//         }),
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
//       var allItems = [];
//       let fetchInstId = await getinstrumentByUserid(user_id);
//       const pop = await getPop();
//       const folk = await getFolk();
//       const classic = await getClassic();
//       const yourmood = await getyourMood();

//       let data = { pop: pop, folk: folk, classic: classic, yourmood: yourmood };
//       if (pop.length !== 0) {
//         await Promise.all(
//           pop.map(async (item) => {
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );
//         await Promise.all(
//           folk.map(async (item) => {
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );
//         await Promise.all(
//           yourmood.map(async (item) => {
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );
//         await Promise.all(
//           classic.map(async (item) => {
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );
//         allItems.push(...pop, ...folk, ...yourmood, ...classic);
//         return res.json({
//           message: "fetch home details successfully",
//           status: 200,
//           success: true,
//           pop: pop,
//           folk: folk,
//           // classic: classic,
//           classic: allItems,
//           yourmood: yourmood,
//           data: data,
//         });
//       } else {
//         return res.json({
//           message: "fetch details failed",
//           status: 400,
//           genre: [],
//           albums: [],
//           yourmood: [],
//           artist: [],
//           success: false,
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

exports.homePagePaylistsearch = async (req, res) => {
  try {
    const { user_id } = req.body;
    const { search } = req.query; // GET request ke liye query params

    // ===== VALIDATION =====
    const schema = Joi.object({
      user_id: Joi.number().required(),
      search: Joi.string().allow("", null),
    });
    const { error } = schema.validate({ user_id, search });
    if (error) {
      return res.json({
        message: error.details[0].message,
        error: error.details.map(i => i.message).join(","),
        missingParams: error.details[0].message,
        status: 400,
        success: false,
      });
    }

    // ===== USER SUBSCRIPTION =====
    const [user_subscription] = await user_subscription_data(user_id);
    const instrumentSelected = user_subscription?.instrument_selected || 5;

    // ===== FETCH SONGS =====
    let songs = await getyourMoods(instrumentSelected);

    // ===== PROCESS SONGS =====
    await Promise.all(
      songs.map(async item => {
        const [fav] = await get_favorite_data(user_id, item.id);
        item.is_favorite = !!fav;

        if (item.instrument_id) {
          const [inst] = await get_instrument_data_by_instrument_id(item.instrument_id);
          item.instrument_data = inst || null;
        }

        const [artist] = await get_artist_data_artist_id(item.artist);
        if (artist) item.artist_name = artist.artist_name;

        if (item.cover_image) item.cover_image = baseurl_cover + item.cover_image;
        if (item.solo) item.solo = baseurl_songs + item.solo;
        if (item.click_bpm) item.click_bpm = baseurl_songs + item.click_bpm;
        if (item.master1) item.master1 = baseurl_songs + item.master1;

        // instrument specific tracks
        item.drums = item.drums && (instrumentSelected == 5 || instrumentSelected == 3) ? baseurl_songs + item.drums : '';
        item.guitar = item.guitar && (instrumentSelected == 5 || instrumentSelected == 1) ? baseurl_songs + item.guitar : '';
        item.bass = item.bass && (instrumentSelected == 5 || instrumentSelected == 2) ? baseurl_songs + item.bass : '';
        item.keyboards = item.keyboards && (instrumentSelected == 5 || instrumentSelected == 4) ? baseurl_songs + item.keyboards : '';
      })
    );

    // ===== SEARCH FILTER =====
    if (search && search.trim() !== "") {
      const keyword = search.toLowerCase();
      songs = songs.filter(item =>
        item.track?.toLowerCase().includes(keyword) ||
        item.label?.toLowerCase().includes(keyword) ||
        item.artist_name?.toLowerCase().includes(keyword) ||
        item.lyrics?.toLowerCase().includes(keyword)
      );
    }

    // ===== GROUP BY DIFFICULTY =====
    const easy = songs.filter(s => s.category?.toLowerCase() === "easy");
    const medium = songs.filter(s => s.category?.toLowerCase() === "medium");
    const high = songs.filter(s => s.category?.toLowerCase() === "high");

    // ===== RESPONSE =====
    return res.json({
      message: "Home data fetched successfully",
      status: 200,
      success: true,
      data: {
        easy,
        medium,
        high,
      },
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};





// exports.homePagePaylist = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     // ===== VALIDATION =====
//     const schema = Joi.object({
//       user_id: Joi.number().required(),
//     });

//     const { error } = schema.validate(req.body);
//     if (error) {
//       return res.json({
//         success: false,
//         status: 400,
//         message: error.details[0].message,
//       });
//     }

//     // ===== USER INSTRUMENT =====
//     const [user_subscription] = await user_subscription_data(user_id);
//     const instrumentSelected = user_subscription?.instrument_selected;

//     // ===== FETCH ALL GENRES =====
//     const genres = await getAllGenres();

//     if (!genres || genres.length === 0) {
//       return res.json({
//         success: true,
//         status: 200,
//         message: "No genres found",
//         data: {},
//       });
//     }

//     const homeData = {};

//     // ===== LOOP GENRES =====
//     for (const genre of genres) {

//       const easy = await getHomeSongsByGenreCategory(
//         genre.id,
//         instrumentSelected,
//         "easy"
//       );

//       const medium = await getHomeSongsByGenreCategory(
//         genre.id,
//         instrumentSelected,
//         "medium"
//       );

//       const high = await getHomeSongsByGenreCategory(
//         genre.id,
//         instrumentSelected,
//         "high"
//       );

//       // ===== PROCESS SONGS (same logic everywhere) =====
//       const processSongs = async (songs) => {
//         return Promise.all(
//           songs.map(async (song) => {

//             // favorite
//             const [favorite_data] = await get_favorite_data(user_id, song.id);
//             song.is_favorite = !!favorite_data;

//             // artist
//             const [artist_data] = await get_artist_data_artist_id(song.artist);
//             song.artist_name = artist_data?.artist_name || null;

//             // instrument data
//             let instrument_data = null;
//             if (song.instrument_id) {
//               [instrument_data] = await get_instrument_data_by_instrument_id(song.instrument_id);
//             }
//             song.instrument_data = instrument_data;

//             // base urls
//             if (song.cover_image) song.cover_image = baseurl_cover + song.cover_image;
//             if (song.solo) song.solo = baseurl_songs + song.solo;
//             if (song.click_bpm) song.click_bpm = baseurl_songs + song.click_bpm;

//             // master1 fallback
//             if (!song.master1 && song.vocals) {
//               song.master1 = song.vocals;
//             }
//             if (song.master1) song.master1 = baseurl_songs + song.master1;

//             // instrument-specific tracks
//             song.guitar = song.guitar && (instrumentSelected == 5 || instrumentSelected == 1)
//               ? baseurl_songs + song.guitar : "";

//             song.bass = song.bass && (instrumentSelected == 5 || instrumentSelected == 2)
//               ? baseurl_songs + song.bass : "";

//             song.drums = song.drums && (instrumentSelected == 5 || instrumentSelected == 3)
//               ? baseurl_songs + song.drums : "";

//             song.keyboards = song.keyboards && (instrumentSelected == 5 || instrumentSelected == 4)
//               ? baseurl_songs + song.keyboards : "";

//             return song;
//           })
//         );
//       };

//       homeData[genre.genre_type] = {
//         genre_id: genre.id,
//         image: genre.image ? baseurl_cover + genre.image : null,
//         easy: await processSongs(easy),
//         medium: await processSongs(medium),
//         high: await processSongs(high),
//       };
//     }

//     return res.json({
//       success: true,
//       status: 200,
//       message: "Home playlist fetched successfully",
//       data: homeData,
//     });

//   } catch (error) {
//     console.error("homePagePlaylist error:", error);
//     return res.json({
//       success: false,
//       status: 500,
//       message: "Internal server error",
//     });
//   }
// };

exports.homePagePaylist = async (req, res) => {
  try {
    const { user_id } = req.body;

    // ===== VALIDATION =====
    const schema = Joi.object({
      user_id: Joi.number().required(),
    });
    const result = schema.validate(req.body);
    if (result.error) {
      return res.json({
        message: result.error.details[0].message,
        error: result.error.details.map(i => i.message).join(","),
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    }

    // ===== USER INSTRUMENT =====
    let [user_subscription] = await user_subscription_data(user_id);
    const instrumentSelected = user_subscription?.instrument_selected;
    console.log('instrumentSelected', instrumentSelected)

    // ===== FETCH ALL SONGS FOR THIS INSTRUMENT =====
    let allSongs = await getAllSongsByInstrument(instrumentSelected);

    // Only keep songs for this instrument (or full access)
    allSongs = allSongs.filter(song => song.instrument_id == instrumentSelected || instrumentSelected == 5);

    // ===== REMOVE DUPLICATES =====
    const usedSongIds = new Set();
    allSongs = allSongs.filter(song => {
      if (usedSongIds.has(song.id)) return false;
      usedSongIds.add(song.id);
      return true;
    });

    // ===== USER INSTRUMENT DETAILS =====
    let fetchInstId = await getinstrumentByUserid(user_id);

    // ===== PROCESS SONGS =====
    const processSong = async (item) => {
      const [favorite_data] = await get_favorite_data(user_id, item.id);
      item.is_favorite = !!favorite_data;

      if (item.instrument_id) {
        const [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
        item.instrument_data = instrument_data || null;
      }

      const [artist_data] = await get_artist_data_artist_id(item.artist);
      item.artist_name = artist_data?.artist_name || null;

      if (item.cover_image) item.cover_image = baseurl_cover + item.cover_image;
      if (item.solo) item.solo = baseurl_songs + item.solo;
      if (item.click_bpm) item.click_bpm = baseurl_songs + item.click_bpm;

      // instrument-specific tracks
      item.drums =
        item.drums && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)
          ? baseurl_songs + item.drums : '';
      item.guitar =
        item.guitar && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)
          ? baseurl_songs + item.guitar : '';
      item.bass =
        item.bass && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)
          ? baseurl_songs + item.bass : '';
      item.keyboards =
        item.keyboards && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)
          ? baseurl_songs + item.keyboards : '';
      if (!item.master1 && item.master_song) {
        item.master1 = item.master_song;
      }
      item.master1 = item.master1 ? baseurl_songs + item.master1 : '';

    };

    await Promise.all(allSongs.map(processSong));

    // ===== GROUP BY STATIC CATEGORIES =====
    const homeData = {
      easy: [],
      medium: [],
      high: []
    };

    allSongs.forEach(song => {
      const category = song.category?.toLowerCase();
      if (category && homeData[category]) {
        homeData[category].push(song);
      }
    });

    // ===== RESPONSE =====
    return res.json({
      message: "Home data fetched successfully",
      status: 200,
      success: true,
      data: homeData, // always has keys: easy, medium, high
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};



// exports.homePagePaylist = async (req, res) => {
//   try {
//     const { user_id } = req.body;

//     // ===== VALIDATION =====
//     const schema = Joi.object({
//       user_id: Joi.number().required(),
//     });

//     const result = schema.validate(req.body);
//     if (result.error) {
//       return res.json({
//         message: result.error.details[0].message,
//         error: result.error.details.map(i => i.message).join(","),
//         missingParams: result.error.details[0].message,
//         status: 400,
//         success: false,
//       });
//     }

//     // ===== USER INSTRUMENT =====
//     let [user_subscription] = await user_subscription_data(user_id);
//     const instrumentSelected = user_subscription?.instrument_selected;

//     // ===== TRACK USED SONG IDS (KEY FIX) =====
//     const usedSongIds = new Set();

//     const filterUniqueSongs = (songs) => {
//       return songs.filter(song => {
//         if (usedSongIds.has(song.id)) return false;
//         usedSongIds.add(song.id);
//         return true;
//       });
//     };

//     // ===== FETCH SONGS (PRIORITY ORDER) =====
//     let pop = filterUniqueSongs(await getPop(instrumentSelected));
//     let folk = filterUniqueSongs(await getFolk(instrumentSelected));
//     let classic = filterUniqueSongs(await getClassic(instrumentSelected));
//     let yourmood = filterUniqueSongs(await getyourMood(instrumentSelected));

//     if (!pop.length && !folk.length && !classic.length && !yourmood.length) {
//       return res.json({
//         message: "No songs found",
//         status: 400,
//         success: false,
//         pop: [],
//         folk: [],
//         classic: [],
//         yourmood: [],
//       });
//     }

//     // ===== USER INSTRUMENT DETAILS =====
//     let fetchInstId = await getinstrumentByUserid(user_id);

//     // ===== PROCESS SONG =====
//     const processSong = async (item) => {

//       const [favorite_data] = await get_favorite_data(user_id, item.id);
//       item.is_favorite = !!favorite_data;

//       if (item.instrument_id) {
//         const [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
//         item.instrument_data = instrument_data || null;
//       }

//       const [artist_data] = await get_artist_data_artist_id(item.artist);
//       item.artist_name = artist_data?.artist_name || null;

//       if (item.cover_image) item.cover_image = baseurl_cover + item.cover_image;
//       if (item.solo) item.solo = baseurl_songs + item.solo;
//       if (item.click_bpm) item.click_bpm = baseurl_songs + item.click_bpm;

//       // instrument-specific tracks
//       item.drums =
//         item.drums && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)
//           ? baseurl_songs + item.drums : '';

//       item.guitar =
//         item.guitar && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)
//           ? baseurl_songs + item.guitar : '';

//       item.bass =
//         item.bass && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)
//           ? baseurl_songs + item.bass : '';

//       item.keyboards =
//         item.keyboards && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)
//           ? baseurl_songs + item.keyboards : '';

//       if (item.master1) item.master1 = baseurl_songs + item.master1;
//     };

//     // ===== PROCESS SONGS =====
//     await Promise.all(pop.map(processSong));
//     await Promise.all(folk.map(processSong));
//     await Promise.all(classic.map(processSong));
//     await Promise.all(yourmood.map(processSong));

//     // ===== RESPONSE (UNCHANGED) =====
//     return res.json({
//       message: "Home data fetched successfully",
//       status: 200,
//       success: true,
//       pop: formatResponse(pop),
//       folk: formatResponse(folk),
//       classic: formatResponse(classic),
//       yourmood: formatResponse(yourmood),
//     });

//   } catch (error) {
//     console.error(error);
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//     });
//   }
// };





// exports.homePagePaylistsearch = async (req, res) => {
//   try {

//     const { user_id } = req.body;
//     const schema = Joi.object({
//       user_id: Joi.number().required(),
//     })

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
//       let fetchInstId = await getinstrumentByUserid(user_id);

//       let pop = await getPop();
//       const folk = await getFolk();
//       const classic = await getClassic();
//       const yourmood = await getyourMood();


//       let [user_subscription] = await user_subscription_data(user_id);

//       console.log(user_subscription, 'user_subscription');
//       if (user_subscription.instrument_selected != 5) {
//         pop = pop.filter(po => po.instrument_id == user_subscription.instrument_selected);
//       }

//       console.log(pop, 'pop');


//       let data = { pop: pop, folk: folk, classic: classic, yourmood: yourmood };

//       if (pop.length !== 0) {

//         await Promise.all(
//           pop.map(async (item) => {
//             console.log(item);

//             let [favorite_data] = await get_favorite_data(user_id, item.id);
//             item.is_favorite = !!favorite_data;

//             let instrument_data = null;
//             if (item.instrument_id) {
//               [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
//             }
//             item.instrument_data = instrument_data

//             const [artist_data] = await get_artist_data_artist_id(item.artist)
//             console.log(artist_data, "artist_data");

//             if (artist_data) {
//               item.artist_name = artist_data.artist_name
//             }

//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }

//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }

//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );

//         await Promise.all(
//           folk.map(async (item) => {

//             let [favorite_data] = await get_favorite_data(user_id, item.id);
//             item.is_favorite = !!favorite_data;

//             const [artist_data] = await get_artist_data_artist_id(item.artist)
//             console.log(artist_data, "artist_data");


//             let instrument_data = null;
//             if (item.instrument_id) {
//               [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
//             }

//             item.instrument_data = instrument_data
//             if (artist_data) {
//               item.artist_name = artist_data.artist_name
//             }
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );

//         await Promise.all(
//           classic.map(async (item) => {


//             let [favorite_data] = await get_favorite_data(user_id, item.id);
//             item.is_favorite = !!favorite_data;

//             let instrument_data = null;
//             if (item.instrument_id) {
//               [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
//             }
//             item.instrument_data = instrument_data

//             const [artist_data] = await get_artist_data_artist_id(item.artist)
//             console.log(artist_data, "artist_data");

//             if (artist_data) {
//               item.artist_name = artist_data.artist_name
//             }
//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );

//         await Promise.all(
//           yourmood.map(async (item) => {

//             let [favorite_data] = await get_favorite_data(user_id, item.id);
//             item.is_favorite = !!favorite_data;

//             let instrument_data = null;
//             if (item.instrument_id) {
//               [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
//             }
//             item.instrument_data = instrument_data

//             const [artist_data] = await get_artist_data_artist_id(item.artist)
//             console.log(artist_data, "artist_data");

//             if (artist_data) {
//               item.artist_name = artist_data.artist_name
//             }

//             if (item.cover_image) {
//               item.cover_image = baseurl_cover + item.cover_image;
//             }
//             if (item.solo != 0) {
//               item.solo = baseurl_songs + item.solo;
//             }
//             if (item.click_bpm != 0) {
//               item.click_bpm = baseurl_songs + item.click_bpm;
//             }
//             if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
//               item.drums = baseurl_songs + item.drums;
//               item.instrument_id = 3
//             } else {
//               item.drums = '';
//             }
//             if (item.claps != 0) {
//               item.claps = baseurl_songs + item.claps;
//             }
//             if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
//               item.guitar = baseurl_songs + item.guitar;
//               item.instrument_id = 1
//             } else {
//               item.guitar = '';
//             }
//             if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
//               item.bass = baseurl_songs + item.bass;
//               item.instrument_id = 2
//             } else {
//               item.bass = '';
//             }
//             if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
//               item.keyboards = baseurl_songs + item.keyboards;
//               item.instrument_id = 4
//             } else {
//               item.keyboards = '';
//             }
//             if (item.master1 != 0) {
//               item.master1 = baseurl_songs + item.master1;
//             }
//           })
//         );

//         return res.json({
//           message: "fetch home details successfully",
//           status: 200,
//           success: true,
//           pop: pop,
//           folk: folk,
//           classic: classic,
//           yourmood: yourmood,
//           data: data,
//         });
//       } else {
//         return res.json({
//           message: "fetch details failed",
//           status: 400,
//           genre: [],
//           albums: [],
//           yourmood: [],
//           artist: [],
//           success: false,
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



exports.homePage = async (req, res) => {
  try {
    const { user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
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
      const pop = await getPop();
      const folk = await getFolk();
      const classic = await getClassic();
      const yourmood = await getyourMood();

      let data = { pop: pop, folk: folk, classic: classic, yourmood: yourmood };

      if (pop.length !== 0) {
        await Promise.all(
          pop.map(async (item) => {
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0) {
              item.drums = baseurl_songs + item.drums;
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0) {
              item.guitar = baseurl_songs + item.guitar;
            }
            if (item.keyboards != 0) {
              item.keyboards = baseurl_songs + item.keyboards;
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );
        await Promise.all(
          folk.map(async (item) => {
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0) {
              item.drums = baseurl_songs + item.drums;
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0) {
              item.guitar = baseurl_songs + item.guitar;
            }
            if (item.keyboards != 0) {
              item.keyboards = baseurl_songs + item.keyboards;
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );
        await Promise.all(
          classic.map(async (item) => {
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0) {
              item.drums = baseurl_songs + item.drums;
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0) {
              item.guitar = baseurl_songs + item.guitar;
            }
            if (item.keyboards != 0) {
              item.keyboards = baseurl_songs + item.keyboards;
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );
        await Promise.all(
          yourmood.map(async (item) => {
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0) {
              item.drums = baseurl_songs + item.drums;
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0) {
              item.guitar = baseurl_songs + item.guitar;
            }
            if (item.keyboards != 0) {
              item.keyboards = baseurl_songs + item.keyboards;
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );
        return res.json({
          message: "fetch home details successfully",
          status: 200,
          success: true,
          pop: pop,
          folk: folk,
          classic: classic,
          yourmood: yourmood,
          data: data,
        });
      } else {
        return res.json({
          message: "fetch details failed",
          status: 400,
          genre: [],
          albums: [],
          yourmood: [],
          artist: [],
          success: false,
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

exports.get_song = async (req, res) => {
  try {
    const { user_id } = req.body;

    const schema = Joi.object({
      user_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
      });
    }

    // 🔹 Step 1: Recorded songs
    let get_song = await get_recorded_song(user_id);

    // 🔹 Step 2: If NO recorded song → fetch default 5 latest songs
    if (!get_song || get_song.length === 0) {
      const subscriptionType = await getUserSubscription(user_id);
      get_song = await getLatestSongsBySubscription(subscriptionType);
    }

    if (!get_song || get_song.length === 0) {
      return res.json({
        success: false,
        status: 400,
        message: "Song Not Found",
        mixtype: [],
      });
    }

    // 🔹 Step 3: Mapping data
    await Promise.all(
      get_song.map(async (item) => {
        const [song_data] = await get_songs_data_song_id(item.song_id || item.id);
        const [artist_data] = await get_artist_data_artist_id(song_data.artist);
        const userdata = await fetchUserBy_Id(user_id);

        item.song_name = song_data.track;
        item.artist_name = artist_data.artist_name;

        item.artist_image = artist_data.image
          ? `https://karakover.com/assets/artist/${artist_data.image}`
          : "";

        item.songUrl = `https://api.karakover.com/assets/songs/${item.songs || song_data.track_no}`;
        item.image = base_url + "karokeLogo.png";

        item.firstname = userdata[0]?.firstname;
        item.lastname = userdata[0]?.lastname;
        item.email = userdata[0]?.email;
      })
    );

    return res.json({
      success: true,
      status: 200,
      message: "Song Found Successfully",
      mixtype: get_song,
    });

  } catch (error) {
    console.error(error);
    return res.json({
      success: false,
      status: 500,
      message: "Internal server error",
    });
  }
};


// exports.get_song = async (req, res) => {
//   try {
//     const { user_id } = req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         user_id: Joi.number().empty().required().messages({
//           "number.empty": "id can't be empty",
//           "number.required": "id is required",
//         }),
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
//       const get_song = await get_recorded_song(user_id);

//       if (get_song && get_song.length > 0) {
//         await Promise.all(
//           get_song.map(async (item) => {
//             console.log(item, "item data ");

//             const [song_data] = await get_songs_data_song_id(item.song_id)
//             const [artist_data] = await get_artist_data_artist_id(song_data.artist)
//             const userdata = await fetchUserBy_Id(item.user_id);
//             item.artist_name = artist_data.artist_name;
//             item.song_name = song_data.track;
//             item.artist_image = "";
//             let base_artist_url = 'https://karakover.com/assets/artist/'
//             if (artist_data.image && !artist_data.image.startsWith('http')) {
//               item.artist_image = base_artist_url + artist_data.image;
//             }
//             item.firstname = userdata[0]?.firstname;
//             item.lastname = userdata[0]?.lastname;
//             item.email = userdata[0]?.email;
//             // item.image = userdata[0]?.image;
//             let base_songs_url = 'https://api.karakover.com/assets/songs/'
//             item.songUrl = base_songs_url + item.songs;
//             item.image = base_url + "karokeLogo.png";
//           })
//         );

//         return res.json({
//           status: 200,
//           success: true,
//           message: "Song Found Successfully",
//           mixtype: get_song,
//         });
//       } else {
//         return res.json({
//           status: 400,
//           success: false,
//           message: "Song Not Found",
//           mixtype: get_song,
//         });
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     return res.json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error,
//     });
//   }
// };


exports.delete_recorded_song = async (req, res) => {
  try {
    const { recorded_song_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        recorded_song_id: Joi.number().required()
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
      const [recored_song_data] = await get_recorded_song_data_recoreded_song_id(recorded_song_id)

      if (!recored_song_data) {
        return res.json({
          status: 404,
          success: false,
          message: "Recorded Song Not Found",

        });
      }
      await delete_recorded_song_by_recorded_song_id(recorded_song_id);
      return res.json({
        status: 200,
        success: true,
        message: "Recorded Song Deleted Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};


exports.get_genre_data_api = async (req, res) => {
  try {
    const genre_data = await get_genre_data_from_database()

    if (genre_data.length == 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Genre Data Retrived Successfully",
        data: []
      });
    }

    genre_data.map((genre) => {
      if (genre.image && !genre.image.startsWith('http')) {
        genre.image = 'https://karakover.com/assets/genre/' + genre.image
      }
    })

    return res.json({
      status: 200,
      success: true,
      message: "Genre Data Retrived Successfully",
      data: genre_data
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

// created by @Krishn 19-02-2026
exports.get_instrument_data_api = async (req, res) => {
  try {
    const { user_id } = req.params;
    const [user_subscription] = await user_subscription_data(user_id);
    const instrumentSelected = user_subscription?.instrument_selected;

    const instrument_data = await get_instrument_data_from_database(instrumentSelected)

    if (instrument_data.length == 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Instrument Data Retrived Successfully",
        data: []
      });
    }

    instrument_data.map((instrument) => {
      if (instrument.image && !instrument.image.startsWith('http')) {
        instrument.image = 'https://karakover.com/assets/instrument/' + instrument.image
      }
    })

    return res.json({
      status: 200,
      success: true,
      message: "Instrument Data Retrived Successfully",
      data: instrument_data
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};

// created by @Krishn 26-03-2026
exports.get_mobile_banners_api = async (req, res) => {
  try {
    const banners = await get_mobile_banners();

    if (!banners || banners.length === 0) {
      return res.json({
        status: 200,
        success: true,
        message: "Mobile Banners Retrieved Successfully",
        data: []
      });
    }

    const updated = banners.map((banner) => {
      const item = { ...banner };
      const bannerType = (item.type || "").toString().toLowerCase();

      // Only image/video need base URL, text should remain as-is
      if ((bannerType === "image" || bannerType === "video")
        && item.banner
        && typeof item.banner === "string"
        && !item.banner.startsWith("http")) {
        item.banner = baseurl_banners + item.banner;
      }

      // For video banners, add base URL for thumbnail_image (same path as banners)
      if (bannerType === "video"
        && item.thumbnail_image
        && typeof item.thumbnail_image === "string"
        && !item.thumbnail_image.startsWith("http")) {
        item.thumbnail_image = baseurl_banners + item.thumbnail_image;
      }

      return item;
    });

    return res.json({
      status: 200,
      success: true,
      message: "Mobile Banners Retrieved Successfully",
      data: updated
    });

  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error,
    });
  }
};


exports.get_songs_by_genre = async (req, res) => {
  try {
    const { genre_id, user_id } = req.body;

    const schema = Joi.object({
      genre_id: Joi.number().required(),
      user_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
      });
    }

    const [user_subscription] = await user_subscription_data(user_id);
    const instrumentSelected = user_subscription?.instrument_selected;

    let songs = [];

    // ===== CASE LOGIC =====
    if (genre_id == 19 && instrumentSelected == 5) {
      songs = await getSongs_All();
    } else if (genre_id == 19 && instrumentSelected != 5) {
      songs = await getSongs_All_By_Instrument(instrumentSelected);
    } else if (genre_id != 19 && instrumentSelected == 5) {
      songs = await getSongs_By_Genre(genre_id);
    } else {
      songs = await getSongs_By_Genre_And_Instrument(genre_id, instrumentSelected);
    }

    if (!songs || songs.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Genre songs fetched successfully",
        data: [],
      });
    }

    // ===== PROCESS SONGS =====
    const processedSongs = await Promise.all(
      songs.map(async (song) => {

        // favorite
        const [favorite_data] = await get_favorite_data(user_id, song.id);
        song.is_favorite = !!favorite_data;

        const instrument_data = await getInstrumentDataByGenreId(song.genre);

        // image base url
        if (instrument_data?.image) {
          instrument_data.image = baseurl_cover + instrument_data.image;
        }

        song.instrument_data = instrument_data;

        // artist
        const [artist_data] = await get_artist_data_artist_id(song.artist);
        song.artist_name = artist_data?.artist_name || null;

        // base urls
        if (song.cover_image) song.cover_image = baseurl_cover + song.cover_image;
        if (song.solo) song.solo = baseurl_songs + song.solo;
        if (song.click_bpm) song.click_bpm = baseurl_songs + song.click_bpm;

        // ✅ ONLY THIS LINE ADDED — NOTHING ELSE
        if (!song.master1 && song.vocals) {
          song.master1 = song.vocals;
        }
        if (song.master1) {
          song.master1 = baseurl_songs + song.master1;
        }

        song.guitar = song.guitar ? baseurl_songs + song.guitar : "";
        song.bass = song.bass ? baseurl_songs + song.bass : "";
        song.drums = song.drums ? baseurl_songs + song.drums : "";
        song.keyboards = song.keyboards ? baseurl_songs + song.keyboards : "";

        return song;
      })
    );



    return res.json({
      success: true,
      status: 200,
      message: "Genre songs fetched successfully",
      data: processedSongs,
    });
  } catch (error) {
    console.error("Error in get_songs_by_genre:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || error,
    });
  }
};

// created by @Krishn 19-02-2026
exports.get_songs_by_instrument = async (req, res) => {
  try {
    const { instrument_id, user_id } = req.body;

    const schema = Joi.object({
      instrument_id: Joi.number().required(),
      user_id: Joi.number().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.json({
        success: false,
        status: 400,
        message: error.details[0].message,
      });
    }

    let songs = [];

    // ===== CASE LOGIC =====
    if (instrument_id == 5) {
      songs = await getSongs_All();
    } else {
      songs = await getSongs_All_By_Instrument(instrument_id);
    }

    if (!songs || songs.length === 0) {
      return res.json({
        success: true,
        status: 200,
        message: "Instrument songs fetched successfully",
        data: [],
      });
    }

    // ===== PROCESS SONGS =====
    const processedSongs = await Promise.all(
      songs.map(async (song) => {

        // favorite
        const [favorite_data] = await get_favorite_data(user_id, song.id);
        song.is_favorite = !!favorite_data;

        const genre_data = await getGenreDataByGenreId(song.genre);

        // image base url
        if (genre_data?.image) {
          genre_data.image = baseurl_cover + genre_data.image;
        }

        song.genre_data = genre_data;

        // artist
        const [artist_data] = await get_artist_data_artist_id(song.artist);
        song.artist_name = artist_data?.artist_name || null;

        // base urls
        if (song.cover_image) song.cover_image = baseurl_cover + song.cover_image;
        if (song.solo) song.solo = baseurl_songs + song.solo;
        if (song.click_bpm) song.click_bpm = baseurl_songs + song.click_bpm;

        // ONLY THIS LINE ADDED — NOTHING ELSE
        if (!song.master1 && song.vocals) {
          song.master1 = song.vocals;
        }
        if (song.master1) {
          song.master1 = baseurl_songs + song.master1;
        }

        song.guitar = song.guitar ? baseurl_songs + song.guitar : "";
        song.bass = song.bass ? baseurl_songs + song.bass : "";
        song.drums = song.drums ? baseurl_songs + song.drums : "";
        song.keyboards = song.keyboards ? baseurl_songs + song.keyboards : "";

        return song;
      })
    );



    return res.json({
      success: true,
      status: 200,
      message: "Instrument songs fetched successfully",
      data: processedSongs,
    });
  } catch (error) {
    console.error("Error in get_songs_by_instrument:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || error,
    });
  }
};










// exports.get_songs_by_genre = async (req, res) => {
//   try {
//     const schema = Joi.object({
//       genre_id: Joi.number().required()
//     });

//     const { error, value } = schema.validate(req.body);
//     if (error) {
//       const message = error.details.map(i => i.message).join(",");
//       return res.status(400).json({
//         message: error.details[0].message,
//         error: message,
//         missingParams: error.details[0].message,
//         status: 400,
//         success: false,
//       });
//     }

//     const { genre_id } = value;
//     const user = req.user;

//     const [subscription_data] = await user_subscription_data(user.id);
//     const instrument_selected_id = subscription_data.instrument_selected;

//     let genre_songs_data = [];
//     if (instrument_selected_id == 5) {
//       genre_songs_data = await get_songs_by_genre_id(genre_id);
//     } else {
//       genre_songs_data = await get_songs_by_genre_id_by_instrument_id(genre_id, instrument_selected_id);
//     }

//     if (!genre_songs_data || genre_songs_data.length === 0) {
//       return res.status(200).json({
//         status: 200,
//         success: true,
//         message: "Genre songs data retrieved successfully",
//         data: [],
//       });
//     }

//     // Await all async operations inside map using Promise.all
//     genre_songs_data = await Promise.all(
//       genre_songs_data.map(async (song) => {
//         let instrument_data = null;

//         if (song.instrument_id) {
//           [instrument_data] = await get_instrument_data_by_instrument_id(song.instrument_id);
//         }

//         song.instrument_data = instrument_data

//         let [favorite_data] = await get_favorite_data(user.id, song.id);
//         song.is_favorite = !!favorite_data;

//         if (song.cover_image && !song.cover_image.startsWith('http')) {
//           song.cover_image = `https://karakover.com/assets/cover/${song.cover_image}`;
//         }

//         return song;
//       })
//     );

//     return res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Genre songs data retrieved successfully",
//       data: genre_songs_data,
//     });

//   } catch (error) {
//     console.error("Error in get_songs_by_genre:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       status: 500,
//       error: error.message || error,
//     });
//   }
// };


exports.add_remove_favorite = async (req, res) => {
  try {
    const schema = Joi.object({
      song_id: Joi.number().required(),
      is_favorite: Joi.boolean().required(),
      user_id: Joi.number().required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      const message = error.details.map(i => i.message).join(",");
      return res.status(400).json({
        message: error.details[0].message,
        error: message,
        missingParams: error.details[0].message,
        status: 400,
        success: false,
      });
    }

    const { song_id, is_favorite, user_id } = value;
    // const user = req.user;

    let response_message = null;
    if (is_favorite == true) {
      response_message = "Added"

      let [favorite_data] = await get_favorite_data(user_id, song_id)
      console.log(favorite_data);
      if (favorite_data) {
        return res.status(400).json({
          success: false,
          message: "You have already Added this in favorite",
          status: 400,
        });
      } else {
        await add_favorite_data(user_id, song_id);
      }
    } else {
      let [favorite_data] = await get_favorite_data(user_id, song_id)

      if (!favorite_data) {
        return res.status(404).json({
          success: false,
          message: "Not Found Favorite Data",
          status: 404,
        });
      }
      response_message = "Removed"
      await remove_favorite_data(user_id, song_id);
    }

    return res.status(200).json({
      status: 200,
      success: true,
      message: `Favorite ${response_message} Successfully`,
    });

  } catch (error) {
    console.error("Error in get_songs_by_genre:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      status: 500,
      error: error.message || error,
    });
  }
};
