import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
        <Link to="/" className="text-xl font-bold text-primary-700">
          TRI·NETRA
        </Link>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <Link to="/about" className="hover:text-primary-700">
            About
          </Link>
          <Link to="/login" className="hover:text-primary-700">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
