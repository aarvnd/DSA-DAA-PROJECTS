import { DIFFICULTY_COLORS } from "../../utils/constants";

export default function Badge({ type = "easy", label }) {
  const colorClasses = DIFFICULTY_COLORS[type] || DIFFICULTY_COLORS.easy;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses}`}
    >
      {label || type}
    </span>
  );
}
