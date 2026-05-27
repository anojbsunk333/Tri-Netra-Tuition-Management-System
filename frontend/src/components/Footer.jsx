import React from "react";

export default function Footer() {
  return (
    <footer className="border-t p-4 mt-8 bg-white">
      <div className="max-w-6xl mx-auto text-sm text-gray-500">
        © {new Date().getFullYear()} TRI·NETRA
      </div>
    </footer>
  );
}
