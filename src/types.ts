import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import Redis from "ioredis";
import { Address } from "nodemailer/lib/mailer";
import { Stream } from "stream";

export type MyContext = {
  req: Request & { session: Session & Partial<SessionData> & { userId?: string } };
  res: Response;
  redis: Redis;
  url: string;
};

export interface MailOptions {
  from?: string | Address | undefined;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export interface Upload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
