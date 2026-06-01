import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function HomePublic() {
  const { user, setUser } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
            <div>
              <h1 className="text-3xl font-bold text-primary-900">TRI·NETRA</h1>
              <p className="mt-1 text-gray-600">
                Tuition center dashboard and role-based portal.
              </p>
            </div>
          </div>
        </header>

        {user ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary-200">
            <h2 className="text-2xl font-semibold text-primary-900">
              Welcome back, {user.name}!
            </h2>
            <p className="mt-2 text-gray-600">
              You are signed in as{" "}
              <strong className="text-primary-600">{user.role}</strong>.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                className="px-4 py-2 rounded bg-primary-600 text-white hover:bg-primary-700 transition"
                to={`/${user.role}/dashboard`}
              >
                Go to dashboard
              </Link>
              <button
                className="px-4 py-2 rounded border border-primary-300 text-primary-600 hover:bg-primary-50 transition"
                onClick={() => setUser(null)}
              >
                Log out
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm border border-primary-200">
            <h2 className="text-2xl font-semibold text-primary-900">
              Get started
            </h2>
            <p className="mt-2 text-gray-600">
              Choose a role and log in to explore admin, teacher, or student
              pages.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Admin", path: "/login/admin" },
                { label: "Teacher", path: "/login/teacher" },
                { label: "Student", path: "/login/student" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block rounded-xl border-2 border-primary-200 bg-primary-50 px-4 py-5 text-center font-semibold text-primary-900 hover:bg-primary-100 hover:border-primary-300 transition"
                >
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
