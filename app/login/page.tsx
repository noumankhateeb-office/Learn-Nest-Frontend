"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { loginUser } from "../../services/auth.service";

// Login Validation Schema
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    // Zod Validation
    const validation = loginSchema.safeParse({
      email,
      password,
    });

    if (!validation.success) {
      setMessage(validation.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      // Login API
      const data = await loginUser({
        email: validation.data.email,
        password: validation.data.password,
      });

      // Save JWT token
      localStorage.setItem("token", data.data.token);

      // Redirect to tasks page
      router.replace("/tasks");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo / Heading */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
            <span className="text-2xl font-bold text-white">
              T
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Login to manage your tasks
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <div className="mt-5 flex items-center justify-between rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <span>{message}</span>

              <button
                onClick={() => setMessage("")}
                className="ml-4 text-lg font-bold hover:text-white"
                aria-label="Close message"
              >
                ×
              </button>
            </div>
          )}

        </div>

        {/* Register Link */}
        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{" "}

          <button
            onClick={() => router.replace("/register")}
            className="font-medium text-blue-400 transition hover:text-blue-300"
          >
            Register
          </button>
        </p>

        <p className="mt-3 text-center text-xs text-slate-600">
          Task Management System
        </p>

      </div>
    </main>
  );
}
