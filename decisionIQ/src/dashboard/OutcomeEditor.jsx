// dashboard/OutcomeEditor.jsx
import React, { useState } from "react"

export default function OutcomeEditor({ decision, onSave, onCancel, darkMode }) {
  const [outcome, setOutcome] = useState({
    success: true,
    stress: 5,
    happiness: 5,
    notes: "",
  })

  const labelBase = `block mb-2 font-semibold ${
    darkMode ? "text-white" : "text-gray-900"
  }`

  const inputBase = `${
    darkMode ? "bg-gray-700 text-white" : "bg-gray-100"
  } border-2 border-transparent focus:border-orange-500 outline-none`

  return (
    <div
      className={`p-6 rounded-2xl ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg mb-6`}
    >
      <h3
        className={`text-xl font-semibold mb-4 ${
          darkMode ? "text-white" : "text-gray-900"
        }`}
      >
        Update Outcome: {decision.situation}
      </h3>

      <div className="space-y-4">
        <div>
          <label className={labelBase}>Was this decision successful?</label>
          <div className="flex gap-4">
            <button
              onClick={() => setOutcome({ ...outcome, success: true })}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                outcome.success
                  ? "bg-green-500 text-white shadow-lg"
                  : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              ✓ Success
            </button>
            <button
              onClick={() => setOutcome({ ...outcome, success: false })}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !outcome.success
                  ? "bg-red-500 text-white shadow-lg"
                  : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              ✗ Not as expected
            </button>
          </div>
        </div>

        <div>
          <label className={labelBase}>
            Stress Level: {outcome.stress}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={outcome.stress}
            onChange={(e) =>
              setOutcome({ ...outcome, stress: parseInt(e.target.value, 10) })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className={labelBase}>
            Happiness Score: {outcome.happiness}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={outcome.happiness}
            onChange={(e) =>
              setOutcome({
                ...outcome,
                happiness: parseInt(e.target.value, 10),
              })
            }
            className="w-full"
          />
        </div>

        <div>
          <label className={labelBase}>Notes</label>
          <textarea
            value={outcome.notes}
            onChange={(e) =>
              setOutcome({ ...outcome, notes: e.target.value })
            }
            placeholder="How did it turn out? What did you learn?"
            className={`w-full px-4 py-3 rounded-xl ${inputBase}`}
            rows="3"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onSave(outcome)}
            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Save Outcome
          </button>
          <button
            onClick={onCancel}
            className={`flex-1 py-3 rounded-xl font-semibold ${
              darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}