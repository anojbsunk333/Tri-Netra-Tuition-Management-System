import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { register } from "../../services/authService";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await register(name, email, password);

      if (response.success) {
        setSuccess("Account created successfully! Redirecting...");
        // Store user in context
        setUser(response.user);
        setToken(response.token);
        // Redirect after brief delay
        setTimeout(() => {
          navigate("/student/dashboard");
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

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Public registration is currently disabled. Please contact the
          administrator to create an account.
        </div>

        <div className="mt-6">
          <Link
            to="/login"
            className="block w-full rounded-2xl bg-primary-600 px-4 py-3 text-center font-semibold text-white hover:bg-primary-700 transition"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
