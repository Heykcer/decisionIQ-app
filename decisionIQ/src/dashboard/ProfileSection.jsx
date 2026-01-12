// src/dashboard/ProfileSection.jsx
import React, { useState, useEffect } from "react"
import { X, User, Star, Crown, Check } from "lucide-react"

export default function ProfileSection({
  open,
  onClose,
  darkMode,
  decisions,
  successRate,
  onLogout,
  user,             // NEW
  onProfileUpdated, // NEW
}) {
  const outcomes = decisions.filter((d) => d.outcome)
  const avgStress =
    outcomes.reduce((sum, d) => sum + (d.outcome.stress || 0), 0) /
      Math.max(outcomes.length, 1) || 0
  const avgHappiness =
    outcomes.reduce((sum, d) => sum + (d.outcome.happiness || 0), 0) /
      Math.max(outcomes.length, 1) || 0

  const panelBg = darkMode ? "bg-gray-900" : "bg-[#FFF9EF]"

  // --- editable profile state (NEW) ---
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(user?.username || "")
  const [emailInput, setEmailInput] = useState(user?.email || "")

  useEffect(() => {
    setNameInput(user?.username || "")
    setEmailInput(user?.email || "")
  }, [user])

  const handleSaveProfile = async () => {
  try {
    const token = window.localStorage.getItem("token") || ""
    const res = await fetch("http://localhost:8000/api/me/update/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: nameInput,
        email: emailInput,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      console.error("Profile update failed", data)
      return
    }
    if (onProfileUpdated) {
      onProfileUpdated(data)
    }
    setEditing(false)
  } catch (err) {
    console.error("Profile update error", err)
  }
}

  // --- end editable profile state ---

  if (!open) return null

  return (
    <>
      {/* backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={onClose}
      />

      {/* sidebar panel */}
      <aside
        className={`fixed inset-y-0 right-0 w-full max-w-md z-50 shadow-2xl ${panelBg} border-l border-orange-100 flex flex-col`}
      >
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100/60">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold">
              {(user?.username || "A").charAt(0).toUpperCase()}
            </span>
            <span className="text-xs font-semibold text-gray-800">
              Profile
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-black/5"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* main profile card */}
          <div className="rounded-3xl bg-white shadow-sm border border-orange-100 p-5 flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.username || "Decision Maker"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "you@example.com"}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-xs font-semibold text-white shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* edit form (overlay card) */}
          {editing && (
            <div className="rounded-3xl bg-white shadow-sm border border-orange-100 p-5 space-y-3">
              <p className="text-xs font-semibold text-gray-900">
                Edit Profile
              </p>
              <div className="space-y-2">
                <label className="block text-[11px] text-gray-600">
                  Name
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 text-xs outline-none focus:ring-2 focus:ring-orange-400/60"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[11px] text-gray-600">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 rounded-xl bg-gray-100 text-xs outline-none focus:ring-2 focus:ring-orange-400/60"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 text-[11px] text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-[11px] font-semibold text-white"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Your Insights */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <h2 className="text-sm font-semibold text-gray-900">
                Your Insights
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InsightCard
                title="Decision Success Rate"
                value={`${successRate.toFixed(0)}%`}
                subtitle="Based on logged outcomes"
              />
              <InsightCard
                title="Average Stress Level"
                value={`${avgStress.toFixed(1)}/10`}
                subtitle="Lower is better"
              />
              <InsightCard
                title="Total Decisions"
                value={decisions.length}
                subtitle="Logged in your journal"
              />
              <InsightCard
                title="Average Happiness"
                value={`${avgHappiness.toFixed(1)}/10`}
                subtitle="Higher is better"
              />
            </div>
          </section>

          {/* Behavioral Patterns */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h2 className="text-sm font-semibold text-gray-900">
                Behavioral Patterns
              </h2>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-pink-50 border border-orange-100 p-4 space-y-2 text-xs text-gray-800">
              <PatternItem text="You make better decisions in the morning" />
              <PatternItem text="Low-risk decisions have higher success rates" />
              <PatternItem text="Discussing with others improves outcomes" />
            </div>
          </section>

          {/* Pricing Plans */}
          <section className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">👑</span>
              <h2 className="text-sm font-semibold text-gray-900">
                Pricing Plans
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Free Plan */}
              <div className="rounded-3xl bg-white border border-orange-100 p-4 flex flex-col gap-2">
                <p className="text-xs font-semibold text-gray-900">Free</p>
                <p className="text-[11px] text-gray-500">
                  Perfect to start building your decision habit.
                </p>
                <ul className="space-y-1 text-[11px] text-gray-600 mt-1">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Log up to 50 decisions.
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Basic insights.
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-green-500" />
                    Email summaries.
                  </li>
                </ul>
                <button className="mt-2 px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-medium text-gray-700 bg-white">
                  Current Plan
                </button>
              </div>

              {/* Premium Plan */}
              <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-pink-500 text-white p-4 flex flex-col gap-2 relative overflow-hidden">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-semibold">
                  Recommended
                </span>
                <p className="text-xs font-semibold">Premium</p>
                <p className="text-[11px] text-orange-50">
                  For deep thinkers who want full clarity on their choices.
                </p>
                <ul className="space-y-1 text-[11px] text-orange-50 mt-1">
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-white" />
                    Unlimited decisions & outcomes.
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-white" />
                    Advanced behavioral insights.
                  </li>
                  <li className="flex items-center gap-1">
                    <Check className="w-3 h-3 text-white" />
                    Priority support & roadmap voting.
                  </li>
                </ul>
                <button className="mt-2 px-3 py-1.5 rounded-xl bg-white text-[11px] font-semibold text-orange-600">
                  Upgrade Soon
                </button>
              </div>
            </div>
          </section>
        </div>
      </aside>
    </>
  )
}

function InsightCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl bg-white border border-orange-100 p-4 flex flex-col gap-1">
      <p className="text-[11px] font-medium text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-900">{value}</p>
      <p className="text-[11px] text-gray-500">{subtitle}</p>
    </div>
  )
}

function PatternItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5">
        <Check className="w-3 h-3 text-orange-500" />
      </span>
      <p className="text-[11px] text-gray-700">{text}</p>
    </div>
  )
}
