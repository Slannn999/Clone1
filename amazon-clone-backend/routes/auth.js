// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); // Assuming you have a User model
// const bcrypt = require('bcryptjs');

// router.post('/signup', async (req, res) => {
//   const { email, password, fullName } = req.body;

//   try {
//     // Check if user already exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Create new user
//     user = new User({
//       fullName,
//       email,
//       password: await bcrypt.hash(password, 10) // Hash the password
//     });

//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;
