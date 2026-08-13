const experiencePoints = [
  'Liderança do levantamento de requisitos ao deploy',
  'Websites, dashboards, painéis administrativos e SaaS',
  'Automações e integrações orientadas à redução de trabalho manual',
  'Figma, desenvolvimento, testes, Linux e documentação técnica',
]

export function Experience() {
  return (
    <section id="experience" className="chapter experience" data-chapter="4" aria-labelledby="experience-title">
      <div className="experience__image" data-reveal>
        <img
          src="images/creative-work.webp"
          alt="Arthur Miyazaki trabalhando entre notebooks, tablet e desenhos técnicos"
          width="1600"
          height="900"
          loading="lazy"
        />
        <span className="image-note image-note--top">Design / Code / Systems</span>
        <span className="image-note image-note--bottom">From intent to deployment</span>
      </div>

      <div className="section-index" data-reveal>
        <span>05</span>
        <span>Build / Experiência</span>
      </div>

      <div className="experience__content">
        <div className="experience__heading">
          <p className="kicker" data-reveal>Jan 2023 — presente</p>
          <h2 id="experience-title" data-reveal>
            Black<br />
            <em>Void.</em>
          </h2>
        </div>

        <div className="experience__details">
          <div className="experience__role" data-reveal>
            <span>Founder & Full Stack Developer</span>
            <span>Dourados · MS</span>
          </div>
          <p className="experience__lead" data-reveal>
            Software house para soluções inteligentes que unem engenharia, automação e IA — em produtos próprios
            e projetos sob demanda.
          </p>
          <ul className="experience__points">
            {experiencePoints.map((point, index) => (
              <li key={point} data-reveal>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="impact" data-reveal>
            <strong>80<sup>%</sup></strong>
            <p>de redução de trabalho manual em automações desenvolvidas para clientes.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
