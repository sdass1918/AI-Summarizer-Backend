import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/email', async (req: Request, res: Response) => {
  const { email, summary } = req.body;
  if (!email || !summary) {
    return res.status(400).json({ error: 'Email and summary are required.' });
  }
  try {
    // Create Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    const info = await transporter.sendMail({
      from: 'Sudipta <no-reply@ethereal.email>',
      to: email,
      subject: 'Your AI-Generated Summary',
      html: `<p>${summary}</p>`,
    });
    console.log('Ethereal email sent:', info.messageId);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error('Email send error:', err);
    res.status(500).json({ error: 'Failed to send email.', details: err instanceof Error ? err.message : String(err) });
  }
});

export default router;