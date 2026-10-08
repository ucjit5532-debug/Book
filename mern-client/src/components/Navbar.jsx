import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FaBarsStaggered, FaBlog, FaXmark } from 'react-icons/fa6'

const navItems = [
  { link: 'Home', path: '/' },
  { link: 'About', path: '/about' },
  { link: 'Shop', path: '/shop' },
  { link: 'Sell Your Book', path: '/admin/dashboard' },
  { link: 'Blog', path: '/blog' },
]

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
         isSticky ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between px-4 py-3"
      >
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-2xl font-bold text-blue-700"
        >
          <FaBlog aria-hidden="true" />
          Books
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map(({ link, path }) => (
            <li key={path}>
              <Link
                to={path}
                className="block text-base uppercase text-black hover:text-blue-700"
              >
                {link}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="text-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700 md:hidden"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? (
            <FaXmark aria-hidden="true" className="h-5 w-5" />
          ) : (
            <FaBarsStaggered aria-hidden="true" className="h-5 w-5" />
          )}
        </button>

        <ul
          id="mobile-navigation"
          className={`absolute left-0 right-0 top-full w-full flex-col gap-4 border-t border-gray-200 bg-white px-4 py-4 shadow-md md:hidden ${
            isMenuOpen ? 'flex' : 'hidden'
          }`}
        >
            {navItems.map(({ link, path }) => (
              <li key={path}>
                <Link
                  to={path}
                  onClick={closeMenu}
                  className="block text-base uppercase text-black hover:text-blue-700"
                >
                  {link}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  )
}

export default Navbar
