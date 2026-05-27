import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl rounded-3xl bg-white p-8 shadow-lg border border-slate-200">
        <h1 className="text-3xl font-bold">About TRI·NETRA</h1>
        <p className="mt-4 text-slate-600 leading-7">
          TRI·NETRA is a tuition center project scaffolded with role-based pages
          for admins, teachers, and students.
        </p>
        <div className="mt-6 space-x-3">
          <Link
            className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
            to="/"
          >
            Home
          </Link>
          <Link
            className="rounded-2xl border border-slate-300 px-4 py-3 text-slate-700"
            to="/login"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
