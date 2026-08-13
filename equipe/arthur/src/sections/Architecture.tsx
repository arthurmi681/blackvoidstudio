const capabilities = [
  ['01', 'Linguagens', 'JavaScript · TypeScript · Python · Rust / Tauri · SQL'],
  ['02', 'Front-end', 'React · Next.js · Tailwind CSS · Vite · Figma'],
  ['03', 'Back-end & APIs', 'Node.js · REST · JWT / OAuth · Webhooks · JSON'],
  ['04', 'Inteligência Artificial', 'LLMs · Prompt Engineering · Multi-agentes · Memória'],
  ['05', 'Automação', 'Telegram · WhatsApp · Instagram · Discord · Processos'],
  ['06', 'Dados', 'SQLite · PostgreSQL · MySQL · Modelagem · CRUD'],
  ['07', 'Integrações', 'APIs de IA · Binance · PicPay · MetaMask · MetaTrader'],
  ['08', 'Infra & Segurança', 'Arch Linux · Shell · Deploy · Hardening · Git'],
]

export function Architecture() {
  return (
    <section id="architecture" className="chapter architecture" data-chapter="3" aria-labelledby="architecture-title">
      <div className="section-index" data-reveal>
        <span>04</span>
        <span>Architecture / Stack</span>
      </div>

      <div className="architecture__intro">
        <p className="kicker" data-reveal>Capability map</p>
        <h2 id="architecture-title" data-reveal>
          Do pixel<br />
          ao <em>processo.</em>
        </h2>
        <p data-reveal>
          Uma arquitetura coerente, não uma coleção de ferramentas. Produto, interface, dados, agentes e
          infraestrutura tratados como partes do mesmo sistema.
        </p>
      </div>

      <div className="capability-list">
        {capabilities.map(([number, title, items]) => (
          <article className="capability" key={number} data-reveal>
            <span className="capability__number">{number}</span>
            <h3>{title}</h3>
            <p>{items}</p>
            <i aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="architecture__statement" data-reveal>
        <span>Front-end</span><i />
        <span>Reasoning</span><i />
        <span>Deploy</span>
      </div>
    </section>
  )
}
