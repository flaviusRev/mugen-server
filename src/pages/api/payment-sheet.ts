/** @format */

import { configureCORS, handlePreflight } from "./cors";
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
export default async function POST(
  request: NextApiRequest,
  response: NextApiResponse
) {
  configureCORS(response); // Configura los encabezados CORS permitidos
  if (handlePreflight(request, response)) {
    return; // Si se manejó la solicitud preflight, no continúes con la lógica del endpoint
  }
  const stripe = new Stripe(
    "sk_test_51O3NFpCkOvYgdBYNHrpbNg4InhRQVLHPIlH1n0BKkUcnc9XG7EDyjyTAB8j924BPtvk8Kn8tQTbbVub4f3IWGA8L00kgNYz2lb"
  );
  const { subscriptionId, customerId } = request.body;
  const prices = {
    1: 7500,
    2: 15000,
    3: 30000,
    4: 45000,
    5: 60000,
    6: 75000,
    7: 90000,
    8: 120000,
    9: 150000,
  }; // Prices in cents
  console.log("IDS: ", subscriptionId, customerId);
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

  //   response.json({
  //     paymentIntent: paymentIntent.client_secret,
  //     ephemeralKey: ephemeralKey.secret,
  //     customer: customerId,
  //     publishableKey:
  //       "pk_test_51O3NFpCkOvYgdBYNlBxpJCKECwWOHw495lTDhTQl5UAA48dhxHibI8cjbR2zejQTln6a55kDXQ1RtUIoXPlF5u3D00LPqrO5hM",
  //   });

  const responsePayment = {
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customerId,
    publishableKey:
      "pk_test_51O3NFpCkOvYgdBYNlBxpJCKECwWOHw495lTDhTQl5UAA48dhxHibI8cjbR2zejQTln6a55kDXQ1RtUIoXPlF5u3D00LPqrO5hM",
  };
  return response.status(200).json(responsePayment);
}
