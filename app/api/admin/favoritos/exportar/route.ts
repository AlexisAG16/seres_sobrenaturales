import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import "@/models/Ser";

export async function GET(){
  if(!await requireAdmin())return NextResponse.json({message:"No autorizado."},{status:401});
  await connectDB();
  const users=await User.find({rol:"user"}).select("username rol favoritos updatedAt").populate("favoritos","nombre_comun tipo clase").sort({username:1}).lean();
  const workbook=new ExcelJS.Workbook();
  workbook.creator="Vampire";
  workbook.created=new Date();
  const sheet=workbook.addWorksheet("Favoritos");
  sheet.columns=[
    {header:"Usuario",key:"username",width:24},
    {header:"Cantidad",key:"cantidad",width:12},
    {header:"Ser favorito",key:"ser",width:30},
    {header:"Tipo",key:"tipo",width:18},
    {header:"Clase",key:"clase",width:24},
    {header:"Actualizado",key:"updatedAt",width:22},
  ];
  for(const user of users){
    const favorites=user.favoritos as any[];
    if(favorites.length)for(const favorite of favorites)sheet.addRow({username:user.username,cantidad:favorites.length,ser:favorite.nombre_comun,tipo:favorite.tipo,clase:String(favorite.clase||"").replaceAll("_"," "),updatedAt:user.updatedAt});
    else sheet.addRow({username:user.username,cantidad:0,ser:"Sin favoritos",tipo:"",clase:"",updatedAt:user.updatedAt});
  }
  sheet.getRow(1).font={bold:true,color:{argb:"FFFFFFFF"}};
  sheet.getRow(1).fill={type:"pattern",pattern:"solid",fgColor:{argb:"FF7C1730"}};
  sheet.getRow(1).alignment={vertical:"middle",horizontal:"center"};
  sheet.views=[{state:"frozen",ySplit:1}];
  sheet.autoFilter={from:"A1",to:"F1"};
  sheet.getColumn("cantidad").alignment={horizontal:"center"};
  sheet.getColumn("updatedAt").numFmt="dd/mm/yyyy hh:mm";
  sheet.eachRow((row,index)=>{row.height=index===1?28:22;if(index>1&&index%2===0)row.fill={type:"pattern",pattern:"solid",fgColor:{argb:"FFF3EDF1"}}});
  const buffer=await workbook.xlsx.writeBuffer();
  return new NextResponse(Buffer.from(buffer),{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="favoritos-archivo-sobrenatural-${new Date().toISOString().slice(0,10)}.xlsx"`}});
}
