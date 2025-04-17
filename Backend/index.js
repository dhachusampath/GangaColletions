const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./controllers/productController');
const bodyParser = require('body-parser');
const CouponRoutes = require('./routes/couponsRoutes');  // Import 
const reviewRoutes = require('./routes/reviews');
// const orderRoutes = require('./routes/orderRoutes');
const passport = require('passport');
const multer = require("multer");
const path = require("path");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const fs = require("fs");
dotenv.config();
const { v4: uuidv4 } = require("uuid"); // For generating unique order ID
const app = express();
const Order = require("./models/Order")
const trackingRoutes = require('./routes/trackingRoutes');
const nodemailer = require("nodemailer");
const orderRoutes = require("./routes/orderRoutes");


// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/images", express.static('uploads'));

require("./controllers/google");
app.use(passport.initialize());
// MongoDB connection
mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.log('Error connecting to MongoDB:', err);
});

// Multer configuration for file upload
// for JSON
app.use(express.json({ limit: '50mb' }));

// for form-data (file uploads)
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', CouponRoutes);  // Mount the coupon routes
app.use('/api/productss/reviews', reviewRoutes);
app.use('/allorders', trackingRoutes); // Use tracking routes
app.use("/api/orders", orderRoutes);
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Backend is running' });
});


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Save order after payment verification
const axios = require("axios"); // Import axios for API requests

app.post("/api/save-order", async (req, res) => {
  try {
    const {
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      shippingAddress,
      billingAddress,
      totalAmount,
      userEmail,
    } = req.body;

    const uniqueOrderId = `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid User ID" });
    }

    // Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // **Fetch payment details from Razorpay API**
    const razorpayResponse = await axios.get(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
      }
    );

    const paymentData = razorpayResponse.data;
    const paymentMethod = paymentData.method; // Razorpay provides method type (card, upi, netbanking, etc.)

    // Save order with payment method
    const newOrder = new Order({
      orderId: uniqueOrderId,
      userId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod, // Store the payment method
      cartItems,
      shippingAddress,
      billingAddress,
      totalAmount,
      status: "Success",
    });

    await newOrder.save();
    await sendOrderEmail(userEmail ,uniqueOrderId, totalAmount, cartItems, shippingAddress);
    await sendAdminEmail(uniqueOrderId, totalAmount, cartItems, shippingAddress);

    // **Reduce stock after successful order**
    for (const item of cartItems) {
      console.log("Processing Item:", item); // Debugging Log
    
      const { productId, size, quantity } = item;
    
      if (!productId || !size) {
        console.error("Missing productId or size:", item);
        continue; // Skip this iteration if data is incorrect
      }
    
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, "sizes.size": size }, // Find product by _id and size
        { $inc: { "sizes.$.stock": -quantity } }, // Reduce stock quantity
        { new: true }
      );
    
      if (!updatedProduct) {
        console.error(`Product with productId ${productId} and size ${size} not found.`);
      } else {
        console.log(`Stock updated successfully for ${productId} - ${size}`);
      }
    }
    
    

    res.json({ success: true, orderId: uniqueOrderId, message: "Payment verified, order saved & stock updated" });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ success: false, message: "Failed to save order" });
  }
});


const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Email to User
async function sendOrderEmail(userEmail, orderId, totalAmount, cartItems, shippingAddress) {
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://gangacollection.netlify.app/assets/GC-logo-DGeKEWzg.png" alt="Ganga Collections" style="max-width: 150px;">
      </div>
      <h2 style="color: #4CAF50;">Order Confirmation</h2>
      <p>Thank you for your order! Here are your order details:</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <h3 style="color: #4CAF50;">Shipping Address:</h3>
      <p>${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}</p>
      <h3 style="color: #4CAF50;">Items:</h3>
      <ul>${cartItems.map((item) => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join("")}</ul>
      <p>We will notify you when your order is shipped.</p>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>This is an automated email, please do not reply.</p>
        <p>&copy; 2025 Ganga Collections. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ganga Collections"<${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Order Confirmation",
    html: emailTemplate,
  });
}

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Configure transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your App password
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.ADMIN_EMAIL, // Your receiving email
    subject: `📩 New Contact Form Submission GC- ${subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #007bff;">📬 New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background: #f9f9f9; padding: 15px; border-left: 4px solid #007bff; font-style: italic;">
          ${message}
        </blockquote>
        <hr>
        <p style="font-size: 12px; color: #555;">This email was sent from your website's contact form.</p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Server error, message not sent" });
  }
});

app.post("/api/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required ❌" });
  }

  // Ensure environment variables are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
    return res.status(500).json({ message: "Server email configuration is missing ❌" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `📢 New Newsletter Subscription`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #007bff;">📩 New Newsletter Subscription</h2>
          <p>A new user has subscribed to your newsletter.</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          <hr>
          <p style="font-size: 12px; color: #555;">This email was generated from your website's newsletter signup form.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Subscription successful! ✅" });

  } catch (error) {
    console.error("Subscription email error:", error);
    res.status(500).json({ message: "Subscription failed. ❌", error: error.message });
  }
});

