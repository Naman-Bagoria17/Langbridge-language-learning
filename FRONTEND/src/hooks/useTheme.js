import { useEffect } from 'react';

// Custom hook to initialize theme on app start
export const useThemeInitializer = () => {
  useEffect(() => {
    // Get theme from localStorage and apply it immediately
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('langbridge-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    };

    initializeTheme();
  }, []);
};

export default useThemeInitializer;
