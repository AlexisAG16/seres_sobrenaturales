import bcrypt from "bcryptjs";
import { Schema, model, models } from "mongoose";
const schema = new Schema({
  username:{type:String,required:true,unique:true,sparse:true,lowercase:true,trim:true,minlength:3,maxlength:30},
  password:{type:String,required:true,minlength:6},rol:{type:String,enum:["user","admin"],default:"user"},
},{timestamps:true,collection:"usuarios"});
schema.pre("save",async function(){if(this.isModified("password"))this.password=await bcrypt.hash(this.password,10)});
export const User=models.User||model("User",schema);
