require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cors = require('cors');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Express app setup
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

// Multer setup for Cloudinary
const upload = multer({ storage });

// Product Schema
const Product = mongoose.model('Product', {
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// User Schema
const Users = mongoose.model('Users', {
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// Routes
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Image upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    success: true,
    image_url: req.file.path, // Cloudinary URL
  });
});

// Add product endpoint
app.post('/addproduct', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const { name, image, category, new_price, old_price } = req.body;

    const newProduct = new Product({
      id,
      name,
      image, // Store Cloudinary URL here
      category,
      new_price,
      old_price,
    });

    await newProduct.save();
    res.json({ success: true, product: newProduct });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product', details: error.message });
  }
});

// Get all products
app.get('/allproducts', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products', details: error.message });
  }
});

// User signup
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await Users.findOne({ email })) {
      return res.status(400).json({ success: false, errors: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({
      name: username,
      email,
      password: hashedPassword,
      cartData: Array(300).fill(0).reduce((acc, _, i) => ({ ...acc, [i]: 0 }), {}),
    });

    await user.save();

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user', details: error.message });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(400).json({ success: false, errors: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, errors: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log in', details: error.message });
  }
});

// Middleware to fetch user
const fetchUser = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ errors: 'Access denied' });

  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch {
    res.status(401).json({ errors: 'Invalid token' });
  }
};

// Add to cart
app.post('/addtocart', fetchUser, async (req, res) => {
  try {
    const { itemid } = req.body;

    const user = await Users.findById(req.user.id);
    user.cartData[itemid] = (user.cartData[itemid] || 0) + 1;

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
