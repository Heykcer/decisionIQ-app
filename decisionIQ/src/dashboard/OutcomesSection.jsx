// dashboard/OutcomesSection.jsx
import React from "react"
import { Edit } from "lucide-react"
import OutcomeEditor from "./OutcomeEditor"

export default function OutcomesSection({
  darkMode,
  decisions,
  editingOutcome,
  setEditingOutcome,
  updateOutcome,
}) {
  const pendingDecisions = decisions.filter((d) => !d.outcome)

  return (
    <div>
      <h1
        className={`text-3xl font-bold mb-6 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Track Outcomes
      </h1>

      {editingOutcome && (
        <OutcomeEditor
          decision={decisions.find((d) => d.id === editingOutcome)}
          onSave={(outcome) => updateOutcome(editingOutcome, outcome)}
          onCancel={() => setEditingOutcome(null)}
          darkMode={darkMode}
        />
      )}

      <div className="space-y-4">
        {pendingDecisions.length === 0 && (
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            All decisions have outcomes logged.
          </p>
        )}

        {pendingDecisions.map((decision) => (
          <div
            key={decision.id}
            className={`p-6 rounded-2xl ${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg`}
          >
            <h3
              className={`text-lg font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {decision.situation}
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Decision: {decision.decision}
            </p>
            <button
              onClick={() => setEditingOutcome(decision.id)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Edit className="w-4 h-4" />
              Edit Outcome
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}