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

// Vibration patterns: [on, off, on, off, ...] in ms
// Intensities are 0–1 and only affect audio pitch/volume
interface HapticPreset {
  vibrate: number[]
  intensity: number
}

const PRESETS: Record<HapticPresetName, HapticPreset> = {
  selection: { vibrate: [12], intensity: 0.2 },
  light: { vibrate: [20], intensity: 0.35 },
  soft: { vibrate: [40], intensity: 0.4 },
  medium: { vibrate: [30], intensity: 0.6 },
  rigid: { vibrate: [15], intensity: 0.85 },
  heavy: { vibrate: [50], intensity: 1.0 },
  success: { vibrate: [30, 80, 50], intensity: 0.7 },
  warning: { vibrate: [40, 120, 40], intensity: 0.6 },
  error: { vibrate: [50, 50, 50, 50, 50], intensity: 0.85 },
  nudge: { vibrate: [80, 100, 50], intensity: 0.5 },
  buzz: { vibrate: [300], intensity: 1.0 },
}

// --- Platform detection ---
const IS_CLIENT = typeof window !== "undefined"
const HAS_VIBRATE =
  IS_CLIENT && typeof navigator !== "undefined" && "vibrate" in navigator
const IS_IOS =
  IS_CLIENT &&
  typeof navigator !== "undefined" &&
  /iPhone|iPad|iPod/.test(navigator.userAgent)

// --- iOS Taptic Engine via hidden checkbox-switch ---
let iosCheckbox: HTMLInputElement | null = null

function ensureIOSCheckbox() {
  if (iosCheckbox || typeof document === "undefined") return

  // Off-screen positioning (NOT display:none — that prevents Taptic Engine)
  const label = document.createElement("label")
  label.setAttribute("aria-hidden", "true")
  Object.assign(label.style, {
    position: "fixed",
    left: "-200vw",
    top: "-200vh",
    opacity: "0",
    pointerEvents: "none",
  })

  const input = document.createElement("input")
  input.type = "checkbox"
  input.setAttribute("switch", "")
  Object.assign(input.style, {
    all: "initial",
    appearance: "auto",
    position: "fixed",
    left: "-200vw",
    top: "-200vh",
    opacity: "0",
    pointerEvents: "none",
  })

  label.appendChild(input)
  document.body.appendChild(label)
  iosCheckbox = input
}

// --- Audio engine ---
let audioCtx: AudioContext | null = null
let audioEnabled = false
const AUDIO_STORAGE_KEY = "haptic-audio"

async function ensureAudioCtx() {
  if (audioCtx) {
    if (audioCtx.state === "suspended") await audioCtx.resume()
    return
  }
  if (typeof AudioContext === "undefined") return
  audioCtx = new AudioContext()
  if (audioCtx.state === "suspended") await audioCtx.resume()
}

function playClickSound(intensity: number) {
  if (!audioCtx) return

  const sampleRate = audioCtx.sampleRate
  const duration = 0.004 + intensity * 0.008
  const bufferSize = Math.ceil(sampleRate * duration)
  const buffer = audioCtx.createBuffer(1, bufferSize, sampleRate)
  const data = buffer.getChannelData(0)

  // White noise with exponential decay shaped by intensity
  const decay = 25 + intensity * 50
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay)
  }

  // Bandpass filter — higher pitch for higher intensity
  const filter = audioCtx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = 2000 + intensity * 3000
  filter.Q.value = 6 + intensity * 4

  const gain = audioCtx.createGain()
  gain.gain.value = 0.15 + intensity * 0.35

  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.connect(filter)
  filter.connect(gain)
  gain.connect(audioCtx.destination)
  source.onended = () => {
    source.disconnect()
    filter.disconnect()
    gain.disconnect()
  }
  source.start()
}

// --- Public API ---

export function triggerHaptic(preset: HapticPresetName = "light") {
  if (!IS_CLIENT) return

  const config = PRESETS[preset]
  if (!config) return

  // Android / Chrome: navigator.vibrate with direct durations
  if (HAS_VIBRATE) {
    try {
      navigator.vibrate(config.vibrate)
    } catch {
      // Silently fail
    }
  }

  // iOS: Taptic Engine via hidden checkbox toggle
  if (IS_IOS) {
    ensureIOSCheckbox()
    iosCheckbox?.click()
  }

  // Audio feedback when enabled
  if (audioEnabled) {
    ensureAudioCtx().then(() => playClickSound(config.intensity))
  }
}

export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled
  if (IS_CLIENT) {
    localStorage.setItem(AUDIO_STORAGE_KEY, enabled ? "true" : "false")
  }
}

export function getAudioEnabled(): boolean {
  if (!IS_CLIENT) return false
  return localStorage.getItem(AUDIO_STORAGE_KEY) === "true"
}

// Hydrate audio preference from localStorage on load
if (IS_CLIENT) {
  audioEnabled = localStorage.getItem(AUDIO_STORAGE_KEY) === "true"
}

export function cancelHaptic() {
  if (HAS_VIBRATE) navigator.vibrate(0)
}
