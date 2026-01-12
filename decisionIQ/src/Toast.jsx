import React, { useEffect } from "react"
import { Check } from "lucide-react"

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg animate-slideIn ${
        type === "success"
          ? "bg-gradient-to-r from-green-500 to-emerald-500"
          : "bg-gradient-to-r from-orange-500 to-amber-500"
      } text-white`}
    >
      <Check className="w-5 h-5" />
      <p className="font-medium">{message}</p>
    </div>
  )
}