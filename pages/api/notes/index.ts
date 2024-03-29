import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import connectDB from "../../../utils/connectDB";
import Note from "../../../models/note/noteModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Not authenticated!" });

  if (req.method === "GET") {
    const value = req.query["value[]"];
    try {
      await connectDB();
      const notes = await Note.find({ _id: { $in: value } }, { __v: 0 });
      return res.status(200).json({ notes });
    } catch (err) {
      return res.status(500).json({ message: "Fail to process" });
    }
  }
}
