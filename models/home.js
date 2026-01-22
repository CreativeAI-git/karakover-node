const db = require("../utils/database");

module.exports = {
  // getPop: async () => {
  //   return db.query(
  //     "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`,  `instrument_id`, `track`,`label`,`cover_image`,`lyrics` ,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '1' "
  //   );
  // },
  getPop: async () => {
    return db.query(`
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
        tbl_music_files.vocals AS master1
      FROM tbl_songs
      JOIN tbl_music_files ON tbl_music_files.song_id = tbl_songs.id
      WHERE genre = '19' 
    `);
  },


  getFolk: async () => {
    return db.query(
      "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`, `track`,`label`,`cover_image`,`lyrics`,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre`= '14' "
    );
  },

  getClassic: async () => {
    return db.query(
      "select `tbl_songs`.`id`,`tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`, `track`,`label`,`cover_image`,`lyrics` ,`tbl_music_files`.`solo`,`tbl_music_files`.`click_bpm`,`tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '16' "
    );
  },

  getyourMood: async () => {
    return db.query(
      "select `tbl_songs`.`id`, `tbl_songs`.`artist`, `tbl_songs`.`category`, `instrument_id`,`track`,`label`,`cover_image`,`lyrics`,`tbl_music_files`.`solo` ,`tbl_music_files`.`click_bpm` , `tbl_music_files`.`guitar`,`tbl_music_files`.`bass`,`tbl_music_files`.`drums`,`tbl_music_files`.`keyboards`,`tbl_music_files`.`claps`, `tbl_music_files`.`vocals` as `master1` from `tbl_songs` JOIN `tbl_music_files` ON `tbl_music_files`.`song_id` = `tbl_songs`.`id` where `genre` = '2' "
    );
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
      `SELECT * FROM tbl_genre ORDER BY created_at DESC `
    );
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
