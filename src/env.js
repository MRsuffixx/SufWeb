import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional().default(587),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().optional(),
    SMTP_TO: z.string().optional(),
  },

  client: {
    NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  },

  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_TO: process.env.SMTP_TO,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});
