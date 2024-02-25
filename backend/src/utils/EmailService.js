import nodemailer from "nodemailer";

export const sendMail = async (receiverEmail, content) => {
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL,
      to: receiverEmail,
      subject: "Account verification OTP",
      html: content,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Something went wrong when trying to send email");
  }
};
