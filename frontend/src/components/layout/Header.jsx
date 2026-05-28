import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b-2 border-primary-600 p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="TRI·NETRA Logo" className="h-12 w-auto" />
          <span className="font-black text-xl text-primary-900 hidden sm:inline">
            TRI·NETRA
          </span>
        </Link>
        <nav className="space-x-4 text-sm text-gray-700">
          <a href="#">Home</a>
          <a href="#courses">Courses</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
