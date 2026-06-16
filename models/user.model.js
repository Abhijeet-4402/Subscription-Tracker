import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'UserName is required'],
        trim: true,
        minlength: [3, 'UserName must be at least 3 characters long'],
        maxlength: [50, 'UserName must be less than 50 characters long']
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
