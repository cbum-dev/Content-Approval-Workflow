import app from "./src/app.ts";
import dotenv from "dotenv";
import type { VercelRequest, VercelResponse } from '@vercel/node';


dotenv.config();

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
