import { Resend } from "resend";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { config } from "dotenv";
import { db } from "../server/db/db";

import * as schema from "../server/schema/auth-schema";

config({ path: ".env" });
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const res = await resend.emails.send({
        from: "Afrianns <onboarding@resend.dev>",
        to: user.email,
        subject: "Change Email - Note App",
        html: `Click this link to change your email<strong>${url}!</strong>`,
      });

      console.log(res);
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
