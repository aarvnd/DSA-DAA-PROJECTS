import { useLanguage } from "../hooks/useLanguage";

const features = [
  {
    icon: "📚",
    title: "Comprehensive Content",
    description: "23+ topics covering both DSA and DAA with detailed explanations and real-life examples",
  },
  {
    icon: "🌐",
    title: "Bilingual Support",
    description: "Learn in English or Hindi (Hinglish) - switch anytime with one click",
  },
  {
    icon: "💻",
    title: "Multi-Language Code",
    description: "Code examples in C, C++, Java, Python, and JavaScript",
  },
  {
    icon: "🧪",
    title: "1000+ Practice Problems",
    description: "From beginner to advanced, with test cases and solutions",
  },
  {
    icon: "🎮",
    title: "Interactive Playground",
    description: "Write, run, and test code directly in the browser",
  },
  {
    icon: "🎯",
    title: "Real-Life Examples",
    description: "Every concept explained with relatable real-world analogies",
  },
];

const techStack = [
  "React 19",
  "React Router DOM v7",
  "Tailwind CSS v4",
  "Vite",
  "React Syntax Highlighter",
  "Judge0 API (Code Execution)",
];

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          {t("about")} - DSA & DAA Seekho
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed">
          A comprehensive learning platform for Data Structures, Algorithms, and Design & Analysis of Algorithms.
          Built for students who want to master these concepts from scratch.
        </p>
      </div>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-slate-800 rounded-xl p-5 border border-slate-700 flex items-start gap-4"
            >
              <span className="text-2xl flex-shrink-0">{feature.icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Tech Stack</h2>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex flex-wrap gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-slate-900 rounded-lg text-sm text-slate-300 border border-slate-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Credits */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Credits</h2>
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-300 leading-relaxed">
            This platform is an open-source project built to help students learn DSA and DAA
            in an interactive and accessible way. Special thanks to the open-source community
            and all the contributors who make projects like this possible.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
            Built with care for students everywhere.
          </div>
        </div>
      </section>
    </div>
  );
}
