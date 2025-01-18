// Required Libraries
require('dotenv').config();


const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcrypt');
const { type } = require("os");
const { error } = require("console");
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;



const app = express();
const port = process.env.PORT || 4000;


// Middleware
app.use(express.json());
app.use(cors());
app.use('/images', express.static(path.join(__dirname, 'upload/images'))); // Serve uploaded images as static files

// Database Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(() => {
    console.log("Failed to connect to DB");
  });

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

// File Filter to Allow Specific File Types (e.g., Images Only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimeType && extName) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"));
  }
};



// Routes
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Upload Image Endpoint
app.post("/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: req.file.path, // Cloudinary URL
  });
});

// Product Schema
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  }
});

// Add Product Endpoint
app.post('/addproduct', async (req, res) => {
    try {
   
       // Fetch all products to get the next available ID
    const products = await Product.find({}).sort({ id: 1 });
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
  
      // Destructure request body
      const { name, image, category, new_price, old_price } = req.body;
  
      // Create new product
      const newProduct = new Product({
        id,
        name,
        image,
        category,
        new_price,
        old_price
      });
  
      console.log(newProduct);
  
      // Save to database
      await newProduct.save();
      console.log("Saved");
  
      // Respond with success
      res.json({ success: true, product: newProduct });
    } catch (error) {
      res.status(500).json({ error: "Failed to add product", details: error.message });
    }
  });
  // Route to get all products
app.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ id: 1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
});
//creating API for deleting products

app.post('/removeproduct', async (req, res) => {
    try {
      // Find and delete product by ID
      const deletedProduct = await Product.findOneAndDelete({ id: req.body.id });
  
      if (!deletedProduct) {
        // If product not found, respond with an error
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
  
      console.log("Removed:");
  
      // Respond with success
      res.json({
        success: true,
        name: deletedProduct.name
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({
        success: false,
        message: "Failed to remove product",
        details: error.message
      });
    }
  });
//Creating API for  getting all products
app.get('/allproducts', async (req, res) => {
    try {
      // Fetch all products from the database
      const products = await Product.find({});
      console.log("All products fetched");
  
      // Respond with success and data
      res.json({
        success: true,
        products: products
      });
    } catch (error) {
      // Handle any errors during fetching
      console.error("Error fetching products:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch products",
        details: error.message
      });
    }
  });
  //Shema creating for user model

  const Users = mongoose.model('Users',{
    name:{
      type:String,
      required: true,
    },
    email:{
      type:String,
      unique:true,
    },
    password:{
      type:String,
      required: true,
    },
    cartData:{
      type:Object,
      default: {},
    },
    date:{
      type:Date,
      default:Date.now,
    }
  })

  //Creating Endpoint for registering the user
  app.post('/signup', async (req, res) => {
    try {
      let check = await Users.findOne({ email: req.body.email });
      if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
      }
  
      let cart = {};
      for (let i = 0; i < 300; i++) {
        cart[i] = 0;
      }
  
      // Check if password is provided
      if (!req.body.password) {
        return res.status(400).json({ success: false, errors: "Password is required" });
      }
  
      // Hashing the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log("Hashed Password:", hashedPassword);
  
      const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: hashedPassword,
        cartData: cart,
      });
  
      await user.save();
  
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });
  
  
  
  //creating endponit for the user login
  app.post('/login', async (req, res) => {
    try {
      // Find user by email
      let user = await Users.findOne({ email: req.body.email });
      
  
      if (!user) {
        return res.status(400).json({ success: false, errors: "Wrong Email Id" });
      }
  
      // Ensure the user has a password field
      if (!user.password) {
        console.error("Error: Password field missing for user.");
        return res.status(500).send("Internal Server Error");
      }
  
      // Ensure the plain text password is provided
      if (!req.body.password) {
        console.error("Error: Password not provided in request.");
        return res.status(400).json({ success: false, errors: "Password is required" });
      }
  
      // Compare passwords
      console.log("Password from Request:", req.body.password);
      console.log("Hashed Password from DB:", user.password);
      const passCompare = await bcrypt.compare(req.body.password, user.password);
  
      if (!passCompare) {
        return res.status(400).json({ success: false, errors: "Wrong Password" });
      }
  
      // Generate JWT token
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });


  //creating endpoint for newcollection data
  app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("NewCollection Fetched")
    res.send(newcollection)
  })

  //creating endpoint for popular in women section
  app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in Women Fetched");
    res.send(popular_in_women);

  })
  //creating middlware to fetch user
  const fetchUser = async(req,res,next)=>{
    const token = req.header('auth-token');
    if (!token) {
      res.status(401).send({errors:"Please authenticate using valid token"})
      
    }
    else{
      try{
        const data = jwt.verify(token,'secret_ecom');
        req.user = data.user;
        next();

      }catch(error){
        res.status(401).send({errors:"please authenticate using valid token "})

      }
    }

  }

  //creating endpoint for adding products in cartdata
  app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemid);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemid] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")
    

  })

  //creating endpoint to remove product from cartdata
  app.post('/removefromcart',fetchUser,async (req,res)=>{
    console.log("removed",req.body.itemid);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemid] >0)
    userData.cartData[req.body.itemid] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("removed")


  })

  //creating  endpoint to get cartdata
  app.post('/getcart',fetchUser,async (req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id})
    res.json(userData.cartData);

  })

  
// Start the Server
app.listen(port, (error) => {
  if (!error) {
    console.log(`Server running on port ${port}`);
  } else {
    console.log("Error:", error);
  }
});