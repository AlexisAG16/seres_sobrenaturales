export default function SiteFooter(){
  return <footer className="site-footer">
    <div className="footer-content">
      <div className="footer-intro">
        <strong>Archivo <span>Sobrenatural</span></strong>
        <p>Relatos, voces y personajes nacidos de un universo propio entre mitos, sombras y leyendas.</p>
      </div>
      <div className="footer-social">
        <p>Sigue el universo</p>
        <div className="social-links">
          <a href="https://www.youtube.com/@spvampire2" target="_blank" rel="noreferrer" aria-label="Canal de Vampire en YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>
            YouTube
          </a>
          <a href="https://x.com/SpVampire064" target="_blank" rel="noreferrer" aria-label="Perfil de Vampire en X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-6.4L6.5 22H3.3l7.3-8.4L.8 2h6.4l4.4 5.8L18.9 2Zm-1.1 17.8h1.7L6.3 4H4.5l13.3 15.8Z"/></svg>
            X
          </a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} Vampire. Todos los derechos reservados.</p>
      <p>Personajes e historias de creación original.</p>
    </div>
  </footer>;
}
