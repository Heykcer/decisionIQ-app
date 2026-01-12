// dashboard/HistorySection.jsx
import React from "react"
import OutcomeSummary from "./OutcomeSummary"

export default function HistorySection({
  darkMode,
  SearchIcon,
  TrashIcon,
  decisions,
  filteredDecisions,
  searchQuery,
  setSearchQuery,
  deleteDecision,
  successRate,
}) {
  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Decision History
      </h1>

      <div className="mb-6">
        <div className="relative">
          <SearchIcon
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search decisions..."
            className={`w-full pl-12 pr-4 py-3 rounded-xl ${
              darkMode ? "bg-gray-800 text-white" : "bg-white"
            } shadow-lg border-2 border-transparent focus:border-orange-500 outline-none`}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredDecisions.map((decision) => (
          <HistoryCard
            key={decision.id}
            darkMode={darkMode}
            TrashIcon={TrashIcon}
            decision={decision}
            deleteDecision={deleteDecision}
          />
        ))}
      </div>

      {decisions.length > 0 && (
        <div
          className={`mt-8 p-6 rounded-2xl ${
            darkMode
              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              : "bg-gradient-to-r from-purple-100 to-pink-100"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-3 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            🧠 Behavioral Insights
          </h3>
          <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
            Based on your {decisions.length} decisions, you tend to perform
            better when decisions are planned and discussed with others. Your
            success rate is {successRate.toFixed(0)}%, which shows strong
            decision-making capabilities.
          </p>
        </div>
      )}
    </div>
  )
}

function HistoryCard({ darkMode, TrashIcon, decision, deleteDecision }) {
  return (
    <div
      className={`p-6 rounded-2xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg hover:shadow-xl transition-all`}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3
            className={`text-xl font-semibold mb-1 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {decision.situation}
          </h3>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            {decision.date}
          </p>
        </div>
        <button
          onClick={() => deleteDecision(decision.id)}
          className={`p-2 rounded-lg ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          } transition-all`}
        >
          <TrashIcon className="w-5 h-5 text-red-500" />
        </button>
      </div>

      <div
        className={`space-y-2 mb-4 ${
          darkMode ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <p>
          <span className="font-semibold">Decision:</span> {decision.decision}
        </p>
        <p>
          <span className="font-semibold">Reasoning:</span>{" "}
          {decision.reasoning}
        </p>
        {decision.constraints && (
          <p>
            <span className="font-semibold">Constraints:</span>{" "}
            {decision.constraints}
          </p>
        )}
      </div>

      {decision.outcome && (
        <OutcomeSummary darkMode={darkMode} outcome={decision.outcome} />
      )}
    </div>
  )
}