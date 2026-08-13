const products = [
  {
    number: '01',
    name: 'KIRA AI',
    type: 'Multi-agent assistant',
    description:
      'Assistente inteligente multiplataforma com agentes especializados, contexto, memória persistente, tarefas e plugins integrados ao núcleo de IA.',
    stack: ['Python', 'Node.js', 'LLMs', 'SQLite', 'Linux'],
  },
  {
    number: '02',
    name: 'JARVIS',
    type: 'Intelligent automation',
    description:
      'Plataforma que conecta Telegram, WhatsApp e APIs financeiras em fluxos de execução orientados por IA e arquitetura extensível.',
    stack: ['Node.js', 'Python', 'REST', 'Webhooks', 'Messaging'],
  },
  {
    number: '03',
    name: 'BLACK VOID',
    type: 'Immersive web experience',
    description:
      'Experiência institucional sci-fi, minimalista e otimizada, com animações avançadas, canvas dinâmico e navegação fluida.',
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
  },
]

export function Systems() {
  return (
    <section id="systems" className="chapter systems" data-chapter="2" aria-labelledby="systems-title">
      <div className="systems__backdrop" aria-hidden="true">
        <img src="images/developer-setup.webp" alt="" width="1600" height="900" loading="lazy" />
      </div>
      <div className="systems__veil" aria-hidden="true" />

      <div className="section-index section-index--light" data-reveal>
        <span>03</span>
        <span>Systems / Produtos</span>
      </div>

      <div className="systems__heading">
        <p className="kicker" data-reveal>Selected systems</p>
        <h2 id="systems-title" data-reveal>
          Inteligência<br />
          em <em>operação.</em>
        </h2>
      </div>

      <div className="product-list">
        {products.map((product) => (
          <article className="product" key={product.name} data-reveal tabIndex={0}>
            <div className="product__number">{product.number}</div>
            <div className="product__title">
              <p>{product.type}</p>
              <h3>{product.name}</h3>
            </div>
            <p className="product__description">{product.description}</p>
            <ul className="product__stack" aria-label={`Tecnologias de ${product.name}`}>
              {product.stack.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <span className="product__arrow" aria-hidden="true">↗</span>
          </article>
        ))}
      </div>
    </section>
  )
}
