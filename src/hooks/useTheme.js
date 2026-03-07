import { useState } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("dsa-theme") !== "light";
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("dsa-theme", newTheme ? "dark" : "light");
  };

  return { isDark, toggleTheme };
}
