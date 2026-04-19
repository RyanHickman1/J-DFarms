import { Resend } from "resend";

export default async function handler(req, res) {
  // 🔒 AUTH
  const auth = req.headers.authorization || "";
  if (auth !== `Bearer ${process.env.API_SECRET}`) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const {
    caller_name,
    caller_phone,
    message,
    intent,
    urgency
  } = req.body || {};

  if (!caller_phone || !message) {
    return res.status(400).json({ ok: false, error: "missing_fields" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "Francesca <send@francescaassistant.com>",
      to: "cvaryan22701@gmail.com", // 🔥 REPLACE THIS
      subject: `📞 New Call – ${intent || "General Inquiry"}`,
      html: `
        <h2>New Call Summary</h2>

        <p><strong>Name:</strong> ${caller_name || "Not provided"}</p>
        <p><strong>Phone:</strong> ${caller_phone}</p>
        <p><strong>Intent:</strong> ${intent || "Unknown"}</p>
        <p><strong>Urgency:</strong> ${urgency || "Normal"}</p>

        <hr>

        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "email_failed" });
  }
}
