import { useEffect } from 'react';
import { useThemeStore } from '@/stores';

const ThemeInitializer = () => {
  const initializeTheme = useThemeStore(state => state.initializeTheme);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return null;
};

export default ThemeInitializer;
