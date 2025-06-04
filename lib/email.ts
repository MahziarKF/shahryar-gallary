// import nodemailer from "nodemailer";

// export async function sendVerificationEmail(to: string, token: string) {
//   const verifyUrl = `${process.env.BASE_URL}/verify?token=${token}`;

//   console.log("Sending verification email to:", to);
//   console.log("Verification URL:", verifyUrl);

//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: parseInt(process.env.SMTP_PORT!),
//     secure: false, // false for TLS over port 587
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

//   try {
//     await transporter.sendMail({
//       from: `"Shahryar Gallery" <${process.env.SMTP_USER}>`,
//       to,
//       subject: "Verify your email",
//       html: `
//         <h3>Verify Your Email</h3>
//         <p>Click the link below to verify your email address:</p>
//         <a href="${verifyUrl}">${verifyUrl}</a>
//       `,
//     });

//     console.log("Verification email sent successfully!");
//   } catch (error) {
//     console.error("Failed to send verification email:", error);
//     throw error; // rethrow to let the main route handler catch it
//   }
// }
