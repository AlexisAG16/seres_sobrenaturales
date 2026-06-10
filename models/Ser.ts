import { Schema, model, models } from "mongoose";
const schema = new Schema({
  tipo:{type:String,enum:["Vampiro","Bruja","Cazador","Humano","Otro"],required:true},clase:String,
  nombre_comun:{type:String,required:true,trim:true},nombre_real:String,
  sexo:{type:String,enum:["Masculino","Femenino","LGTBQ+"]},pais_ciudad:String,epoca_vida:String,
  padres:{type:[String],default:[]},poderes:{type:[String],default:[]},biografia:String,mision:String,imagen:String,video:String,
},{timestamps:true,collection:"seres"});
export const Ser = models.Ser || model("Ser",schema);
