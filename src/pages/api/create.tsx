import client from "../../../components/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method == "POST") {
      const prismaClient = await client();
      console.log(request.body);
      const data = request.body;
      if (!data || !data.id || !data.email) {
        return response.status(400).json({ message: "Invalid request" });
      }
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
      const note = await prismaClient.note.create({
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
      response.status(200).json(note);
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}
