'use server'

import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { Resend } from 'resend'
import { v4 as uuidv4 } from 'uuid'

import { prisma } from '@/lib/prisma'
import { options } from '../api/auth/[...nextauth]/options'
import { User } from '@prisma/client'
import { createSchedule } from './schedule'

type UserCreate = { name: string, email: string, timezone: string, password: string, username: string }

const resend = new Resend(process.env.RESEND_API_KEY)

export async function getSession() {
  return await getServerSession(options)
}

export async function getUser() {
  const session = await getSession();

  if (!session) throw new Error("User not authenticated");

  return await prisma.user.findUnique({
    where: {
      email: session.user?.email as string
    },
    include: {
      schedules: true
    }
  })
}

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
      throw new Error("Email is already in use|Please use a different email or log in if you already have an account.")
    } else if (emailUsernameValid.username === username) {
      throw new Error("Username is already in use|Please choose a different username to continue.")
    }
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      username,
      timezone,
      hashedPassword,
      name,
      schedules: {
        create: [
          {
            name: 'Working Hours', isDefault: true, availableDays: [
              { day: 'MONDAY', value: '08:00 - 17:00' },
              { day: 'TUESDAY', value: '08:00 - 17:00' },
              { day: 'WEDNESDAY', value: '08:00 - 17:00' },
              { day: 'THURSDAY', value: '08:00 - 17:00' },
              { day: 'FRIDAY', value: '08:00 - 17:00' },
              { day: 'SATURDAY', value: '' },
              { day: 'SUNDAY', value: '' },
            ]
          }
        ]
      }
    }
  });

  return user;
}

export async function editUser({ data, usernameRequired }: { data: Partial<Pick<User, 'username' | 'description' | 'description' | 'timezone' | 'image' | 'name'>>, usernameRequired?: boolean }) {
  const session = await getSession();

  if (!session) throw new Error("Not authorized");

  if (usernameRequired && !data.username) throw new Error('Username should not be left empty')

  if (data.username) {
    const URLValidRegex = /^[a-zA-Z0-9._-]*$/
    if (!URLValidRegex.test(data.username)) throw new Error("Username contains invalid characters")

    const usernameTaken = await prisma.user.findFirst({
      where: {
        username: data.username
      }
    })

    if (usernameTaken) {
      const isUsernameTakenByCurrentUser = usernameTaken.email === session.user?.email

      if (!isUsernameTakenByCurrentUser) throw new Error("Username is taken. Please choose another one!")
    };
  }

  const user = await prisma.user.update({
    where: {
      email: session.user?.email as string
    },
    data: {
      ...data
    },
    include: {
      schedules: true
    }
  })

  if (user.schedules.length === 0) {
    await createSchedule({ availableDays: 'default', isDefault: true });
  }

  return true;
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

export async function changePassword(oldPassword: string, newPassword: string) {
  const user = await getUser()
  if (!user) throw new Error('401 Unauthorized');

  const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.hashedPassword!);
  if (!isOldPasswordCorrect) throw new Error("Old password is incorrect");

  const newHashedPassword = await bcrypt.hash(newPassword, 12);

  return await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      hashedPassword: newHashedPassword
    }
  })
}

export async function createResetPassword(userEmail: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: userEmail
    }
  });

  if (!user) throw new Error("User with this email doesn't exist");

  let timestamp = new Date().getTime();
  timestamp += 600000;

  const expirationDate = new Date(timestamp);
  const uuid = uuidv4();

  const resetPassword = await prisma.resetPassword.create({
    data: {
      identifier: user.id,
      expires: expirationDate,
      token: uuid
    }
  })

  await resend.emails.send({
    from: 'MyCal <contact@lindritsulaj.com>',
    to: user?.email!,
    subject: 'Reset Password for MyCal',
    html: `
      <p>Hi ${user.name},</p>
      <p>We received a request to reset the password for your account on MyCal.</p>
      <p>If you made this request, click the link below to reset your password:</p>
      <p><a href="https://mycal.lindritsulaj.com/reset-password?token=${resetPassword.token}" target="_blank">Reset Your Password</a></p>
      <p>If the link above doesn’t work, copy and paste this URL into your browser:</p>
      <p>https://mycal.lindritsulaj.com/reset-password?token=${resetPassword.token}</p>
      <p>For security reasons, this link will expire in 60 minutes. If you did not request a password reset, you can safely ignore this email.</p>
      <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
      <p>Thank you,</p>
      <p>Lindrit Sulaj</p>
    `
  });
}

export async function resetPassword(newPassword: string, token: string) {
  const resetPasswordWithUser = await prisma.resetPassword.findUnique({
    where: {
      token
    },
    include: {
      user: true
    }
  });

  if (!resetPasswordWithUser) throw new Error("Something went wrong")

  const currentTime = new Date().getTime();
  const expirationTime = new Date(resetPasswordWithUser.expires).getTime();

  if (expirationTime < currentTime) throw new Error("This code has expired. Please try again");

  if (newPassword.length < 8) throw new Error("New password should be equal or bigger than 8 characters");

  const hashedPassword = await bcrypt.hash(newPassword, 12)

  await prisma.user.update({
    where: {
      id: resetPasswordWithUser.user.id
    },
    data: {
      hashedPassword
    }
  })
}

export async function deleteUser() {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized")

  return await prisma.user.delete({
    where: {
      id: user.id
    }
  })
}