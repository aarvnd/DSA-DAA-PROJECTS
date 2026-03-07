import { useParams, Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import topicsData from "../data/topics.json";
import Badge from "../components/common/Badge";

const difficultyMap = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
};

export default function TopicDetail() {
  const { category, topicId } = useParams();
  const { t, ct, lang } = useLanguage();

  const categoryData = topicsData.categories.find((c) => c.id === category);
  const topic = categoryData?.topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4">Topic Not Found</h2>
        <Link to="/topics" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          Back to Topics
        </Link>
      </div>
    );
  }

  const title = lang === "hi" ? topic.titleHi : topic.title;
  const description = lang === "hi" ? topic.descriptionHi : topic.description;

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to="/topics" className="hover:text-white transition-colors">
          {t("topics")}
        </Link>
        <span>/</span>
        <span className="text-slate-300">
          {lang === "hi" ? categoryData.titleHi : categoryData.title}
        </span>
        <span>/</span>
        <span className="text-white">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left side: Topic Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{topic.icon}</span>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-white">{title}</h1>
                  <Badge
                    type={difficultyMap[topic.difficulty] || "easy"}
                    label={topic.difficulty}
                  />
                </div>
                <p className="text-slate-400 leading-relaxed">{description}</p>
              </div>
            </div>
          </div>

          {/* Real-life Example */}
          {topic.realLifeExample && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <span>💡</span> {t("realLifeExample")}
              </h3>
              <p className="text-slate-300 leading-relaxed bg-slate-900 rounded-lg p-4 border border-slate-700">
                {ct(topic.realLifeExample)}
              </p>
            </div>
          )}

          {/* Subtopics */}
          {topic.subtopics && topic.subtopics.length > 0 && (
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Subtopics ({topic.subtopics.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.subtopics.map((sub, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-slate-900 rounded-lg p-3 border border-slate-700"
                  >
                    <span className="text-indigo-400 font-mono text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-slate-300 text-sm">{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right side: Action Buttons */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 space-y-4">
            <div className="text-center mb-2">
              <div className="text-3xl font-bold text-indigo-400">{topic.totalProblems}</div>
              <div className="text-sm text-slate-400">{t("totalProblems")}</div>
            </div>

            <Link
              to={`/learn/${category}/${topicId}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {t("startLearning")}
            </Link>

            <Link
              to={`/practice/${category}/${topicId}`}
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors border border-slate-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              {t("problems")}
            </Link>
          </div>

          {/* Quick Info */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Quick Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">{t("difficulty")}</span>
                <Badge
                  type={difficultyMap[topic.difficulty] || "easy"}
                  label={topic.difficulty}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subtopics</span>
                <span className="text-white">{topic.subtopics?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Problems</span>
                <span className="text-white">{topic.totalProblems}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
