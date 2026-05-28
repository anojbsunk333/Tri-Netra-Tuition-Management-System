import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto rounded-3xl bg-white p-8 shadow-lg border-2 border-primary-200">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
          <h1 className="text-3xl font-bold text-primary-900">
            About TRI·NETRA
          </h1>
        </div>
        <p className="text-gray-600 leading-7">
          TRI·NETRA is a tuition center project scaffolded with role-based pages
          for admins, teachers, and students.
        </p>
        <div className="mt-6 space-x-3">
          <Link
            className="rounded-2xl bg-primary-600 text-white px-4 py-3 hover:bg-primary-700 transition inline-block"
            to="/"
          >
            Home
          </Link>
          <Link
            className="rounded-2xl border-2 border-primary-300 text-primary-600 px-4 py-3 hover:bg-primary-50 transition inline-block"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
