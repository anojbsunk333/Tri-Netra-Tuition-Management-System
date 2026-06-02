import React from "react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  className = "",
}) {
  return (
    <div
      className={`rounded-3xl border border-gray-200 bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-10 w-10 text-primary-600" />}
        <div>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
          {sub && <p className="text-xs text-gray-400">{sub}</p>}
        </div>
      </div>
    </div>
  );
}
