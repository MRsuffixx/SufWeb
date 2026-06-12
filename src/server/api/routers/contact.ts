import { z } from "zod";
import nodemailer from "nodemailer";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { env } from "~/env.js";
import { TRPCError } from "@trpc/server";

// In-memory rate limiter: max 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }

  if (entry.count >= 3) return false;
  entry.count++;
  return true;
}

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (value.resetAt < now) rateLimitMap.delete(key);
  }
}, 10 * 60 * 1000);

const contactSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  email: z.string().email("Invalid email").max(200),
  message: z.string().min(10, "Message too short").max(5000),
});

export const contactRouter = createTRPCRouter({
  send: publicProcedure.input(contactSchema).mutation(async ({ input, ctx }) => {
    // Rate limiting via IP (from headers)
    const ip =
      (ctx.headers?.get("x-forwarded-for") as string | undefined) ??
      (ctx.headers?.get("x-real-ip") as string | undefined) ??
      "unknown";

    if (!checkRateLimit(ip)) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: "Too many messages. Please wait an hour before trying again.",
      });
    }

    // If SMTP is not configured, skip sending (dev mode)
    if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
      console.info("[Contact] SMTP not configured — skipping email send (dev mode)");
      // Simulate a brief delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT ?? 587,
      secure: (env.SMTP_PORT ?? 587) === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: env.SMTP_FROM ?? env.SMTP_USER,
      to: env.SMTP_TO ?? env.SMTP_USER,
      replyTo: `${input.name} <${input.email}>`,
      subject: `Portfolio contact from ${input.name}`,
      text: `
Name: ${input.name}
Email: ${input.email}

Message:
${input.message}
      `.trim(),
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #6366f1; margin-bottom: 16px;">New portfolio contact</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Name</td>
      <td style="padding: 8px 0; color: #f8fafc;">${input.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; color: #94a3b8; font-size: 14px;">Email</td>
      <td style="padding: 8px 0; color: #f8fafc;"><a href="mailto:${input.email}" style="color: #6366f1;">${input.email}</a></td>
    </tr>
  </table>
  <div style="margin-top: 24px; padding: 16px; background: #141414; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06);">
    <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px;">Message:</p>
    <p style="color: #f8fafc; white-space: pre-wrap; margin: 0;">${input.message}</p>
  </div>
</div>
      `.trim(),
    });

    return { success: true };
  }),
});
