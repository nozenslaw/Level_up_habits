import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const WALLPAPERS = [
  { id: 'none', name: 'Aucun', url: null, category: 'Default' },
  { id: 'neon', name: 'Neon Abstract', url: 'https://images.pexels.com/photos/28408917/pexels-photo-28408917.jpeg', category: 'Dark/Neon' },
  { id: 'cyber', name: 'Cyber City', url: 'https://images.pexels.com/photos/4512439/pexels-photo-4512439.jpeg', category: 'Dark/Urban' },
  { id: 'nature', name: 'Misty Nature', url: 'https://images.pexels.com/photos/1367192/pexels-photo-1367192.jpeg', category: 'Nature/Calm' },
  { id: 'pastel', name: 'Soft Pastel', url: 'https://images.pexels.com/photos/7135058/pexels-photo-7135058.jpeg', category: 'Light/Abstract' }
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useLocalStorage('app_theme', 'dark');
  const [wallpaperId, setWallpaperId] = useLocalStorage('app_wallpaper', 'none');
  const [customWallpaper, setCustomWallpaper] = useLocalStorage('app_custom_wallpaper', null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const getCurrentWallpaper = () => {
    if (customWallpaper) return customWallpaper;
    const wallpaper = WALLPAPERS.find(w => w.id === wallpaperId);
    return wallpaper?.url || null;
  };

  const setWallpaperFromUrl = (url) => {
    setCustomWallpaper(url);
    setWallpaperId('custom');
  };

  const selectWallpaper = (id) => {
    setWallpaperId(id);
    if (id !== 'custom') {
      setCustomWallpaper(null);
    }
  };

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    wallpapers: WALLPAPERS,
    wallpaperId,
    selectWallpaper,
    customWallpaper,
    setWallpaperFromUrl,
    currentWallpaper: getCurrentWallpaper(),
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
