import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import CodeBlock from "../components/common/CodeBlock";
import topicsData from "../data/topics.json";

export default function LessonPage() {
  const { category, topicId } = useParams();
  const { ct, t } = useLanguage();
  const [notes, setNotes] = useState(null);
  const [activeSection, setActiveSection] = useState(0);

  const allTopics = topicsData.categories.flatMap((c) => c.topics);
  const topic = allTopics.find((tp) => tp.id === topicId);

  useEffect(() => {
    async function loadNotes() {
      try {
        const data = await import(`../data/${category}/${topicId}/notes.json`);
        setNotes(data.default || data);
      } catch {
        setNotes(null);
      }
    }
    loadNotes();
  }, [category, topicId]);

  if (!notes) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-white mb-2">Content Coming Soon!</h2>
          <p className="text-slate-400 mb-4">Notes for this topic are being prepared.</p>
          <Link to={`/topics/${category}/${topicId}`} className="text-indigo-400 hover:text-indigo-300">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const section = notes.sections[activeSection];

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Sidebar - Section Navigation */}
        <div className="w-64 bg-slate-800 min-h-screen p-4 border-r border-slate-700 hidden md:block">
          <Link to={`/topics/${category}/${topicId}`} className="text-indigo-400 hover:text-indigo-300 text-sm mb-4 block">
            &larr; Back to {topic?.title}
          </Link>
          <h3 className="text-lg font-bold text-white mb-4">{ct(notes.title)}</h3>
          <nav className="space-y-1">
            {notes.sections.map((sec, idx) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(idx)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  activeSection === idx
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {ct(sec.title)}
              </button>
            ))}
          </nav>
          <div className="mt-6 pt-4 border-t border-slate-700">
            <Link
              to={`/practice/${category}/${topicId}`}
              className="block w-full text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
            >
              {t("problems")} &rarr;
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8 max-w-4xl">
          {/* Mobile section nav */}
          <div className="md:hidden mb-4">
            <Link to={`/topics/${category}/${topicId}`} className="text-indigo-400 hover:text-indigo-300 text-sm mb-2 block">
              &larr; Back
            </Link>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(Number(e.target.value))}
              className="w-full bg-slate-800 text-white border border-slate-700 rounded px-3 py-2"
            >
              {notes.sections.map((sec, idx) => (
                <option key={sec.id} value={idx}>{ct(sec.title)}</option>
              ))}
            </select>
          </div>

          {/* Introduction (only on first section) */}
          {activeSection === 0 && (
            <div className="mb-8 animate-fade-in">
              <h1 className="text-3xl font-bold text-white mb-4">{ct(notes.title)}</h1>
              <div className="bg-slate-800 rounded-lg p-6 mb-4 border border-slate-700">
                <p className="text-slate-300 leading-relaxed">{ct(notes.introduction)}</p>
              </div>
              <div className="bg-indigo-900/30 rounded-lg p-6 border border-indigo-800/50">
                <h3 className="text-lg font-semibold text-indigo-300 mb-2">{t("realLifeExample")} 💡</h3>
                <p className="text-slate-300 leading-relaxed">{ct(notes.realLifeAnalogy)}</p>
              </div>
            </div>
          )}

          {/* Section Content */}
          <div className="animate-fade-in" key={section.id}>
            <h2 className="text-2xl font-bold text-white mb-4">{ct(section.title)}</h2>

            {/* Content */}
            <div className="prose prose-invert max-w-none mb-6">
              {ct(section.content).split("\n").map((line, i) => {
                if (line.startsWith("**") && line.endsWith("**")) {
                  return <h3 key={i} className="text-lg font-semibold text-white mt-4 mb-2">{line.replace(/\*\*/g, "")}</h3>;
                }
                if (line.startsWith("- **")) {
                  const parts = line.replace(/^- \*\*/, "").split("**");
                  return (
                    <div key={i} className="flex gap-2 ml-4 mb-1">
                      <span className="text-indigo-400">•</span>
                      <span className="text-slate-300">
                        <strong className="text-white">{parts[0]}</strong>
                        {parts[1]}
                      </span>
                    </div>
                  );
                }
                if (line.match(/^\d+\./)) {
                  const parts = line.replace(/^\d+\.\s*\*\*/, "").split("**");
                  return (
                    <div key={i} className="flex gap-2 ml-4 mb-1">
                      <span className="text-slate-300">
                        <strong className="text-white">{parts[0]}</strong>
                        {parts[1] || ""}
                      </span>
                    </div>
                  );
                }
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="text-slate-300 mb-2">{line}</p>;
              })}
            </div>

            {/* Code Examples */}
            {section.codeExamples && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t("codeExample")} 💻</h3>
                <CodeBlock codeExamples={section.codeExamples} />
              </div>
            )}

            {/* Key Points */}
            {section.keyPoints && (
              <div className="bg-amber-900/20 rounded-lg p-5 border border-amber-800/30 mb-6">
                <h3 className="text-lg font-semibold text-amber-300 mb-3">{t("keyPoints")} ⭐</h3>
                <ul className="space-y-2">
                  {section.keyPoints.map((kp, i) => (
                    <li key={i} className="flex gap-2 text-slate-300">
                      <span className="text-amber-400">✓</span>
                      {ct(kp)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time Complexity */}
            {section.timeComplexity && (
              <div className="bg-slate-800 rounded-lg p-5 border border-slate-700 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">{t("timeComplexity")} ⏱️</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(section.timeComplexity).map(([op, tc]) => (
                    <div key={op} className="bg-slate-700/50 rounded p-3 text-center">
                      <div className="text-xs text-slate-400 capitalize mb-1">{op}</div>
                      <div className="text-lg font-mono font-bold text-indigo-400">{tc}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-4 border-t border-slate-700">
              <button
                onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
                disabled={activeSection === 0}
                className={`px-4 py-2 rounded text-sm ${
                  activeSection === 0
                    ? "text-slate-600 cursor-not-allowed"
                    : "text-indigo-400 hover:bg-slate-800"
                }`}
              >
                &larr; {t("prev")}
              </button>
              {activeSection < notes.sections.length - 1 ? (
                <button
                  onClick={() => setActiveSection(activeSection + 1)}
                  className="px-4 py-2 rounded text-sm bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {t("next")} &rarr;
                </button>
              ) : (
                <Link
                  to={`/practice/${category}/${topicId}`}
                  className="px-4 py-2 rounded text-sm bg-green-600 hover:bg-green-700 text-white"
                >
                  {t("problems")} &rarr;
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
