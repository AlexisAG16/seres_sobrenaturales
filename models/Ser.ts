import { Schema, deleteModel, model, models } from "mongoose";
import { ALL_SER_CLASSES, SER_TYPES } from "@/lib/ser-options";

const schema = new Schema({
  tipo: { type: String, enum: SER_TYPES, required: true },
  clase: { type: String, enum: [...ALL_SER_CLASSES, ""], default: "" },
  nombre_comun: { type: String, required: true, trim: true },
  nombre_real: String,
  sexo: { type: String, enum: ["Masculino", "Femenino", "LGTBQ+"] },
  pais_ciudad: String,
  epoca_vida: String,
  padres: { type: [String], default: [] },
  poderes: { type: [String], default: [] },
  biografia: String,
  mision: String,
  imagen: String,
  audio: String,
  video: String,
}, { timestamps: true, collection: "seres" });

schema.index(
  { nombre_comun: 1 },
  {
    unique: true,
    collation: { locale: "es", strength: 2 },
    name: "nombre_comun_unique_ci",
  },
);

// La validación de negocio exige clase únicamente para tipos no humanos.
// Recompilar evita conservar un esquema anterior durante el hot reload.
if (models.Ser) deleteModel("Ser");
export const Ser = model("Ser", schema);
