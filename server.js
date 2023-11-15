/** @format */

const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
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
    publishableKey: process.env.STRIPE_PUBLIC_KEY,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
