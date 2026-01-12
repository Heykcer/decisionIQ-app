// src/AuthPage.jsx
import React, { useState } from "react"
import {
  ArrowLeft,
  Moon,
  Sun,
  Mail,
  Lock,
  Settings,
  Brain,
} from "lucide-react"

export default function AuthPage({
  darkMode,
  setDarkMode,
  goToDashboard,
  goBack,
  onLogin,
  onRegister,
}) {
  const [mode, setMode] = useState("signin") // "signin" | "signup"
  const [name, setName] = useState("")
  const [username, setUsername] = useState("") // used for login + register
  const [email, setEmail] = useState("") // only for signup
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  if (loading) return
  setLoading(true)

  try {
    if (mode === "signin") {
      await onLogin(username, password)
    } else {
      await onRegister(username, email, password)
    }
    // IMPORTANT: do NOT call goToDashboard here.
    // App.jsx's login/register will change page only on success.
  } catch (err) {
    console.error("Auth error", err)
  } finally {
    setLoading(false)
  }
}


  const toggleMode = (newMode) => {
    setMode(newMode)
    setPassword("")
  }

  const bgGradient = darkMode
    ? "from-slate-950 via-slate-900 to-slate-950"
    : "from-[#FFF8EE] via-[#FFF4E6] to-[#FFF5E7]"

  const cardBg = darkMode ? "bg-slate-900" : "bg-white"
  const textPrimary = darkMode ? "text-slate-50" : "text-gray-900"
  const textSecondary = darkMode ? "text-slate-300" : "text-gray-500"

  return (
    <div
      className={`min-h-screen flex flex-col ${
        darkMode ? "bg-slate-950" : "bg-[#FFF8EE]"
      }`}
    >
      {/* top bar */}
      <header className="flex items-center justify-between px-8 py-4">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm">
            <ArrowLeft className="w-3 h-3 text-gray-700" />
          </span>
          Back
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
              <Brain className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-gray-800">
              DecisionIQ
            </span>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900"
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* main two-column layout */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 px-4 md:px-12 pb-10">
        {/* left: auth card */}
        <div className="flex items-center justify-center">
          <div
            className={`${cardBg} rounded-[32px] shadow-[0_24px_60px_rgba(15,23,42,0.08)] border border-orange-100/60 w-full max-w-lg px-8 py-10`}
          >
            {/* tabs */}
            <div className="inline-flex bg-orange-50 rounded-full p-1 mb-8">
              <button
                type="button"
                onClick={() => toggleMode("signin")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  mode === "signin"
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => toggleMode("signup")}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  mode === "signup"
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-sm"
                    : "text-gray-600"
                }`}
              >
                Sign Up
              </button>
            </div>

            <h1
              className={`text-2xl md:text-3xl font-semibold mb-2 ${textPrimary}`}
            >
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </h1>
            <p className={`text-xs mb-8 ${textSecondary}`}>
              {mode === "signin"
                ? "Sign in to continue your journey"
                : "Start making clearer, more confident decisions"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username field (used in both modes) */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full rounded-xl bg-[#F7EBDE] border border-transparent px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-400/60"
                    placeholder="your_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Email only for signup */}
              {mode === "signup" && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-gray-400">
                      <Mail className="w-3 h-3" />
                    </span>
                    <input
                      type="email"
                      className="w-full rounded-xl bg-[#F7EBDE] border border-transparent pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-400/60"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <Lock className="w-3 h-3" />
                  </span>
                  <input
                    type="password"
                    className="w-full rounded-xl bg-[#F7EBDE] border border-transparent pl-8 pr-3 py-2 text-xs outline-none focus:ring-2 focus:ring-amber-400/60"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {mode === "signin" && (
                <div className="flex items-center justify-between text-[11px]">
                  <label className="inline-flex items-center gap-2 text-gray-600">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-orange-500 focus:ring-amber-400/70"
                    />
                    Remember me
                  </label>
                  <button
                    type="button"
                    className="text-orange-600 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-white text-xs font-semibold shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-gray-500">
              {mode === "signin" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("signup")}
                    className="text-orange-600 font-semibold"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => toggleMode("signin")}
                    className="text-orange-600 font-semibold"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </div>

        {/* right: quote & features */}
        <div className="hidden md:flex items-center justify-center">
          <div
            className={`w-full max-w-md h-[420px] rounded-[32px] bg-gradient-to-br ${bgGradient} p-8 flex flex-col justify-between shadow-[0_24px_60px_rgba(15,23,42,0.10)]`}
          >
            <div className="space-y-3">
              <p className="text-xs font-medium text-orange-900/70">
                Quote of the day
              </p>
              <p className="text-base font-semibold text-gray-900">
                &quot;In any moment of decision, the best thing you can do is
                the right thing.&quot;
              </p>
              <p className="text-[11px] text-gray-600">
                — Theodore Roosevelt
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <FeatureItem text="AI-powered insights" />
              <FeatureItem text="Track your progress" />
              <FeatureItem text="Private & secure" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-xs shadow-sm">
        <Settings className="w-3 h-3 text-orange-500" />
      </span>
      <p className="text-xs text-gray-800">{text}</p>
    </div>
  )
}
