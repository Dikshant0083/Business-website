// server.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import contactRoutes from './routes/contact.js';
import orderRoutes from './routes/order.js';
import cors from 'cors';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

// ES module support for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/contact', contactRoutes);
app.use('/api/order', orderRoutes);

// Frontend route mappings (clean URL without .html)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/index', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'public', 'products.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));
app.get('/order', (req, res) => res.sendFile(path.join(__dirname, 'public', 'order.html')));
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'public', 'gallery.html')));


// Handle contact form POST directly
app.post('/contact', async (req, res) => {
  const { name, email, phone, location, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nLocation: ${location}\n\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.send('<script>alert("Message sent successfully!"); window.location.href="/contact";</script>');
  } catch (error) {
    console.error('Error sending mail:', error);
    res.status(500).send('<script>alert("Failed to send message."); window.location.href="/contact";</script>');
  }
});
