"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleSettingsVars, useGetSettings, UserSettings, useToggleSettings } from "@/features/settings/hooks"
// import { useGetSettings, useToggleSettings } from "@/features/notifications/hooks"
// import type { ToggleSettingsVars, UserSettings } from "@/features/notifications/hooks"

// Map each API key → human-readable label + description
// Add a new entry here when the backend adds a new setting key
const SETTING_ITEMS: {
  key: keyof UserSettings
  label: string
  description: string
}[] = [
    {
      key: "newJobPosted",
      label: "New job posted",
      description: "Receive a notification when a new job is posted.",
    },
    // Uncomment when provider settings are needed:
    // {
    //   key: "jobMatchesCategory",
    //   label: "Job matches category",
    //   description: "Get notified when a job matches your service category.",
    // },
    // {
    //   key: "expertSelected",
    //   label: "Expert selected",
    //   description: "Be notified when an expert is selected for your job.",
    // },
    // {
    //   key: "newReviewReceived",
    //   label: "New review received",
    //   description: "Get notified when you receive a new review.",
    // },
  ]

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 " +
        (checked ? "bg-[#34C759]" : "bg-slate-300") +
        (disabled ? " opacity-50 cursor-not-allowed" : "")
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

function SettingRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-[#F9F9F9] px-4 py-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-36 rounded" />
        <Skeleton className="h-3 w-56 rounded" />
      </div>
      <Skeleton className="h-6 w-11 rounded-full" />
    </div>
  )
}

export default function Notifications() {
  const { data, isLoading } = useGetSettings()
  const { mutate: toggleSetting, isPending } = useToggleSettings()

  const settings = data?.data?.notifications
  const handleToggle = (key: keyof UserSettings) => {
    if (!settings) return
    const payload: ToggleSettingsVars = { [key]: !settings[key] }
    toggleSetting(payload)
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-[#181818]">
        Notifications
      </h2>

      <div className="space-y-3">
        {isLoading ? (
          // Show skeletons while fetching — one per setting item
          SETTING_ITEMS.map((item) => <SettingRowSkeleton key={item.key} />)
        ) : !settings ? (
          <p className="text-sm text-[rgba(24,24,24,0.5)]">
            Failed to load settings. Please try again.
          </p>
        ) : (
          SETTING_ITEMS.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between rounded-2xl bg-[#F9F9F9] px-4 py-4"
            >
              <div>
                <p className="font-medium text-[#181818]">{item.label}</p>
                <p className="mt-0.5 text-sm text-[rgba(24,24,24,0.6)]">{item.description}</p>
              </div>
              <Toggle
                checked={!!settings[item.key]}
                onChange={() => handleToggle(item.key)}
                disabled={isPending}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}