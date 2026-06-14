import mongoose from "mongoose";
import { DB_URI , NODE_ENV} from "../config/env.js";

if(!DB_URI){
    throw new Error(`Please define the DB_URI in the environment variables (.env.${NODE_ENV}.local file)`);
}

const connectDB = async() =>{
    try{
        await mongoose.connect(DB_URI);
        console.log(`Connected to MongoDB in ${NODE_ENV} environment`);
    } catch(error){
        console.error('Error connecting to DB:', error);
        process.exit(1);
    }
}

export default connectDB;