"use server";
import client from "./client";

export async function getNotes(data) {
  const prismaClient = await client();
  let note = await prismaClient.note.findMany({
    where: {
      authorId: data.id,
    },
  });
  return note;
}
