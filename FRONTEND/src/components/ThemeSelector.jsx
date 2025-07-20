import { useState, useEffect } from "react";

const themes = [
  { value: "light", label: "☀️ Light" },
  { value: "dark", label: "🌙 Dark" },
  { value: "cupcake", label: "🧁 Cupcake" },
  { value: "bumblebee", label: "🐝 Bumblebee" },
  { value: "emerald", label: "💚 Emerald" },
  { value: "corporate", label: "🏢 Corporate" },
  { value: "synthwave", label: "🌆 Synthwave" },
  { value: "retro", label: "📼 Retro" },
  { value: "cyberpunk", label: "🤖 Cyberpunk" },
  { value: "valentine", label: "💝 Valentine" },
  { value: "halloween", label: "🎃 Halloween" },
  { value: "garden", label: "🌸 Garden" },
  { value: "forest", label: "🌲 Forest" },
  { value: "aqua", label: "🌊 Aqua" },
  { value: "lofi", label: "🎵 Lo-Fi" },
  { value: "pastel", label: "🎨 Pastel" },
  { value: "fantasy", label: "🧚 Fantasy" },
  { value: "wireframe", label: "📐 Wireframe" },
  { value: "black", label: "⚫ Black" },
  { value: "luxury", label: "💎 Luxury" },
  { value: "dracula", label: "🧛 Dracula" },
  { value: "cmyk", label: "🖨️ CMYK" },
  { value: "autumn", label: "🍂 Autumn" },
  { value: "business", label: "💼 Business" },
  { value: "acid", label: "🧪 Acid" },
  { value: "lemonade", label: "🍋 Lemonade" },
  { value: "night", label: "🌃 Night" },
  { value: "coffee", label: "☕ Coffee" },
  { value: "winter", label: "❄️ Winter" },
  { value: "dim", label: "🔅 Dim" },
  { value: "nord", label: "🏔️ Nord" },
  { value: "sunset", label: "🌅 Sunset" },
];

const ThemeSelector = () => {
  const getInitialTheme = () => {
    try {
      return localStorage.getItem("langbridge-theme") || "dark";
    } catch (error) {
      console.warn("Failed to load theme from localStorage:", error);
      return "dark";
    }
  };

  const [currentTheme, setCurrentTheme] = useState(getInitialTheme);

  const applyTheme = (theme) => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("langbridge-theme", theme);
      setCurrentTheme(theme);
    } catch (error) {
      console.warn("Failed to apply theme:", error);
    }
  };

  const handleThemeChange = (event) => {
    const newTheme = event.target.value;
    applyTheme(newTheme);
  };

  useEffect(() => {
    applyTheme(currentTheme);
  }, []);

  const getCurrentThemeData = () => {
    return themes.find((t) => t.value === currentTheme) || themes[1]; // fallback to dark
  };

  const currentThemeData = getCurrentThemeData();

  if (!currentTheme) {
    return <div className="text-base-content text-sm">Theme Loading...</div>;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-base-300 shadow-md">
      <span className="text-base-content/70 text-base">🎨</span>
      <select
        aria-label="Select theme"
        value={currentTheme}
        onChange={handleThemeChange}
        className="select select-sm min-w-[150px] bg-base-200 border-base-300 text-base-content focus:border-primary"
        title={`Current theme: ${currentThemeData.label}`}
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSelector;
