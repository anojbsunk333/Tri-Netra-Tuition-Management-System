import React from "react";

export default function Header() {
  return (
    <header className="bg-white border-b p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="font-black text-lg">TRI·NETRA</div>
        <nav className="space-x-4 text-sm text-gray-700">
          <a href="#">Home</a>
          <a href="#courses">Courses</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
