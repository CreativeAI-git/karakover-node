const express = require("express");
const stripeController = require("../controller/stripeController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/stripe/webhook",express.raw({ type: "application/json" }),stripeController.handleWebhook);
router.get("/plans", stripeController.getPlans);
router.get("/payment-success", stripeController.paymentSuccess);
router.get("/payment-cancel", stripeController.paymentCancel);
router.post("/create-checkout-session",auth,express.json(),stripeController.createCheckoutSession);
router.get("/subscription-status", auth, stripeController.getSubscriptionStatus);
router.post("/cancel-subscription",auth,express.json(),stripeController.cancelSubscription);
router.post("/upgrade-subscription",auth,express.json(),stripeController.upgradeSubscription);

module.exports = router;
