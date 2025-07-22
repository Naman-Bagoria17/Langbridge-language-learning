import { useEffect } from 'react';

// Custom hook to initialize theme on app start
// Sets 'forest' as the default theme for first-time users
export const useThemeInitializer = () => {
  useEffect(() => {
    // Get theme from localStorage and apply it immediately
    const initializeTheme = () => {
      try {
        const savedTheme = localStorage.getItem('langbridge-theme');

        // If no theme is saved (first-time user), set forest as default theme
        if (!savedTheme) {
          const defaultTheme = 'forest';
          localStorage.setItem('langbridge-theme', defaultTheme);
          document.documentElement.setAttribute('data-theme', defaultTheme);
          console.log('🌲 First-time user detected - setting default theme to Forest');
        } else {
          // Use saved theme for returning users
          document.documentElement.setAttribute('data-theme', savedTheme);
        }
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        // Fallback to forest theme even on error
        document.documentElement.setAttribute('data-theme', 'forest');
      }
    };

    initializeTheme();
  }, []);
};

export default useThemeInitializer;
