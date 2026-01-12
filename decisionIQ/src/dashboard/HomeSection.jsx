// src/dashboard/HomeSection.jsx
import React, { useState } from "react"
import { Clock, Award, TrendingUp } from "lucide-react"

export default function HomeSection({
  darkMode,
  decisions,
  successRate,
  showToast,
}) {
  const [aiPrompt, setAiPrompt] = useState("")

  const avgHappiness =
    decisions.filter((d) => d.outcome).reduce(
      (sum, d) => sum + (d.outcome.happiness || 0),
      0
    ) / Math.max(decisions.filter((d) => d.outcome).length, 1) || 0

  const generateAIResponse = () => {
    if (!aiPrompt) return
    const responses = [
      `Based on your past decisions, you tend to succeed when you take calculated risks with proper planning.`,
      `You perform best when consulting others before making big choices.`,
      `Your history shows higher satisfaction when decisions align with long-term goals.`,
    ]
    const random = responses[Math.floor(Math.random() * responses.length)]
    showToast(random, "info")
  }

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-2 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Welcome to Your Decision Intelligence Hub
      </h1>
      <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
        "Every decision shapes your future. Make them count."
      </p>

      {/* AI Assistant card */}
      <div
        className={`mt-8 p-8 rounded-2xl ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg mb-6`}
      >
        <h2
          className={`text-xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          AI Decision Assistant
        </h2>
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Share your current dilemma and get AI-powered insights based on your
          decision history.
        </p>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="What decision are you facing today?"
          className={`mt-4 w-full px-4 py-3 rounded-xl ${
            darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
          } border-2 border-transparent focus:border-orange-500 outline-none`}
          rows="4"
        />
        <button
          onClick={generateAIResponse}
          className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Get AI Suggestion
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          darkMode={darkMode}
          color="orange"
          Icon={Clock}
          label="Total Decisions"
          value={decisions.length}
        />
        <StatCard
          darkMode={darkMode}
          color="green"
          Icon={Award}
          label="Success Rate"
          value={`${successRate.toFixed(0)}%`}
        />
        <StatCard
          darkMode={darkMode}
          color="purple"
          Icon={TrendingUp}
          label="Avg Happiness"
          value={avgHappiness.toFixed(1)}
        />
      </div>
    </div>
  )
}

function StatCard({ darkMode, color, Icon, label, value }) {
  const bgMap = {
    orange: darkMode
      ? "bg-gradient-to-br from-orange-500 to-amber-500"
      : "bg-gradient-to-br from-orange-400 to-amber-400",
    green: darkMode
      ? "bg-gradient-to-br from-green-500 to-emerald-500"
      : "bg-gradient-to-br from-green-400 to-emerald-400",
    purple: darkMode
      ? "bg-gradient-to-br from-purple-500 to-pink-500"
      : "bg-gradient-to-br from-purple-400 to-pink-400",
  }

  return (
    <div className={`p-6 rounded-2xl ${bgMap[color]} text-white`}>
      {/* Icon is passed as a prop and rendered as a component */}
      <Icon className="w-10 h-10 mb-3" />
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className="text-white/80">{label}</p>
    </div>
  )
}