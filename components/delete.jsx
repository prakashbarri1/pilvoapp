"use server";
import client from "./client";

export async function deleteNote(data) {
  const prismaClient = await client();
  let note = await prismaClient.note.delete({
    where: {
      id: data.id,
    },
  });
  return note;
}
