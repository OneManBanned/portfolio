import express from "express";
import { ContactSchema } from "../client/types/types.js";
import "dotenv/config";
import ViteExpress from "vite-express";
import nodemailer from "nodemailer";

const app = express();

app.use(express.json());

app.post("/contact-form", async (req, res) => {
  const body = req.body;
  const result = ContactSchema.safeParse(body);

  if (result.success) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        clientId: process.env.OAUTH_CLIENTID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      },
    });

    const { name, email, message } = result.data;

    await new Promise((res, rej) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
          rej(error);
        } else {
          console.log("Server is ready to take our messages");
          res(success);
        }
      });
    });

    let mailOptions = {
      from: email,
      replyTo: email,
      to: "lawlesswebdev@gmail.com",
      subject: `${name} sent a message.`,
      text: message,
    };

    await new Promise((response, reject) => {
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          response(data);
        }
      });
    });

    return res.status(200).json({ success: true });

  }

  const serverErrors = Object.fromEntries(
    result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || [],
  );

  return res.json({ errors: serverErrors });
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
