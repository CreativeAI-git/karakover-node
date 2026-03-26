const db = require("../utils/database");

module.exports = {
  // getPop: async () => {
  //   return db.query(
  //     "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`,  `instrument_id`, `track`,`label`,`cover_image`,`lyrics` ,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '1' "
  //   );
  // },
  // getPop: async () => {
  //   return db.query(`
  //     SELECT 
  //       tbl_songs.id,
  //       tbl_songs.artist,
  //       tbl_songs.category,
  //       instrument_id,
  //       track,
  //       label,
  //       cover_image,
  //       lyrics,
  //       tbl_music_files.solo,
  //       tbl_music_files.click_bpm,
  //       tbl_music_files.guitar,
  //       tbl_music_files.bass,
  //       tbl_music_files.drums,
  //       tbl_music_files.keyboards,
  //       tbl_music_files.claps,
  //       tbl_music_files.master_song AS master1
  //     FROM tbl_songs
  //     JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
  //     WHERE tbl_songs.instrument_id = '1'
  //   `);
  // },

  getPop: async (instrumentId) => {
    let query = `
    SELECT 
      tbl_songs.id, tbl_songs.artist, tbl_songs.category, instrument_id,
      track, label, cover_image, lyrics,
      tbl_music_files.solo, tbl_music_files.click_bpm,
      tbl_music_files.guitar, tbl_music_files.bass,
      tbl_music_files.drums, tbl_music_files.keyboards,
      tbl_music_files.claps, tbl_music_files.vocals, tbl_music_files.master_song AS master1
    FROM tbl_songs
    JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
    WHERE 1=1
  `;

    let params = [];

    if (instrumentId && instrumentId != 5) { // 5 = all instruments
      query += " AND instrument_id = ?";
      params.push(instrumentId);
    }

    // if (instrumentId) {
    //   query += " AND instrument_id = ?";
    //   params.push(instrumentId);
    // }

    return db.query(query, params);
  },

  getAllGenres: async () => {
    return db.query(`
    SELECT id, genre_type, image, created_at
    FROM genre
    ORDER BY created_at ASC
  `);
  },

  getHomeSongsByGenreCategory: async (genreId, instrumentId, category) => {
    let query = `
    SELECT 
      s.id,
      s.artist,
      s.category,
      s.instrument_id,
      s.track,
      s.label,
      s.cover_image,
      s.lyrics,
      mf.solo,
      mf.click_bpm,
      mf.guitar,
      mf.bass,
      mf.drums,
      mf.keyboards,
      mf.claps,
      mf.vocals,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.genre = ?
      AND s.category = ?
  `;

    let params = [genreId, category];

    // instrument filter (skip if Full Access = 5)
    if (instrumentId && instrumentId != 5) {
      query += ` AND s.instrument_id = ?`;
      params.push(instrumentId);
    }

    return db.query(query, params);
  },

  // getFolk: async () => {
  //   return db.query(
  //     "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`, `track`,`label`,`cover_image`,`lyrics`,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre`= '14' "
  //   );
  // },

  getFolk: async (instrumentId) => {
    let query = `
    SELECT tbl_songs.id, tbl_songs.artist, tbl_songs.category, instrument_id,
           track, label, cover_image, lyrics,
           tbl_music_files.solo, tbl_music_files.click_bpm,
           tbl_music_files.guitar, tbl_music_files.bass,
           tbl_music_files.drums, tbl_music_files.keyboards,
           tbl_music_files.claps, tbl_music_files.vocals, tbl_music_files.master_song AS master1
    FROM tbl_songs
    JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
    WHERE genre = 'Folk'  -- optional: can remove if genre_id used
  `;

    let params = [];

    if (instrumentId && instrumentId != 5) {
      query += " AND instrument_id = ?";
      params.push(instrumentId);
    }

    return db.query(query, params);
  },


  // getClassic: async () => {
  //   return db.query(
  //     "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`, `track`,`label`,`cover_image`,`lyrics` ,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '16' "
  //   );
  // },

  getClassic: async (instrumentId) => {
    let query = `
    SELECT 
      tbl_songs.id,
      tbl_songs.artist,
      tbl_songs.category,
      instrument_id,
      track,
      label,
      cover_image,
      lyrics,
      tbl_music_files.solo,
      tbl_music_files.click_bpm,
      tbl_music_files.guitar,
      tbl_music_files.bass,
      tbl_music_files.drums,
      tbl_music_files.keyboards,
      tbl_music_files.claps,
      tbl_music_files.vocals,
      tbl_music_files.master_song AS master1
    FROM tbl_songs
    JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
    WHERE 1=1
  `;

    let params = [];

    if (instrumentId && instrumentId != 5) { // 5 = all instruments
      query += " AND instrument_id = ?";
      params.push(instrumentId);
    }

    return db.query(query, params);
  },


  // getyourMood: async () => {
  //   return db.query(
  //     "select `tbl_songs`.`id`, `tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`,`track`,`label`,`cover_image`,`lyrics`,`tbl_music_files`.`solo` ,`tbl_music_files`.`click_bpm` , `tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '2' "
  //   );
  // },

  getyourMood: async (instrumentId) => {
    let query = `
    SELECT 
      tbl_songs.id,
      tbl_songs.artist,
      tbl_songs.category,
      instrument_id,
      track,
      label,
      cover_image,
      lyrics,
      tbl_music_files.solo,
      tbl_music_files.click_bpm,
      tbl_music_files.guitar,
      tbl_music_files.bass,
      tbl_music_files.drums,
      tbl_music_files.keyboards,
      tbl_music_files.claps,
      tbl_music_files.vocals,
      tbl_music_files.master_song AS master1
    FROM tbl_songs
    JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
    WHERE 1=1
  `;

    let params = [];

    if (instrumentId && instrumentId != 5) { // 5 = all instruments
      query += " AND instrument_id = ?";
      params.push(instrumentId);
    }

    return db.query(query, params);
  },


  get_recorded_song: async (user_id) => {
    return db.query(
      `SELECT * FROM recorded_songs  where user_id = '${user_id}' `
    );
  },

  get_recorded_song_data_recoreded_song_id: async (recorded_song_id) => {
    return await db.query(
      `SELECT * FROM recorded_songs  where id = '${recorded_song_id}' `
    );
  },

  get_songs_by_genre_id_by_instrument_id: async (genre_id, instrument_id) => {
    return await db.query(
      `SELECT * FROM tbl_songs  where genre = '${genre_id}' AND instrument_id ='${instrument_id}' ORDER BY created_at DESC `
    );
  },

  getAllSongsByInstrument: async (instrumentId) => {
    const query = `
    SELECT 
      s.*,                      -- song table ka id safe rahega
      mf.song_id,
      mf.chords_songs,
      mf.vocals,
      mf.master_song AS master1,
      mf.solo,
      mf.click_bpm,
      mf.bass,
      mf.drums,
      mf.guitar,
      mf.keyboards,
      mf.claps,
      mf.backing_track_guitar,
      mf.backing_track_bass,
      mf.backing_track_drums,
      mf.backing_track_keys,
      mf.all_file_names,
      mf.song_type,
      mf.updated_at
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.instrument_id = ? OR ? = 5
    ORDER BY s.id DESC
  `;
    return db.query(query, [instrumentId, instrumentId]);
  },

  getUserSubscription: async (user_id) => {
    const sql = `
    SELECT instrument_selected
    FROM user_subscription
    WHERE user_id = ?
      AND payment_status = 1
    ORDER BY created_at DESC
    LIMIT 1
  `;
    const [result] = await db.query(sql, [user_id]);
    return result?.instrument_selected || null;
  },




  getLatestSongsBySubscription: async (subscriptionType) => {
    const sql = `
    SELECT *
    FROM tbl_songs
    WHERE instrument_id = ?
    ORDER BY created_at DESC
    LIMIT 5
  `;
    return await db.query(sql, [subscriptionType]);
  },



  getyourMoods: async (instrumentId, search = "") => {
    let query = `
    SELECT 
      s.*,                      
      mf.song_id,
      mf.chords_songs,
      mf.vocals,
      mf.master_song AS master1,
      mf.solo,
      mf.click_bpm,
      mf.bass,
      mf.drums,
      mf.guitar,
      mf.keyboards,
      mf.claps,
      mf.backing_track_guitar,
      mf.backing_track_bass,
      mf.backing_track_drums,
      mf.backing_track_keys,
      mf.all_file_names,
      mf.song_type,
      mf.updated_at
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE 1=1
  `;

    const params = [];

    // ===== INSTRUMENT FILTER =====
    if (instrumentId && instrumentId != 5) {
      query += ` AND s.instrument_id = ?`;
      params.push(instrumentId);
    }

    // ===== SEARCH FILTER =====
    if (search && search.trim() !== "") {
      const keyword = `%${search}%`;
      query += `
      AND (
        s.track LIKE ?
        OR s.label LIKE ?
        OR s.lyrics LIKE ?
        OR s.artist LIKE ?
      )
    `;
      params.push(keyword, keyword, keyword, keyword);
    }

    query += ` ORDER BY s.id DESC`;

    return db.query(query, params);
  },







  //   getAllSongsByInstrument:async (instrumentId) => {
  //   let query = `
  //     SELECT *
  //     FROM tbl_songs s
  //     JOIN tbl_music_files mf ON mf.song_id = s.id
  //     WHERE s.instrument_id = ? OR ? = 5
  //     ORDER BY s.id DESC
  //   `;
  //   return db.query(query, [instrumentId, instrumentId]);
  // },


  get_songs_by_genre_name: async (genreName) => {
    return await db.query(
      `
    SELECT *
    FROM tbl_songs
    WHERE LOWER(genre) = LOWER(?)
    ORDER BY created_at DESC
    `,
      [genreName]
    );
  },

  get_songs_by_genre_name_and_instrument: async (genreName, instrument_id) => {
    return await db.query(
      `
    SELECT *
    FROM tbl_songs
    WHERE LOWER(genre) = LOWER(?)
      AND instrument_id = ?
    ORDER BY created_at DESC
    `,
      [genreName, instrument_id]
    );
  },

  get_all_songs: async () => {
    return await db.query(`
    SELECT *
    FROM tbl_songs
    ORDER BY created_at DESC
  `);
  },

  // getSongsByGenreIdAndInstrument: async (genre_id, instrument_id) => {
  //   // Example SQL: fetch songs of a genre filtered by instrument
  //   return await db.query("SELECT * FROM tbl_songs WHERE genre = ? AND instrument_id = ?", [genre_id, instrument_id]);
  // },

  //   getSongsByGenreId: async (genre_id) => {
  //   return db.query(`
  //     SELECT DISTINCT s.*, mf.*
  //     FROM tbl_songs s
  //     JOIN tbl_music_files mf ON mf.song_id = s.id
  //     WHERE s.genre = ?
  //     ORDER BY s.id DESC
  //   `, [genre_id]);
  // },

  // getSongsByGenreIdAndInstrument: async (genre_id, instrument_id) => {
  //   const query = `
  //     SELECT 
  //       s.id, s.artist, s.category, s.instrument_id, s.track, s.label, s.cover_image, s.lyrics,
  //       mf.solo, mf.click_bpm, mf.guitar, mf.bass, mf.drums, mf.keyboards, mf.claps, mf.master_song AS master1
  //     FROM tbl_songs s
  //     JOIN tbl_music_files mf ON mf.song_id = s.id
  //     WHERE s.genre = ? AND s.instrument_id = ?
  //     ORDER BY s.id DESC
  //   `;
  //   return db.query(query, [genre_id, instrument_id]);
  // },
  getSongsByGenreAndInstrument: async (genre_id, instrument_id) => {

    let conditions = [];
    let values = [];

    // Genre condition
    if (genre_id != 19) {
      conditions.push("s.genre = ?");
      values.push(genre_id);
    }

    // Instrument condition
    if (instrument_id != 5) {
      conditions.push("s.instrument_id = ?");
      values.push(instrument_id);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    return db.query(`
    SELECT DISTINCT
      s.*,
      mf.solo,
      mf.click_bpm,
      mf.guitar,
      mf.bass,
      mf.drums,
      mf.keyboards,
      mf.claps,
      mf.master_song AS master1,
      mf.vocals
    FROM tbl_songs s
    LEFT JOIN tbl_music_files mf ON mf.song_id = s.id
    ${whereClause}
    ORDER BY s.id DESC
  `, values);
  },

  getSongs_All: async () => {
    return db.query(`
    SELECT DISTINCT 
      s.*,
      mf.*,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    ORDER BY s.id DESC
  `);
  },


  getSongs_All_By_Instrument: async (instrument_id) => {
    return db.query(`
    SELECT DISTINCT 
      s.*,
      mf.*,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.instrument_id = ?
    ORDER BY s.id DESC
  `, [instrument_id]);
  },

  getSongs_By_Genre: async (genre_id) => {
    return db.query(`
    SELECT DISTINCT 
      s.*,
      mf.*,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.genre = ?
    ORDER BY s.id DESC
  `, [genre_id]);
  },




  getSongs_By_Genre_And_Instrument: async (genre_id, instrument_id) => {
    return db.query(`
    SELECT DISTINCT 
      s.*,
      mf.*,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.genre = ?
      AND s.instrument_id = ?
    ORDER BY s.id DESC
  `, [genre_id, instrument_id]);
  },


  getInstrumentDataById: async (instrument_id) => {
    // Yeh function ek hi instrument row return karega, jo song ke instrument_id se match kare
    const rows = await db.query(`
    SELECT id, instrument, cost, image, created_at
    FROM tbl_instruments
    WHERE id = ?
    LIMIT 1
  `, [instrument_id]);

    return rows[0] || null;
  },

  // Get instrument data from genre table based on genre_id
  getInstrumentDataByGenreId: async (genre_id) => {
    try {
      const rows = await db.query(
        `SELECT id, genre_type, image, created_at
       FROM tbl_genre
       WHERE id = ? LIMIT 1`,
        [genre_id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error in getInstrumentDataByGenreId:", error);
      return null;
    }
  },

  // created by @Krishn 19-02-2026
  getGenreDataByGenreId: async (genre_id) => {
    try {
      const rows = await db.query(
        `SELECT id, genre_type, image, created_at
       FROM tbl_genre
       WHERE id = ? LIMIT 1`,
        [genre_id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error("Error in getGenretDataByGenreId:", error);
      return null;
    }
  },

  // getInstrumentDataByGenreId:async (genre_id) => {
  //   const rows = await db.query(
  //     `SELECT 
  //        id,
  //        genre_type,
  //        image,
  //        created_at
  //      FROM tbl_genre
  //      WHERE id = ?
  //      LIMIT 1`,
  //     [genre_id]
  //   );

  //   if (!rows.length) return null;

  //   const data = rows[0];

  //   // ✅ base URL yahin lagta hai
  //   if (data.image) {
  //     data.image = baseurl_instrument + data.image;
  //   }

  //   return data;
  // },


  getSongs_By_InstrumentOnly: async (instrument_id) => {
    return db.query(`
    SELECT DISTINCT 
      s.*, 
      mf.solo,
      mf.click_bpm,
      mf.drums,
      mf.guitar,
      mf.bass,
      mf.keyboards,
      mf.claps,
      mf.vocals,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.instrument_id = CAST(? AS UNSIGNED)
    ORDER BY s.id DESC
  `, [instrument_id]);
  },


  getSongsByGenreIdAndInstrument: async (genre_id) => {
    return db.query(`
    SELECT DISTINCT 
      s.*, 
      mf.solo,
      mf.click_bpm,
      mf.drums,
      mf.guitar,
      mf.bass,
      mf.keyboards,
      mf.vocals,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.genre = ?
    ORDER BY s.id DESC
  `, [genre_id]);
  },

  getSongsByAllGenres: async () => {
    return db.query(`
    SELECT DISTINCT 
      s.*,
      mf.solo,
      mf.click_bpm,
      mf.guitar,
      mf.bass,
      mf.drums,
      mf.keyboards,
      mf.claps,
      mf.vocals,
      mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    ORDER BY s.id DESC
  `);
  },


  user_subscription_datagetSongsByGenreId: async () => {
    const query = `
    SELECT 
      s.id, s.artist, s.category, s.instrument_id, s.track, s.label, s.cover_image, s.lyrics, mf.guitar, mf.bass, mf.drums, mf.keyboards, mf.claps, mf.vocals, mf.master_song AS master1
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    ORDER BY s.id DESC
  `;
    return db.query(query);
  },

  // getSongsByGenreId: async () => {
  //   try {
  //     const rows = await db.query(
  //       `SELECT * FROM tbl_songs ORDER BY id DESC`,
  //     );
  //     return rows;
  //   } catch (error) {
  //     console.error("Error in getSongsByGenreId:", error);
  //     throw error;
  //   }
  // },

  getSongsByGenreId: async (genre_id) => {
    return await db.query(`
    SELECT 
      s.*, 
      mf.master_song AS master1,
      mf.vocals,
      mf.solo,
      mf.click_bpm,
      mf.drums,
      mf.guitar,
      mf.bass,
      mf.keyboards
    FROM tbl_songs s
    JOIN tbl_music_files mf ON mf.song_id = s.id
    WHERE s.genre = ?
    ORDER BY s.id DESC
  `, [genre_id]);
  },


  get_songs_by_instrument_id: async (instrument_id) => {
    return await db.query(
      `
    SELECT *
    FROM tbl_songs
    WHERE instrument_id = ?
    ORDER BY created_at DESC
    `,
      [instrument_id]
    );
  },


  get_songs_by_genre_id_by_instrument_id: async (genre_id, instrument_id) => {
    const sql = `
    SELECT * 
    FROM tbl_songs
    WHERE genre = ?
      AND instrument_id = ?
    ORDER BY created_at DESC
  `;
    return await db.query(sql, [genre_id, instrument_id]);
  },

  // home model
  get_songs_by_genre_with_optional_instrument: async (genre_id, instrument_id) => {
    const sql = `
    SELECT *
    FROM songs
    WHERE genre_id = ?
    AND (instrument_id = ? OR instrument_id IS NULL)
  `;
    const [rows] = await db.query(sql, [genre_id, instrument_id]);
    return rows;
  },


  get_songs_by_genre_id: async (genre_id) => {
    return await db.query(
      `SELECT * FROM tbl_songs  where genre = '${genre_id}' ORDER BY created_at DESC `
    );
  },



  user_subscription_data: async (user_id) => {
    return await db.query(
      `SELECT * FROM  user_subscription  where user_id = '${user_id}'`
    );
  },

  add_favorite_data: async (user_id, song_id) => {
    return await db.query(
      `INSERT INTO tbl_favorite (user_id, song_id) VALUES (?, ?)`,
      [user_id, song_id]
    );
  },

  get_favorite_data: async (user_id, song_id) => {
    return await db.query(
      `SELECT * FROM tbl_favorite WHERE user_id = ? AND song_id = ?`,
      [user_id, song_id]
    );
  },

  get_instrument_data_by_instrument_id: async (instrument_id) => {
    return await db.query(
      `SELECT * FROM tbl_instruments WHERE id = ?`,
      [instrument_id]
    );
  },

  remove_favorite_data: async (user_id, song_id) => {
    return await db.query(
      `DELETE FROM tbl_favorite WHERE user_id = ? AND song_id = ?`,
      [user_id, song_id]
    );
  },



  get_genre_data_from_database: async (recorded_song_id) => {
    return await db.query(
      `SELECT * FROM tbl_genre ORDER BY id DESC `
    );
  },

  // created by @Krishn 19-02-2026
  get_instrument_data_from_database: async (instrumentId) => {

    if (instrumentId == 5) {
      // Get all instruments
      return await db.query(
        `SELECT * FROM tbl_instruments ORDER BY id DESC`
      );
    } else {
      // Get specific instrument
      return await db.query(
        `SELECT * FROM tbl_instruments WHERE id = ? ORDER BY id DESC`,
        [instrumentId]
      );
    }

  },

  delete_recorded_song_by_recorded_song_id: async (recorded_song_id) => {
    return db.query(
      `DELETE FROM recorded_songs WHERE id = '${recorded_song_id}' `
    );
  },

  fetchUserBy_Id: async (user_id) => {
    return db.query(`SELECT * from tbl_users  where id = '${user_id}' `);
  },

  get_songs_data_song_id: async (song_id) => {
    return db.query(`SELECT * from tbl_songs  where id = '${song_id}' `);
  },

  get_artist_data_artist_id: async (artist_id) => {
    return db.query(`SELECT * from tbl_artists  where id = '${artist_id}' `);
  },
};
