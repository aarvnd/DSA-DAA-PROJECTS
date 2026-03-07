import { useState } from "react";
import Editor from "@monaco-editor/react";
import { LANGUAGE_MONACO, LANGUAGE_NAMES } from "../../utils/constants";

export default function CodeEditor({
  code,
  language = "cpp",
  onChange,
  onLanguageChange,
  readOnly = false,
  height = "400px",
}) {
  const languages = Object.keys(LANGUAGE_NAMES);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-1 bg-slate-800 px-3 py-2 border-b border-slate-700">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange?.(lang)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              language === lang
                ? "bg-indigo-600 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {LANGUAGE_NAMES[lang]}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <Editor
          height={height}
          language={LANGUAGE_MONACO[language] || "plaintext"}
          value={code}
          onChange={onChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            readOnly,
            padding: { top: 10 },
          }}
        />
      </div>
    </div>
  );
}
