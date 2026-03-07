import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { DIFFICULTY_COLORS } from "../utils/constants";
import topicsData from "../data/topics.json";

export default function PracticeList() {
  const { category, topicId } = useParams();
  const { ct, t, lang } = useLanguage();
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const allTopics = topicsData.categories.flatMap((c) => c.topics);
  const topic = allTopics.find((tp) => tp.id === topicId);

  useEffect(() => {
    async function loadProblems() {
      try {
        const data = await import(`../data/${category}/${topicId}/problems.json`);
        setProblems((data.default || data).problems || []);
      } catch {
        setProblems([]);
      }
    }
    loadProblems();
  }, [category, topicId]);

  const filtered = problems.filter((p) => {
    const matchesDifficulty = filter === "all" || p.difficulty === filter;
    const matchesSearch =
      searchTerm === "" ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.titleHi && p.titleHi.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesDifficulty && matchesSearch;
  });

  const counts = {
    all: problems.length,
    easy: problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard: problems.filter((p) => p.difficulty === "hard").length,
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/topics/${category}/${topicId}`} className="text-indigo-400 hover:text-indigo-300 text-sm mb-2 block">
            &larr; Back to {topic?.title}
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {topic?.icon} {lang === "hi" ? topic?.titleHi : topic?.title} - {t("problems")}
          </h1>
          <p className="text-slate-400">{counts.all} problems available</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
          <div className="flex gap-2">
            {["all", "easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                onClick={() => setFilter(d)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === d
                    ? d === "all"
                      ? "bg-indigo-600 text-white"
                      : d === "easy"
                      ? "bg-green-600 text-white"
                      : d === "medium"
                      ? "bg-yellow-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)} ({counts[d]})
              </button>
            ))}
          </div>
        </div>

        {/* Problems List */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-400">No problems found. Try a different filter.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((problem, idx) => (
              <Link
                key={problem.id}
                to={`/problem/${category}/${topicId}/${problem.id}`}
                className="block bg-slate-800 hover:bg-slate-700 rounded-lg p-4 border border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-sm font-mono w-8">{idx + 1}.</span>
                    <div>
                      <h3 className="text-white font-medium">
                        {lang === "hi" ? problem.titleHi : problem.title}
                      </h3>
                      {problem.tags && (
                        <div className="flex gap-1 mt-1">
                          {problem.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-slate-500 bg-slate-700/50 px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                    {problem.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex gap-4">
          <Link
            to={`/learn/${category}/${topicId}`}
            className="text-indigo-400 hover:text-indigo-300 text-sm"
          >
            &larr; {t("lessons")}
          </Link>
        </div>
      </div>
    </div>
  );
}
