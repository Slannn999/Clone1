const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Products = require("./Products");
const Users = require("./Users");


const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

// connection url

const connection_url = "mongodb+srv://gauresh019:gauresh@cluster0.jq2n6.mongodb.net/Cluster0?retryWrites=true&w=majority";


mongoose.connect(connection_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// API

app.get("/", (req, res) => res.status(200).send("Home Page"));

// add product

app.post("/products/add", (req, res) => {
  const productDetail = req.body;

  console.log("Product Detail >>>>", productDetail);

  Products.create(productDetail, (err, data) => {
    if (err) {
      res.status(500).send(err.message);
      console.log(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/products/get", (req, res) => {
  Products.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// API for SIGNUP

const jwt = require("jsonwebtoken");

app.post("/auth/signup", async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user_exist = await Users.findOne({ email });

  if (user_exist) {
    return res.status(400).json({ message: "The Email is already in use!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new Users({
    email,
    password: hashedPassword,
    fullName,
  });

  await newUser.save();

  // Generate JWT Token
  const token = jwt.sign({ id: newUser._id }, "your_secret_key", { expiresIn: "7d" });

  res.status(201).json({ message: "User Created Successfully", token, user: newUser });
});


// API for LOGIN

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({ email });

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "7d" });

  res.json({ message: "Login successful", token, user });
});





app.listen(port, () => console.log("listening on the port", port));