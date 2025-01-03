"use server";
import { PrismaClient } from "@prisma/client";

export default async function client() {
  const client = new PrismaClient();
  return client;
}
