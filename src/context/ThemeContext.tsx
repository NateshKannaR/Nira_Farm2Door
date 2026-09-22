'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

export type Theme = 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = 'kb_theme';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Default theme is ALWAYS 'light' in any case
  const [theme, setThemeState] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme: only 'dark' if explicitly chosen by user, otherwise strictly 'light'
  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (savedTheme === 'dark') {
        setThemeState('dark');
        setResolvedTheme('dark');
      } else {
        setThemeState('light');
        setResolvedTheme('light');
      }
    } catch {
      setThemeState('light');
      setResolvedTheme('light');
    }
  }, []);

  // Sync resolved theme and document classes whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      setResolvedTheme('dark');
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      setResolvedTheme('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Failed to save theme preference in localStorage:', e);
    }
  };

  const toggleTheme = () => {
    // Switch between light and dark
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const contextValue = useMemo<ThemeContextType>(() => ({
    theme,
    resolvedTheme: mounted ? resolvedTheme : 'light',
    setTheme,
    toggleTheme,
  }), [theme, resolvedTheme, mounted]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
