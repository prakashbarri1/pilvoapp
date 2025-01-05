"use server";
import client from "./client";

export async function getNotes(data, published) {
  const prismaClient = await client();
  console.log(data, published);
  if (published == false) {
    let note = await prismaClient.note.findMany({
      where: {
        authorId: data.id,
      },
    });
    return note;
  } else {
    let note = await prismaClient.note.findMany({
      where: {
        published: true,
        NOT: [{ authorId: data.id }],
      },
    });
    return note;
  }
}
