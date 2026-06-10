import Link from "next/link";
import AnimatedVampire from "@/components/AnimatedVampire";

const groups = [
  ["Vampiros", "Linajes inmortales, órdenes antiguas y criaturas marcadas por la sangre.", "Vampiro"],
  ["Brujas", "Portadoras de magia, pactos, conocimientos arcanos y legados familiares.", "Bruja"],
  ["Otros seres", "Híbridos, no muertos, hechiceros y entidades difíciles de clasificar.", "Otro"],
];

export default function Home() {
  return <>
    <section className="hero"><div className="hero-layout"><div className="hero-inner">
      <p className="eyebrow">Crónicas de un universo original</p>
      <h1>Seres <span>Sobrenaturales</span></h1>
      <p className="lead">Un archivo vivo para registrar personajes, linajes, poderes, misiones y biografías de un mundo fantástico creado a lo largo de los años.</p>
      <div className="actions"><Link className="button" href="/seres">Explorar el archivo</Link><Link className="button secondary" href="/historia">Conocer la historia</Link></div>
    </div><AnimatedVampire /></div></section>
    <section className="section">
      <p className="eyebrow" style={{textAlign: "center"}}>El bestiario</p>
      <h2 className="section-title">Historias que merecen ser <span>recordadas</span></h2>
      <div className="intro-grid">{groups.map(([title, text, type]) => <article className="panel" key={title}><h3>{title}</h3><p>{text}</p><Link href={`/seres?tipo=${type}`}>Abrir colección →</Link></article>)}</div>
    </section>
  </>;
}
