const contactRoutes = [
  ['Email', 'arthurmiyazaki3@gmail.com', 'mailto:arthurmiyazaki3@gmail.com'],
  ['WhatsApp', '+55 67 99161-0074', 'https://wa.me/5567991610074'],
  ['GitHub', '/arthurmi681', 'https://github.com/arthurmi681'],
  ['LinkedIn', '/in/arthur-miyazaki', 'https://www.linkedin.com/in/arthur-miyazaki-8b2119390'],
]

export function Contact() {
  return (
    <section id="contact" className="chapter contact" data-chapter="6" aria-labelledby="contact-title">
      <div className="section-index section-index--light" data-reveal>
        <span>07</span>
        <span>Connect / Contato</span>
      </div>

      <div className="contact__center">
        <p className="kicker" data-reveal>Connection available</p>
        <h2 id="contact-title" data-reveal>
          Vamos construir<br />
          algo com <em>propósito.</em>
        </h2>
        <p className="contact__lead" data-reveal>
          Projetos, parcerias estratégicas e oportunidades onde tecnologia, design e inteligência artificial
          criam valor real.
        </p>
        <a className="contact__primary" href="mailto:arthurmiyazaki3@gmail.com" data-reveal>
          <span>Iniciar uma conversa</span>
          <i>↗</i>
        </a>
      </div>

      <div className="contact-routes">
        {contactRoutes.map(([label, value, href]) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" data-reveal>
            <span>{label}</span>
            <strong>{value}</strong>
            <i>↗</i>
          </a>
        ))}
      </div>

      <footer className="footer" data-reveal>
        <span>© 2026 Arthur Miyazaki</span>
        <span>Full Stack & AI Engineer</span>
        <a href="#signal">Back to signal ↑</a>
      </footer>
    </section>
  )
}
