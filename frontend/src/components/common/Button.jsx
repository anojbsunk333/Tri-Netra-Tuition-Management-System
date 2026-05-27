import React from "react";
export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-red-600 text-white rounded"
    >
      {children}
    </button>
  );
}
