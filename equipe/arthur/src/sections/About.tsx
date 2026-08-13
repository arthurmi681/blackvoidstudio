export function About() {
  return (
    <section id="about" className="chapter about" data-chapter="1" aria-labelledby="about-title">
      <div className="section-index" data-reveal>
        <span>02</span>
        <span>Intent / Sobre</span>
      </div>

      <div className="about__grid">
        <figure className="about__portrait" data-reveal>
          <img
            src="images/arthur-portrait.webp"
            alt="Retrato editorial de Arthur Miyazaki em roupa preta diante de uma parede de concreto"
            width="1080"
            height="1440"
            loading="lazy"
          />
          <figcaption>
            <span>Portrait / 2026</span>
            <span>Human before system</span>
          </figcaption>
        </figure>

        <div className="about__copy">
          <p className="kicker" data-reveal>Intenção antes da execução.</p>
          <h2 id="about-title" data-reveal>
            Sistemas que pensam.<br />
            Produtos que <em>funcionam.</em>
          </h2>
          <div className="about__body" data-reveal>
            <p>
              Fundador da Black Void, software house especializada em soluções inteligentes que unem engenharia
              de software, automação e inteligência artificial.
            </p>
            <p>
              Desenvolvo aplicações web completas, sistemas multiagentes com memória e pipelines de automação —
              do levantamento de requisitos ao deploy em Linux.
            </p>
          </div>
          <div className="about__coordinates" data-reveal aria-label="Áreas de atuação">
            <span><b>01</b> Engineering</span>
            <span><b>02</b> Automation</span>
            <span><b>03</b> Intelligence</span>
          </div>
        </div>
      </div>
    </section>
  )
}
