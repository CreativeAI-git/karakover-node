const Joi = require("joi");
const moment = require("moment");

const stripeModel = require("../models/stripeModel");
const stripeService = require("../services/stripeService");

const PLAN_TYPES = {
  SINGLE_MONTHLY: "single_monthly",
  FULL_MONTHLY: "full_monthly",
  FULL_YEARLY: "full_yearly",
};

const FULL_ACCESS_INSTRUMENT_ID = 5;
const VALID_INSTRUMENT_IDS = [1, 2, 3, 4, 5];

function success(res, statusCode, body) {
  return res.status(statusCode).json({
    success: true,
    ...body,
  });
}

function failure(res, statusCode, message, details) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
  });
}

function paymentPage(title, message) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Arial, sans-serif;
      color: #151515;
      background: #f7f7f2;
    }
    main {
      width: min(480px, calc(100% - 32px));
      padding: 32px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #fff;
      text-align: center;
    }
    h1 {
      margin: 0 0 12px;
      font-size: 28px;
      line-height: 1.2;
    }
    p {
      margin: 0;
      color: #555;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <main>
    <h1>${title}</h1>
    <p>${message}</p>
  </main>
</body>
</html>`;
}

function getPlanDays(plan) {
  if (plan.plan_type === PLAN_TYPES.FULL_YEARLY || plan.billing_cycle === "yearly") {
    return 365;
  }

  return 30;
}

function getInstrumentForPlan(plan, selectedInstrument) {
  if (plan.plan_type === PLAN_TYPES.SINGLE_MONTHLY) {
    return selectedInstrument;
  }

  return FULL_ACCESS_INSTRUMENT_ID;
}

function getSubscriptionNameForPlan(plan) {
  if (plan.billing_cycle === "yearly" || plan.plan_type === PLAN_TYPES.FULL_YEARLY) {
    return "yearly";
  }

  return "monthly";
}

function normalizeAmount(amount) {
  const numeric = Number(amount);
  return Number.isFinite(numeric) ? numeric : 0;
}

function normalizeStripePaymentStatus(status) {
  switch (status) {
    case "paid":
    case "succeeded":
    case "complete":
      return "succeeded";
    case "failed":
    case "unpaid":
    case "void":
    case "uncollectible":
      return "failed";
    case "refunded":
      return "refunded";
    default:
      return "pending";
  }
}

function getStripeId(value) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

function isValidStripePriceId(priceId) {
  return (
    typeof priceId === "string" &&
    priceId.startsWith("price_") &&
    !priceId.endsWith("_ID")
  );
}

async function createSubscriptionFromCheckoutSession(session) {
  const metadata = session.metadata || {};
  const userId = Number(metadata.user_id);
  const planId = Number(metadata.plan_id);
  const selectedInstrument = Number(metadata.selected_instrument);

  console.log("Checkout session metadata:", metadata);

  if (!userId || !planId) {
    throw new Error("Stripe session metadata is missing user_id or plan_id");
  }

  const [plan] = await stripeModel.getPlanById(planId);
  if (!plan) {
    throw new Error(`Plan not found for Stripe session: ${planId}`);
  }

  const [existingSubscription] = await stripeModel.getSubscriptionByStripeId(
    getStripeId(session.subscription)
  );
  if (existingSubscription) {
    await createPaymentRecordFromSession({
      session,
      userId,
      planId,
      subscriptionId: existingSubscription.id,
      plan,
    });

    return existingSubscription;
  }

  const subscriptionDays = getPlanDays(plan);
  const startDate = moment();
  const endDate = moment(startDate).add(subscriptionDays, "days");
  const instrumentSelected = getInstrumentForPlan(plan, selectedInstrument);

  const subscriptionData = {
    user_id: userId,
    plan_id: planId,
    instrument_selected: instrumentSelected,
    amount: normalizeAmount(plan.price),
    subscription_name: getSubscriptionNameForPlan(plan),
    subscription_start_date: startDate.format("YYYY-MM-DD HH:mm:ss"),
    subscription_end_date: endDate.format("YYYY-MM-DD HH:mm:ss"),
    subscription_days: subscriptionDays,
    payment_status: 1,
    stripe_customer_id: getStripeId(session.customer),
    stripe_subscription_id: getStripeId(session.subscription),
    stripe_price_id: plan.stripe_price_id,
    subscription_status: "active",
  };

  console.log("Creating subscription", subscriptionData);

  const created = await stripeModel.createSubscription(subscriptionData);
  const subscriptionId = created.insertId;

  await createPaymentRecordFromSession({
    session,
    userId,
    planId,
    subscriptionId,
    plan,
  });

  return {
    id: subscriptionId,
    ...subscriptionData,
  };
}

async function createPaymentRecordFromSession({
  session,
  userId,
  planId,
  subscriptionId,
  plan,
}) {
  const invoiceId = getStripeId(session.invoice);

  if (invoiceId) {
    const [existingPayment] = await stripeModel.getPaymentByInvoiceId(invoiceId);
    if (existingPayment) {
      return existingPayment;
    }
  }

  let paymentIntentId = getStripeId(session.payment_intent);
  let amount = normalizeAmount(plan.price);
  let currency = plan.currency || "usd";
  let paymentStatus = normalizeStripePaymentStatus(session.payment_status);

  if (invoiceId) {
    const invoice = await stripeService.retrieveInvoice(invoiceId);
    paymentIntentId = getStripeId(invoice.payment_intent) || paymentIntentId;
    amount = invoice.amount_paid ? invoice.amount_paid / 100 : amount;
    currency = invoice.currency || currency;
    paymentStatus = normalizeStripePaymentStatus(invoice.status);
  }

  const paymentPayload = {
    user_id: userId,
    plan_id: planId,
    subscription_id: subscriptionId,
    stripe_payment_intent_id: paymentIntentId,
    stripe_invoice_id: invoiceId,
    amount,
    currency,
    payment_status: paymentStatus,
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  console.log("Creating payment record", paymentPayload);

  return stripeModel.createPaymentRecord(paymentPayload);
}

async function createPaymentRecordFromInvoice(invoice) {
  const stripeSubscriptionId = getStripeId(invoice.subscription);

  if (!stripeSubscriptionId) {
    console.log("invoice.paid missing subscription id:", invoice.id);
    return;
  }

  const [subscription] = await stripeModel.getSubscriptionByStripeId(
    stripeSubscriptionId
  );
  if (!subscription) {
    console.log("No local subscription found for invoice:", {
      invoice_id: invoice.id,
      stripe_subscription_id: stripeSubscriptionId,
    });
    return;
  }

  const [existingPayment] = await stripeModel.getPaymentByInvoiceId(invoice.id);
  if (existingPayment) {
    console.log("Payment record already exists for invoice:", invoice.id);
    return;
  }

  const paymentPayload = {
    user_id: subscription.user_id,
    plan_id: subscription.plan_id,
    subscription_id: subscription.id,
    stripe_payment_intent_id: getStripeId(invoice.payment_intent),
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
    currency: invoice.currency,
    payment_status: normalizeStripePaymentStatus(invoice.status),
    created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
  };

  console.log("Creating payment record", paymentPayload);

  await stripeModel.createPaymentRecord(paymentPayload);
}

async function updateSubscriptionFromStripe(stripeSubscription) {
  if (!stripeSubscription?.id) {
    return;
  }

  const startDate = stripeSubscription.current_period_start
    ? moment.unix(stripeSubscription.current_period_start)
    : null;
  const endDate = stripeSubscription.current_period_end
    ? moment.unix(stripeSubscription.current_period_end)
    : null;

  const data = {
    subscription_status: stripeSubscription.status,
    payment_status: stripeSubscription.status === "active" ? 1 : 0,
  };

  if (startDate) {
    data.subscription_start_date = startDate.format("YYYY-MM-DD HH:mm:ss");
  }

  if (endDate) {
    data.subscription_end_date = endDate.format("YYYY-MM-DD HH:mm:ss");
    if (startDate) {
      data.subscription_days = Math.max(1, endDate.diff(startDate, "days"));
    }
  }

  await stripeModel.updateSubscriptionByStripeId(stripeSubscription.id, data);
}

exports.getPlans = async (req, res) => {
  try {
    const plans = await stripeModel.getActivePlans();
    return success(res, 200, { data: plans });
  } catch (error) {
    console.error("getPlans error:", error);
    return failure(res, 500, "Internal server error");
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return failure(res, 401, "Unauthorized");
    }

    const schema = Joi.object({
      plan_id: Joi.number().integer().positive().required(),
      selected_instrument: Joi.number()
        .integer()
        .valid(...VALID_INSTRUMENT_IDS)
        .optional(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return failure(res, 400, error.details[0].message);
    }

    const [user] = await stripeModel.getUserById(userId);
    if (!user) {
      return failure(res, 404, "User not found");
    }

    const [plan] = await stripeModel.getPlanById(value.plan_id);
    if (!plan) {
      return failure(res, 404, "Plan not found or inactive");
    }

    if (!isValidStripePriceId(plan.stripe_price_id)) {
      return failure(
        res,
        400,
        "Plan has invalid stripe_price_id. Save the real Stripe Price ID from Stripe Dashboard."
      );
    }

    if (
      plan.plan_type === PLAN_TYPES.SINGLE_MONTHLY &&
      !value.selected_instrument
    ) {
      return failure(
        res,
        400,
        "selected_instrument is required for single_monthly plan"
      );
    }

    const selectedInstrument = getInstrumentForPlan(plan, value.selected_instrument);
    const session = await stripeService.createSubscriptionCheckoutSession({
      user,
      plan,
      selectedInstrument,
    });

    return success(res, 200, { checkout_url: session.url });
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    return failure(res, 500, "Internal server error");
  }
};

exports.paymentSuccess = async (req, res) => {
  const { session_id: sessionId } = req.query;

  try {
    if (sessionId) {
      const session = await stripeService.retrieveCheckoutSession(sessionId);

      if (session.payment_status === "paid" || getStripeId(session.subscription)) {
        await createSubscriptionFromCheckoutSession(session);
      }
    }

    return res
      .status(200)
      .send(paymentPage("Payment Successful", "Your subscription is active."));
  } catch (error) {
    console.error("paymentSuccess error:", error);
    return res
      .status(200)
      .send(
        paymentPage(
          "Payment Successful",
          "Your payment was completed. We are still confirming the subscription details."
        )
      );
  }
};

exports.paymentCancel = async (req, res) => {
  return res
    .status(200)
    .send(paymentPage("Payment Cancelled", "You can return to the app and try again."));
};

exports.handleWebhook = async (req, res) => {
  console.log("Webhook received");

  const signature = req.headers["stripe-signature"];

  let event;
  try {
    event = stripeService.constructWebhookEvent(req.body, signature);
  } catch (error) {
    return failure(res, 400, "Invalid Stripe webhook signature", error.message);
  }

  try {
    console.log(event.type);

    switch (event.type) {
      case "checkout.session.completed":
        await createSubscriptionFromCheckoutSession(event.data.object);
        break;

      case "invoice.paid":
        await createPaymentRecordFromInvoice(event.data.object);
        if (getStripeId(event.data.object.subscription)) {
          await updateSubscriptionFromStripe(
            await stripeService.retrieveSubscription(
              getStripeId(event.data.object.subscription)
            )
          );
        }
        break;

      case "invoice.payment_failed":
        if (getStripeId(event.data.object.subscription)) {
          await stripeModel.updateSubscriptionByStripeId(
            getStripeId(event.data.object.subscription),
            {
              subscription_status: "past_due",
              payment_status: 0,
            }
          );
        }
        break;

      case "customer.subscription.updated":
        await updateSubscriptionFromStripe(event.data.object);
        break;

      case "customer.subscription.deleted":
        await stripeModel.updateSubscriptionByStripeId(event.data.object.id, {
          subscription_status: "cancelled",
          payment_status: 0,
        });
        break;

      default:
        break;
    }

    return success(res, 200, { received: true });
  } catch (error) {
    console.error("handleWebhook error:", error);
    return failure(res, 500, "Webhook processing failed");
  }
};

exports.getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return failure(res, 401, "Unauthorized");
    }

    const [subscription] = await stripeModel.getLatestSubscription(userId);
    return success(res, 200, { subscription: subscription || null });
  } catch (error) {
    console.error("getSubscriptionStatus error:", error);
    return failure(res, 500, "Internal server error");
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return failure(res, 401, "Unauthorized");
    }

    const [subscription] = await stripeModel.getLatestSubscription(userId);
    if (!subscription) {
      return failure(res, 404, "Active subscription not found");
    }

    if (!subscription.stripe_subscription_id) {
      return failure(res, 400, "Subscription is missing Stripe subscription id");
    }

    await stripeService.cancelSubscription(subscription.stripe_subscription_id);
    await stripeModel.cancelSubscription(subscription.id);

    return success(res, 200, {
      message: "Subscription cancelled successfully",
    });
  } catch (error) {
    console.error("cancelSubscription error:", error);
    return failure(res, 500, "Internal server error");
  }
};
