import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  name: {
    type: String,
    required: true,
  },
  phone:{
    type:String,
    required:true
  },
  address: {
    type: String,
    required: true,
  },
  password: { 
    type: String,
    required: true,
  },
  image:{type:String}, 
  createdAt: {
    type: Date,
    default: Date.now,  // Automatically set the current date when the document is created
  }
});

const User = mongoose.model('User', userSchema);
export default User;
