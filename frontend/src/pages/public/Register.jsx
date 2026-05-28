import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { registerUser } from "../../api/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await registerUser(name, email, password, role);

      if (response.success) {
        setSuccess("Account created successfully! Redirecting...");
        // Store user in context
        setUser(response.user);
        // Redirect after brief delay
        setTimeout(() => {
          navigate(`/${role}/dashboard`);
        }, 1000);
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during registration";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border-2 border-primary-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-primary-900 text-center">
          Create Account
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Fill details to create your account.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {success}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-gray-700">
              Full name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
              minLength={6}
              className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-gray-700">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
              className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link
            className="text-primary-600 font-semibold hover:text-primary-700"
            to="/login"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
