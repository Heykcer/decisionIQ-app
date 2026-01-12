import React from "react"
import { Brain, Sun, Moon, PlusCircle, TrendingUp, Target } from "lucide-react"

export default function LandingPage({ darkMode, setDarkMode, goToAuth }) {
  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900"
          : "bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50"
      }`}
    >
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain
            className={`w-8 h-8 ${
              darkMode ? "text-orange-400" : "text-orange-600"
            }`}
          />
          <span
            className={`text-2xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            DecisionIQ
          </span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full ${
            darkMode
              ? "bg-gray-800 text-yellow-400"
              : "bg-white text-gray-700"
          } shadow-lg hover:scale-110 transition-transform`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1
            className={`text-6xl font-bold mb-6 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Think Better.{" "}
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-transparent bg-clip-text">
              Decide Smarter.
            </span>
          </h1>
          <p
            className={`text-xl mb-8 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            } max-w-2xl mx-auto`}
          >
            Your personal AI-powered decision journal that learns from your
            choices, tracks outcomes, and helps you make better decisions every
            day.
          </p>
          <button
            onClick={goToAuth}
            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get Started Free
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            {
              icon: PlusCircle,
              title: "Log Decisions",
              desc: "Capture every important choice with context and reasoning",
            },
            {
              icon: TrendingUp,
              title: "Track Outcomes",
              desc: "Monitor results and measure success over time",
            },
            {
              icon: Brain,
              title: "Learn Patterns",
              desc: "Discover your decision-making tendencies and biases",
            },
            {
              icon: Target,
              title: "AI Suggestions",
              desc: "Get personalized recommendations based on your history",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={`p-6 rounded-2xl ${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg hover:shadow-xl transition-all hover:-translate-y-1`}
            >
              <feature.icon
                className={`w-12 h-12 mb-4 ${
                  darkMode ? "text-orange-400" : "text-orange-600"
                }`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {feature.title}
              </h3>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`p-8 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700"
              : "bg-gradient-to-r from-orange-100 to-amber-100"
          } text-center`}
        >
          <p
            className={`text-2xl italic ${
              darkMode ? "text-gray-200" : "text-gray-700"
            } mb-4`}
          >
            "The quality of our decisions determines the quality of our lives."
          </p>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            — Decision Science Research
          </p>
        </div>
      </div>
    </div>
  )
}