import type { Metadata } from "next";
import Link from "next/link";
import Notifications from "@/components/Notifications";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Archivo Sobrenatural", template: "%s | Archivo Sobrenatural" },
  description: "Archivo personal de personajes sobrenaturales, míticos y necrománticos.",
};

const links = [["/", "Inicio"], ["/seres", "Archivo"], ["/historia", "Historia"], ["/acerca", "Acerca"], ["/cuenta", "Cuenta"]];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="site-header">
          <Link href="/" className="brand">Archivo <span>Sobrenatural</span></Link>
          <nav aria-label="Navegación principal">
            {links.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
          </nav>
        </header>
        <main>{children}</main>
        <footer><strong>Archivo Sobrenatural</strong><p>Un universo personal de seres, linajes, poderes e historias.</p></footer>
        <Notifications/>
      </body>
    </html>
  );
}
