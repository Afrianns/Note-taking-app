import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";

import { getDb } from "../server/db/db";

import * as schema from "../server/schema/auth-schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async (
        { user, newEmail, url, token },
        request
      ) => {
        const config = useRuntimeConfig();
        const resend = new Resend(config.RESEND_API as string);

        const res = await resend.emails.send({
          from: "Afrianns <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify Change Email - Note App",
          html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F3; height: 100vh;">
                <div style="padding:20px; background: #004030"></div>
                <h1 style="color: #333; text-align: center;">The Note Inc!</h1>
              <div style="background-color: #4A9782; border: 1px solid #FCECDD; padding: 20px; border-radius: 5px; margin: 10%;">
              <p style="font-size: 1.6rem; margin-bottom: 1rem; color: #fff; font-weight: 600;">Hi, ${user.name}</p>
              <p style="margin: 0; color: #fff;">To update email to <span style='text-decoration: underline; color: #FEFAE0;'>${newEmail}</span>. Please click link <a href='${url}' style='text-decoration: underline; color: #FEFAE0;'>here</a>.</p>
                <div style="border-top: 1px solid red; border-color: #D2C1B6; font-size: 10px; color: #eee; margin-top: 1rem; margin-bottom: 1rem">
                    <p style="font-weight: 600; margin-top: 1rem">Doesn't work? Use link below</p>      
                      <span style='text-decoration: underline; color: #FEFAE0;'>${url}</span>
                </div>
              </div>
            </div>
            `,
        });
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const config = useRuntimeConfig();
      const resend = new Resend(config.RESEND_API as string);

      const res = await resend.emails.send({
        from: "Afrianns <onboarding@resend.dev>",
        to: user.email,
        subject: "Verification Email - Note App",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #FAF7F3; height: 100vh;">
            <div style="padding:20px; background: #004030"></div>
            <h1 style="color: #333; text-align: center;">The Note Inc!</h1>
          <div style="background-color: #4A9782; border: 1px solid #FCECDD; padding: 20px; border-radius: 5px; margin: 10%;">
          <p style="font-size: 1.6rem; margin-bottom: 1rem; color: #fff; font-weight: 600;">Hi, ${user.name}</p>
          <p style="margin: 0; color: #fff;">Click this link to verify your email <a href='${url}' style='text-decoration: underline; color: #FEFAE0;'>here</a>.</p>
            <div style="border-top: 1px solid red; border-color: #D2C1B6; font-size: 10px; color: #eee; margin-top: 1rem; margin-bottom: 1rem">
                <p style="font-weight: 600; margin-top: 1rem">Doesn't work? Copy link below</p>      
                <span style='text-decoration: underline; color: #FEFAE0;'>${url}</span>
            </div>
          </div>
        </div>
        `,
      });
    },
  },
  database: drizzleAdapter(getDb(), {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
});
