import client from "../../../components/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method == "PUT") {
      const prismaClient = await client();
      console.log(request.body);
      const data = request.body;
      console.log(data);
      if (!data || !data.email || !data.vid) {
        return response.status(400).json({ message: "Invalid request" });
      }
      const record = await prismaClient.user.findUnique({
        where: {
          email: data.email,
        },
      });
      if (record) {
        const note = await prismaClient.note.update({
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
        response.status(200).json(note);
      } else {
        response.status(400).json({ message: "Bad Request" });
      }
    } else {
      response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}
