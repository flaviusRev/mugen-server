/** @format */

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51O3NFpCkOvYgdBYNHrpbNg4InhRQVLHPIlH1n0BKkUcnc9XG7EDyjyTAB8j924BPtvk8Kn8tQTbbVub4f3IWGA8L00kgNYz2lb"
);
const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-customer", async (req, res) => {
  const { email } = req.body;
  let customer = await stripe.customers.create({ email: email }); // This example just creates a new Customer every time
  res.send({
    customer: customer.id,
  });
});

app.post("/payment-sheet", async (req, res) => {
  const { subscriptionId, customerId } = req.body;
  const prices = { 1: 999, 2: 1999, 3: 2999 }; // Prices in cents
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customerId },
    { apiVersion: "2023-10-16" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: prices[subscriptionId],
    currency: "usd",
    customer: customerId,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerId,
    publishableKey:
      "pk_test_51O3NFpCkOvYgdBYNlBxpJCKECwWOHw495lTDhTQl5UAA48dhxHibI8cjbR2zejQTln6a55kDXQ1RtUIoXPlF5u3D00LPqrO5hM",
  });
});

module.exports = app;
