import assert from "node:assert/strict"
import { test } from "node:test"

import { formatPostDate, formatRelative } from "./relativeTime.ts"

const now = new Date("2026-11-18T17:00:00Z")
const ago = (ms) => new Date(now.getTime() - ms).toISOString()
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

test("long relative times", () => {
  const cases = [
    [ago(-10 * SECOND), "just now"],
    [ago(30 * SECOND), "just now"],
    [ago(MINUTE), "1 minute ago"],
    [ago(5 * MINUTE), "5 minutes ago"],
    [ago(2 * HOUR), "2 hours ago"],
    [ago(3 * DAY), "3 days ago"],
    [ago(8 * DAY), "1 week ago"],
    [ago(23 * DAY), "3 weeks ago"],
    ["2026-10-14T22:57:01.937Z", "Oct 14"],
    ["2025-12-01T17:00:00Z", "Dec 1, 2025"],
  ]
  for (const [iso, expected] of cases)
    assert.equal(formatRelative(iso, now, "long"), expected, iso)
})

test("a future createdAt reads as just now", () => {
  assert.equal(formatRelative(ago(-2 * HOUR), now, "long"), "just now")
  assert.equal(formatRelative(ago(-2 * HOUR), now, "tiny"), "NOW")
})

test("tiny relative times", () => {
  const cases = [
    [ago(30 * SECOND), "NOW"],
    [ago(5 * MINUTE), "5M"],
    [ago(2 * HOUR), "2H"],
    [ago(3 * DAY), "3D"],
    [ago(23 * DAY), "3W"],
    ["2026-10-14T22:57:01.937Z", "OCT 14"],
  ]
  for (const [iso, expected] of cases)
    assert.equal(formatRelative(iso, now, "tiny"), expected, iso)
})

test("boundaries", () => {
  assert.equal(formatRelative(ago(59 * SECOND), now, "long"), "just now")
  assert.equal(formatRelative(ago(59 * MINUTE), now, "long"), "59 minutes ago")
  assert.equal(formatRelative(ago(23 * HOUR), now, "long"), "23 hours ago")
  assert.equal(formatRelative(ago(DAY), now, "long"), "1 day ago")
  assert.equal(formatRelative(ago(6 * DAY), now, "long"), "6 days ago")
  assert.equal(formatRelative(ago(7 * DAY), now, "long"), "1 week ago")
  assert.equal(formatRelative(ago(29 * DAY), now, "long"), "4 weeks ago")
  assert.equal(formatRelative(ago(30 * DAY), now, "long"), "Oct 19")
})

test("formatPostDate uses New York time and adds the year only when it differs", () => {
  assert.equal(formatPostDate("2026-11-19T03:00:00Z", now), "Nov 18")
  assert.equal(formatPostDate("2025-12-01T17:00:00Z", now), "Dec 1, 2025")
})
