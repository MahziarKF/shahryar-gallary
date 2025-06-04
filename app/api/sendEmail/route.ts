import { sendVerificationEmail } from "@/lib/email";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const prisma = PrismaClient();
const token = crypto.randomBytes(32).toString("hex");

await prisma.user.create({
  data: {
    email,
    password: hashedPassword,
    is_verified: false,
    verificationToken: token,
  },
});

await sendVerificationEmail(email, token);
