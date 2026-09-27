import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Menu, X, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Investment Plans', path: '/plans' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                Apex<span className="text-indigo-400">Invest</span>
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 tracking-wider uppercase">Demo Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-white bg-slate-800/80 border border-slate-700/60 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link to={isAdmin ? '/admin' : '/dashboard'}>
                <Button variant="emerald" icon={isAdmin ? Shield : ArrowRight}>
                  {isAdmin ? 'Admin Portal' : 'My Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Start Investing</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-b border-slate-800 px-4 pt-4 pb-6 space-y-3 animate-slide-down">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full"
              >
                <Button variant="emerald" className="w-full">
                  {isAdmin ? 'Admin Portal' : 'Go to Dashboard'}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="secondary" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="primary" className="w-full">
                    Start Investing
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
