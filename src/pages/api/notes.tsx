import client from "../../../components/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method == "PUT") {
      const prismaClient = await client();
      const { data, published } = request.body;
      console.log(data, published);
      if (published == false) {
        const note = await prismaClient.note.findMany({
          where: {
            authorId: data.id,
          },
        });
        response.status(200).json(note);
      } else {
        const note = await prismaClient.note.findMany({
          where: {
            published: true,
            NOT: [{ authorId: data.id }],
          },
        });
        response.status(200).json(note);
      }
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    response.redirect("/");
  }
}
