import client from "../../../components/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    if (request.method == "DELETE") {
      const prismaClient = await client();
      const data = request.body;
      if (!data || !data.id) {
        return response.status(400).json({ message: "Invalid request" });
      }
      const note = await prismaClient.note.delete({
        where: {
          id: data.id,
        },
      });
      response.status(200).json(note);
    } else {
      return response.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal Server Error" });
  }
}
