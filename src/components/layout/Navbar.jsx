import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: t("home") },
    { to: "/topics", label: t("topics") },
    { to: "/playground", label: t("playground") },
    { to: "/about", label: t("about") },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="text-xl font-bold text-white">
              DSA & DAA Seekho
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side: Language toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm font-medium text-slate-300 hover:text-white transition-colors border border-slate-600"
            >
              {lang === "en" ? "HI" : "EN"}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-slate-800 border-t border-slate-700 px-4 pb-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
