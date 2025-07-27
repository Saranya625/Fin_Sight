import pkg from 'json2csv';
const { Parser } = pkg;
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import Transaction from '../models/Transaction.js';

export const generateReport = async (req, res) => {
  const { insights, format, duration, customDate } = req.body;
  const { userId } = req.params;

  let startDate, endDate;
  const now = new Date();

  switch (duration) {
    case 'thisMonth':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'last3Months':
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    case 'custom':
      startDate = new Date(customDate.start);
      endDate = new Date(customDate.end);
      break;
    default:
      startDate = new Date(0); // Beginning of time
      endDate = now; // Now
  }

  try {
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    if (format === 'csv') {
      const fields = ['date', 'description', 'category', 'amount', 'type'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(transactions);

      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      return res.send(csv);
    } else if (format === 'pdf') {
      const doc = new PDFDocument();
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment;filename=report.pdf',
        }).end(pdfData);
      });

      doc.fontSize(25).text('Transaction Report', { align: 'center' });
      doc.moveDown();

      transactions.forEach(transaction => {
        doc.fontSize(12).text(`Date: ${new Date(transaction.date).toLocaleDateString()}, Description: ${transaction.description}, Category: ${transaction.category}, Amount: ${transaction.amount.toFixed(2)}, Type: ${transaction.type}`);
        doc.moveDown(0.5);
      });
      doc.end();
    } else if (format === 'email') {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'user@example.com', // This should ideally come from user data
        subject: 'Your Transaction Report',
        text: 'Here is your transaction report.',
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).send(error.toString());
        }
        res.status(200).send('Email sent: ' + info.response);
      });
    } else if (format === 'preview') {
      res.json(transactions);
    } else {
      res.status(400).send('Invalid format');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report.');
  }
};
