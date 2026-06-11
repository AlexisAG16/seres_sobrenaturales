export const SER_TYPES = ["Vampiro","Bruja","Cazador","Humano","Otro"] as const;
export type SerType = typeof SER_TYPES[number];

export const CLASSES_BY_TYPE:Record<SerType,readonly {value:string;label:string}[]>={
  Vampiro:[
    {value:"draculianos",label:"Draculianos"},
    {value:"nueva_orden",label:"Nueva Orden"},
    {value:"olvidadas",label:"Olvidadas"},
  ],
  Bruja:[
    {value:"orden_merlin",label:"Orden de Merlín"},
    {value:"nueva_orden",label:"Nueva Orden"},
  ],
  Cazador:[
    {value:"de_vampiros",label:"De Vampiros"},
    {value:"de_brujas",label:"De Brujas"},
  ],
  Humano:[],
  Otro:[
    {value:"no_muertos",label:"No Muertos"},
    {value:"hibridos",label:"Híbridos"},
    {value:"hechiceros",label:"Hechiceros"},
  ],
};

export const ALL_SER_CLASSES=[...new Set(Object.values(CLASSES_BY_TYPE).flat().map(option=>option.value))];

export function isSerType(value:string):value is SerType{
  return SER_TYPES.includes(value as SerType);
}
