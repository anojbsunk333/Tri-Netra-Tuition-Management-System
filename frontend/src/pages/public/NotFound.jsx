import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-lg border border-slate-200 text-center">
        <h1 className="text-5xl font-bold">404</h1>
        <p className="mt-4 text-slate-600">
          The page you are looking for does not exist.
        </p>
        <Link
          className="mt-6 inline-block rounded-2xl bg-slate-900 px-6 py-3 text-white"
          to="/"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
