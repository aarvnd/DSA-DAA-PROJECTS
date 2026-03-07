import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { DIFFICULTY_COLORS } from "../utils/constants";
import CodeEditor from "../components/editor/CodeEditor";
import OutputPanel from "../components/editor/OutputPanel";
import CompilerToolbar from "../components/editor/CompilerToolbar";
import { executeCode, runTestCases } from "../services/judge0";

export default function ProblemPage() {
  const { category, topicId, problemId } = useParams();
  const { ct, t, lang } = useLanguage();
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    async function loadProblem() {
      try {
        const data = await import(`../data/${category}/${topicId}/problems.json`);
        const probs = (data.default || data).problems || [];
        const found = probs.find((p) => p.id === problemId);
        setProblem(found || null);
        if (found?.starterCode) {
          setCode(found.starterCode[language] || "");
        }
      } catch {
        setProblem(null);
      }
    }
    loadProblem();
  }, [category, topicId, problemId]);

  useEffect(() => {
    if (problem?.starterCode) {
      setCode(problem.starterCode[language] || "// Write your code here");
    }
  }, [language, problem]);

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");
    setError("");
    setTestResults(null);

    try {
      if (problem?.testCases?.length) {
        const sampleTests = problem.testCases.slice(0, 2);
        const results = await runTestCases(code, language, sampleTests);
        setTestResults(results);
        const allPassed = results.every((r) => r.passed);
        setStatus({
          id: allPassed ? 3 : 11,
          description: allPassed ? "Sample Tests Passed!" : "Some Tests Failed",
        });
        if (results[0]) {
          setOutput(results[0].actualOutput || "");
          setError(results[0].error || "");
        }
      } else {
        const result = await executeCode(code, language, "");
        setOutput(result.stdout || "");
        setError(result.stderr || result.compile_output || "");
        setStatus(result.status);
      }
    } catch (err) {
      setError(err.message);
      setStatus({ id: 0, description: "Error" });
    }
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    if (!problem?.testCases) return;
    setIsRunning(true);
    setOutput("");
    setError("");

    try {
      const results = await runTestCases(code, language, problem.testCases);
      setTestResults(results);
      const allPassed = results.every((r) => r.passed);
      setStatus({
        id: allPassed ? 3 : 11,
        description: allPassed ? "All Tests Passed! 🎉" : `${results.filter((r) => r.passed).length}/${results.length} Tests Passed`,
      });
      setActiveTab("testcases");
    } catch (err) {
      setError(err.message);
    }
    setIsRunning(false);
  };

  const handleReset = () => {
    if (problem?.starterCode) {
      setCode(problem.starterCode[language] || "");
    }
    setOutput("");
    setError("");
    setTestResults(null);
    setStatus(null);
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Problem Not Found</h2>
          <Link to={`/practice/${category}/${topicId}`} className="text-indigo-400 hover:text-indigo-300">
            Go Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-900 flex flex-col">
      {/* Top Bar */}
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-3">
          <Link to={`/practice/${category}/${topicId}`} className="text-slate-400 hover:text-white text-sm">
            &larr; Back
          </Link>
          <h1 className="text-white font-medium">{lang === "hi" ? problem.titleHi : problem.title}</h1>
          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${DIFFICULTY_COLORS[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSubmit}
            disabled={isRunning}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded font-medium transition-colors"
          >
            {t("submit")}
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="w-1/2 overflow-y-auto border-r border-slate-700">
          {/* Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-800">
            {["description", "testcases"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "text-white border-b-2 border-indigo-500"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab === "description" ? "Description" : t("testCases")}
              </button>
            ))}
          </div>

          <div className="p-5">
            {activeTab === "description" ? (
              <div className="animate-fade-in">
                {/* Description */}
                <p className="text-slate-300 mb-4 leading-relaxed">{ct(problem.description)}</p>

                {/* Examples */}
                {problem.examples?.map((ex, i) => (
                  <div key={i} className="bg-slate-800 rounded-lg p-4 mb-4 border border-slate-700">
                    <h4 className="text-sm font-semibold text-white mb-2">Example {i + 1}:</h4>
                    <div className="space-y-1 text-sm font-mono">
                      <div><span className="text-slate-400">Input: </span><span className="text-green-300">{ex.input}</span></div>
                      <div><span className="text-slate-400">Output: </span><span className="text-green-300">{ex.output}</span></div>
                      {ex.explanation && (
                        <div className="text-slate-400 mt-1">
                          <span className="font-sans">💡 </span>{ct(ex.explanation)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white mb-2">Constraints:</h4>
                    <ul className="space-y-1">
                      {problem.constraints.map((c, i) => (
                        <li key={i} className="text-sm text-slate-400 font-mono">• {c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hints */}
                {problem.hints && (
                  <div className="mb-4">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="text-sm text-amber-400 hover:text-amber-300"
                    >
                      {showHint ? "Hide Hints ▲" : `${t("hint")} ▼`}
                    </button>
                    {showHint && (
                      <div className="mt-2 bg-amber-900/20 border border-amber-800/30 rounded-lg p-3">
                        {problem.hints.map((h, i) => (
                          <p key={i} className="text-sm text-amber-200 mb-1">💡 {ct(h)}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Solution */}
                {problem.solution && (
                  <div>
                    <button
                      onClick={() => setShowSolution(!showSolution)}
                      className="text-sm text-green-400 hover:text-green-300"
                    >
                      {showSolution ? "Hide Solution ▲" : `${t("solution")} ▼`}
                    </button>
                    {showSolution && (
                      <div className="mt-2 bg-green-900/20 border border-green-800/30 rounded-lg p-4">
                        <p className="text-sm text-green-200 mb-3">{ct(problem.solution.approach)}</p>
                        {problem.solution.code && (
                          <pre className="bg-slate-900 rounded p-3 text-sm text-green-300 overflow-x-auto">
                            {problem.solution.code[language] || problem.solution.code.cpp || Object.values(problem.solution.code)[0]}
                          </pre>
                        )}
                        <div className="flex gap-4 mt-2 text-xs text-slate-400">
                          <span>Time: {problem.solution.timeComplexity}</span>
                          <span>Space: {problem.solution.spaceComplexity}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Test Cases Tab */
              <div className="animate-fade-in">
                {testResults ? (
                  <div className="space-y-3">
                    {testResults.map((tr, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-4 border ${
                          tr.passed ? "bg-green-900/20 border-green-800/30" : "bg-red-900/20 border-red-800/30"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className={tr.passed ? "text-green-400" : "text-red-400"}>
                            {tr.passed ? "✓" : "✗"}
                          </span>
                          <span className="text-sm font-medium text-white">Test Case {i + 1}</span>
                          <span className={`text-xs ${tr.passed ? "text-green-400" : "text-red-400"}`}>
                            {tr.passed ? t("passed") : t("failed")}
                          </span>
                        </div>
                        <div className="space-y-1 text-sm font-mono">
                          <div><span className="text-slate-400">Input: </span><span className="text-slate-300">{tr.input}</span></div>
                          <div><span className="text-slate-400">Expected: </span><span className="text-green-300">{tr.expectedOutput}</span></div>
                          <div><span className="text-slate-400">Got: </span><span className={tr.passed ? "text-green-300" : "text-red-300"}>{tr.actualOutput || "(empty)"}</span></div>
                          {tr.error && <div className="text-red-400 mt-1">{tr.error}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-400">Run your code to see test case results</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1">
            <CodeEditor
              code={code}
              language={language}
              onChange={(val) => setCode(val || "")}
              onLanguageChange={setLanguage}
              height="100%"
            />
          </div>
          <CompilerToolbar onRun={handleRun} onReset={handleReset} isRunning={isRunning} />
          <OutputPanel output={output} error={error} isRunning={isRunning} status={status} />
        </div>
      </div>
    </div>
  );
}
