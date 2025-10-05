import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/util/mongodb';
import checkEnvironment from '@/util/check-environment';
import nodemailer from 'nodemailer';
import shortId from 'shortid';
import uniqid from 'uniqid';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: user && pass ? { user, pass } : undefined
  });
};

const sendMail = async (email: string, emailData: any) => {
  const url = checkEnvironment();
  const page = 'signup';

  const fromAddress = process.env.FROM_EMAIL || 'no-reply@example.com';

  const html = `<div>
      <div style="height:100px; background-color:#26292c; color: white">
        <p>Kanva</p>
      <div>
      <div style="height:200px; background-color:#0079bf;">
        <a href='${url}/${page}?token=${emailData.token}&email=${encodeURIComponent(email)}&boardId=${emailData.boardId}'>Join</a>
      </div>
      <div style="height:100px; background-color:#26292c;">

      </div>
    </div>`;

  const transporter = createTransporter();
  if (!transporter) {
    throw new Error('SMTP configuration is missing (SMTP_HOST/SMTP_PORT)');
  }

  const info = await transporter.sendMail({
    from: fromAddress,
    to: email,
    subject: 'You are invited to join a Kanva board',
    html
  });

  return info;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {


  try {
    const { db } = await connectToDatabase();

    const requestType = req.method;

    switch (requestType) {
      case 'POST': {
        const { email, boardId } = req.body;

        const token = uniqid();
        const id = shortId.generate();

        const emailData = {
          id,
          token,
          boardId
        };

        await db.collection('token').insertOne({ token, userId: id, status: 'valid', email, boardId });
        // user may be null if not registered yet
        const user = await db.collection('users').findOne({ email });

        try {
          await sendMail(email, emailData);
          res.status(200).json({ message: 'Email sent successfully', status: 200 });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Failed to send invite email', err);
          res.status(500).json({ message: 'Failed to send email', error: err?.message || err });
        }

        return;
      }

      default:
        res.status(400).send({ message: 'Invalid request' });
        break;
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Mail API error', err);
    res.status(500).send({ msg: 'DB connection error', status: 500, error: err?.message || err });
  }
}
