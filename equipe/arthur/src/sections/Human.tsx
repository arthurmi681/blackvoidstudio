export function Human() {
  return (
    <section id="human" className="chapter human" data-chapter="5" aria-labelledby="human-title">
      <div className="section-index" data-reveal>
        <span>06</span>
        <span>Human / Fora do sistema</span>
      </div>

      <div className="human__layout">
        <div className="human__manifesto">
          <p className="kicker" data-reveal>Human before system</p>
          <h2 id="human-title" data-reveal>
            Tecnologia<br />
            com <em>intenção.</em>
          </h2>
          <blockquote data-reveal>
            “A disciplina do código e a precisão da espada têm o mesmo princípio: intenção, economia e execução.”
          </blockquote>
          <div className="human__facts" data-reveal>
            <span><b>PT</b> Nativo</span>
            <span><b>EN</b> Leitura técnica</span>
            <span><b>ES</b> Básico</span>
          </div>
        </div>

        <figure className="human__photo" data-reveal>
          <img
            src="images/arthur-human.webp"
            alt="Autorretrato informal de Arthur Miyazaki diante de um espelho"
            width="900"
            height="1600"
            loading="lazy"
          />
          <figcaption>
            <span>Arthur / Off frame</span>
            <span>2026</span>
          </figcaption>
        </figure>
      </div>

      <div className="human__ticker" aria-hidden="true">
        <span>Build with purpose · Build with purpose · Build with purpose ·</span>
        <span>Build with purpose · Build with purpose · Build with purpose ·</span>
      </div>
    </section>
  )
}
