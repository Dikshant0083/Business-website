// controllers/contactController.js
import transporter from '../config/mail.js';

export const handleContact = async (req, res) => {
  const { name, phone, location, message } = req.body;

  if (!name || !phone || !location || !message) {
    // You can also add redirect with error message here if needed
    return res.redirect('/contact?error=missing_fields');
  }

  try {
    await transporter.sendMail({
      from: `Choudhary Plastic Ponds <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: `New Contact Message from ${name}`,
      html: `
        <h3>New Contact Inquiry</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });

    // Redirect with success flag
    res.redirect('/contact?success=true');
  } catch (err) {
    console.error('Email send error:', err);
    res.redirect('/contact?error=server');
  }
};