"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "./client";

export async function deleteNote(data) {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email;

  if (!email) {
    throw new Error("Unauthorized");
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
