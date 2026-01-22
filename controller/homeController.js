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
} = require("../models/home");

const {
  getinstrumentByUserid,
} = require("../models/instrument");

const Joi = require("joi");
const BaseURl = require("../middleware/cofig");

const base_url = BaseURl + "/assets/";

const baseurl_songs = base_url + "songs/";
const baseurl_cover = base_url + "cover/";


exports.homePagePaylistsearch = async (req, res) => {
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
      var allItems = [];
      let fetchInstId = await getinstrumentByUserid(user_id);
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
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
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
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
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
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
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
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );
        allItems.push(...pop, ...folk, ...yourmood, ...classic);
        return res.json({
          message: "fetch home details successfully",
          status: 200,
          success: true,
          pop: pop,
          folk: folk,
          // classic: classic,
          classic: allItems,
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


exports.homePagePaylist = async (req, res) => {
  try {

    const { user_id } = req.body;
    const schema = Joi.object({
      user_id: Joi.number().required(),
    })

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

      let pop = await getPop();
      const folk = await getFolk();
      const classic = await getClassic();
      const yourmood = await getyourMood();


      let [user_subscription] = await user_subscription_data(user_id);

      console.log(user_subscription, 'user_subscription');
      if (user_subscription.instrument_selected != 5) {
        pop = pop.filter(po => po.instrument_id == user_subscription.instrument_selected);
      }

      console.log(pop, 'pop');


      let data = { pop: pop, folk: folk, classic: classic, yourmood: yourmood };

      if (pop.length !== 0) {

        await Promise.all(
          pop.map(async (item) => {
            console.log(item);

            let [favorite_data] = await get_favorite_data(user_id, item.id);
            item.is_favorite = !!favorite_data;

            let instrument_data = null;
            if (item.instrument_id) {
              [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
            }
            item.instrument_data = instrument_data

            const [artist_data] = await get_artist_data_artist_id(item.artist)
            console.log(artist_data, "artist_data");

            if (artist_data) {
              item.artist_name = artist_data.artist_name
            }

            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }

            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }

            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );

        await Promise.all(
          folk.map(async (item) => {

            let [favorite_data] = await get_favorite_data(user_id, item.id);
            item.is_favorite = !!favorite_data;

            const [artist_data] = await get_artist_data_artist_id(item.artist)
            console.log(artist_data, "artist_data");


            let instrument_data = null;
            if (item.instrument_id) {
              [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
            }

            item.instrument_data = instrument_data
            if (artist_data) {
              item.artist_name = artist_data.artist_name
            }
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );

        await Promise.all(
          classic.map(async (item) => {


            let [favorite_data] = await get_favorite_data(user_id, item.id);
            item.is_favorite = !!favorite_data;

            let instrument_data = null;
            if (item.instrument_id) {
              [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
            }
            item.instrument_data = instrument_data

            const [artist_data] = await get_artist_data_artist_id(item.artist)
            console.log(artist_data, "artist_data");

            if (artist_data) {
              item.artist_name = artist_data.artist_name
            }
            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
            }
            if (item.master1 != 0) {
              item.master1 = baseurl_songs + item.master1;
            }
          })
        );

        await Promise.all(
          yourmood.map(async (item) => {

            let [favorite_data] = await get_favorite_data(user_id, item.id);
            item.is_favorite = !!favorite_data;

            let instrument_data = null;
            if (item.instrument_id) {
              [instrument_data] = await get_instrument_data_by_instrument_id(item.instrument_id);
            }
            item.instrument_data = instrument_data

            const [artist_data] = await get_artist_data_artist_id(item.artist)
            console.log(artist_data, "artist_data");

            if (artist_data) {
              item.artist_name = artist_data.artist_name
            }

            if (item.cover_image) {
              item.cover_image = baseurl_cover + item.cover_image;
            }
            if (item.solo != 0) {
              item.solo = baseurl_songs + item.solo;
            }
            if (item.click_bpm != 0) {
              item.click_bpm = baseurl_songs + item.click_bpm;
            }
            if (item.drums != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 3)) {
              item.drums = baseurl_songs + item.drums;
              item.instrument_id = 3
            } else {
              item.drums = '';
            }
            if (item.claps != 0) {
              item.claps = baseurl_songs + item.claps;
            }
            if (item.guitar != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 1)) {
              item.guitar = baseurl_songs + item.guitar;
              item.instrument_id = 1
            } else {
              item.guitar = '';
            }
            if (item.bass != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 2)) {
              item.bass = baseurl_songs + item.bass;
              item.instrument_id = 2
            } else {
              item.bass = '';
            }
            if (item.keyboards != 0 && (fetchInstId[0]?.instrument_selected == 5 || fetchInstId[0]?.instrument_selected == 4)) {
              item.keyboards = baseurl_songs + item.keyboards;
              item.instrument_id = 4
            } else {
              item.keyboards = '';
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
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id is required",
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
      const get_song = await get_recorded_song(user_id);

      if (get_song && get_song.length > 0) {
        await Promise.all(
          get_song.map(async (item) => {
            console.log(item, "item data ");

            const [song_data] = await get_songs_data_song_id(item.song_id)
            const [artist_data] = await get_artist_data_artist_id(song_data.artist)
            const userdata = await fetchUserBy_Id(item.user_id);
            item.artist_name = artist_data.artist_name;
            item.song_name = song_data.track;
            item.artist_image = "";
            let base_artist_url = 'https://159.223.251.167:3000/artist/'
            if (artist_data.image && !artist_data.image.startsWith('http')) {
              item.artist_image = base_artist_url + artist_data.image;
            }
            item.firstname = userdata[0]?.firstname;
            item.lastname = userdata[0]?.lastname;
            item.email = userdata[0]?.email;
            // item.image = userdata[0]?.image;
            let base_songs_url = 'https://159.223.251.167:3000/assets/songs/'
            item.songUrl = base_songs_url + item.songs;
            item.image = base_url + "karokeLogo.png";
          })
        );

        return res.json({
          status: 200,
          success: true,
          message: "Song Found Successfully",
          mixtype: get_song,
        });
      } else {
        return res.json({
          status: 400,
          success: false,
          message: "Song Not Found",
          mixtype: get_song,
        });
      }
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
        message: "Genry Data Retrived Successfully",
        data: []
      });
    }

    genre_data.map((genre) => {
      if (genre.image && !genre.image.startsWith('http')) {
        genre.image = 'https://159.223.251.167/assets/genre/' + genre.image
      }
    })

    return res.json({
      status: 200,
      success: true,
      message: "Genry Data Retrived Successfully",
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


exports.get_songs_by_genre = async (req, res) => {
  try {
    const schema = Joi.object({
      genre_id: Joi.number().required()
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

    const { genre_id } = value;
    const user = req.user;

    const [subscription_data] = await user_subscription_data(user.id);
    const instrument_selected_id = subscription_data.instrument_selected;

    let genre_songs_data = [];
    if (instrument_selected_id == 5) {
      genre_songs_data = await get_songs_by_genre_id(genre_id);
    } else {
      genre_songs_data = await get_songs_by_genre_id_by_instrument_id(genre_id, instrument_selected_id);
    }

    if (!genre_songs_data || genre_songs_data.length === 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Genre songs data retrieved successfully",
        data: [],
      });
    }

    // Await all async operations inside map using Promise.all
    genre_songs_data = await Promise.all(
      genre_songs_data.map(async (song) => {
        let instrument_data = null;

        if (song.instrument_id) {
          [instrument_data] = await get_instrument_data_by_instrument_id(song.instrument_id);
        }

        song.instrument_data = instrument_data

        let [favorite_data] = await get_favorite_data(user.id, song.id);
        song.is_favorite = !!favorite_data;

        if (song.cover_image && !song.cover_image.startsWith('http')) {
          song.cover_image = `https://159.223.251.167/assets/cover/${song.cover_image}`;
        }

        return song;
      })
    );

    return res.status(200).json({
      status: 200,
      success: true,
      message: "Genre songs data retrieved successfully",
      data: genre_songs_data,
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
