"use server";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "./client";

export async function getNotes() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    throw new Error("No email on account");
  }

  const notes = await prisma.note.findMany({
    where: {
      authorId: email,
    },
  });
  return notes;
}
