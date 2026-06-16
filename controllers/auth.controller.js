import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";


export const signUp = async (req, res, next) => {
    //  Session for mongoose transactions
    const session = await mongoose.startSession();
    //  for performing atomic operations on multiple collections, we need to use transactions.
    //  Transactions allow us to execute a series of operations as a single unit of work.
    //  If any operation within the transaction fails, the entire transaction can be rolled back, ensuring data integrity.
    session.startTransaction();
    try{
        // 1. Create user
        const { name, email, password } = req.body;
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409; // Conflict
            throw error;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        // Create a new user instance with the hashed password
        const newUsers = await User.create([{ name, email, password: hashedPassword }], {session});
        // 2. Generate JWT token
        const token =jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        //Commit the transaction if everything is successful
        await session.commitTransaction();
        // End the transaction
        session.endSession();
        // 3. Send response with token and user details
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data:{
                token,
                user: newUsers[0]
            }
        });

    }catch(error){
        // If any error occurs during the transaction, we need to abort the transaction to roll back any changes made to the database.
        await session.abortTransaction();
        session.endSession();
        next(error);
    }

}

export const signIn = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404; // Not Found
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            const error = new Error('Invalid email or password');
            error.statusCode = 401; // Unauthorized
            throw error;
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.status(200).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                token,
                user
            }
        });

    } catch(error){
        next(error);
    }
}

export const signOut = async (req, res, next) => {

}