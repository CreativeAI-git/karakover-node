const db = require("../utils/database");
module.exports = {
  addUser: async (user) => {
    return await db.query("insert into tbl_users set ?", [user]);
  },

  fetchUserCreatedAtById: async (userId) => {
    return db.query("select created_at from tbl_users where id = ? LIMIT 1", [
      userId,
    ]);
  },

  fetchLatestPaidSubscriptionByUserId: async (userId) => {
    return db.query(
      `SELECT
         us.id,
         us.user_id,
         us.plan_id,
         us.instrument_selected,
         us.amount,
         us.payment_status,
         us.subscription_name,
         us.subscription_status,
         us.subscription_start_date,
         us.subscription_end_date,
         us.subscription_days,
         us.created_at,
         us.updated_at,
         tp.plan_name,
         tp.plan_type,
         tp.instrument_access,
         ti.instrument AS instrument_name,
         ti.image AS instrument_image
       FROM user_subscription us
       LEFT JOIN tbl_plans tp
         ON us.plan_id = tp.id
       LEFT JOIN tbl_instruments ti
         ON us.instrument_selected = ti.id
       WHERE us.user_id = ?
         AND us.payment_status = 1
         AND (
           us.subscription_status IS NULL
           OR us.subscription_status IN ('active', 'trial', 'past_due')
         )
         AND (
           us.subscription_end_date IS NULL
           OR us.subscription_end_date >= NOW()
         )
       ORDER BY us.subscription_start_date DESC, us.updated_at DESC, us.id DESC
       LIMIT 1`,
      [userId]
    );
  },

fetchPaymentByUserId: async (userId) => {
  try {
    const rows = await db.query(
      "SELECT payment_status FROM user_subscription WHERE user_id = ? ORDER BY id DESC LIMIT 1",
      [userId]
    );
    // rows will be an array
    if (rows.length > 0) {
      return rows[0]; // return the latest payment record
    } else {
      return null; // no payment found
    }
  } catch (error) {
    console.log("Error fetching payment:", error);
    return null;
  }
},


 recorded_songs: async (user) => {
    return db.query("insert into recorded_songs set ?", [user]);
  },

  
  fetchUserByEmail: async (email) => {
    return db.query("select * from tbl_users where  email = ?", [email]);
  },

  fetchUserToken: async (token) => {
    return db.query("select * from tbl_users where token=?", [token]);
  },

  fetchUserActToken: async (act_token) => {
    return db.query("select * from tbl_users where act_token=?", [act_token]);
  },

  updateUser: async (token, email) => {
    return db.query("Update tbl_users set token=? where email=?", [
      token,
      email,
    ]);
  },

  updateVerifyUser: async (user, id) => {
    return db.query("update tbl_users set ? where id = ?", [user, id]);
  },

  updateUserbyPass: async (password, user_id) => {
    return db.query("Update tbl_users set password=? where  id =?", [
      password,
      user_id,
    ]);
  },
  fetchUserbysocial: async (email, social) => {
    return db.query("select * from tbl_users where email=? and social=?", [
      email,
      social,
    ]);
  },

  updateUsersocail: async (social, email) => {
    return db.query("Update tbl_users set social=? where email=?", [
      social,
      email,
    ]);
  },
  fetchUserById: async (id) => {
    return db.query(
      "select id,firstname,lastname,email,phone,image from tbl_users where id = ?",
      [id]
    );
  },

  fetchInstrumentUserid: async (id) => {
    return db.query(
      "select instrument_selected from user_subscription where user_id = ? ORDER BY id DESC LIMIT 1",
      [id]
    );
  },

  updateUserById: async (user, id) => {
    return db.query("update tbl_users set ? where id = ?", [user, id]);
  },

  fetchAlluser: async () => {
    return db.query("select * from tbl_users");
  },

  deleteUser: async (user_id) => {
    return db.query("Delete  From  tbl_users where id = ?", [user_id]);
  },

  fetchArtistSongsById: async (id) => {
    return db.query(
      " select `tbl_songs`.*, `tbl_artists`.`artist_name` ,`tbl_genre`.`genre_type` , `tbl_albums`.`album_type` from `tbl_songs` INNER JOIN `tbl_artists` ON `tbl_songs`.`artist`=`tbl_artists`.`id` INNER JOIN `tbl_albums` ON `tbl_songs`.`album_id`=`tbl_albums`.`id` INNER JOIN `tbl_genre` ON `tbl_songs`.`genre`=`tbl_genre`.`id` where `tbl_songs`.`artist` = ? ",
      [id]
    );
  },

  fetchSongsByGenreId: async (id) => {
    return db.query(
      " select `tbl_songs`.*, `tbl_artists`.`artist_name` ,`tbl_genre`.`genre_type` , `tbl_albums`.`album_type` from `tbl_songs` INNER JOIN `tbl_artists` ON `tbl_songs`.`artist`=`tbl_artists`.`id` INNER JOIN `tbl_albums` ON `tbl_songs`.`album_id`=`tbl_albums`.`id` INNER JOIN `tbl_genre` ON `tbl_songs`.`genre`=`tbl_genre`.`id` where `tbl_songs`.`genre` = ? ",
      [id]
    );
  },

  updPasswdByToken: async (password, token) => {
    return db.query("Update tbl_users set password=? where token=?", [
      password,
      token,
    ]);
  },

  tokenUpdate: async (id) => {
    return db.query('Update tbl_users set token="" where id=?', [id]);
  },
  updateLoginStatusByEmail: async (email) => {
    return db.query('Update tbl_users set login_status="1" where email = ?', [
      email,
    ]);
  },

  insertSongRequest: async (data) => {
    return db.query(`insert into request_song set ?`, [data]);
  },

  insertIntoNotification: async (data) => {
    return db.query(`insert into tbl_notification set ?`, [data]);
  },

  get_notification: async (receiver_id) => {
    return db.query(
      `select * from tbl_notification where receiver_id = '${receiver_id}'`
    );
  },

  update_fcm_token: async (fcm_token, email) => {
    return db.query(
      `Update tbl_users set fcm_token="${fcm_token}" where email="${email}"`
    );
  },
};
