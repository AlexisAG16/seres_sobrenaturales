import type { Metadata } from "next";
import Notifications from "@/components/Notifications";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata:Metadata={
  title:{default:"Archivo Sobrenatural",template:"%s | Archivo Sobrenatural"},
  description:"Archivo personal de personajes sobrenaturales, míticos y necrománticos.",
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){
  return <html lang="es">
    <body>
      <SiteHeader/>
      <main>{children}</main>
      <SiteFooter/>
      <Notifications/>
    </body>
  </html>;
}
