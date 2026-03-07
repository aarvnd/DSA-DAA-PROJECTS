import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import CodeEditor from "../components/editor/CodeEditor";
import OutputPanel from "../components/editor/OutputPanel";
import CompilerToolbar from "../components/editor/CompilerToolbar";
import { executeCode } from "../services/judge0";

const DEFAULT_CODE = {
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  python: 'print("Hello, World!")',
  javascript: 'console.log("Hello, World!");',
};

export default function Playground() {
  const { t } = useLanguage();
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(DEFAULT_CODE.cpp);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] || "");
    setOutput("");
    setError("");
    setStatus(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    try {
      const result = await executeCode(code, language, input);
      setOutput(result.stdout || "");
      setError(result.stderr || result.compile_output || "");
      setStatus(result.status);
    } catch (err) {
      setError(err.message);
      setStatus({ id: 0, description: "Error" });
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    setCode(DEFAULT_CODE[language] || "");
    setOutput("");
    setError("");
    setStatus(null);
    setInput("");
  };

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-slate-400 hover:text-white text-sm">&larr; Home</Link>
          <h1 className="text-xl font-bold text-white">{t("playground")} 🎮</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowInput(!showInput)}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              showInput ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            {t("input")} {showInput ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Input Panel */}
        {showInput && (
          <div className="bg-slate-800 border-b border-slate-700 p-3">
            <label className="text-xs text-slate-400 mb-1 block">{t("input")} (stdin):</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded p-2 text-sm font-mono resize-none"
              rows={3}
              placeholder="Enter input here..."
            />
          </div>
        )}

        {/* Code Editor */}
        <div className="flex-1">
          <CodeEditor
            code={code}
            language={language}
            onChange={(val) => setCode(val || "")}
            onLanguageChange={handleLanguageChange}
            height="100%"
          />
        </div>

        {/* Toolbar & Output */}
        <CompilerToolbar onRun={handleRun} onReset={handleReset} isRunning={isRunning} />
        <OutputPanel output={output} error={error} isRunning={isRunning} status={status} />
      </div>
    </div>
  );
}
