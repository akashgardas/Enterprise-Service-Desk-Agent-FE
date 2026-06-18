import { useState, useEffect } from 'react';

const THEME_KEY = 'app-theme';
const DARK = 'dark';
const LIGHT = 'light';

export const useTheme = () => {
  // Initial state setup
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
    } catch (e) {
      return LIGHT; // Fallback to light
    }
  });

  // Effect to apply theme to HTML and save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      console.error('useTheme: Error saving to localStorage:', e);
    }

    // Update DOM
    if (theme === DARK) {
      document.documentElement.classList.add(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
    }
  }, [theme]);

  // System theme listener (only if no user preference saved)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? DARK : LIGHT);
      }
    };
    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === DARK ? LIGHT : DARK);
  };

  return { theme, toggleTheme };
};
