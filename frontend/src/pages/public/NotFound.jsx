import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl rounded-3xl bg-white p-10 shadow-lg border-2 border-primary-200 text-center">
        <div className="flex justify-center mb-4">
          <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
        </div>
        <h1 className="text-5xl font-bold text-primary-900">404</h1>
        <p className="mt-4 text-gray-600">
          The page you are looking for does not exist.
        </p>
        <Link
          className="mt-6 inline-block rounded-2xl bg-primary-600 text-white px-6 py-3 hover:bg-primary-700 transition"
          to="/"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
