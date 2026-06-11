import bcrypt from "bcryptjs";
import { Schema, deleteModel, model, models } from "mongoose";
const schema = new Schema({
  username:{type:String,required:true,unique:true,sparse:true,lowercase:true,trim:true,minlength:3,maxlength:30},
  password:{type:String,required:true,minlength:6},rol:{type:String,enum:["user","admin"],default:"user"},
  favoritos:{type:[Schema.Types.ObjectId],ref:"Ser",default:[]},
},{timestamps:true,collection:"usuarios"});
schema.pre("save",async function(){if(this.isModified("password"))this.password=await bcrypt.hash(this.password,10)});
if(models.User&&!models.User.schema.path("favoritos"))deleteModel("User");
export const User=models.User||model("User",schema);
