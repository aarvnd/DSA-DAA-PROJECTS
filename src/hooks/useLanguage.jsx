import { createContext, useContext, useState } from "react";
import labels from "../utils/labels";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("dsa-lang") || "hi";
  });

  const toggleLang = () => {
    const newLang = lang === "en" ? "hi" : "en";
    setLang(newLang);
    localStorage.setItem("dsa-lang", newLang);
  };

  const t = (key) => labels[lang]?.[key] || labels.en[key] || key;
  const ct = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[lang] || obj.en || "";
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, ct }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
