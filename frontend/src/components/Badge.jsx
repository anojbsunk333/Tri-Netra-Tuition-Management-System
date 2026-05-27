import React from 'react';

export default function Badge({ status }) {
  const styles = {
    paid: "bg-green-100 text-green-700 border border-green-200",
    due: "bg-red-100 text-red-700 border border-red-200",
    partial: "bg-amber-100 text-amber-700 border border-amber-200",
    present: "bg-green-100 text-green-700 border border-green-200",
    absent: "bg-red-100 text-red-700 border border-red-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${styles[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
