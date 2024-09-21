const express = require('express');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

router.post('/payment', async (req, res) => {
  try {
    const { cartItems, userEmail, userName } = req.body;

    // Simulate payment gateway logic here
    const paymentSuccess = true; // Replace with actual payment logic

    if (!paymentSuccess) {
      return res.status(400).json({ success: false, message: 'Payment failed.' });
    }

    // Generate a unique game key
    const gameKey = uuidv4();

    // Send confirmation email with the user's email and name
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host : "smtp.gmail.com",
      port : 587,
      secure : false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Game Purchase Confirmation',
      text: `Hello ${userName},\n\nThank you for your purchase! Your unique game key is: ${gameKey}. Use it to access your game.\n\nBest regards,\nYour Games Team`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true, gameKey });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed.' });
  }
});

module.exports = router;
