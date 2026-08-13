export function Hero() {
  return (
    <section id="signal" className="chapter hero" data-chapter="0" aria-labelledby="hero-title">
      <div className="hero__image-wrap" data-reveal>
        <img
          className="hero__image"
          src="images/arthur-urban.webp"
          alt="Arthur Miyazaki em uma rua urbana, sob uma rede de cabos"
          width="1080"
          height="1920"
          loading="eager"
          fetchPriority="high"
        />
        <div className="hero__scan" aria-hidden="true" />
      </div>

      <div className="hero__copy">
        <p className="eyebrow" data-reveal>
          <span>Founder @ Black Void</span>
          <span>Dourados · MS · Brasil</span>
        </p>
        <h1 id="hero-title" data-reveal>
          <span>Arthur</span>
          <span className="hero__surname">Miyazaki</span>
        </h1>
        <nav className="hero__role" data-reveal aria-label="Áreas de atuação">
          <a href="#architecture">Full Stack</a>
          <i aria-hidden="true" />
          <a href="#systems">AI Engineer</a>
        </nav>
        <div className="hero__actions" data-reveal>
          <a className="button button--signal" href="#systems">
            Explorar sistemas <span>↓</span>
          </a>
          <a className="button button--outline" href="#contact">
            Iniciar conversa <span>↗</span>
          </a>
        </div>
      </div>

      <div className="hero__footer" data-reveal>
        <span>Scroll to connect</span>
        <div className="hero__scroll-line"><i /></div>
        <span>01 / 07</span>
      </div>
    </section>
  )
}
