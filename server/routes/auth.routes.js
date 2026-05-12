const express= require('express');
const router= express.Router();
const bcrypt= require('bcryptjs');
const jwt= require('jsonwebtoken');
const User= require('../models/User');

router.post('/register', async(requestAnimationFrame, res)=>{
    try{
        const {email, password}= requestAnimationFrame.body;

        if(!email||!password){
            return res.status(400).json({
                success: false,
                msg: 'Email and password are required'
            });
        }

        const existingUser= await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                msg: 'email already registered'
            });
        }

        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password, salt);

        const user= await User.create({
            email,
            password: hashedPassword
        });

        const token= jwt.sign({
            id: user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            success:true,
            token
        });

    }catch(error){
        console.error(error);
        res.status(500).json({success: false, msg: 'Server error'});
    }
});

router.post('/login', async(req, res)=>{
    try{
        const {email, password}= req.body;

        if(!email||!password){
            return res.status(400).json({
                success:false,
                msg:'email and password are required'
            });
        }

        const user= await User.findOne({email});
        if(!User){
            return res.status(400).json({
                success:false,
                msg:'Invalid credentials'
            });
        }

        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success: false,
                msg: 'Invalid creds'
            });
        }

        const token= jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(200).json({
            success: true,
            token
        });
    }catch(error){
        console.error(error);
        res.status(500).json({success: false, msg:'Server error'});
    }
});

module.exports= router;