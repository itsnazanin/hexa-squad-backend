
import { farazSMS, farazSendPattern } from "@aspianet/faraz-sms";

const apiKey = process.env.FARAZ_API_KEY;
const patternCode = process.env.FARAZ_PATTERN_CODE;
const sender = process.env.FARAZ_SENDER;

if (!apiKey || !patternCode || !sender) {
  throw new Error("Faraz SMS environment variables are missing");
}

farazSMS.init(apiKey);

export const sendOtpSms = async (
  phone: string,
  code: string
) => {
  await farazSendPattern(
    patternCode,
    phone,
    sender,
    { code }
  );
};
