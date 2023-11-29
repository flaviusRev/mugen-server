/** @format */

export function configureCORS(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "OPTIONS, POST");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
export function handlePreflight(request, response) {
  if (request.method === "OPTIONS") {
    configureCORS(response); // Configura los encabezados CORS permitidos
    response.status(200).end(); // Responde a la solicitud preflight
    return true; // Indica que se manejó la solicitud preflight
  }
  return false; // Indica que no se manejó la solicitud preflight
}
