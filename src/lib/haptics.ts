import {
  getHapticAudioPreference,
  setHapticAudioPreference,
} from "@/lib/preferences"

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
let iosHapticLabel: HTMLLabelElement | null = null

function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
  styles: Partial<CSSStyleDeclaration> = {},
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  Object.assign(el.style, styles)
  return el
}

function ensureIOSCheckbox() {
  if (iosHapticLabel || typeof document === "undefined") return

  const switchId = "ios-haptic-switch"

  const input = createElement(
    "input",
    { type: "checkbox", id: switchId, switch: "" },
    { all: "initial", appearance: "auto", width: "100%", height: "100%" },
  )

  const label = createElement(
    "label",
    { for: switchId, "aria-hidden": "true" },
    {
      position: "fixed",
      top: "0",
      left: "0",
      width: "28px",
      height: "18px",
      opacity: "0.01",
      zIndex: "-1",
      pointerEvents: "none",
    },
  )

  label.appendChild(input)
  document.body.insertAdjacentElement("afterbegin", label)
  iosHapticLabel = label
}

// --- Audio engine ---
let audioCtx: AudioContext | null = null
let hapticAudioEnabled = true

function getAudioContextConstructor():
  | (new (contextOptions?: AudioContextOptions) => AudioContext)
  | null {
  if (!IS_CLIENT) return null
  const windowWithWebkit = window as Window & {
    webkitAudioContext?: new (
      contextOptions?: AudioContextOptions,
    ) => AudioContext
  }
  if (typeof AudioContext !== "undefined") return AudioContext
  return windowWithWebkit.webkitAudioContext ?? null
}

function playClickSound(intensity: number) {
  if (!audioCtx) return

  const { sampleRate } = audioCtx
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

  if (!hapticAudioEnabled) return

  // Android / Chrome: navigator.vibrate with direct durations
  if (HAS_VIBRATE) {
    try {
      navigator.vibrate(config.vibrate)
    } catch {
      // Silently fail
    }
  }

  // iOS: trigger the dedicated switch from the same user-gesture call stack.
  if (IS_IOS) {
    ensureIOSCheckbox()
    iosHapticLabel?.click()
  }

  // Audio feedback when enabled (resume must be requested synchronously from the user gesture on iOS)
  const AudioContextCtor = getAudioContextConstructor()
  if (AudioContextCtor) {
    if (!audioCtx) {
      audioCtx = new AudioContextCtor()
    }
    const intensity = config.intensity
    const play = () => playClickSound(intensity)
    if (audioCtx.state === "suspended") {
      void audioCtx.resume().then(play)
    } else {
      play()
    }
  }
}

export function setAudioEnabled(enabled: boolean) {
  hapticAudioEnabled = enabled
  setHapticAudioPreference(enabled)
}

export function getAudioEnabled(): boolean {
  return getHapticAudioPreference(true)
}

// Hydrate audio preference from localStorage on load
if (IS_CLIENT) {
  hapticAudioEnabled = getAudioEnabled()
}

export function cancelHaptic() {
  if (HAS_VIBRATE) navigator.vibrate(0)
}
