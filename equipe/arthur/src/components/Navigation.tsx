import { useEffect, useState } from 'react'

const links = [
  { href: '#about', label: 'Sobre' },
  { href: '#systems', label: 'Sistemas' },
  { href: '#architecture', label: 'Stack' },
  { href: '#experience', label: 'Experiência' },
]

type NavigationProps = {
  activeChapter: number
}

export function Navigation({ activeChapter }: NavigationProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => document.body.classList.remove('menu-open')
  }, [open])

  return (
    <header className="nav-shell">
      <a className="brand" href="#signal" aria-label="Arthur Miyazaki — início">
        <span className="brand__mark">A/M</span>
        <span className="brand__line">Signal / Void</span>
      </a>

      <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegação principal">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a className="nav__cv" href="docs/curriculo-arthur-miyazaki.pdf" download onClick={() => setOpen(false)}>
          Currículo ↘
        </a>
        <a className="nav__contact" href="#contact" onClick={() => setOpen(false)}>
          Contato
        </a>
      </nav>

      <div className="nav__status" aria-label={`Capítulo ${activeChapter + 1} de 7`}>
        <span>{String(activeChapter + 1).padStart(2, '0')}</span>
        <i />
        <span>07</span>
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
    </header>
  )
}
