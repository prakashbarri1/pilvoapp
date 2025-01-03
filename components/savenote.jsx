"use server";
import client from "./client";

export async function createNote(data) {
  const prismaClient = await client();
  let record = await prismaClient.user.findUnique({
    where: {
      name: data.id,
      email: data.email,
    },
  });
  if (!record) {
    record = await prismaClient.user.create({
      data: {
        name: data.id,
        email: data.email,
      },
    });
    console.log("User Craeted");
  }
  let note = await prismaClient.note.create({
    data: {
      title: data.title,
      content: data.note,
      html: data.content,
      published: true,
      authorId: data.email,
      description: data.desc,
    },
  });
  console.log("Note created:", note);
  return note;
}
