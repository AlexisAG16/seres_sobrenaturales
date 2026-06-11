import { Schema, deleteModel, model, models } from "mongoose";
import { ALL_SER_CLASSES,SER_TYPES } from "@/lib/ser-options";
const schema = new Schema({
  tipo:{type:String,enum:SER_TYPES,required:true},
  clase:{type:String,enum:[...ALL_SER_CLASSES,""],required:function(this:{tipo:string}){return this.tipo!=="Humano"}},
  nombre_comun:{type:String,required:true,trim:true},nombre_real:String,
  sexo:{type:String,enum:["Masculino","Femenino","LGTBQ+"]},pais_ciudad:String,epoca_vida:String,
  padres:{type:[String],default:[]},poderes:{type:[String],default:[]},biografia:String,mision:String,imagen:String,audio:String,video:String,
},{timestamps:true,collection:"seres"});

// Next.js conserva modelos compilados durante el hot reload. Si el servidor
// tenía el esquema anterior, Mongoose descartaba el nuevo campo de audio.
if (models.Ser && !models.Ser.schema.path("audio")) {
  deleteModel("Ser");
}

export const Ser = models.Ser || model("Ser",schema);
