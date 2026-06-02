import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/authService";

const validRoles = ["admin", "teacher", "student"];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const { role: routeRole } = useParams();
  const role = validRoles.includes(routeRole) ? routeRole : null;

  useEffect(() => {
    if (routeRole && !role) {
      navigate("/login", { replace: true });
    }
  }, [routeRole, role, navigate]);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!role) return;

    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);

      if (response.success) {
        // Check if user's role matches the selected role
        if (response.user.role !== role) {
          setError(
            `Your role is ${response.user.role}, but you're trying to access ${role} portal`,
          );
          setLoading(false);
          return;
        }

        setUser(response.user);
        setToken(response.token);
        navigate(`/${role}/dashboard`);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "An error occurred during login";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border-2 border-primary-200">
          <div className="flex justify-center mb-6">
            <img src="/logo.png" alt="TRI·NETRA" className="h-20 w-auto" />
          </div>
          <h1 className="text-3xl font-bold text-primary-900 text-center">
            Choose your login
          </h1>
          <p className="mt-2 text-gray-600 text-center">
            Select the portal you want to sign in to.
          </p>
          <div className="mt-6 grid gap-4">
            {validRoles.map((item) => (
              <Link
                key={item}
                to={`/login/${item}`}
                className="block rounded-2xl border-2 border-primary-200 bg-primary-50 px-4 py-5 text-center font-semibold text-primary-900 hover:bg-primary-100 hover:border-primary-400 transition"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)} Login
              </Link>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link
              className="text-primary-600 font-semibold hover:text-primary-700"
              to="/register"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const title = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-lg border-2 border-primary-200">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="TRI·NETRA" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-primary-900 text-center">
          {title}
        </h1>
        <p className="mt-2 text-gray-600 text-center">
          Enter your details to access the {role} portal.
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
              className="mt-2 w-full rounded-2xl border-2 border-primary-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-white font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Continue"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <Link
            className="text-primary-600 font-semibold hover:text-primary-700"
            to="/register"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
