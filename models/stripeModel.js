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

  createPaymentRecord: async (paymentData) => {
    console.log("DB insert stripe_payments", paymentData);
    return db.query("INSERT INTO stripe_payments SET ?", [paymentData]);
  },

  getLatestSubscription: async (userId) => {
    return db.query(
      `SELECT *
       FROM user_subscription
       WHERE user_id = ?
         AND payment_status = ?
         AND subscription_status IN (?, ?, ?)
       ORDER BY id DESC
       LIMIT 1`,
      [userId, 1, "active", "trialing", "past_due"]
    );
  },

  cancelSubscription: async (subscriptionId) => {
    return db.query(
      `UPDATE user_subscription
       SET subscription_status = ?
       WHERE id = ?`,
      ["cancelled", subscriptionId]
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

  getPaymentByInvoiceId: async (stripeInvoiceId) => {
    return db.query(
      `SELECT id
       FROM stripe_payments
       WHERE stripe_invoice_id = ?
       LIMIT 1`,
      [stripeInvoiceId]
    );
  },
};
