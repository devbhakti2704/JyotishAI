// Bump this whenever the Privacy Policy / consent wording materially changes.
// Stored with every row so you know which policy version a user agreed to.
export const CONSENT_VERSION = '2026-06-03'

// k-anonymity threshold: never emit an aggregate bucket with fewer than this many users.
export const K_MIN = 25

export const QUESTION_CATEGORIES = ['career', 'love', 'health', 'finance', 'other'] as const
export type QuestionCategory = (typeof QUESTION_CATEGORIES)[number]

// State/UT level only — city is intentionally discarded for region bucketing.
const INDIAN_REGIONS = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

// birth_place may be a bare state (from the dropdown) or "City, State" free text.
// We only ever keep the state/UT, or 'Other' — never the city.
export function deriveRegion(birthPlace: string | null | undefined): string {
  const t = (birthPlace || '').toLowerCase()
  if (!t) return 'Other'
  const hit = INDIAN_REGIONS.find((r) => t.includes(r.toLowerCase()))
  return hit || 'Other'
}

// Coarse age band from birth date — the exact date is never used in aggregates.
export function deriveAgeBucket(birthDate: string | null | undefined): string {
  if (!birthDate) return 'unknown'
  const d = new Date(birthDate)
  if (isNaN(d.getTime())) return 'unknown'
  const age = Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  if (age < 0 || age > 120) return 'unknown'
  if (age < 18) return '<18'
  if (age < 25) return '18-24'
  if (age < 35) return '25-34'
  if (age < 45) return '35-44'
  if (age < 55) return '45-54'
  if (age < 65) return '55-64'
  return '65+'
}
