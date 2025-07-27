import pkg from 'json2csv';
const { Parser } = pkg;
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import Transaction from '../models/Transaction.js';
import fs from 'fs';
import path from 'path';

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
    // Go back 3 months from now, not including the current month
    startDate = new Date(now);
    startDate.setMonth(startDate.getMonth() - 3);
    startDate.setDate(1); // First day of the month

    endDate = new Date(now.getFullYear(), now.getMonth(), 0); // Last day of previous month
    break;

  case 'custom':
    startDate = new Date(customDate.start);
    endDate = new Date(customDate.end);
    console.log("CUSTOM DATE RECEIVED:", customDate);

    break;

  default:
    startDate = new Date(0);
    endDate = now;
}


  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  try {
    const transactions = await Transaction.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    }).lean();

    if (!transactions || transactions.length === 0) {
      return res.status(200).send('No transactions found for this period.');
    }

    // Summarize totals
    const incomeTotal = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);

    const expenseTotal = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);

    const netBalance = incomeTotal - expenseTotal;

    // --- CSV ---
    if (format === 'csv') {
      const fields = ['date', 'description', 'category', 'amount', 'type'];
      const json2csvParser = new Parser({ fields });
      const csv = json2csvParser.parse(transactions);

      res.header('Content-Type', 'text/csv');
      res.attachment('report.csv');
      return res.send(csv);
    }

    // --- PDF ---
    else if (format === 'pdf' || format === 'email') {
      const doc = new PDFDocument({ margin: 40 });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      const fileName = `report-${Date.now()}.pdf`;
      const filePath = path.join('temp', fileName);

      // Logo
      const logoPath = './react-dashboard/public/vite.svg'; // Path to your logo
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 40, 40, { width: 50 });
      }


      doc.font('Helvetica-Bold').fontSize(24).text('Personal Finance Report', { align: 'center' });
      doc.moveDown();


      doc
        .font('Helvetica')
        .fontSize(12)
        .text(`Total Income: ₹${incomeTotal.toFixed(2)}`, { continued: true })
        .text(`   |   Total Expenses: ₹${expenseTotal.toFixed(2)}   |   Net Balance: ₹${netBalance.toFixed(2)}`);
      doc.moveDown();

      doc.font('Helvetica-Bold').fontSize(14).text('Transactions:', { underline: true });
      doc.moveDown();

      const tableTop = doc.y;
      const dateX = 50;
      const descriptionX = 130;
      const categoryX = 300;
      const amountX = 400;
      const typeX = 480;

      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Date', dateX, tableTop);
      doc.text('Description', descriptionX, tableTop);
      doc.text('Category', categoryX, tableTop);
      doc.text('Amount', amountX, tableTop);
      doc.text('Type', typeX, tableTop);

      doc.font('Helvetica').fontSize(9);
      let y = tableTop + 20;

      transactions.forEach((t) => {
        const date = t.date ? new Date(t.date).toLocaleDateString() : 'N/A';
        const amount = typeof t.amount === 'number' ? t.amount.toFixed(2) : '0.00';

        doc.text(date, dateX, y);
        doc.text(t.description, descriptionX, y, { width: 150, ellipsis: true });
        doc.text(t.category, categoryX, y);
        doc.text(`₹${amount}`, amountX, y);
        doc.text(t.type.toUpperCase(), typeX, y);
        y += 15;
        if (y > doc.page.height - 50) {
          doc.addPage();
          y = 50; // Reset y for new page
          doc.font('Helvetica-Bold').fontSize(10);
          doc.text('Date', dateX, y);
          doc.text('Description', descriptionX, y);
          doc.text('Category', categoryX, y);
          doc.text('Amount', amountX, y);
          doc.text('Type', typeX, y);
          doc.font('Helvetica').fontSize(9);
          y += 20;
        }
      });
      doc.moveDown();

      if (req.body.chartImage) {
        const base64Data = req.body.chartImage.replace(/^data:image\/png;base64,/, '');
        const imgPath = `temp/chart-${Date.now()}.png`;
        fs.writeFileSync(imgPath, base64Data, 'base64');
        doc.addPage().image(imgPath, { fit: [500, 400], align: 'center' });
        fs.unlinkSync(imgPath); 
      }

      doc.end();

      const finalPdf = await new Promise((resolve) =>
        doc.on('end', () => resolve(Buffer.concat(buffers)))
      );


      if (format === 'email') {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: req.body.email || 'user@example.com',
          subject: 'Your Financial Report',
          text: 'Your report is attached as a PDF.',
          attachments: [
            {
              filename: 'report.pdf',
              content: finalPdf,
            },
          ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
            return res.status(500).send('Email failed');
          }
          return res.status(200).send('Email sent: ' + info.response);
        });
      } else {
        res.writeHead(200, {
          'Content-Length': Buffer.byteLength(finalPdf),
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment;filename=report.pdf',
        }).end(finalPdf);
      }
    }

    else if (format === 'preview') {
  const filteredTransactions = transactions.map(t => ({
    type: t.type,
    amount: t.amount,
    category: t.category,
    description: t.description,
    date: t.date,
  }));

  return res.json({
    transactions_data: filteredTransactions,
    summary: {
      incomeTotal,
      expenseTotal,
      netBalance,
    },
  });
}


    // --- Invalid ---
    else {
      res.status(400).send('Invalid format');
    }
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).send('Server error');
  }
};
