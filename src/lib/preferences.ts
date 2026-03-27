const DARK_MODE_STORAGE_KEY = "darkMode"
const HAPTIC_AUDIO_STORAGE_KEY = "haptic-audio"

export function getBooleanPreference(
  key: string,
  fallback: boolean,
): boolean {
  if (typeof window === "undefined") return fallback

  try {
    const value = window.localStorage.getItem(key)
    if (value === "true") return true
    if (value === "false") return false
    return fallback
  } catch {
    return fallback
  }
}

export function setBooleanPreference(key: string, value: boolean) {
  if (typeof window === "undefined") return

  try {
    window.localStorage.setItem(key, value ? "true" : "false")
  } catch {
    // Silently ignore storage write failures (private mode, blocked storage, etc.)
  }
}

export function getDarkModePreference(fallback = false): boolean {
  return getBooleanPreference(DARK_MODE_STORAGE_KEY, fallback)
}

export function setDarkModePreference(value: boolean) {
  setBooleanPreference(DARK_MODE_STORAGE_KEY, value)
}

export function getHapticAudioPreference(fallback = true): boolean {
  return getBooleanPreference(HAPTIC_AUDIO_STORAGE_KEY, fallback)
}

export function setHapticAudioPreference(value: boolean) {
  setBooleanPreference(HAPTIC_AUDIO_STORAGE_KEY, value)
}
