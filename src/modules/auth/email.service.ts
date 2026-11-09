
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
const emailFrom = process.env.EMAIL_FROM;

if (!apiKey || !emailFrom) {
  throw new Error("Resend environment variables are missing");
}

const resend = new Resend(apiKey);

export const sendOtpEmail = async (
  email: string,
  code: string
) => {
  const { data, error } = await resend.emails.send({
    from: emailFrom,
    to: [email],
    subject: "HexaSquad - Verification Code",
    text: `Your HexaSquad verification code is ${code}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto;">
        <h2>HexaSquad</h2>
        <p>Use the following code to sign in:</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px;">
          ${code}
        </div>
        <p>This code expires in 5 minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error("Failed to send verification email");
  }

  return data;
};
