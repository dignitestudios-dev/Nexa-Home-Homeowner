"use client"

import React from "react"

const notificationItems = [
  { id: "newMessages", label: "New messages", description: "Receive updates when you get new messages.", enabled: true },
  { id: "appUpdates", label: "App updates", description: "Get notified about app releases and feature updates.", enabled: true },
  { id: "promotionalEmails", label: "Promotional emails", description: "Receive marketing and product news.", enabled: false },
  { id: "securityAlerts", label: "Security alerts", description: "Be notified of important security events.", enabled: false },
  { id: "accountActivity", label: "Account activity", description: "Track sign-ins and account changes.", enabled: false },
  { id: "reminders", label: "Reminders", description: "Receive reminders for upcoming tasks and actions.", enabled: false },
  { id: "tips", label: "Tips and recommendations", description: "Personalized product tips and recommendations.", enabled: false },
  { id: "other", label: "Other notifications", description: "Miscellaneous updates and information.", enabled: false },
]

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 " +
        (checked ? "bg-[#34C759]" : "bg-slate-300")
      }
      aria-pressed={checked}
    >
      <span
        className={
          "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 " +
          (checked ? "translate-x-5" : "translate-x-0.5")
        }
      />
    </button>
  )
}

export default function Notifications() {
  const [toggles, setToggles] = React.useState(
    notificationItems.reduce((acc, item) => {
      acc[item.id] = item.enabled
      return acc
    }, {} as Record<string, boolean>)
  )

  const handleToggle = (id: string) => {
    setToggles((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#181818]">Notifications</h2>
      <div className="space-y-3">
        {notificationItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-[#F9F9F9] px-4 py-4"
          >
            <div>
              <p className="font-medium text-[#181818]">{item.label}</p>
              <p className="mt-0.5 text-sm text-[rgba(24,24,24,0.6)]">{item.description}</p>
            </div>
            <Toggle checked={toggles[item.id]} onChange={() => handleToggle(item.id)} />
          </div>
        ))}
      </div>
    </div>
  )
}
