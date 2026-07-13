const db = require("../utils/database");

const planColumns = `
  id,
  plan_name,
  plan_type,
  instrument_access,
  price,
  currency,
  billing_cycle,
  stripe_product_id,
  stripe_price_id,
  is_active,
  title,
  subtitle,
  badge_text,
  features,
  button_text
`;

module.exports = {
  getActivePlans: async () => {
    return db.query(
      `SELECT ${planColumns}
       FROM tbl_plans
       WHERE is_active = ?
       ORDER BY id ASC`,
      [1]
    );
  },

  getPlanById: async (planId) => {
    return db.query(
      `SELECT ${planColumns}
       FROM tbl_plans
       WHERE id = ? AND is_active = ?
       LIMIT 1`,
      [planId, 1]
    );
  },

  getUserById: async (userId) => {
    return db.query(
      `SELECT id, firstname, lastname, email
       FROM tbl_users
       WHERE id = ?
       LIMIT 1`,
      [userId]
    );
  },

  createSubscription: async (subscriptionData) => {
    console.log("DB insert user_subscription", subscriptionData);
    return db.query("INSERT INTO user_subscription SET ?", [subscriptionData]);
  },

  getLatestAnySubscriptionByUserId: async (userId) => {
    return db.query(
      `SELECT *
       FROM user_subscription
       WHERE user_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [userId]
    );
  },

  // createPaymentRecord: async (paymentData) => {
  //   console.log("DB insert stripe_payments", paymentData);
  //   return db.query("INSERT INTO stripe_payments SET ?", [paymentData]);
  // },
  updateSubscriptionById: async (id, data) => {
    return db.query(
      `UPDATE user_subscription
       SET ?
       WHERE id = ?`,
      [data, id]
    );
  },    

  getLatestSubscription: async (userId) => {
    return db.query(
      `SELECT
         us.*,
         tp.plan_name,
         tp.plan_type,
         tp.instrument_access,
         tp.billing_cycle,
         ti.instrument AS instrument_name,
         ti.image AS instrument_image
       FROM user_subscription us
       LEFT JOIN tbl_plans tp
         ON us.plan_id = tp.id
       LEFT JOIN tbl_instruments ti
         ON us.instrument_selected = ti.id
       WHERE us.user_id = ?
         AND us.payment_status = ?
         AND (
           us.subscription_status IS NULL
           OR us.subscription_status IN (?, ?, ?)
         )
         AND (
           us.subscription_end_date IS NULL
           OR us.subscription_end_date >= NOW()
         )
       ORDER BY us.subscription_start_date DESC, us.updated_at DESC, us.id DESC
       LIMIT 1`,
      [userId, 1, "active", "trial", "past_due"]
    );
  },

  getLatestCancelableSubscription: async (userId) => {
    return db.query(
      `SELECT
         us.*,
         tp.plan_name,
         tp.plan_type,
         tp.instrument_access,
         tp.billing_cycle,
         ti.instrument AS instrument_name,
         ti.image AS instrument_image
       FROM user_subscription us
       LEFT JOIN tbl_plans tp
         ON us.plan_id = tp.id
       LEFT JOIN tbl_instruments ti
         ON us.instrument_selected = ti.id
       WHERE us.user_id = ?
         AND us.payment_status = ?
         AND us.stripe_subscription_id IS NOT NULL
         AND us.stripe_subscription_id <> ''
         AND (
           us.subscription_status IS NULL
           OR us.subscription_status IN (?, ?, ?)
         )
         AND (
           us.subscription_end_date IS NULL
           OR us.subscription_end_date >= NOW()
         )
       ORDER BY us.subscription_start_date DESC, us.updated_at DESC, us.id DESC
       LIMIT 1`,
      [userId, 1, "active", "trial", "past_due"]
    );
  },

  cancelSubscription: async (subscriptionId) => {
    return db.query(
      `UPDATE user_subscription
       SET subscription_status = ?,
           payment_status = ?,
           subscription_end_date = NOW()
       WHERE id = ?`,
      ["cancelled", 0, subscriptionId]
    );
  },

  getSubscriptionByStripeId: async (stripeSubscriptionId) => {
    return db.query(
      `SELECT *
       FROM user_subscription
       WHERE stripe_subscription_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [stripeSubscriptionId]
    );
  },

  updateSubscriptionByStripeId: async (stripeSubscriptionId, data) => {
    return db.query(
      `UPDATE user_subscription
       SET ?
       WHERE stripe_subscription_id = ?`,
      [data, stripeSubscriptionId]
    );
  },

  // getPaymentByInvoiceId: async (stripeInvoiceId) => {
  //   return db.query(
  //     `SELECT id
  //      FROM stripe_payments
  //      WHERE stripe_invoice_id = ?
  //      LIMIT 1`,
  //     [stripeInvoiceId]
  //   );
  // },
  getSubscriptionByInvoiceId: async (stripeInvoiceId) => {
    return db.query(
      `SELECT *
       FROM user_subscription
       WHERE stripe_invoice_id = ?
       ORDER BY id DESC
       LIMIT 1`,
      [stripeInvoiceId]
    );
  },

  updateUserPaymentStatus: async (userId, paymentStatus) => {
    return db.query(
      `UPDATE tbl_users
       SET payment_status = ?
       WHERE id = ?`,
      [paymentStatus, userId]
    );
  },
};

// exports.expireAllActiveSubscriptions = async(userId)=>{

//     return db.query(
//         `
//         UPDATE subscriptions
//         SET
//             subscription_status='expired',
//             payment_status=0,
//             subscription_end_date=NOW()
//         WHERE user_id=?
//         AND subscription_status='active'
//         `,
//         [userId]
//     );

// };

// exports.expireSubscription = async (subscriptionId) => {
//     return db.query(
//         `
//         UPDATE subscriptions
//         SET
//             subscription_status='expired',
//             payment_status=0,
//             subscription_end_date=NOW()
//         WHERE id=?
//         `,
//         [subscriptionId]
//     );

// };


module.exports.expireAllActiveSubscriptions = async(userId)=>{

    return db.query(
        `
        UPDATE user_subscription
        SET
            subscription_status='expired',
            payment_status=0,
            subscription_end_date=NOW()
        WHERE user_id=?
        AND subscription_status='active'
        `,
        [userId]
    );

};

module.exports.expireSubscription = async (subscriptionId) => {
    return db.query(
        `
        UPDATE user_subscription
        SET
            subscription_status='expired',
            payment_status=0,
            subscription_end_date=NOW()
        WHERE id=?
        `,
        [subscriptionId]
    );

};
