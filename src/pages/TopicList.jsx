import { useState } from "react";
import { useLanguage } from "../hooks/useLanguage";
import topicsData from "../data/topics.json";
import Card from "../components/common/Card";
import Badge from "../components/common/Badge";

const difficultyMap = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
};

export default function TopicList() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState("dsa");

  const activeCategory = topicsData.categories.find((c) => c.id === activeTab);

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-8">{t("topics")}</h1>

      {/* Tab Switching */}
      <div className="flex gap-2 mb-8">
        {topicsData.categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-colors text-sm ${
              activeTab === category.id
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
            }`}
          >
            {lang === "hi" ? category.titleHi : category.title}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {activeCategory && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory.topics.map((topic) => (
            <Card
              key={topic.id}
              to={`/topics/${activeCategory.id}/${topic.id}`}
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
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span>{topic.totalProblems} problems</span>
                <span>|</span>
                <span>{topic.subtopics.length} subtopics</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
