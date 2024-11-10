'use server'

import bcrypt from 'bcryptjs'
import { Resend } from 'resend'

import { prisma } from '@/lib/prisma'

type UserCreate = { name: string, email: string, timezone: string, password: string, username: string }

const resend = new Resend(process.env.RESEND_API_KEY)

export async function createUser(data: UserCreate) {
  const { name, email, timezone, username, password } = data;

  if (Object.values(data).some(value => !value)) throw new Error("One of the fields is missing|Please review the form, fill in any empty fields, and try again.")

  const emailUsernameValid = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username 
        },
        {
          email
        }
      ]
    }
  });

  if (emailUsernameValid) {
    if (emailUsernameValid.email === email) {
      throw new Error("Email is already in use|This email is already in use. Please use a different email or log in if you already have an account.")
    } else if (emailUsernameValid.username === username) {
      throw new Error("Username is already in use|This username is already taken. Please choose a different one to continue.")
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      timezone,
      hashedPassword,
      name
    }
  });

  return user;
}

export async function createVerification(userId: string) {
  let timestamp = new Date().getTime();
  timestamp += 600000;
  const expirationDate = new Date(timestamp);

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!user) throw new Error("We couldn't find this user in the database record.");
  if (user.emailVerified) throw new Error("Email is already verified")

  const code = Math.floor(Math.random() * 900000) + 100000
  const hashedCode = await bcrypt.hash(code.toString(), 12);

  const verificationToken = await prisma.verificationToken.create({
    data: {
      identifier: userId,
      token: hashedCode,
      expires: expirationDate,
    }
  });

  if (!verificationToken) throw new Error("Something went wrong when creating the verification token.")

  const email = await resend.emails.send({
    from: 'MyCal <contact@lindritsulaj.com>',
    to: user?.email!,
    subject: 'Verification Code for MyCal',
    html: `
      <p>Welcome ${user.name}, We’re excited to have you on board!</p>
      <p>To complete your registration and activate your account, please use the following verification code:</p>
      <p><strong>Verification code:</strong> ${code}</p>
      <p>Enter this code in the app to confirm your email address and unlock all features of your account.</p>
      <p>If you didn’t sign up for an account, please ignore this email.</p>
      <p>Best regards, <br /> Lindrit </p>
    `
  });

  if (!email) throw new Error("Something went wrong")

  return verificationToken.id
}

export async function verifyEmail(userId: string, verificationId: string, token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      id: verificationId
    }
  });

  if (!verificationToken) throw new Error("The verification token doesn't exist")

  const currentTime = new Date().getTime();
  const expirationTime = new Date(verificationToken.expires).getTime();

  if (expirationTime < currentTime) throw new Error("This code has expired. Please try again")

  const isCodeValid = await bcrypt.compare(
    token,
    verificationToken.token
  );

  if (!isCodeValid) throw new Error("The code you provided isn't the same as the one we sent you")

  return await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      emailVerified: new Date()
    }
  })
}