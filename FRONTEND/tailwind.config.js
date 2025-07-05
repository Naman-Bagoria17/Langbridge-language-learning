import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    daisyui
  ],
  daisyui: {
    themes: [
      "business",
      "corporate",
      "luxury",
      "dark",
      "night",
      "dim",
      "nord",
      "winter",
      "autumn",
      "dracula",
      "slate",
      {
        "professional": {
          "primary": "#2563eb",
          "secondary": "#64748b",
          "accent": "#0ea5e9",
          "neutral": "#1e293b",
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#e2e8f0",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
        "executive": {
          "primary": "#1e40af",
          "secondary": "#475569",
          "accent": "#0f766e",
          "neutral": "#0f172a",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#cbd5e1",
          "info": "#0891b2",
          "success": "#059669",
          "warning": "#d97706",
          "error": "#dc2626",
        },
        "slate": {
          "primary": "#334155",
          "secondary": "#64748b",
          "accent": "#0f766e",
          "neutral": "#1e293b",
          "base-100": "#f8fafc",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        }
      }
    ],
  },
}