// src/dashboard/LogDecisionSection.jsx
import React from "react"

const constraintOptions = {
  time: [
    { value: "low", label: "Low pressure", icon: "🟢" },
    { value: "medium", label: "Some urgency", icon: "🟡" },
    { value: "high", label: "Time sensitive", icon: "🔴" },
  ],
  risk: [
    { value: "low", label: "Low risk", icon: "🛡️" },
    { value: "medium", label: "Moderate risk", icon: "⚖️" },
    { value: "high", label: "High risk", icon: "⚠️" },
  ],
  emotion: [
    { value: "calm", label: "Calm", icon: "😌" },
    { value: "neutral", label: "Neutral", icon: "😐" },
    { value: "anxious", label: "Anxious", icon: "😰" },
    { value: "excited", label: "Excited", icon: "😊" },
  ],
}

export default function LogDecisionSection({
  darkMode,
  newDecision,
  setNewDecision,
  saveDecision,
}) {
  const cardBase = `rounded-2xl border ${
    darkMode ? "bg-gray-900/60 border-gray-800" : "bg-white border-orange-100"
  }`

  const labelBase = `text-sm font-semibold ${
    darkMode ? "text-gray-200" : "text-gray-800"
  }`

  const sectionTitle = `text-base font-semibold ${
    darkMode ? "text-gray-100" : "text-gray-900"
  }`

  const inputBase = `w-full px-4 py-3 rounded-xl ${
    darkMode ? "bg-gray-900 text-white" : "bg-orange-50"
  } border border-transparent focus:border-orange-400 outline-none text-sm`

  return (
    <div className="w-full space-y-6">
      <h1
        className={`text-2xl font-bold mb-2 ${
          darkMode ? "text-gray-100" : "text-gray-900"
        }`}
      >
        Log Decision
      </h1>

      {/* Situation & Goal */}
      <div className={cardBase + " p-5 space-y-4"}>
        <div>
          <p className={sectionTitle}>Situation</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            Describe the decision you are facing right now.
          </p>
          <textarea
            value={newDecision.situation}
            onChange={(e) =>
              setNewDecision({ ...newDecision, situation: e.target.value })
            }
            placeholder="E.g. Should I accept a new job offer at a smaller startup?"
            className={inputBase + " mt-3"}
            rows={3}
          />
        </div>

        <div>
          <p className={sectionTitle}>Goal</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            What are you trying to optimize for?
          </p>
          <input
            value={newDecision.intent}
            onChange={(e) =>
              setNewDecision({ ...newDecision, intent: e.target.value })
            }
            placeholder="E.g. Better work‑life balance, more growth, higher income"
            className={inputBase + " mt-3"}
          />
        </div>
      </div>

      {/* Constraints & Context */}
      <div className={cardBase + " p-5 space-y-5"}>
        <p className={sectionTitle}>Constraints &amp; Context</p>

        {/* Time Pressure */}
        <div className="space-y-2">
          <span className={labelBase}>Time Pressure</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.time.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.timePressure === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, timePressure: opt.value })
                }
              />
            ))}
          </div>
        </div>

        {/* Risk Level */}
        <div className="space-y-2">
          <span className={labelBase}>Risk Level</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.risk.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.riskLevel === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, riskLevel: opt.value })
                }
              />
            ))}
          </div>
        </div>

        {/* Emotional State */}
        <div className="space-y-2">
          <span className={labelBase}>Emotional State</span>
          <div className="flex flex-wrap gap-3">
            {constraintOptions.emotion.map((opt) => (
              <PillOption
                key={opt.value}
                label={opt.label}
                icon={opt.icon}
                active={newDecision.emotion === opt.value}
                onClick={() =>
                  setNewDecision({ ...newDecision, emotion: opt.value })
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      <div className={cardBase + " p-5 space-y-4"}>
        <p className={sectionTitle}>Alternatives Considered</p>
        <input
          value={newDecision.alternatives || ""}
          onChange={(e) =>
            setNewDecision({ ...newDecision, alternatives: e.target.value })
          }
          placeholder="Option 1, Option 2, Option 3..."
          className={inputBase}
        />
      </div>

      {/* Final Decision & Reasoning */}
      <div className={cardBase + " p-5 space-y-4 mb-4"}>
        <div>
          <p className={sectionTitle}>Final Decision</p>
          <input
            value={newDecision.decision}
            onChange={(e) =>
              setNewDecision({ ...newDecision, decision: e.target.value })
            }
            placeholder="What did you decide to do?"
            className={inputBase + " mt-2"}
          />
        </div>

        <div>
          <p className={sectionTitle}>Reasoning</p>
          <p className={darkMode ? "text-gray-400" : "text-gray-500 text-sm"}>
            Why does this option feel right given your constraints?
          </p>
          <textarea
            value={newDecision.reasoning}
            onChange={(e) =>
              setNewDecision({ ...newDecision, reasoning: e.target.value })
            }
            placeholder="Summarize how you weighed trade‑offs and why you prefer this path."
            className={inputBase + " mt-2"}
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={saveDecision}
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          Save Decision
        </button>
      </div>
    </div>
  )
}

function PillOption({ label, icon, active, onClick }) {
  const base =
    "px-4 py-2 rounded-full text-sm font-medium inline-flex items-center justify-center cursor-pointer transition-all"
  const activeClasses = "bg-orange-500 text-white shadow-sm"
  const inactiveClasses = "bg-orange-50 text-orange-800 hover:bg-orange-100"

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${active ? activeClasses : inactiveClasses}`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  )
}