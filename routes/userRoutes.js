const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const pool = require('../database');
const bcrypt = require('bcryptjs')

router.post('/signup', [
    // Validate username
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 4 }).withMessage('Username must be at least 4 characters'),

    // Validate email
    body('email').isEmail().withMessage('Invalid email address'),

    // Validate password
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  async(req,res)=>{
    const {username, email, password} = req.body;

    //check for errors
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        // Using pool.query() directly instead of acquiring a connection with pool.getConnection() and releasing it with connection.release() is a simplification provided by the mysql2/promise library. It is considered more convenient and cleaner for handling queries.

        //check if username/email already taken
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);

        if (existingUsers.length > 0) {
        const isEmailTaken = existingUsers.some(user => user.email === email);
        const isUsernameTaken = existingUsers.some(user => user.username === username);

        if (isEmailTaken && isUsernameTaken) {
                return res.status(400).json({ message: 'Username and email are already taken' });
            } else if (isEmailTaken) {
                return res.status(400).json({ message: 'Email already taken' });
            } else if (isUsernameTaken) {
                return res.status(400).json({ message: 'Username already taken' });
            }
        }
        
        // next creating a new user entry into db
        const salts = await bcrypt.genSalt();
        const securePass = await bcrypt.hash(password, salts)
        // save user with the secure pass
        await pool.query('INSERT INTO users (username, email, password) VALUES (? , ? , ?)', [username , email, securePass ]);
        res.status(201).json({message:"Signed up successfully!"})
    } catch (error) {
        console.error('MySQL Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }

  }
)

module.exports = router;