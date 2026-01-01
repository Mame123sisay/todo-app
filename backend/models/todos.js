import mongoose from "mongoose";
const todoSchema= new mongoose.Schema({
  task:{
    type:String,
    unique:true,
    required:true
  },
  status: { 
    type: String, 
    enum: ["pending", "completed"], 
    default: "pending"},

},
{
  timestamps:true
});

const Todo=mongoose.model('Todo',todoSchema)
export default Todo