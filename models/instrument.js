const db = require("../utils/database");
module.exports = {
  fetchInstrumentList: async () => {
    return db.query("select * from tbl_instruments where id != '5' LIMIT 6");
  },

  fetchInsById: async (id) => {
    return db.query(
      "select * from tbl_instruments where id = ? LIMIT 1",
      [id]
    );
  },

  instrumentSelect: async (data) => {
    return db.query("insert into user_subscription set ?", [data]);
  },

  updateInstrumentSelect: async (data, user_id) => {
    return db.query("update user_subscription set ? where user_id = ?", [
      data,
      user_id,
    ]);
  },

  getinstrumentSelected: async (id) => {
    return db.query(
      "select id,	user_id, instrument_selected from user_subscription where id = ? LIMIT 1",
      [id]
    );
  },

  getDataByInstrument: async (id) => {
    return db.query(
      "select `instrument_id`, `track`,`label`,`cover_image`,`lyrics` from tbl_songs where instrument_id = ?",
      [id]
    );
  },

  getAllDataInstrument: async () => {
    return db.query(
      "select `instrument_id`, `track`,`label`,`cover_image`,`lyrics` from tbl_songs "
    );
  },

  getinstrumentByUserid: async (user_id) => {
    return db.query(
      `select id,	user_id, instrument_selected from user_subscription where user_id = ? `,
      [user_id]
    );
  },

  updateSubscription: async (data, id, user_id) => {
    return db.query(
      "update user_subscription set ? where id = ? and user_id = ? ",
      [data, id, user_id]
    );
  },

  fetchSongsById: async (id) => {
    return db.query(
      `select A.*, B.artist_name, C.genre_type, D.album_type, 
              E.layout_name, 
              F.drums, F.bass, F.guitar, F.vocals, F.solo, F.click_bpm, F.chords_songs, F.keyboards, F.claps ,
              F.back_track 
              from tbl_songs A
              LEFT JOIN tbl_artists B  ON A.artist= B.id
              LEFT JOIN tbl_genre C ON A.genre= C.id
              LEFT JOIN tbl_albums D ON A.album_id= D.id 
              LEFT JOIN tbl_music_zones_types  E ON  A.zone_type = E.id 
              LEFT JOIN tbl_music_files F ON A.id= F.song_id 
              where A.id = ?`,
      [id]
    );
  },

  fetchevoriateSong: async (id) => {
    return db.query('select * from tbl_favorite where song_id = ?', [id]);
  },

  fetchevoriateSongUser: async (id, user_id) => {
    return db.query('select * from tbl_favorite where song_id = ? AND user_id = ?', [id, user_id]);
  },


  // fetch_last_songs: async (song_id) => {
  //   return db.query(`SELECT * FROM recorded_songs where song_i= ${song_id}ORDER BY created_at DESC LIMIT 1`);
  // },

  fetch_last_songs: async (user_id, song_id) => {
    return db.query(
      `SELECT * FROM recorded_songs WHERE user_id = ? AND song_id = ? ORDER BY created_at DESC LIMIT 1`,
      [user_id, song_id]
    );
  },



  //   fetchSongsById: async (id) => {
  //   return db.query(
  //     `select A.*, B.artist_name, C.genre_type, D.album_type, 
  //             E.layout_name, 
  //             F.drums, F.bass, F.guitar, F.vocals, F.solo, F.click_bpm, F.chords_songs, F.keyboards, F.claps  
  //             from tbl_songs A
  //             LEFT JOIN tbl_artists B  ON A.artist= B.id
  //             LEFT JOIN tbl_genre C ON A.genre= C.id
  //             LEFT JOIN tbl_albums D ON A.album_id= D.id 
  //             LEFT JOIN tbl_music_zones_types  E ON  A.zone_type = E.id 
  //             LEFT JOIN tbl_music_files F ON A.id= F.song_id 
  //             where A.id = ?`,
  //     [id]
  //   );
  // },


  fetchSongsByCategory: async () => {
    return db.query(
      `SELECT A.*, B.artist_name, C.genre_type, D.album_type, 
              E.layout_name, 
              F.drums, F.bass, F.guitar, F.vocals, F.solo, F.click_bpm, F.keyboards, F.claps,F.vocals as master1,
              CASE 
                WHEN A.category = 'High' THEN 'High'
                WHEN A.category = 'Medium' THEN 'Medium'
                WHEN A.category = 'Easy' THEN 'Easy'
                ELSE 'Other' 
              END AS category_group
              FROM tbl_songs A
              LEFT JOIN tbl_artists B  ON A.artist = B.id
              LEFT JOIN tbl_genre C ON A.genre = C.id
              LEFT JOIN tbl_albums D ON A.album_id = D.id 
              LEFT JOIN tbl_music_zones_types E ON A.zone_type = E.id 
              LEFT JOIN tbl_music_files F ON A.id = F.song_id 
              ORDER BY category_group DESC, A.category DESC`
    );
  },


  fetchSongsByImage: async (song_id) => {
    return db.query(
      `SELECT * from song_images where song_id = '${song_id}'`
    );
  },
};
