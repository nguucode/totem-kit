/** OKLCH -> sRGB -> WCAG relative luminance -> contrast ratio. */

export function parseOklch(value) {
  const m = value.match(/oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+|none)/)
  if (!m) throw new Error(`not an oklch() colour: ${value}`)
  const L = m[2] === '%' ? Number(m[1]) / 100 : Number(m[1])
  return [L, Number(m[3]), m[4] === 'none' ? 0 : Number(m[4])]
}

export function toSrgb([L, C, hDeg]) {
  const h = (hDeg * Math.PI) / 180
  const a = C * Math.cos(h)
  const b = C * Math.sin(h)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((v) => Math.min(1, Math.max(0, v)))
}

function luminance(rgb) {
  const encoded = rgb.map((c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055))
  const linear = encoded.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
}

/** WCAG 2 contrast ratio between two oklch() strings. */
export function contrast(a, b) {
  const [hi, lo] = [luminance(toSrgb(parseOklch(a))), luminance(toSrgb(parseOklch(b)))].sort(
    (x, y) => y - x,
  )
  return (hi + 0.05) / (lo + 0.05)
}

export const AA_TEXT = 4.5
/** WCAG 1.4.11: a UI component boundary, such as a focus indicator. */
export const AA_NON_TEXT = 3
