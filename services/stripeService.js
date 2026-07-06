require("../utils/env");

const Stripe = require("stripe");

let stripeClient;

function requireEnv(key) {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required in .env`);
  }

  return value;
}

function getStripeClient() {
  if (!stripeClient) {
    stripeClient = Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }

  return stripeClient;
}

function getWebhookSecret() {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

function buildCheckoutUrls() {
  const appUrl = requireEnv("APP_URL").replace(/\/$/, "");
  // const successUrl = `${appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`;
  const successUrl = `${appUrl}/?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${appUrl}/payment-cancel`;

  console.log("Success URL:", successUrl);
  console.log("Cancel URL:", cancelUrl);

  return {
    successUrl,
    cancelUrl,
  };
}

async function createSubscriptionCheckoutSession({ user, plan, selectedInstrument }) {
  const stripe = getStripeClient();
  const { successUrl, cancelUrl } = buildCheckoutUrls();

  return stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email || undefined,
    line_items: [
      {
        price: plan.stripe_price_id,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      user_id: String(user.id),
      plan_id: String(plan.id),
      selected_instrument: String(selectedInstrument),
    },
    subscription_data: {
      metadata: {
        user_id: String(user.id),
        plan_id: String(plan.id),
        selected_instrument: String(selectedInstrument),
      },
    },
  });
}

function constructWebhookEvent(rawBody, signature) {
  const stripe = getStripeClient();
  return stripe.webhooks.constructEvent(rawBody, signature, getWebhookSecret());
}

async function retrieveSubscription(subscriptionId) {
  return getStripeClient().subscriptions.retrieve(subscriptionId);
}

async function retrieveInvoice(invoiceId) {
  return getStripeClient().invoices.retrieve(invoiceId);
}

async function retrieveCheckoutSession(sessionId) {
  return getStripeClient().checkout.sessions.retrieve(sessionId, {
    expand: ["subscription", "invoice"],
  });
}

async function cancelSubscription(stripeSubscriptionId) {
  return getStripeClient().subscriptions.cancel(stripeSubscriptionId);
}

module.exports = {
  createSubscriptionCheckoutSession,
  constructWebhookEvent,
  retrieveSubscription,
  retrieveInvoice,
  retrieveCheckoutSession,
  cancelSubscription,
};
