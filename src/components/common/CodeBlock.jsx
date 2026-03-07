import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const LANGUAGE_TABS = [
  { key: "c", label: "C" },
  { key: "cpp", label: "C++" },
  { key: "java", label: "Java" },
  { key: "python", label: "Python" },
  { key: "javascript", label: "JS" },
];

const LANGUAGE_SYNTAX = {
  c: "c",
  cpp: "cpp",
  java: "java",
  python: "python",
  javascript: "javascript",
};

export default function CodeBlock({ codeExamples = {}, defaultLanguage = "cpp" }) {
  const availableLanguages = LANGUAGE_TABS.filter((lang) => codeExamples[lang.key]);
  const [activeLanguage, setActiveLanguage] = useState(
    codeExamples[defaultLanguage] ? defaultLanguage : availableLanguages[0]?.key || "cpp"
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const code = codeExamples[activeLanguage] || "";
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (availableLanguages.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 text-slate-400 text-sm">
        No code examples available.
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      {/* Language tabs and copy button */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-700">
        <div className="flex gap-1">
          {availableLanguages.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setActiveLanguage(lang.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeLanguage === lang.key
                  ? "bg-indigo-500/20 text-indigo-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code display */}
      <SyntaxHighlighter
        language={LANGUAGE_SYNTAX[activeLanguage] || "text"}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: "1.25rem",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.7",
        }}
        showLineNumbers
        lineNumberStyle={{ color: "#475569", minWidth: "2.5em" }}
      >
        {codeExamples[activeLanguage] || ""}
      </SyntaxHighlighter>
    </div>
  );
}
