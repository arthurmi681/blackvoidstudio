const chapters = ['Signal', 'Intent', 'Systems', 'Architecture', 'Build', 'Human', 'Connect']

export function ChapterRail({ active }: { active: number }) {
  return (
    <aside className="chapter-rail" aria-label="Progresso da experiência">
      {chapters.map((chapter, index) => (
        <a
          key={chapter}
          href={`#${['signal', 'about', 'systems', 'architecture', 'experience', 'human', 'contact'][index]}`}
          className={active === index ? 'is-active' : ''}
          aria-current={active === index ? 'step' : undefined}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <i />
          <em>{chapter}</em>
        </a>
      ))}
    </aside>
  )
}
