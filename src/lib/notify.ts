import "server-only";

import { Resend } from "resend";
import { site } from "@/content/site";

// Emails Abinash when someone uses the contact form. Neon stays the source of truth:
// this runs after the message is saved (via after() in the Server Action), and a failure
// here is logged, never shown to the visitor.

type Message = { name: string; email: string; message: string };

// Until abinasha.com.np is verified in Resend, its shared test sender is the only one allowed.
const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

let warnedMissingKey = false;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export async function notifyNewMessage({ name, email, message }: Message) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    if (!warnedMissingKey) {
      console.warn("contact: RESEND_API_KEY or CONTACT_TO_EMAIL not set; skipping the notification email");
      warnedMissingKey = true;
    }
    return;
  }

  const host = new URL(site.url).host;
  // A subject is one line: drop any line breaks a visitor typed into their name.
  const subject = `New message from ${name.replace(/[\r\n]+/g, " ")} · ${host}`;
  const text = `${name} <${email}> wrote via ${host}:\n\n${message}\n\n— Reply to this email to answer them.`;
  // Everything the visitor typed is escaped, so their input can't inject markup into the email.
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#1a1a17">
<p style="margin:0 0 12px"><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt; wrote via ${escapeHtml(host)}:</p>
<p style="margin:0 0 16px;padding-left:12px;border-left:2px solid #e4572e;white-space:pre-wrap">${escapeHtml(message)}</p>
<p style="margin:0;color:#5e5a52;font-size:13px">Reply to this email to answer them.</p>
</div>`;

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
      to,
      replyTo: email, // so "Reply" goes straight to the visitor
      subject,
      text,
      html,
    });
    if (error) console.error("contact: notification email failed", error);
    else console.log("contact: notification email sent", data?.id);
  } catch (err) {
    console.error("contact: notification email failed", err);
  }
}
