// controllers/orderController.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const handleOrder = async (req, res) => {
  const { name, email, phone, product, size, quantity, address } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const orderDetails = `
    🛒 New Order Received:

    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Product: ${product}
    Size: ${size}
    Quantity: ${quantity}
    Address: ${address}
  `;

  const customerConfirmation = `
    Dear ${name},

    ✅ Thank you for placing your order with Choudhary Plastic Ponds!

    📦 Order Details:
    - Product: ${product}
    - Size: ${size}
    - Quantity: ${quantity}
    - Delivery Address: ${address}

    We will contact you shortly to confirm your order.

    Regards,
    Choudhary Plastic Ponds
  `;

  try {
    // Send email to admin
    await transporter.sendMail({
      from: `"Choudhary Plastic Ponds" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: 'New Order Received',
      text: orderDetails,
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"Choudhary Plastic Ponds" <${process.env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Order Confirmation',
      text: customerConfirmation,
    });

    res.status(200).json({
      success: true,
      message: 'Order placed successfully! A confirmation email has been sent to your email address.',
    });
  } catch (error) {
    console.error('Error sending order email:', error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong while sending email. Please try again later.',
    });
  }
};
