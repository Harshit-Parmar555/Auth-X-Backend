// Importing necessary modules
import nodemailer from "nodemailer";

// Importing required templates
import {
  VERIFICATION_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
} from "./template.js";

// Verfication email function
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "test@test.com",
      to: email,
      subject: "Verfiy your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
    };

    const response = await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

// Welcome email function
export const sendWelcomeEmail = async (email, name) => {
  try {
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "test@test.com",
      to: email,
      html: WELCOME_EMAIL_TEMPLATE.replace("{userName}", name),
    };
    const response = await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

// Reset password email function
export const sendResetPasswordEmail = async (email, resetUrl) => {
  try {
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "test@test.com",
      to: email,
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetUrl),
    };
    const response = await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

// Reset success email function
export const sendResetSuccessEmail = async (email) => {
  try {
    let transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const mailOptions = {
      from: "test@test.com",
      to: email,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    };
    const response = await transport.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};
