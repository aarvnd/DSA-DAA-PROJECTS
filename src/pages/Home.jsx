import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import topicsData from "../data/topics.json";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

const difficultyMap = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
};

export default function Home() {
  const { t, ct, lang } = useLanguage();

  const stats = [
    { value: "23", label: t("totalTopics") },
    { value: "1000+", label: t("totalProblems") },
    { value: "5", label: t("languages") },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            {t("heroTitle")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          {t("heroSubtitle")}
        </p>
        <Link
          to="/topics"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors text-lg"
        >
          {t("startLearning")}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-16">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700"
          >
            <div className="text-2xl md:text-4xl font-bold text-indigo-400 mb-1">
              {stat.value}
            </div>
            <div className="text-xs md:text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Topic Categories */}
      {topicsData.categories.map((category) => (
        <section key={category.id} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-white">
              {lang === "hi" ? category.titleHi : category.title}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {category.topics.length} topics
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.topics.map((topic) => (
              <Card
                key={topic.id}
                to={`/topics/${category.id}/${topic.id}`}
                icon={topic.icon}
                title={lang === "hi" ? topic.titleHi : topic.title}
                description={lang === "hi" ? topic.descriptionHi : topic.description}
                badge={
                  <Badge
                    type={difficultyMap[topic.difficulty] || "easy"}
                    label={topic.difficulty}
                  />
                }
              >
                {topic.realLifeExample && (
                  <p className="mt-2 text-xs text-slate-500 italic">
                    {ct(topic.realLifeExample).substring(0, 80)}...
                  </p>
                )}
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
