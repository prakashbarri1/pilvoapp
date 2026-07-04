"use server";
import { auth } from "@clerk/nextjs/server";
import prisma from "./client";

export async function getNotes() {
  const { sessionClaims } = await auth();
  const email = sessionClaims?.email;

  if (!email) {
    throw new Error("Unauthorized");
  }

  const notes = await prisma.note.findMany({
    where: {
      authorId: email,
    },
  });
  return notes;
}