// Send Email to Admin
async function sendAdminEmail(orderId, totalAmount, cartItems, shippingAddress) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const emailTemplate = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="https://gangacollection.netlify.app/assets/GC-logo-DGeKEWzg.png" alt="Ganga Collections" style="max-width: 150px;">
      </div>
      <h2 style="color: #4CAF50;">New Order Received</h2>
      <p>A new order has been placed with the following details:</p>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <h3 style="color: #4CAF50;">Shipping Address:</h3>
      <p>${shippingAddress.streetAddress}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.zipCode}</p>
      <h3 style="color: #4CAF50;">Items:</h3>
      <ul>${cartItems.map((item) => `<li>${item.name} - ₹${item.price} x ${item.quantity}</li>`).join("")}</ul>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #777;">
        <p>This is an automated email, please do not reply.</p>
        <p>&copy; 2025 Ganga Collections. All rights reserved.</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Ganga Collections" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "New Order Received",
    html: emailTemplate,
  });
}
const xlsx = require("xlsx");
const Product = require('./models/Product');
const Review = require('./models/Review');

app.get("/api/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.put("/api/update-tracking/:orderId", async (req, res) => {
  try {
    const { trackingLink, deliveryStatus } = req.body;
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { trackingLink, deliveryStatus },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({ success: true, updatedOrder });
  } catch (error) {
    res.status(500).json({ error: "Failed to update tracking details" });
  }
});

app.get("/api/allorders/all", async (req, res) => {
  try {
    const orders = await Order.find(); // Fetch all orders from the database
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
})

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir); // Save both images and Excel files to the "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Use the original file name for images (no renaming)
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
}).fields([
  { name: "excelFile", maxCount: 1 }, // Excel file upload (1 file)
  { name: "images", maxCount: 100 },   // Multiple image uploads (up to 10 files)
]);

// Bulk upload endpoint
app.post("/api/bulk-upload", upload, async (req, res) => {
  try {
    const { excelFile, images } = req.files;
    
    if (!excelFile) {
      return res.status(400).json({ message: "Excel file is required" });
    }

    // Read and process the Excel file
    const filePath = excelFile[0].path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const groupedData = {};

    // Process each row in the Excel file
    data.forEach((row) => {
      const itemCode = row.itemCode?.trim();
      if (!itemCode) return; // Skip rows without itemCode

      // Initialize product object if not already in groupedData
      if (!groupedData[itemCode]) {
        groupedData[itemCode] = {
          itemCode,
          name: row.name?.trim() || null,
          description: row.description?.trim() || null,
          polish: row.polish?.trim() || null,
          category: row.category?.trim() || null,
          subcategory: row.subcategory?.trim() || null,
          costPrice: row.costPrice || null,
          images: [], // To store image names
          sizes: [],
        };
      }

      // Handle image paths (images are directly named in Excel)
      if (row.images) {
        row.images.split(",").forEach((img) => {
          const imageName = img.trim(); // Directly take the name of the image
          
          // Check if the image exists in the uploaded files and store it
          const uploadedImage = images.find(image => image.originalname === imageName);
          if (uploadedImage) {
            // Image file path in uploads folder
            const destinationPath = path.join(__dirname, "uploads", uploadedImage.originalname);
            groupedData[itemCode].images.push(uploadedImage.originalname); // Store only the image name
          } else {
            console.error(`Image not found in the upload folder: ${imageName}`);
          }
        });
      }

      // Handle size-specific data
      if (row.size) {
        groupedData[itemCode].sizes.push({
          size: row.size.trim(),
          barcode: row.barcode?.trim() || null,
          retailPrice: row.retailPrice || 0,
          wholesalePrice: row.wholesalePrice || 0,
          stock: row.stock || 0,
          thresholdStock: row.thresholdStock || 0,
        });
      }
    });

    // Upsert data into the database
    for (const product of Object.values(groupedData)) {
      await Product.updateOne(
        { itemcode: product.itemCode }, // Match by itemCode
        {
          $set: {
            itemcode: product.itemCode,
            name: product.name,
            description: product.description,
            polish: product.polish,
            category: product.category,
            subcategory: product.subcategory,
            costPrice: product.costPrice,
            images: product.images, // Store the image names in DB
          },
          $addToSet: {
            sizes: { $each: product.sizes }, // Avoid duplicate sizes
          },
        },
        { upsert: true }
      );
    }

    // Delete the uploaded Excel file after processing
    fs.unlinkSync(filePath);

    res.status(200).json({ message: "Bulk upload successful!" });
  } catch (error) {
    console.error("Error during bulk upload:", error);
    res.status(500).json({ message: "Error processing upload", error: error.message });
  }
});

app.delete('/api/reviews/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  try {
    await Review.findByIdAndDelete(reviewId);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

// Start Server

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
