"use server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "./client";

export async function updateNote(data) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email on account");
  }

  const existing = await prisma.note.findUnique({
    where: { id: data.vid },
  });

  if (!existing) {
    throw new Error("Note not found");
  }

  if (existing.authorId !== email) {
    throw new Error("Forbidden");
  }

  const note = await prisma.note.update({
    where: {
      id: data.vid,
    },
    data: {
      content: data.note,
      html: data.content,
    },
  });
  return note;
}
