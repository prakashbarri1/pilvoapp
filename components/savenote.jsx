"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "./client";

export async function createNote(data) {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const name = sessionClaims?.name || email.split("@")[0];

  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
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
