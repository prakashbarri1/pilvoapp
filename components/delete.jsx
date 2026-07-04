"use server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "./client";

export async function deleteNote(data) {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email on account");
  }

  const existing = await prisma.note.findUnique({
    where: { id: data.id },
  });

  if (!existing) {
    throw new Error("Note not found");
  }

  if (existing.authorId !== email) {
    throw new Error("Forbidden");
  }

  const note = await prisma.note.delete({
    where: {
      id: data.id,
    },
  });
  return note;
}
