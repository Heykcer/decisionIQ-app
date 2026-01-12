// src/Dashboard.jsx
import React, { useState } from "react"
import {
  Sun,
  Moon,
  Brain,
  TrendingUp,
  History,
  Home,
  PlusCircle,
  User,
  Search,
  Trash2,
  Menu,
  X,
} from "lucide-react"
import HomeSection from "./dashboard/HomeSection"
import LogDecisionSection from "./dashboard/LogDecisionSection"
import HistorySection from "./dashboard/HistorySection"
import OutcomesSection from "./dashboard/OutcomesSection"
import ProfileSection from "./dashboard/ProfileSection"

export default function Dashboard({
  darkMode,
  setDarkMode,
  decisions,
  newDecision,
  setNewDecision,
  saveDecision,
  deleteDecision,
  updateOutcome,
  editingOutcome,
  setEditingOutcome,
  searchQuery,
  setSearchQuery,
  successRate,
  showToast,
  onLogout,
  user,
  onProfileUpdated,
}) {
  const [activeSection, setActiveSection] = useState("home")
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  

  const navItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "log", icon: PlusCircle, label: "Log Decision" },
    { id: "history", icon: History, label: "History" },
    { id: "outcomes", icon: TrendingUp, label: "Outcomes" },
  ]

  const filteredDecisions = decisions.filter(
    (d) =>
      d.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.decision.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectSection = (id) => {
    setActiveSection(id)
    setMobileNavOpen(false)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-[#FFF9EF]"}`}>
      {/* SOLID TOP NAVBAR */}
      <nav
        className={`sticky top-0 z-40 px-4 md:px-6 py-3 flex items-center justify-between ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg`}
      >
        {/* Left: hamburger (mobile) + brand */}
        <div className="flex items-center gap-3">
          <button
            className="md:hidden p-2 rounded-full bg-gray-100 text-gray-700"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            {mobileNavOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <Brain
            className={`w-7 h-7 ${
              darkMode ? "text-orange-400" : "text-orange-600"
            }`}
          />
          <span
            className={`text-lg font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            DecisionIQ
          </span>
        </div>

        {/* Center: DESKTOP nav tabs */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectSection(item.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right: dark mode + profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 text-orange-800 hover:bg-orange-100 border border-orange-100"
          >
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-semibold">
  {(user?.username || "A").charAt(0).toUpperCase()}
</div>

            {/* <span className="hidden sm:inline text-sm font-medium">
              Profile
            </span> */}
          </button>
        </div>
      </nav>

      {/* TRANSPARENT / GLASS MOBILE HAMBURGER MENU */}
      {mobileNavOpen && (
        <>
          {/* Dark backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />

          {/* Glass panel */}
          <div className="fixed top-0 left-0 right-0 z-50 mt-16 px-4">
            <div className="rounded-xl bg-white/10 border border-white/40 backdrop-blur-xl shadow-2xl overflow-hidden">
              {/* Header row */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/20 bg-gradient-to-r from-orange-500/80 to-amber-500/80 text-white">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  <span className="text-sm font-semibold">
                    DecisionIQ
                  </span>
                </div>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav items */}
              <div className="py-1">
                {navItems.map((item) => {
                  const active = activeSection === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left transition-all ${
                        active
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                          : "text-gray-900 hover:bg-white/20"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-sm flex items-center justify-center ${
                          active
                            ? "bg-white/15"
                            : "bg-white/40 text-orange-500"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* MAIN CONTENT */}
      <main className="p-4 md:p-8 w-full">
        {activeSection === "home" && (
          <HomeSection
            darkMode={darkMode}
            decisions={decisions}
            successRate={successRate}
            showToast={showToast}
          />
        )}

        {activeSection === "log" && (
          <LogDecisionSection
            darkMode={darkMode}
            newDecision={newDecision}
            setNewDecision={setNewDecision}
            saveDecision={saveDecision}
          />
        )}

        {activeSection === "history" && (
          <HistorySection
            darkMode={darkMode}
            SearchIcon={Search}
            TrashIcon={Trash2}
            decisions={decisions}
            filteredDecisions={filteredDecisions}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            deleteDecision={deleteDecision}
            successRate={successRate}
          />
        )}

        {activeSection === "outcomes" && (
          <OutcomesSection
            darkMode={darkMode}
            decisions={decisions}
            editingOutcome={editingOutcome}
            setEditingOutcome={setEditingOutcome}
            updateOutcome={updateOutcome}
          />
        )}
      </main>

      {/* PROFILE SIDEBAR OVERLAY */}
      <ProfileSection
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        darkMode={darkMode}
        decisions={decisions}
        successRate={successRate}
        onLogout={() => {
          setProfileOpen(false)
          onLogout()
        }}
        user={user}
        onProfileUpdated={onProfileUpdated}
      />
    </div>
  )
}