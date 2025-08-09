// api/horse.js
export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, message: "API is live. Send POST to trigger." });
  }
  return res.status(405).json({ ok: false, error: "Method Not Allowed" });
}

