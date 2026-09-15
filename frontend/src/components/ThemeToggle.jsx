import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ style = {} }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle Dark and Light theme"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.45rem 0.85rem',
        borderRadius: '999px',
        border: isDark ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(15, 23, 42, 0.15)',
        background: isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.9)',
        color: isDark ? '#fbbf24' : '#6366f1',
        fontSize: '0.82rem',
        fontWeight: 600,
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(99, 102, 241, 0.15)',
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {isDark ? (
        <>
          <Sun size={16} color="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
          <span style={{ color: '#e2e8f0' }}>Light Mode</span>
        </>
      ) : (
        <>
          <Moon size={16} color="#6366f1" style={{ filter: 'drop-shadow(0 0 4px #6366f1)' }} />
          <span style={{ color: '#1e293b' }}>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
