// src/App.jsx
import React, { useState, useEffect } from "react"
import Dashboard from "./Dashboard"
import Toast from "./Toast"
import LandingPage from "./LandingPage"
import AuthPage from "./AuthPage"

const API_BASE = import.meta.env.VITE_API_URL


export default function DecisionJournalApp() {
  const [darkMode, setDarkMode] = useState(false)

  const [currentPage, setCurrentPage] = useState(() =>
    localStorage.getItem("token") ? "dashboard" : "landing"
  )

  const [toast, setToast] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [user, setUser] = useState(null)

  const [decisions, setDecisions] = useState([])
  const [newDecision, setNewDecision] = useState({
    situation: "",
    intent: "",
    constraints: "",
    alternatives: "",
    decision: "",
    reasoning: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [editingOutcome, setEditingOutcome] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
  }

  const authHeaders = token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" }

  // ---------- AUTH ----------

  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      let data = null
      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (!res.ok) {
        const msg =
          (data && (data.detail || data.error)) ||
          "Wrong username or password"
        showToast(msg, "error")
        return
      }

      if (!data || !data.access) {
        showToast("No access token in response", "error")
        return
      }

      setToken(data.access)
      localStorage.setItem("token", data.access)
      showToast("Logged in")
      setCurrentPage("dashboard")
    } catch (err) {
      console.error("Login error", err)
      showToast("Login failed: network error", "error")
    }
  }

  const register = async (username, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      })

      let data = null
      try {
        data = await res.json()
      } catch {
        data = null
      }

      if (!res.ok) {
        let msg = "Registration failed"
        if (data) {
          if (data.username) msg = data.username.join(" ")
          else if (data.email) msg = data.email.join(" ")
          else if (data.password) msg = data.password.join(" ")
        }
        showToast(msg, "error")
        return
      }

      // auto-login with username
      await login(username, password)
    } catch (err) {
      console.error("Register error", err)
      showToast("Registration failed: network error", "error")
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setDecisions([])
    localStorage.removeItem("token")
    setCurrentPage("landing")
    showToast("Logged out")
  }

  // ---------- LOAD USER + DECISIONS ----------

  useEffect(() => {
    if (!token) return

    const fetchUserAndDecisions = async () => {
      try {
        const meRes = await fetch(`${API_BASE}/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (meRes.ok) {
          const meData = await meRes.json()
          setUser(meData)
        }

        const res = await fetch(`${API_BASE}/decisions/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) {
          const text = await res.text()
          console.error("Decisions error response:", text)
          showToast("Failed to load decisions", "error")
          return
        }
        const data = await res.json()
        setDecisions(data)
      } catch (err) {
        console.error("Load decisions error", err)
        showToast("Failed to load decisions", "error")
      }
    }

    fetchUserAndDecisions()
  }, [token])

  // ---------- DECISIONS CRUD ----------

  const saveDecision = async () => {
    if (!newDecision.situation || !newDecision.decision) {
      showToast("Please fill in situation and decision", "error")
      return
    }
    try {
      const res = await fetch(`${API_BASE}/decisions/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newDecision),
      })
      const text = await res.text()
      console.log("Save decision status:", res.status, "body:", text)
      if (!res.ok) {
        showToast("Failed to save decision", "error")
        return
      }
      const created = JSON.parse(text)
      setDecisions((prev) => [created, ...prev])
      setNewDecision({
        situation: "",
        intent: "",
        constraints: "",
        alternatives: "",
        decision: "",
        reasoning: "",
      })
      showToast("Decision saved successfully!")
      setCurrentPage("dashboard")
    } catch (err) {
      console.error("Save decision error", err)
      showToast("Failed to save decision", "error")
    }
  }

  const updateOutcome = async (id, outcome) => {
    try {
      const res = await fetch(`${API_BASE}/decisions/${id}/`, {
        method: "PATCH",
        headers: authHeaders,
        body: JSON.stringify({ outcome }),
      })
      const text = await res.text()
      console.log("Update outcome status:", res.status, "body:", text)
      if (!res.ok) {
        showToast("Failed to update outcome", "error")
        return
      }
      const updated = JSON.parse(text)
      setDecisions((prev) => prev.map((d) => (d.id === id ? updated : d)))
      setEditingOutcome(null)
      showToast("Outcome updated successfully!")
    } catch (err) {
      console.error("Update outcome error", err)
      showToast("Failed to update outcome", "error")
    }
  }

  const deleteDecision = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/decisions/${id}/`, {
        method: "DELETE",
        headers: authHeaders,
      })
      const text = await res.text()
      console.log("Delete decision status:", res.status, "body:", text)
      if (!res.ok && res.status !== 204) {
        showToast("Failed to delete decision", "error")
        return
      }
      setDecisions((prev) => prev.filter((d) => d.id !== id))
      showToast("Decision deleted")
    } catch (err) {
      console.error("Delete decision error", err)
      showToast("Failed to delete decision", "error")
    }
  }

  const successRate =
    (decisions.filter((d) => d.outcome?.success).length /
      Math.max(decisions.length, 1)) *
    100

  const goToAuth = () => setCurrentPage("auth")
  const goBackToLanding = () => setCurrentPage("landing")

  const handleProfileUpdated = (updatedUser) => {
    setUser(updatedUser)
  }

  return (
    <>
      {currentPage === "landing" && !token && (
        <LandingPage
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          goToAuth={goToAuth}
        />
      )}

      {currentPage === "auth" && !token && (
        <AuthPage
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          goToDashboard={() => setCurrentPage("dashboard")}
          goBack={goBackToLanding}
          onLogin={login}
          onRegister={register}
        />
      )}

      {token && (
        <Dashboard
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          decisions={decisions}
          newDecision={newDecision}
          setNewDecision={setNewDecision}
          saveDecision={saveDecision}
          deleteDecision={deleteDecision}
          updateOutcome={updateOutcome}
          editingOutcome={editingOutcome}
          setEditingOutcome={setEditingOutcome}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          successRate={successRate}
          showToast={showToast}
          onLogout={logout}
          user={user}
          onProfileUpdated={handleProfileUpdated}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
