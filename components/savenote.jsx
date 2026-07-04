"use server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "./client";

export async function createNote(data) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email on account");
  }

  const name = user.username || user.firstName || email.split("@")[0];

  let dbUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: { name, email },
    });
  }

  const note = await prisma.note.create({
    data: {
      title: data.title,
      content: data.note,
      html: data.content,
      published: true,
      authorId: email,
      description: data.desc,
    },
  });
  return note;
}
