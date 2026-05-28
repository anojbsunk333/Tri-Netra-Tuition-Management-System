import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../api/api";

export default function AdminDashboard() {
  const { user, setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(email, password);

      if (response.success && response.user.role === "admin") {
        setUser(response.user);
        setEmail("");
        setPassword("");
        setShowLoginForm(false);
      } else {
        setError(
          response.message || "Only admin users can access this dashboard",
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {user && user.role === "admin" ? (
          <div className="rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold text-primary-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">Welcome back, {user.name}!</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Logged in as</p>
                  <p className="font-semibold text-primary-900">{user.email}</p>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="rounded-2xl bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">0</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 border border-green-200">
                <p className="text-gray-600 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold text-green-900 mt-2">0</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 border border-purple-200">
                <p className="text-gray-600 text-sm">Total Batches</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">0</p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 border border-orange-200">
                <p className="text-gray-600 text-sm">Total Fees</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">0</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto rounded-2xl bg-white p-8 shadow-lg border-2 border-primary-200">
            <div className="flex justify-center mb-6">
              <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
            </div>
            <h1 className="text-3xl font-bold text-primary-900 text-center">
              Admin Login
            </h1>
            <p className="mt-2 text-gray-600 text-center">
              Enter your credentials to access the admin dashboard.
            </p>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="mt-6 space-y-5" onSubmit={handleLogin}>
              <label className="block">
                <span className="text-sm font-semibold text-gray-700">
                  Email
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-gray-700">
                  Password
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
