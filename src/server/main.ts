import express from "express";
import { ContactSchema } from "../client/types/types.js";
import "dotenv/config";
import ViteExpress from "vite-express";
import nodemailer from "nodemailer";

const app = express();

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

app.use(express.json());

app.post("/contact-form", (req, res) => {
    const body = req.body;
    const result = ContactSchema.safeParse(body);

    if (result.success) {
        const { name, email, message } = result.data;

        let mailOptions = {
            from: email,
            replyTo: email,
            to: "lawlesswebdev@gmail.com",
            subject: `${name} sent a message.`,
            text: message,
        };

        transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
                res.json({ success: false });
                return console.log("Error " + err);
            } else {
                return "Email succesfully sent " + data;
            }
        });

        return res.json({ success: true });
    }

    const serverErrors = Object.fromEntries(
        result.error?.issues?.map((issue) => [issue.path[0], issue.message]) || [],
    )

    return res.json({ errors: serverErrors });
});

ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
);
