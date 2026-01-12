// dashboard/OutcomeSummary.jsx
import React from "react"

export default function OutcomeSummary({ darkMode, outcome }) {
  return (
    <div
      className={`p-4 rounded-xl ${
        outcome.success ? "bg-green-500/10" : "bg-red-500/10"
      } border-2 ${
        outcome.success ? "border-green-500/30" : "border-red-500/30"
      }`}
    >
      <p
        className={`font-semibold mb-2 ${
          outcome.success ? "text-green-600" : "text-red-600"
        }`}
      >
        {outcome.success ? "✓ Success" : "✗ Did not meet expectations"}
      </p>
      <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
        Stress: {outcome.stress}/10 | Happiness: {outcome.happiness}/10
      </p>
      {outcome.notes && (
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {outcome.notes}
        </p>
      )}
    </div>
  )
}