import { Link } from "react-router-dom";

export default function Card({ title, description, icon, badge, onClick, to, children }) {
  const content = (
    <div
      className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 transition-all duration-300 cursor-pointer border border-slate-700 hover:border-slate-600 hover:shadow-lg hover:shadow-indigo-500/5"
      onClick={!to ? onClick : undefined}
    >
      <div className="flex items-start gap-4">
        {icon && <span className="text-3xl flex-shrink-0">{icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white truncate">{title}</h3>
            {badge && <span className="flex-shrink-0">{badge}</span>}
          </div>
          {description && (
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{content}</Link>;
  }

  return content;
}
