/**
 * Fetches the GitHub contribution calendar for the profile owner and writes a
 * compact snapshot to src/data/github-contributions.json. Runs before `next build`
 * in CI (with GITHUB_TOKEN) and locally (falling back to `gh auth token`).
 * If the fetch fails but a previous snapshot exists, the stale snapshot is kept.
 */
import { execSync } from "child_process"
import fs from "fs/promises"
import path from "path"

const LOGIN = "josephdburdick"
const OUT_FILE = path.join(process.cwd(), "src/data/github-contributions.json")

const LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
}

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionLevel
            }
          }
        }
      }
    }
  }
`

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  try {
    return execSync("gh auth token", { encoding: "utf8" }).trim()
  } catch {
    return null
  }
}

async function hasSnapshot() {
  try {
    await fs.access(OUT_FILE)
    return true
  } catch {
    return false
  }
}

async function bail(message) {
  if (await hasSnapshot()) {
    console.warn(`${message} — keeping existing snapshot.`)
    process.exit(0)
  }
  console.error(`${message} — and no existing snapshot to fall back on.`)
  process.exit(1)
}

const token = getToken()
if (!token) await bail("No GitHub token available")

let calendar
try {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const json = await response.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  calendar = json.data.user.contributionsCollection.contributionCalendar
} catch (error) {
  await bail(`Failed to fetch contributions (${error.message})`)
}

const snapshot = {
  login: LOGIN,
  total: calendar.totalContributions,
  fetchedAt: new Date().toISOString().slice(0, 10),
  weeks: calendar.weeks.map((week) =>
    week.contributionDays.map((day) => LEVELS[day.contributionLevel] ?? 0),
  ),
}

await fs.writeFile(OUT_FILE, JSON.stringify(snapshot))
console.log(
  `Wrote ${OUT_FILE}: ${snapshot.total} contributions across ${snapshot.weeks.length} weeks.`,
)
