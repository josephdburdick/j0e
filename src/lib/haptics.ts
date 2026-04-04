export type HapticPresetName =
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "soft"
  | "rigid"
  | "selection"
  | "nudge"
  | "buzz"

interface HapticsInstance {
  trigger: (input?: string) => Promise<void>
}

let haptics: HapticsInstance | null = null

if (typeof window !== "undefined") {
  import("web-haptics")
    .then(({ WebHaptics }) => {
      haptics = new WebHaptics()
    })
    .catch(() => {})
}

export function triggerHaptic(preset: HapticPresetName = "light") {
  haptics?.trigger(preset)
}
