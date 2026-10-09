import nodemailer from "nodemailer";

const MAILBOX = "gckosala@gmail.com";
const APP_PASSWORD = "GMAIL_APP_PASSWORD";
const MAX_BODY_BYTES = 16 * 1024;
const MAX_MESSAGE_LENGTH = 7000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentSubmissions = new Map();

function respond(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getClientKey(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return forwardedFor.split(",")[0].trim();
  }
  return req.socket.remoteAddress ?? "unknown";
}

function isRateLimited(req) {
  const now = Date.now();
  const key = getClientKey(req);
  const previous = recentSubmissions.get(key) ?? [];
  const active = previous.filter((time) => now - time < RATE_LIMIT_WINDOW_MS);

  if (active.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, active);
    return true;
  }

  active.push(now);
  recentSubmissions.set(key, active);

  if (recentSubmissions.size > 1000) {
    for (const [candidate, times] of recentSubmissions) {
      if (times.every((time) => now - time >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(candidate);
      }
    }
  }

  return false;
}

async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let bytes = 0;
    let tooLarge = false;

    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });

    req.on("end", () => {
      if (tooLarge) {
        reject(Object.assign(new Error("Body too large"), { statusCode: 413 }));
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(Object.assign(new Error("Invalid JSON"), { statusCode: 400 }));
      }
    });

    req.on("error", reject);
  });
}

function cleanString(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function handleContactRequest(req, res) {
  const url = new URL(req.url ?? "/", "http://localhost");
  if (url.pathname !== "/api/contact") return false;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    respond(res, 405, { error: "method_not_allowed" });
    return true;
  }

  const origin = req.headers.origin;
  const host = req.headers.host;
  if (origin && host) {
    try {
      if (new URL(origin).host.toLowerCase() !== host.toLowerCase()) {
        respond(res, 403, { error: "origin_not_allowed" });
        return true;
      }
    } catch {
      respond(res, 403, { error: "origin_not_allowed" });
      return true;
    }
  }

  if (!String(req.headers["content-type"] ?? "").includes("application/json")) {
    respond(res, 415, { error: "json_required" });
    return true;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    respond(res, error.statusCode ?? 400, { error: "invalid_request" });
    return true;
  }

  const name = cleanString(body?.name, 120);
  const email = cleanString(body?.email, 254);
  const subject = cleanString(body?.subject, 160).replace(/[\r\n]+/g, " ");
  const message = cleanString(body?.message, MAX_MESSAGE_LENGTH);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !emailPattern.test(email) || !message) {
    respond(res, 400, { error: "invalid_fields" });
    return true;
  }

  const appPassword = process.env[APP_PASSWORD]?.replace(/\s+/g, "");
  if (!appPassword) {
    respond(res, 503, { error: "gmail_not_configured" });
    return true;
  }

  if (isRateLimited(req)) {
    respond(res, 429, { error: "too_many_requests" });
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: MAILBOX,
        pass: appPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
      tls: { minVersion: "TLSv1.2" },
    });

    const delivery = await transporter.sendMail({
      from: `Chandima Kosala Portfolio <${MAILBOX}>`,
      to: MAILBOX,
      replyTo: email,
      subject: `Portfolio enquiry: ${subject || "New message"}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Subject: ${subject || "(No subject)"}`,
        "",
        "Message:",
        message,
      ].join("\n"),
    });

    if (!delivery.accepted?.length) {
      throw new Error("SMTP did not accept the recipient");
    }

    respond(res, 200, { ok: true });
  } catch (error) {
    const code = typeof error?.code === "string" ? error.code : "";
    const responseCode = Number(error?.responseCode);
    // Keep sender addresses and message content out of server logs.
    console.error("Portfolio contact email delivery failed:", code || "SMTP_ERROR");

    if (code === "EAUTH" || responseCode === 535) {
      respond(res, 502, { error: "gmail_authentication_failed" });
    } else {
      respond(res, 502, { error: "delivery_failed" });
    }
  }

  return true;
}
