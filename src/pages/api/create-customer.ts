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
  const { email } = request.body;
  let customer = await stripe.customers.create({ email: email }); // This example just creates a new Customer every time
  //   response.send({
  //     customer: customer.id,
  //   });
  const customerResponse = {
    customer: customer.id,
  };
  return response.status(200).json(customerResponse);
}
