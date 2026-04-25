import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Trophy, BookOpen, Search, Info } from 'lucide-react';

export default function MobileNav() {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span>Ana Sayfa</span>
      </NavLink>
      <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Trophy size={22} />
        <span>Quiz</span>
      </NavLink>
      <NavLink to="/blog" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BookOpen size={22} />
        <span>Blog</span>
      </NavLink>
      <div className="nav-indicator" />
    </nav>
  );
}
