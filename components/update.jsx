"use server";
import client from "./client";

export async function updateNote(data) {
  const prismaClient = await client();
  let record = await prismaClient.user.findUnique({
    where: {
      name: data.id,
      email: data.email,
    },
  });
  if (record) {
    let note = await prismaClient.note.update({
      where: {
        id: data.vid,
      },
      data: {
        content: data.note,
        html: data.content,
        published: data.published,
      },
    });
    console.log("Note Updated:", note);
    return note;
  } else {
    return null;
  }
}
