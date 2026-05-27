import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HomePublic() {
  const { user, setUser } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold">TRI·NETRA</h1>
            <p className="text-slate-600 mt-2">
              Tuition center dashboard and role-based portal.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="px-4 py-2 rounded bg-slate-800 text-white"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="px-4 py-2 rounded border border-slate-300 text-slate-700"
              to="/about"
            >
              About
            </Link>
          </div>
        </header>

        {user ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold">
              Welcome back, {user.name}!
            </h2>
            <p className="mt-2 text-slate-600">
              You are signed in as <strong>{user.role}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="px-4 py-2 rounded bg-slate-800 text-white"
                to={`/${user.role}/dashboard`}
              >
                Go to dashboard
              </Link>
              <button
                className="px-4 py-2 rounded border border-slate-300 text-slate-700"
                onClick={() => setUser(null)}
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-semibold">Get started</h2>
            <p className="mt-2 text-slate-600">
              Choose a role and log in to explore admin, teacher, or student
              pages.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Admin", path: "/login" },
                { label: "Teacher", path: "/login" },
                { label: "Student", path: "/login" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center hover:bg-slate-100"
                >
                  <span className="font-semibold">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
