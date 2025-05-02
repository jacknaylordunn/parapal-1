import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeContextType = {
  theme: Theme;
  resolvedTheme: 'dark' | 'light';
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'system', 
  resolvedTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Initialize state from localStorage or default to system
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('parapal-theme');
    if (savedTheme === 'dark' || savedTheme === 'light' || savedTheme === 'system') {
      return savedTheme as Theme;
    }
    
    // Otherwise default to system
    return 'system';
  });
  
  // Track the resolved theme (what's actually applied)
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  // Apply theme to DOM and save preference
  useEffect(() => {
    // Determine actual theme to apply
    let newResolvedTheme: 'dark' | 'light';
    
    if (theme === 'system') {
      newResolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
      newResolvedTheme = theme;
    }
    
    // Update the resolved theme state
    setResolvedTheme(newResolvedTheme);
    
    // Update DOM
    document.documentElement.classList.toggle('dark', newResolvedTheme === 'dark');
    
    // Save preference
    localStorage.setItem('parapal-theme', theme);
  }, [theme]);

  // Handle system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Toggle between light and dark (excluding system)
  const toggleTheme = () => {
    setTheme(prevTheme => {
      // If system, switch to the opposite of current resolved theme
      if (prevTheme === 'system') {
        return resolvedTheme === 'light' ? 'dark' : 'light';
      }
      // Otherwise toggle between light and dark
      return prevTheme === 'light' ? 'dark' : 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      resolvedTheme,
      toggleTheme, 
      setTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
