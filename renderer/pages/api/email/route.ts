import PlaidVerifyEmail from "../../../emails";
import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    const body = await req.body;
    const { email, username } = await body;
    const validationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const { data, error } = await resend.emails.send({
      from: "Mebius <noreply@mebius.fun>",
      to: [email],
      subject: "Welcome to NextChat!",
      react: PlaidVerifyEmail({ username,validationCode }),
    });
    if (error) {
      return res.status(500).json({ error });
    }
    return res.status(200).json({ validationCode });
}
